import api from "./http";

/**
 * Busca os dados de saúde completos de um aluno.
 * @param {string} alunoId - O ID do aluno.
 * @returns {Promise<object>} Os dados de saúde do aluno.
 */
export async function getDadosSaudeAluno(alunoId) {
  if (!alunoId) throw new Error("ID do aluno é obrigatório para buscar dados de saúde.");
  const { data } = await api.get(`/alunos/${alunoId}/saude`);
  return data;
}

/**
 * Cria os dados de saúde para um aluno.
 * @param {string} alunoId - O ID do aluno.
 * @param {object} saudeData - O objeto completo com os dados de saúde.
 * @returns {Promise<object>} Os dados de saúde criados.
 */
export async function criarDadosSaudeAluno(alunoId, saudeData) {
  if (!alunoId) throw new Error("ID do aluno é obrigatório para criar dados de saúde.");
  const { data } = await api.post(`/alunos/${alunoId}/saude`, saudeData);
  return data;
}

/**
 * Atualiza os dados de saúde de um aluno.
 * @param {string} alunoId - O ID do aluno.
 * @param {object} saudeData - O objeto com os campos de saúde a serem atualizados.
 * @returns {Promise<object>} Os dados de saúde atualizados.
 */
export async function atualizarDadosSaudeAluno(alunoId, saudeData) {
  if (!alunoId) throw new Error("ID do aluno é obrigatório para atualizar dados de saúde.");
  const { data } = await api.put(`/alunos/${alunoId}/saude`, saudeData);
  return data;
}

// Não haverá delete de todo o registro de saúde por enquanto, 
// a gestão é feita atualizando para listas vazias ou removendo itens específicos. 