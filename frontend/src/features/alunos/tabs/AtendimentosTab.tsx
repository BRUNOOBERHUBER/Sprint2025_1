import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { MessageCircle } from "lucide-react";

export default function AtendimentosTab() {
  const { id: alunoId } = useParams();

  console.log("AtendimentosTab renderizando com alunoId:", alunoId);

  // Teste simples primeiro
  if (!alunoId) {
    return <div className="p-4 text-red-600">Erro: ID do aluno não encontrado</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-blue-800 flex items-center gap-2">
            <MessageCircle className="w-5 h-5" />
            Histórico de Atendimentos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="font-semibold">Reunião com Responsáveis</h4>
                  <p className="text-sm text-gray-600">15/11/2024 - 14:30</p>
                </div>
                <Badge className="bg-green-100 text-green-800">Concluído</Badge>
              </div>
              <div className="space-y-2">
                <div>
                  <strong>Motivo:</strong> Discussão sobre dificuldades em matemática
                </div>
                <div>
                  <strong>Responsável:</strong> Profa. Maria Santos (Coordenadora)
                </div>
                <div>
                  <strong>Resultado:</strong> Acordado reforço escolar 2x por semana. Responsáveis
                  comprometeram-se com acompanhamento em casa.
                </div>
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="font-semibold">Atendimento Psicopedagógico</h4>
                  <p className="text-sm text-gray-600">08/11/2024 - 10:00</p>
                </div>
                <Badge className="bg-blue-100 text-blue-800">Em andamento</Badge>
              </div>
              <div className="space-y-2">
                <div>
                  <strong>Motivo:</strong> Avaliação de dificuldades de aprendizagem
                </div>
                <div>
                  <strong>Responsável:</strong> Psicopedagoga Carla Lima
                </div>
                <div>
                  <strong>Resultado:</strong> Identificadas estratégias específicas para dislexia. Próxima sessão
                  agendada para 22/11.
                </div>
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="font-semibold">Encaminhamento Médico</h4>
                  <p className="text-sm text-gray-600">25/10/2024 - 09:15</p>
                </div>
                <Badge className="bg-yellow-100 text-yellow-800">Aguardando</Badge>
              </div>
              <div className="space-y-2">
                <div>
                  <strong>Motivo:</strong> Crise asmática durante educação física
                </div>
                <div>
                  <strong>Responsável:</strong> Enfermeira Escolar - Ana Costa
                </div>
                <div>
                  <strong>Resultado:</strong> Responsáveis orientados a buscar reavaliação médica. Aguardando
                  retorno com novo laudo.
                </div>
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="font-semibold">Conselho de Classe</h4>
                  <p className="text-sm text-gray-600">18/10/2024 - 16:00</p>
                </div>
                <Badge className="bg-green-100 text-green-800">Concluído</Badge>
              </div>
              <div className="space-y-2">
                <div>
                  <strong>Motivo:</strong> Avaliação bimestral do desempenho
                </div>
                <div>
                  <strong>Responsável:</strong> Equipe Docente
                </div>
                <div>
                  <strong>Resultado:</strong> Definidas estratégias de apoio em matemática. Elogiado progresso em
                  português e participação em sala.
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">Próximos Atendimentos</h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">Sessão Psicopedagógica</span>
                <span className="text-sm font-medium">22/11/2024 - 10:00</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Reunião de Acompanhamento</span>
                <span className="text-sm font-medium">29/11/2024 - 14:30</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 