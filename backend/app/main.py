from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api.routes import api_router

origins = ["http://localhost:5173"]

app = FastAPI(title="Porto RAG", description="A Retrieval-Augmented Generation (RAG) system for document retrieval and question answering.", version="1.0.0")

app.add_middleware(CORSMiddleware, allow_origins=origins, allow_methods=["*"], allow_headers=["*"],allow_credentials=False)


app.include_router(api_router, prefix="/api")

@app.get("/")
def root():
    return {"message": "Hello World"}