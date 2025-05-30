import { useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { login } from "../../api/auth";
import { useState } from "react";

const schema = z.object({
  user: z.string().min(3, "Usuário obrigatório"),
  pass: z.string().min(3, "Senha obrigatória"),
});

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });
  const navigate = useNavigate();
  const location = useLocation();
  const [errorMsg, setErrorMsg] = useState(null);

  const onSubmit = async (data) => {
    setErrorMsg(null);
    try {
      const res = await login(data);
      localStorage.setItem("token", res.token);
      const redirectTo = location.state?.from?.pathname || "/dashboard";
      navigate(redirectTo);
    } catch (err) {
      console.error(err);
      setErrorMsg("Credenciais inválidas");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-background">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-sm"
      >
        <h2 className="mb-6 text-center text-2xl font-bold text-primary-dk">
          Login
        </h2>
        <div className="mb-4">
          <label className="block text-primary-dk text-sm font-bold mb-2">
            Usuário
          </label>
          <input
            {...register("user")}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="text"
            placeholder="Usuário"
          />
          {errors.user && (
            <p className="text-red-500 text-xs italic">{errors.user.message}</p>
          )}
        </div>
        <div className="mb-6">
          <label className="block text-primary-dk text-sm font-bold mb-2">
            Senha
          </label>
          <input
            {...register("pass")}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            type="password"
            placeholder="********"
          />
          {errors.pass && (
            <p className="text-red-500 text-xs italic">{errors.pass.message}</p>
          )}
        </div>
        {errorMsg && <p className="text-red-500 text-xs italic mb-4">{errorMsg}</p>}
        <div className="flex items-center justify-between">
          <button
            className="bg-primary hover:bg-primary-dk text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Entrar
          </button>
        </div>
      </form>
    </div>
  );
} 