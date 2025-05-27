import { useParams, useNavigate, useLocation, Routes, Route, Navigate } from "react-router-dom";
import DadosGeraisTab from "./tabs/DadosGeraisTab";
import BoletinsTab from "./tabs/BoletinsTab";
import FrequenciaTab from "./tabs/FrequenciaTab";
// Stubs para outras abas
import PlaceholderTab from "./tabs/PlaceholderTab";
import StudentNavigation from "../../components/StudentNavigation";

export default function AlunoDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

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

  const currentTab = location.pathname.split("/").pop() || "dados";
  const handleTabChange = (tab: string) => navigate(tab);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Aluno {id}</h1>
      <StudentNavigation activeTab={currentTab} onTabChange={handleTabChange} />
      <Routes>
        <Route index element={<Navigate to="dados" />} />
        {tabs.map((t) => (
          <Route key={t.path} path={t.path} element={t.element} />
        ))}
      </Routes>
    </div>
  );
} 