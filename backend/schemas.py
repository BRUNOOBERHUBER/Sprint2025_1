from typing import List, Optional, Dict
from pydantic import BaseModel, Field, EmailStr
from datetime import date, datetime


class ContatoResponsavel(BaseModel):
    nome: str
    fone: str
    email: Optional[EmailStr]


class DadosPessoais(BaseModel):
    enderecoCompleto: Optional[str] = None
    contatosPais: Optional[List[ContatoResponsavel]] = Field(default_factory=list)


class AlunoBase(BaseModel):
    nome: str
    sobrenome: str
    dataNascimento: datetime
    anoEscolar: str  # ex.: "5º Ano"
    endereco: str
    contatosResponsaveis: List[ContatoResponsavel] = Field(default_factory=list)
    fotoAlunoId: Optional[str] = None
    tagsAtencao: List[str] = Field(default_factory=list)
    matricula: Optional[str] = None
    ra: Optional[str] = None
    cpf: Optional[str] = None
    dadosPessoais: Optional[DadosPessoais] = None


class AlunoCreate(AlunoBase):
    dataNascimento: datetime


class AlunoUpdate(BaseModel):
    nome: Optional[str] = None
    sobrenome: Optional[str] = None
    dataNascimento: Optional[datetime] = None
    anoEscolar: Optional[str] = None
    endereco: Optional[str] = None
    contatosResponsaveis: Optional[List[ContatoResponsavel]] = None
    fotoAlunoId: Optional[str] = None
    tagsAtencao: Optional[List[str]] = None
    matricula: Optional[str] = None
    ra: Optional[str] = None
    cpf: Optional[str] = None
    dadosPessoais: Optional[DadosPessoais] = None


class AlunoDB(AlunoBase):
    idade: int
    id: str = Field(alias="_id")

    class Config:
        populate_by_name = True
        orm_mode = True


class LoginRequest(BaseModel):
    user: str
    passw: str


class TokenResponse(BaseModel):
    token: str


class UserCreate(BaseModel):
    username: str = Field(..., min_length=3)
    password: str = Field(..., min_length=3)


class UserDB(BaseModel):
    id: str = Field(alias="_id")
    username: str
    password: str

    class Config:
        populate_by_name = True
        orm_mode = True


class DisciplinaNota(BaseModel):
    nome: str
    nota: float


class BoletimCreate(BaseModel):
    ano: int
    bimestre: int
    disciplinas: List[DisciplinaNota]

    @property
    def mediaGeral(self) -> float:
        if not self.disciplinas:
            return 0.0
        return sum(d.nota for d in self.disciplinas) / len(self.disciplinas)


class BoletimDB(BoletimCreate):
    id: str = Field(alias="_id")
    alunoId: str

    class Config:
        populate_by_name = True
        orm_mode = True


class BoletimUpdate(BaseModel):
    ano: Optional[int] = None
    bimestre: Optional[int] = None
    disciplinas: Optional[List[DisciplinaNota]] = None


# Modelos para Projetos de Contraturno
class ContraturnoBase(BaseModel):
    titulo: str
    descricao: Optional[str] = None
    alunosInscritos: List[str] = Field(default_factory=list)
    professor: Optional[str] = None
    horario: Optional[str] = None
    vagas: Optional[int] = 0
    categoria: Optional[str] = None
    status: Optional[str] = "Ativo"


class ContraturnoCreate(ContraturnoBase):
    pass


class ContraturnoUpdate(BaseModel):
    titulo: Optional[str] = None
    descricao: Optional[str] = None
    alunosInscritos: Optional[List[str]] = None
    professor: Optional[str] = None
    horario: Optional[str] = None
    vagas: Optional[int] = None
    categoria: Optional[str] = None
    status: Optional[str] = None


class ContraturnoDB(ContraturnoBase):
    id: str = Field(alias="_id")

    class Config:
        populate_by_name = True
        orm_mode = True


# Nova seção para Colaboradores
class ColaboradorBase(BaseModel):
    nome: str
    cargoFuncao: str
    email: EmailStr
    celular: str


class ColaboradorCreate(ColaboradorBase):
    pass


class ColaboradorUpdate(BaseModel):
    nome: Optional[str] = None
    cargoFuncao: Optional[str] = None
    email: Optional[EmailStr] = None
    celular: Optional[str] = None


class ColaboradorDB(ColaboradorBase):
    id: str = Field(alias="_id")
    criadoEm: Optional[datetime] = None

    class Config:
        populate_by_name = True
        orm_mode = True


class FrequenciaCreate(BaseModel):
    ano: int
    totalAulas: int
    faltas: int
    percentPresenca: float


class FrequenciaDB(FrequenciaCreate):
    id: str = Field(alias="_id")
    alunoId: str

    class Config:
        populate_by_name = True
        orm_mode = True


class SaudeCreate(BaseModel):
    tipo: str
    descricao: str
    dataLaudo: Optional[date] = None
    documentosIds: Optional[List[str]] = None


class SaudeDB(SaudeCreate):
    id: str = Field(alias="_id")
    alunoId: str

    class Config:
        populate_by_name = True
        orm_mode = True


class AtendimentoCreate(BaseModel):
    titulo: str
    data: date
    motivo: str
    resultado: Optional[str] = None
    responsavelColabId: str
    documentoId: Optional[str] = None


class AtendimentoUpdate(BaseModel):
    titulo: Optional[str] = None
    data: Optional[date] = None
    motivo: Optional[str] = None
    resultado: Optional[str] = None
    responsavelColabId: Optional[str] = None
    documentoId: Optional[str] = None


class AtendimentoDB(AtendimentoCreate):
    id: str = Field(alias="_id")
    alunoId: str

    class Config:
        populate_by_name = True
        orm_mode = True 