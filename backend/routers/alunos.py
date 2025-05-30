from flask import Blueprint, request, jsonify
from typing import List, Optional
from schemas import AlunoCreate, AlunoDB, AlunoUpdate
from database import get_db
from utils import validar_token
from bson import ObjectId
from datetime import date

router = Blueprint("alunos", __name__)
COLLECTION = "alunos"

def aluno_helper(doc: dict) -> AlunoDB:
    doc["_id"] = str(doc["_id"])
    if isinstance(doc.get("dataNascimento"), (str,)):
        nascimento = date.fromisoformat(doc["dataNascimento"][:10])
    else:
        nascimento = doc.get("dataNascimento")
    hoje = date.today()
    idade = hoje.year - nascimento.year - ((hoje.month, hoje.day) < (nascimento.month, nascimento.day))
    doc["idade"] = idade
    return AlunoDB(**doc)

@router.route("/", methods=["GET"])
@validar_token
def listar_alunos():
    print("[/api/alunos] Rota acessada")
    nome = request.args.get("nome")
    tag = request.args.get("tag")
    db = get_db()
    filtro = {}
    if nome:
        filtro["nome"] = {"$regex": nome, "$options": "i"}
    if tag:
        filtro["tagsAtencao"] = tag
    print(f"[/api/alunos] Filtro aplicado: {filtro}")
    cursor = db[COLLECTION].find(filtro)
    docs = list(cursor)
    print(f"[/api/alunos] Documentos encontrados: {len(docs)}")
    print(f"[/api/alunos] Primeiros 5 docs: {docs[:5]}")
    return jsonify([aluno_helper(d).dict() for d in docs])

@router.route("/", methods=["POST"])
@validar_token
def criar_aluno():
    data = request.get_json()
    aluno = AlunoCreate(**data)
    db = get_db()
    result = db[COLLECTION].insert_one(aluno.dict())
    novo = db[COLLECTION].find_one({"_id": result.inserted_id})
    return jsonify(aluno_helper(novo).dict()), 201

@router.route("/<aluno_id>", methods=["GET"])
@validar_token
def get_aluno(aluno_id: str):
    db = get_db()
    aluno = db[COLLECTION].find_one({"_id": ObjectId(aluno_id)})
    if not aluno:
        return jsonify({"detail": "Aluno não encontrado"}), 404
    return jsonify(aluno_helper(aluno).dict())

@router.route("/<aluno_id>", methods=["PUT"])
@validar_token
def atualizar_aluno(aluno_id: str):
    data = request.get_json()
    aluno = AlunoUpdate(**data)
    db = get_db()
    result = db[COLLECTION].update_one(
        {"_id": ObjectId(aluno_id)},
        {"$set": aluno.dict(exclude_unset=True)}
    )
    if result.matched_count == 0:
        return jsonify({"detail": "Aluno não encontrado"}), 404
    atualizado = db[COLLECTION].find_one({"_id": ObjectId(aluno_id)})
    return jsonify(aluno_helper(atualizado).dict())

@router.route("/<aluno_id>", methods=["DELETE"])
@validar_token
def deletar_aluno(aluno_id: str):
    db = get_db()
    result = db[COLLECTION].delete_one({"_id": ObjectId(aluno_id)})
    if result.deleted_count == 0:
        return jsonify({"detail": "Aluno não encontrado"}), 404
    return "", 204 