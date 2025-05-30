import api from "./http";

export async function login(req) {
  const payload = { user: req.user, passw: req.pass };
  const { data } = await api.post("/auth/login", payload);
  return data;
}

export async function signup(req) {
  const { data } = await api.post("/signup", req);
  return data;
} 