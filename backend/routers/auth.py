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
    print(f"[DEBUG] Dados recebidos no login: {data}")
    payload = LoginRequest(**data)
    print(f"[DEBUG] Payload após validação: user={payload.user}, passw={payload.passw}")
    print(f"[DEBUG] Comparando com: USER_FIXO={USER_FIXO}, PASS_FIXO={PASS_FIXO}")
    
    # Usar credenciais fixas ao invés do banco
    if payload.user != USER_FIXO or payload.passw != PASS_FIXO:
        print(f"[DEBUG] Credenciais inválidas: {payload.user} != {USER_FIXO} ou {payload.passw} != {PASS_FIXO}")
        return jsonify({"detail": "Credenciais inválidas"}), 401
    
    print("[DEBUG] Login bem-sucedido!")
    return jsonify(TokenResponse(token=TOKEN_FIXO).dict()) 