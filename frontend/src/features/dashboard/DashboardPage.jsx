import { useState, useEffect } from "react";
import { Button } from "../../components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/card";
import { Calendar, Activity, GraduationCap, Users, AlertTriangle, FileText } from "lucide-react";
import { Bar, Line, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title as ChartTitle,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import api from "../../api/http";

// Registrar componentes do Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ChartTitle,
  Tooltip,
  Legend,
  ArcElement
);

export default function DashboardPage() {
  const [dashboardData, setDashboardData] = useState({
    totalAlunos: 0,
    totalColaboradores: 0,
    alunosComAtencao: 0,
    atendimentosMes: 0,
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const { data } = await api.get("/dashboard/stats");
        console.log("Dados do Dashboard recebidos:", data);
        setDashboardData({
          totalAlunos: data.totalAlunos,
          totalColaboradores: data.totalColaboradores,
          alunosComAtencao: data.alunosComAtencao,
          atendimentosMes: data.atendimentosMes,
        });
      } catch (error) {
        console.error("Erro ao buscar dados do dashboard:", error);
      }
    };
    fetchDashboardData();
  }, []);

  const frequenciaData = {
    labels: ["1º Bim", "2º Bim", "3º Bim", "4º Bim"],
    datasets: [{ label: "Frequência Média (%)", data: [92, 89, 91, 88], borderColor: "#1e81b0", backgroundColor: "rgba(30, 129, 176, 0.1)", tension: 0.4 }],
  };

  const notasIntervencaoData = {
    labels: ["0-2", "3-4", "5-6", "7-8", "9-10"],
    datasets: [
      { label: "Número de Alunos", data: [12, 28, 45, 89, 71], backgroundColor: "#76b5c5" },
      { label: "Intervenções", data: [8, 15, 12, 7, 3], backgroundColor: "#abdbe3" },
    ],
  };

  const tagsAtencaoData = {
    labels: ["Dificuldade Aprendizagem", "Frequência Baixa", "Comportamento", "Saúde", "Família"],
    datasets: [{ data: [35, 28, 15, 12, 10], backgroundColor: ["#063970", "#1e81b0", "#76b5c5", "#abdbe3", "#eeeee4"] }],
  };

  const chartOptions = { responsive: true, plugins: { legend: { position: "top" } } };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="w-8 h-8 text-primary-dark" />
          <h1 className="text-3xl font-bold text-primary-dark">Dashboard</h1>
        </div>
        <Button variant="outline" size="sm">
          <Calendar className="mr-2 h-4 w-4" /> Este mês
        </Button>
      </div>

      {/* Cards de estatísticas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-secondary">
          <CardHeader className="flex items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">Total de Alunos</CardTitle>
            <GraduationCap className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary-dark">{dashboardData.totalAlunos}</div>
            <p className="text-xs text-gray-600">+2 novos este mês</p>
          </CardContent>
        </Card>
        <Card className="border-secondary">
          <CardHeader className="flex items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">Colaboradores</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary-dark">{dashboardData.totalColaboradores}</div>
            <p className="text-xs text-gray-600">Equipe ativa</p>
          </CardContent>
        </Card>
        <Card className="border-secondary">
          <CardHeader className="flex items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">Alunos com Atenção</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{dashboardData.alunosComAtencao}</div>
            <p className="text-xs text-gray-600">Requerem acompanhamento</p>
          </CardContent>
        </Card>
        <Card className="border-secondary">
          <CardHeader className="flex items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">Atendimentos</CardTitle>
            <Activity className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary-dark">{dashboardData.atendimentosMes}</div>
            <p className="text-xs text-gray-600">Este mês</p>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="border-secondary">
          <CardHeader className="flex flex-col">
            <CardTitle className="text-primary-dark">Frequência por Bimestre</CardTitle>
            <p className="text-sm text-gray-600">Percentual médio de frequência dos alunos</p>
          </CardHeader>
          <CardContent>
            <Line data={frequenciaData} options={chartOptions} />
          </CardContent>
        </Card>
        <Card className="border-secondary">
          <CardHeader className="flex flex-col">
            <CardTitle className="text-primary-dark">Notas vs Intervenções</CardTitle>
            <p className="text-sm text-gray-600">Distribuição de alunos por faixa de nota</p>
          </CardHeader>
          <CardContent>
            <Bar data={notasIntervencaoData} options={chartOptions} />
          </CardContent>
        </Card>
        <Card className="border-secondary">
          <CardHeader className="flex flex-col">
            <CardTitle className="text-primary-dark">Tags de Atenção</CardTitle>
            <p className="text-sm text-gray-600">Distribuição dos tipos de acompanhamento</p>
          </CardHeader>
          <CardContent>
            <Doughnut data={tagsAtencaoData} options={chartOptions} />
          </CardContent>
        </Card>
      </div>

      {/* Ações rápidas */}
      <Card className="border-secondary">
        <CardHeader className="flex flex-col">
          <CardTitle className="text-primary-dark">Ações Rápidas</CardTitle>
          <p className="text-sm text-gray-600">Acesso direto às funcionalidades mais utilizadas</p>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Button className="bg-primary hover:bg-primary/90 text-white">
            <GraduationCap className="mr-2 h-4 w-4" /> Novo Aluno
          </Button>
          <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white">
            <Users className="mr-2 h-4 w-4" /> Novo Colaborador
          </Button>
          <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white">
            <FileText className="mr-2 h-4 w-4" /> Gerar Relatório
          </Button>
          <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white">
            <Activity className="mr-2 h-4 w-4" /> Novo Atendimento
          </Button>
        </CardContent>
      </Card>
    </div>
  );
} 