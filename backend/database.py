from motor.motor_asyncio import AsyncIOMotorClient
from functools import lru_cache
import os

MONGODB_URI = os.getenv(
    "MONGODB_URI",
    "mongodb+srv://admin:admin@cluster0.ki0fukf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
)
DB_NAME = os.getenv("MONGO_DB_NAME", "EMEF")


@lru_cache(maxsize=1)
def get_client() -> AsyncIOMotorClient:
    """Retorna um único cliente MongoDB reutilizável"""
    return AsyncIOMotorClient(MONGODB_URI)


def get_db():
    """Dependency que injeta a database do Mongo."""
    client = get_client()
    return client[DB_NAME] 