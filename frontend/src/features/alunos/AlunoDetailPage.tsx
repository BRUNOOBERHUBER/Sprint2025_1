import { useParams, NavLink, Routes, Route, Navigate } from "react-router-dom";
import DadosGeraisTab from "./tabs/DadosGeraisTab";
import BoletinsTab from "./tabs/BoletinsTab";
import FrequenciaTab from "./tabs/FrequenciaTab";
// Stubs para outras abas
import PlaceholderTab from "./tabs/PlaceholderTab";

export default function AlunoDetailPage() {
  const { id } = useParams();

  if (!id) {
    return <div>Id inválido</div>;
  }

  const tabs = [
    { path: "dados", label: "Dados Gerais", element: <DadosGeraisTab /> },
    { path: "boletins", label: "Boletins", element: <BoletinsTab /> },
    { path: "frequencia", label: "Frequência", element: <FrequenciaTab /> },
    // adicionar outras conforme §3.2
    { path: "saude", label: "Saúde", element: <PlaceholderTab nome="Saúde" /> },
    { path: "atendimentos", label: "Atendimentos", element: <PlaceholderTab nome="Atendimentos" /> },
    { path: "projetos", label: "Contraturno", element: <PlaceholderTab nome="Contraturno" /> },
  ];

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Aluno {id}</h1>
      <nav className="flex gap-4 mb-4 border-b pb-2">
        {tabs.map((t) => (
          <NavLink
            key={t.path}
            to={t.path}
            className={({ isActive }) => (isActive ? "font-bold text-primary" : "")}
          >
            {t.label}
          </NavLink>
        ))}
      </nav>
      <Routes>
        <Route index element={<Navigate to="dados" />} />
        {tabs.map((t) => (
          <Route key={t.path} path={t.path} element={t.element} />
        ))}
      </Routes>
    </div>
  );
} 