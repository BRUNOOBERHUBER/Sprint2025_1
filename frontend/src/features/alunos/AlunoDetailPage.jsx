import { useParams, useNavigate, useLocation, Routes, Route, Navigate } from "react-router-dom";
import DadosGeraisTab from "./tabs/DadosGeraisTab";
import BoletinsTab from "./tabs/BoletinsTab";
import FrequenciaTab from "./tabs/FrequenciaTab";
import ContraturnoTab from "./tabs/ContraturnoTab";
// Stubs para outras abas
import PlaceholderTab from "./tabs/PlaceholderTab";
import StudentNavigation from "../../components/StudentNavigation";
import SaudeTab from "./tabs/SaudeTab";
import AtendimentosTab from "./tabs/AtendimentosTab";

export default function AlunoDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  if (!id) {
    return <div>Id inválido</div>;
  }

  const tabs = [
    { path: "dados-gerais", label: "Dados Gerais", element: <DadosGeraisTab /> },
    { path: "boletins", label: "Boletins", element: <BoletinsTab /> },
    { path: "frequencia", label: "Frequência", element: <FrequenciaTab /> },
    { path: "saude", label: "Saúde", element: <SaudeTab /> },
    { path: "atendimentos", label: "Atendimentos", element: <AtendimentosTab /> },
    { path: "contraturno", label: "Contraturno", element: <ContraturnoTab /> },
  ];

  const currentTab = location.pathname.split("/").pop() || "dados-gerais";
  const handleTabChange = (tab) => navigate(`/alunos/${id}/${tab}`);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Aluno {id}</h1>
      <StudentNavigation activeTab={currentTab} onTabChange={handleTabChange} />
      <Routes>
        <Route index element={<Navigate to="dados-gerais" />} />
        {tabs.map((t) => (
          <Route key={t.path} path={t.path} element={t.element} />
        ))}
      </Routes>
    </div>
  );
} 