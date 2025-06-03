import { useParams, useNavigate, useLocation, Routes, Route } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getAluno } from "../../api/alunos";
import DadosGeraisTab from "./tabs/DadosGeraisTab";
import BoletinsTab from "./tabs/BoletinsTab";
import FrequenciaTab from "./tabs/FrequenciaTab";
import ContraturnoTab from "./tabs/ContraturnoTab";
import SaudeTab from "./tabs/SaudeTab";
import AtendimentosTab from "./tabs/AtendimentosTab";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/card";
import { User, FileText, Calendar, Heart, MessageCircle, Clock, ChevronRight, ArrowLeft } from "lucide-react";
import { Button } from "../../components/ui/button";

export default function AlunoDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const { data: aluno } = useQuery({
    queryKey: ["aluno", id],
    queryFn: () => getAluno(id),
    enabled: !!id,
  });

  if (!id) {
    return <div>Id inválido</div>;
  }

  const tabs = [
    { 
      path: "dados-gerais", 
      label: "Dados Gerais", 
      element: <DadosGeraisTab />,
      icon: <User className="w-6 h-6" />,
      description: "Informações pessoais e acadêmicas do aluno"
    },
    { 
      path: "boletins", 
      label: "Boletins", 
      element: <BoletinsTab />,
      icon: <FileText className="w-6 h-6" />,
      description: "Notas e desempenho acadêmico"
    },
    { 
      path: "frequencia", 
      label: "Frequência", 
      element: <FrequenciaTab />,
      icon: <Calendar className="w-6 h-6" />,
      description: "Registro de presença e faltas"
    },
    { 
      path: "saude", 
      label: "Saúde", 
      element: <SaudeTab />,
      icon: <Heart className="w-6 h-6" />,
      description: "Informações de saúde e atendimentos médicos"
    },
    { 
      path: "atendimentos", 
      label: "Atendimentos", 
      element: <AtendimentosTab />,
      icon: <MessageCircle className="w-6 h-6" />,
      description: "Histórico de atendimentos e ocorrências"
    },
    { 
      path: "contraturno", 
      label: "Contraturno", 
      element: <ContraturnoTab />,
      icon: <Clock className="w-6 h-6" />,
      description: "Atividades e projetos extracurriculares"
    },
  ];

  const currentTab = location.pathname.split("/").pop();
  const handleTabChange = (tab) => navigate(`/alunos/${id}/${tab}`);
  const currentTabData = tabs.find(tab => tab.path === currentTab);

  // Se não estiver em nenhuma aba específica, mostra o sumário
  if (!currentTab || currentTab === id) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="bg-primary text-white -mx-6 px-6 py-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">
                {aluno ? `${aluno.nome} ${aluno.sobrenome}` : "Carregando..."}
              </h1>
              <p className="text-white/80">{aluno?.anoEscolar}</p>
            </div>
          </div>
        </div>

        {/* Grid de Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tabs.map((tab) => (
            <Card 
              key={tab.path}
              className="border-2 border-secondary hover:border-primary cursor-pointer transition-all duration-200"
              onClick={() => handleTabChange(tab.path)}
            >
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-secondary rounded-lg text-primary">
                    {tab.icon}
                  </div>
                  <CardTitle className="text-lg text-primary-dark">
                    {tab.label}
                  </CardTitle>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{tab.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Se estiver em uma aba específica, mostra apenas o conteúdo da aba com botão de voltar
  return (
    <div className="container mx-auto p-6">
      <div className="mb-6 flex items-center gap-4">
        <Button 
          variant="ghost" 
          className="flex items-center gap-2 text-primary hover:text-primary-dark"
          onClick={() => navigate(`/alunos/${id}`)}
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </Button>
        <div className="flex items-center gap-2">
          <div className="p-2 bg-secondary rounded-lg">
            {currentTabData?.icon}
          </div>
          <h2 className="text-xl font-semibold text-primary-dark">
            {currentTabData?.label}
          </h2>
        </div>
      </div>
      <Routes>
        {tabs.map((t) => (
          <Route key={t.path} path={t.path} element={t.element} />
        ))}
      </Routes>
    </div>
  );
} 