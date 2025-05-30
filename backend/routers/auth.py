from flask import Blueprint, request, jsonify
from schemas import LoginRequest, TokenResponse, UserCreate, UserDB
from database import get_db

router = Blueprint("auth", __name__)

# Usuário fixo (em produção usar hash e banco)
USER_FIXO = "admin"
PASS_FIXO = "admin"
TOKEN_FIXO = "secure-token"

COLLECTION = "users"


def user_helper(doc: dict) -> UserDB:
    doc["_id"] = str(doc["_id"])
    return UserDB(**doc)


@router.route("/signup", methods=["POST"])
def signup():
    data = request.get_json()
    user = UserCreate(**data)
    db = get_db()
    
    # Verifica se usuário já existe
    existente = db[COLLECTION].find_one({"username": user.username})
    if existente:
        return jsonify({"detail": "Usuário já existe"}), 409

    result = db[COLLECTION].insert_one(user.dict())
    novo = db[COLLECTION].find_one({"_id": result.inserted_id})
    return jsonify(user_helper(novo).dict()), 201


@router.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    payload = LoginRequest(**data)
    db = get_db()
    
    user_doc = db[COLLECTION].find_one({"username": payload.user})
    if not user_doc:
        return jsonify({"detail": "Usuário não encontrado"}), 401
    if user_doc.get("password") != payload.passw:
        return jsonify({"detail": "Senha inválida"}), 401
    return jsonify(TokenResponse(token=TOKEN_FIXO).dict()) 