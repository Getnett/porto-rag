from fastapi import Depends,Request
from fastapi.security import HTTPAuthorizationCredentials
from fastapi.security import HTTPBearer

from services.supabase_auth import verify_jwt,get_jwks


security = HTTPBearer()

# TODO use pydantic classes to improve typing for the return type

async def get_current_user(
        request: Request,  # gives us access to app.state
        credentials: HTTPAuthorizationCredentials = Depends(security),
) -> dict:
    """
    FastAPI dependency. Extract and verify the Bearer token.
    Returns the JWT claims dict, which includes:
      - sub: the user's UUID
      - email: their email
      - role: 'authenticated'
      - session_id: their current session UUID
    """
    return await verify_jwt(credentials.credentials,request.app.state.jwks_lock,request.app.state.jwks_cache)