from flask import request, jsonify
from functools import wraps

TOKEN_HEADER_NAME = "X-API-TOKEN"
TOKEN_FIXO = "secure-token"

def validar_token(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        token = request.headers.get(TOKEN_HEADER_NAME)
        print(f"[VALIDAR_TOKEN] Token recebido no header '{TOKEN_HEADER_NAME}': {{token}}")
        if token != TOKEN_FIXO:
            print("[VALIDAR_TOKEN] Token inválido ou ausente!")
            return jsonify({"detail": "Token inválido ou ausente"}), 401
        print("[VALIDAR_TOKEN] Token validado com sucesso!")
        return f(*args, **kwargs)
    return decorated_function 