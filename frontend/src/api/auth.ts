import api from "./http";

export interface LoginRequest {
  user: string;
  pass: string;
}

export interface TokenResponse {
  token: string;
}

export async function login(req: LoginRequest) {
  const { data } = await api.post<TokenResponse>("/login", req);
  return data;
}

export interface SignupRequest {
  username: string;
  password: string;
}

export async function signup(req: SignupRequest) {
  const { data } = await api.post("/signup", req);
  return data;
} 