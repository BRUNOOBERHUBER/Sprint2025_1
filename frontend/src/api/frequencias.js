import api from "./http";

export async function listarFrequencias(alunoId) {
  const { data } = await api.get(`/alunos/${alunoId}/frequencias`);
  return data;
}

export async function criarFrequencia(alunoId, frequencia) {
  const { data } = await api.post(`/alunos/${alunoId}/frequencias`, frequencia);
  return data;
}

export async function getFrequencia(alunoId, frequenciaId) {
  const { data } = await api.get(`/alunos/${alunoId}/frequencias/${frequenciaId}`);
  return data;
}

export async function deletarFrequencia(alunoId, frequenciaId) {
  await api.delete(`/alunos/${alunoId}/frequencias/${frequenciaId}`);
} 