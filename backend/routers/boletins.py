from flask import Blueprint, request, jsonify
from typing import List
from bson import ObjectId
from database import get_db
from utils import validar_token
from schemas import BoletimCreate, BoletimDB, BoletimUpdate

router = Blueprint("boletins", __name__)
COLLECTION = "boletins"

def boletim_helper(doc: dict) -> BoletimDB:
    doc["_id"] = str(doc["_id"])
    return BoletimDB(**doc)

@router.route("/alunos/<aluno_id>/boletins", methods=["GET"])
@validar_token
def listar_boletins(aluno_id: str):
    db = get_db()
    cursor = db[COLLECTION].find({"alunoId": aluno_id})
    docs = list(cursor)
    return jsonify([boletim_helper(d).dict() for d in docs])

@router.route("/alunos/<aluno_id>/boletins", methods=["POST"])
@validar_token
def criar_boletim(aluno_id: str):
    data = request.get_json()
    boletim = BoletimCreate(**data)
    boletim.alunoId = aluno_id
    db = get_db()
    result = db[COLLECTION].insert_one(boletim.dict())
    novo = db[COLLECTION].find_one({"_id": result.inserted_id})
    return jsonify(boletim_helper(novo).dict()), 201

@router.route("/alunos/<aluno_id>/boletins/<boletim_id>", methods=["GET"])
@validar_token
def get_boletim(aluno_id: str, boletim_id: str):
    db = get_db()
    boletim = db[COLLECTION].find_one({
        "_id": ObjectId(boletim_id),
        "alunoId": aluno_id
    })
    if not boletim:
        return jsonify({"detail": "Boletim não encontrado"}), 404
    return jsonify(boletim_helper(boletim).dict())

@router.route("/alunos/<aluno_id>/boletins/<boletim_id>", methods=["PUT"])
@validar_token
def atualizar_boletim(aluno_id: str, boletim_id: str):
    data = request.get_json()
    boletim = BoletimUpdate(**data)
    db = get_db()
    result = db[COLLECTION].update_one(
        {"_id": ObjectId(boletim_id), "alunoId": aluno_id},
        {"$set": boletim.dict(exclude_unset=True)}
    )
    if result.matched_count == 0:
        return jsonify({"detail": "Boletim não encontrado"}), 404
    atualizado = db[COLLECTION].find_one({"_id": ObjectId(boletim_id)})
    return jsonify(boletim_helper(atualizado).dict())

@router.route("/alunos/<aluno_id>/boletins/<boletim_id>", methods=["DELETE"])
@validar_token
def deletar_boletim(aluno_id: str, boletim_id: str):
    db = get_db()
    result = db[COLLECTION].delete_one({
        "_id": ObjectId(boletim_id),
        "alunoId": aluno_id
    })
    if result.deleted_count == 0:
        return jsonify({"detail": "Boletim não encontrado"}), 404
    return "", 204 