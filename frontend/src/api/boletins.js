import api from "./http";

export async function listarBoletins(alunoId) {
  const { data } = await api.get(`/alunos/${alunoId}/boletins`);
  return data;
}

export async function criarBoletim(alunoId, boletim) {
  const { data } = await api.post(`/alunos/${alunoId}/boletins`, boletim);
  return data;
}

export async function getBoletim(alunoId, boletimId) {
  const { data } = await api.get(`/alunos/${alunoId}/boletins/${boletimId}`);
  return data;
}

export async function atualizarBoletim(alunoId, boletimId, updates) {
  const { data } = await api.put(`/alunos/${alunoId}/boletins/${boletimId}`, updates);
  return data;
}

export async function deletarBoletim(alunoId, boletimId) {
  await api.delete(`/alunos/${alunoId}/boletins/${boletimId}`);
} 