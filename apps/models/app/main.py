from fastapi import Depends, FastAPI
from contextlib import asynccontextmanager

from .common.db import database

from .modules.domains.router import domains_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    await database.connect()
    yield
    await database.disconnect()


app = FastAPI(lifespan=lifespan)


app.include_router(domains_router)

@app.get("/")
async def root():
    return {"message": "Hello!"}
