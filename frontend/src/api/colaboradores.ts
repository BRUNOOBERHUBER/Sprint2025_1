import api from "./http";

export interface Colaborador {
  _id: string;
  nome: string;
  cargoFuncao: string;
  email: string;
  celular: string;
  criadoEm: string;
}

export type ColaboradorCreate = Omit<Colaborador, "_id" | "criadoEm">;
export type ColaboradorUpdate = Partial<Omit<Colaborador, "_id" | "criadoEm">>;

export async function listarColaboradores() {
  const { data } = await api.get<Colaborador[]>("/colaboradores");
  return data;
}

export async function criarColaborador(payload: ColaboradorCreate) {
  const { data } = await api.post<Colaborador>("/colaboradores", payload);
  return data;
}

export async function getColaborador(id: string) {
  const { data } = await api.get<Colaborador>(`/colaboradores/${id}`);
  return data;
}

export async function updateColaborador(id: string, updates: ColaboradorUpdate) {
  const { data } = await api.put<Colaborador>(`/colaboradores/${id}`, updates);
  return data;
}

export async function deleteColaborador(id: string) {
  await api.delete(`/colaboradores/${id}`);
} 