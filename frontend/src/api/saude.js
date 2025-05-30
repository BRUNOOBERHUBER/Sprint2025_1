import api from "./http";

export async function listarRegistrosSaude(alunoId) {
  const { data } = await api.get(`/alunos/${alunoId}/saude`);
  return data;
}

export async function criarRegistroSaude(alunoId, registro) {
  const { data } = await api.post(`/alunos/${alunoId}/saude`, registro);
  return data;
}

export async function getRegistroSaude(alunoId, registroId) {
  const { data } = await api.get(`/alunos/${alunoId}/saude/${registroId}`);
  return data;
}

export async function deletarRegistroSaude(alunoId, registroId) {
  await api.delete(`/alunos/${alunoId}/saude/${registroId}`);
} 