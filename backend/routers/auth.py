from fastapi import APIRouter, HTTPException, Depends
from fastapi import status
from backend.schemas import LoginRequest, TokenResponse, UserCreate, UserDB
from backend.database import get_db
from motor.motor_asyncio import AsyncIOMotorDatabase

router = APIRouter(tags=["auth"])

# Usuário fixo (em produção usar hash e banco)
USER_FIXO = "admin"
PASS_FIXO = "admin"
TOKEN_FIXO = "secure-token"

COLLECTION = "users"


def user_helper(doc: dict) -> UserDB:
    doc["_id"] = str(doc["_id"])
    return UserDB(**doc)


@router.post("/signup", response_model=UserDB, status_code=status.HTTP_201_CREATED)
async def signup(user: UserCreate, db: AsyncIOMotorDatabase = Depends(get_db)):
    # Verifica se usuário já existe
    existente = await db[COLLECTION].find_one({"username": user.username})
    if existente:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Usuário já existe")

    result = await db[COLLECTION].insert_one(user.dict())
    novo = await db[COLLECTION].find_one({"_id": result.inserted_id})
    return user_helper(novo)


@router.post("/login", response_model=TokenResponse)
async def login(payload: LoginRequest, db: AsyncIOMotorDatabase = Depends(get_db)):
    user_doc = await db[COLLECTION].find_one({"username": payload.user})
    if not user_doc:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Usuário não encontrado")
    if user_doc.get("password") != payload.passw:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Senha inválida")
    return TokenResponse(token=TOKEN_FIXO) 