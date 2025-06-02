from flask import Blueprint, request, jsonify
from typing import List
from bson import ObjectId
from pydantic import ValidationError
from database import get_db
from utils import validar_token
from schemas import FrequenciaCreate, FrequenciaDB, FrequenciaUpdate

router = Blueprint("frequencias", __name__)
COLLECTION = "frequencias"

def freq_helper(doc: dict) -> FrequenciaDB:
    doc["_id"] = str(doc["_id"])
    return FrequenciaDB(**doc)

@router.route("/alunos/<aluno_id>/frequencias", methods=["GET"])
@validar_token
def listar_frequencias(aluno_id: str):
    db = get_db()
    cursor = db[COLLECTION].find({"alunoId": aluno_id})
    docs = list(cursor)
    return jsonify([freq_helper(d).model_dump() for d in docs])

@router.route("/alunos/<aluno_id>/frequencias", methods=["POST"])
@validar_token
def criar_frequencia(aluno_id: str):
    data = request.get_json()
    if not isinstance(data, dict):
        return jsonify({"detail": "Corpo da requisição inválido. Esperado um objeto JSON."}), 400
    
    data_com_aluno_id = {**data, "alunoId": aluno_id}
    
    try:
        frequencia = FrequenciaCreate(**data_com_aluno_id)
    except ValidationError as e:
        return jsonify({"detail": "Erro de validação nos dados enviados.", "errors": e.errors()}), 422
    except Exception as e:
        print(f"[CRIA FREQUENCIA] Erro inesperado: {str(e)}")
        return jsonify({"detail": f"Ocorreu um erro interno ao processar sua solicitação."}), 500

    db = get_db()
    try:
        dados_para_inserir = frequencia.model_dump()
        result = db[COLLECTION].insert_one(dados_para_inserir)
    except Exception as e:
        print(f"[CRIA FREQUENCIA] Erro ao inserir no DB: {str(e)}")
        return jsonify({"detail": "Erro ao salvar os dados no banco de dados."}), 500
        
    novo = db[COLLECTION].find_one({"_id": result.inserted_id})
    if not novo:
        return jsonify({"detail": "Erro ao recuperar o registro criado após a inserção."}), 500
    
    return jsonify(freq_helper(novo).model_dump()), 201

@router.route("/alunos/<aluno_id>/frequencias/<freq_id>", methods=["GET"])
@validar_token
def get_frequencia(aluno_id: str, freq_id: str):
    db = get_db()
    frequencia_doc = db[COLLECTION].find_one({
        "_id": ObjectId(freq_id),
        "alunoId": aluno_id
    })
    if not frequencia_doc:
        return jsonify({"detail": "Frequência não encontrada"}), 404
    return jsonify(freq_helper(frequencia_doc).model_dump())

@router.route("/alunos/<aluno_id>/frequencias/<freq_id>", methods=["DELETE"])
@validar_token
def deletar_frequencia(aluno_id: str, freq_id: str):
    db = get_db()
    result = db[COLLECTION].delete_one({
        "_id": ObjectId(freq_id),
        "alunoId": aluno_id
    })
    if result.deleted_count == 0:
        return jsonify({"detail": "Frequência não encontrada"}), 404
    return "", 204

@router.route("/alunos/<aluno_id>/frequencias/<freq_id>", methods=["PUT"])
@validar_token
def atualizar_frequencia(aluno_id: str, freq_id: str):
    data = request.get_json()
    try:
        frequencia_update = FrequenciaUpdate(**data)
    except ValidationError as e:
        return jsonify({"detail": "Erro de validação nos dados enviados para atualização.", "errors": e.errors()}), 422
    
    db = get_db()
    
    update_data = frequencia_update.model_dump(exclude_unset=True)

    if not update_data:
        return jsonify({"detail": "Nenhum dado para atualizar fornecido"}), 400

    result = db[COLLECTION].update_one(
        {"_id": ObjectId(freq_id), "alunoId": aluno_id},
        {"$set": update_data}
    )
    
    if result.matched_count == 0:
        return jsonify({"detail": "Frequência não encontrada para atualização"}), 404
        
    updated_doc = db[COLLECTION].find_one({"_id": ObjectId(freq_id)})
    if not updated_doc:
         return jsonify({"detail": "Frequência atualizada, mas erro ao recuperar."}), 500
    return jsonify(freq_helper(updated_doc).model_dump()), 200 