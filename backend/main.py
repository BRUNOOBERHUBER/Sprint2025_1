from flask import Flask
from flask_cors import CORS
from routers import alunos, boletins, colaboradores, contraturno, dashboard, frequencias, saude, atendimentos, auth

app = Flask(__name__)
app.url_map.strict_slashes = False
CORS(
    app,
    resources={r"/api/*": {"origins": "http://localhost:5173"}},
    allow_headers=["*"],
    methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"]
)

# Registra as rotas com prefixo /api
app.register_blueprint(auth.router, url_prefix="/api/auth")
app.register_blueprint(alunos.router, url_prefix="/api/alunos")
app.register_blueprint(boletins.router, url_prefix="/api/boletins")
app.register_blueprint(colaboradores.router, url_prefix="/api/colaboradores")
app.register_blueprint(contraturno.router, url_prefix="/api/contraturno")
app.register_blueprint(dashboard.router, url_prefix="/api/dashboard")
app.register_blueprint(frequencias.router, url_prefix="/api/frequencias")
app.register_blueprint(saude.router, url_prefix="/api/saude")
app.register_blueprint(atendimentos.router, url_prefix="/api/atendimentos")

if __name__ == "__main__":
    app.run(debug=True, port=8000) 