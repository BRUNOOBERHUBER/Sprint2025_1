import React from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Clock } from "lucide-react";

export default function ContraturnoTab() {
  const { id: alunoId } = useParams();

  console.log("ContraturnoTab renderizando com alunoId:", alunoId);

  // Teste simples primeiro
  if (!alunoId) {
    return <div className="p-4 text-red-600">Erro: ID do aluno não encontrado</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-blue-800 flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Atividades de Contraturno
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="font-semibold text-lg">Reforço Escolar - Matemática</h4>
                  <p className="text-sm text-gray-600">Terças e Quintas | 14:00 - 15:30</p>
                </div>
                <Badge className="bg-green-100 text-green-800">Ativo</Badge>
              </div>
              <div className="space-y-2 mb-4">
                <div>
                  <strong>Período:</strong> 01/11/2024 - 20/12/2024
                </div>
                <div>
                  <strong>Responsável:</strong> Prof. João Silva
                </div>
                <div>
                  <strong>Objetivo:</strong> Reforçar conceitos básicos de matemática e desenvolver estratégias de
                  resolução de problemas.
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Frequência:</span>
                  <span className="text-sm font-medium">95% (19/20 aulas)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Progresso:</span>
                  <Badge className="bg-blue-100 text-blue-800">Bom</Badge>
                </div>
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="font-semibold text-lg">Oficina de Leitura</h4>
                  <p className="text-sm text-gray-600">Segundas | 15:00 - 16:00</p>
                </div>
                <Badge className="bg-green-100 text-green-800">Ativo</Badge>
              </div>
              <div className="space-y-2 mb-4">
                <div>
                  <strong>Período:</strong> 15/10/2024 - 15/12/2024
                </div>
                <div>
                  <strong>Responsável:</strong> Profa. Lucia Mendes
                </div>
                <div>
                  <strong>Objetivo:</strong> Desenvolver fluência leitora e compreensão textual, especialmente
                  para alunos com dislexia.
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Frequência:</span>
                  <span className="text-sm font-medium">100% (8/8 aulas)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Progresso:</span>
                  <Badge className="bg-green-100 text-green-800">Excelente</Badge>
                </div>
              </div>
            </div>

            <div className="border rounded-lg p-4 opacity-60">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="font-semibold text-lg">Projeto Horta Escolar</h4>
                  <p className="text-sm text-gray-600">Sextas | 13:30 - 15:00</p>
                </div>
                <Badge className="bg-gray-100 text-gray-800">Concluído</Badge>
              </div>
              <div className="space-y-2 mb-4">
                <div>
                  <strong>Período:</strong> 05/08/2024 - 30/10/2024
                </div>
                <div>
                  <strong>Responsável:</strong> Prof. Carlos Santos
                </div>
                <div>
                  <strong>Objetivo:</strong> Educação ambiental e desenvolvimento de responsabilidade através do
                  cuidado com plantas.
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Frequência Final:</span>
                  <span className="text-sm font-medium">88% (22/25 aulas)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Avaliação:</span>
                  <Badge className="bg-green-100 text-green-800">Satisfatório</Badge>
                </div>
              </div>
            </div>

            <div className="border rounded-lg p-4 border-dashed border-gray-300">
              <div className="text-center py-8">
                <Clock className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <h4 className="font-semibold text-gray-600 mb-2">Próximas Atividades</h4>
                <p className="text-sm text-gray-500 mb-4">
                  Oficina de Artes Visuais
                  <br />
                  Início previsto: Janeiro 2025
                </p>
                <Badge className="bg-blue-100 text-blue-800">Em planejamento</Badge>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-green-50 rounded-lg">
            <h4 className="font-semibold text-green-800 mb-2">Relatório de Progresso</h4>
            <p className="text-sm text-gray-700 mb-3">
              Robson tem demonstrado excelente engajamento nas atividades de contraturno. O reforço em matemática
              está apresentando resultados positivos, com melhora gradual na compreensão dos conceitos.
            </p>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-lg font-bold text-green-600">95%</div>
                <div className="text-xs text-gray-600">Frequência Geral</div>
              </div>
              <div>
                <div className="text-lg font-bold text-blue-600">3</div>
                <div className="text-xs text-gray-600">Projetos Ativos</div>
              </div>
              <div>
                <div className="text-lg font-bold text-purple-600">12h</div>
                <div className="text-xs text-gray-600">Horas Semanais</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 