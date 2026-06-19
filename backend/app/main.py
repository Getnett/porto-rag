from contextlib import asynccontextmanager
import asyncio

from fastapi import FastAPI,Depends
from fastapi.middleware.cors import CORSMiddleware

from cachetools import TTLCache

from services.supabase_auth import get_jwks
from api.routes import api_router
from api.deps.auth_user import get_current_user


origins = ["http://localhost:5173"]



@asynccontextmanager
async def lifespan(app: FastAPI):
    app.state["jwks_lock"] = asyncio.Lock()
    app.state["jwks_cache"] = TTLCache(maxsize=1, ttl=600)
    await get_jwks(app.state.jwks_lock, app.state.jwks_cache)  # warm cache at startup
    yield


app = FastAPI(title="Porto RAG", description="A Retrieval-Augmented Generation (RAG) system for document retrieval and question answering.", version="1.0.0",lifespan=lifespan)


app.add_middleware(CORSMiddleware, allow_origins=origins, allow_methods=["*"], allow_headers=["*"],allow_credentials=False)

@app.get("/")
def root():
    return {"message": "Hello World"}

app.include_router(api_router, prefix="/api",dependencies=[Depends(get_current_user)])

