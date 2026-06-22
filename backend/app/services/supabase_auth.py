import asyncio
from fastapi import HTTPException, status

from cachetools import TTLCache
import httpx
from jose import jwt, JWTError, ExpiredSignatureError

from typing import Optional

from core.config import settings


SUPABASE_URL = settings.SUPABASE_URL
JWKS_URL = f"{SUPABASE_URL}/auth/v1/.well-known/jwks.json"
EXPECTED_ISSUER=f"{SUPABASE_URL}/auth/v1"


# Cache JWKS for 10 minutes — matches Supabase's edge cache TTL.
# Thread-safe: one lock prevents stampedes where multiple requests
# all try to refresh the cache simultaneously.





async def get_jwks(_jwks_lock:asyncio.Lock | None,_jwks_cache:TTLCache) -> dict:
    """Fetch JWKS from Supabase, with a 10-minute TTL cache."""
    async with _jwks_lock:
        cached = _jwks_cache.get("jwks")
        if cached:
            return cached
        
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(JWKS_URL,timeout=10)
                response.raise_for_status()
        except httpx.HTTPError:
            stale = _jwks_cache.get("jwks_stale")
            if stale:
                return stale
            raise HTTPException(status_code=503,detail="Auth service temporarily unavaliable") 
        jwks = response.json()
        _jwks_cache["jwks"] = jwks
        _jwks_cache["jwks_stale"] = jwks
        return jwks               
       
    
def find_public_key(token: str, jwks: dict) -> Optional[dict]:
    """
    Extract the 'kid' from the JWT header and find the matching
    public key in the JWKS. This matters during key rotation —
    Supabase may have multiple valid keys at once.
    """
    try:
        # decode_complete=False means we only read the header, no verification yet
        headers = jwt.get_unverified_header(token)
    except JWTError:
        return None

    kid = headers.get("kid")
    for key in jwks.get("keys", []):
        if key.get("kid") == kid:
            return key

    return None


async def verify_jwt(token: str,_jwks_lock:asyncio.Lock | None,_jwks_cache:TTLCache) -> dict:
    """
    Verify the JWT locally using Supabase's public JWKS.
    Returns the decoded claims if valid.
    Raises HTTPException if invalid for any reason.
    """
    jwks = await get_jwks(_jwks_lock,_jwks_cache)
    public_key = find_public_key(token, jwks)

    if not public_key:
        # Could mean: key not in JWKS yet (just rotated), or a forged token.
        # Busting the cache and retrying once handles the rotation race condition.
        _jwks_cache.clear()
        jwks = await get_jwks(_jwks_lock,_jwks_cache)
        public_key = find_public_key(token, jwks)

        if not public_key:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token signing key not recognized.",
            )

    try:
        claims = jwt.decode(
            token,
            public_key,
            algorithms=["ES256"],  
            options={
                "verify_aud": False,  # Supabase JWTs don't set a standard audience
            },
            issuer=EXPECTED_ISSUER,
        )
        return claims

    except ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired.",
        )
    except JWTError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Token is invalid: {str(e)}",
        )
