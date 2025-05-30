import api from "./http";

export async function listarAtendimentos(alunoId) {
  const { data } = await api.get(`/alunos/${alunoId}/atendimentos`);
  return data;
}

export async function criarAtendimento(alunoId, atendimento) {
  const { data } = await api.post(`/alunos/${alunoId}/atendimentos`, atendimento);
  return data;
}

export async function getAtendimento(alunoId, atendimentoId) {
  const { data } = await api.get(`/alunos/${alunoId}/atendimentos/${atendimentoId}`);
  return data;
}

export async function atualizarAtendimento(alunoId, atendimentoId, updates) {
  const { data } = await api.put(`/alunos/${alunoId}/atendimentos/${atendimentoId}`, updates);
  return data;
}

export async function deletarAtendimento(alunoId, atendimentoId) {
  await api.delete(`/alunos/${alunoId}/atendimentos/${atendimentoId}`);
} 