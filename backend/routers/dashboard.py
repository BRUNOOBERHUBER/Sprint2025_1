from flask import Blueprint, jsonify, request
from database import get_db
from utils import validar_token

router = Blueprint("dashboard", __name__)

@router.route("/stats", methods=["GET"])
@validar_token
def get_stats():
    db = get_db()
    total_alunos = db["alunos"].count_documents({})
    total_colaboradores = db["colaboradores"].count_documents({})
    alunos_atencao = db["alunos"].count_documents({"tagsAtencao": {"$exists": True, "$ne": []}})
    from datetime import datetime, timedelta
    inicio_mes = datetime.now().replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    atendimentos_mes = db["atendimentos"].count_documents({"data": {"$gte": inicio_mes}})
    return jsonify({
        "totalAlunos": total_alunos,
        "totalColaboradores": total_colaboradores,
        "alunosComAtencao": alunos_atencao,
        "atendimentosMes": atendimentos_mes
    }) 