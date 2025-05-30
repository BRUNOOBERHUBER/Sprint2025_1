import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Heart } from "lucide-react";

export default function SaudeTab() {
  const { id: alunoId } = useParams();

  console.log("SaudeTab renderizando com alunoId:", alunoId);

  // Teste simples primeiro
  if (!alunoId) {
    return <div className="p-4 text-red-600">Erro: ID do aluno não encontrado</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-blue-800 flex items-center gap-2">
            <Heart className="w-5 h-5" />
            Informações de Saúde
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-800">Condições de Saúde</h4>
              <div className="space-y-3">
                <div className="p-3 border rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-medium">Dislexia</span>
                    <Badge className="bg-blue-100 text-blue-800">Confirmado</Badge>
                  </div>
                  <p className="text-sm text-gray-600">
                    Diagnóstico confirmado em 15/03/2024. Necessita de adaptações pedagógicas.
                  </p>
                  <div className="mt-2 text-xs text-gray-500">Laudo médico: Dr. Ana Silva - CRM 12345</div>
                </div>

                <div className="p-3 border rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-medium">Asma Leve</span>
                    <Badge className="bg-yellow-100 text-yellow-800">Controlada</Badge>
                  </div>
                  <p className="text-sm text-gray-600">
                    Porta bombinha de emergência. Evitar atividades físicas intensas em dias frios.
                  </p>
                  <div className="mt-2 text-xs text-gray-500">Última consulta: 10/02/2024</div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-gray-800">Medicações</h4>
              <div className="space-y-3">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="font-medium">Salbutamol (bombinha)</div>
                  <div className="text-sm text-gray-600">Uso conforme necessidade</div>
                  <div className="text-xs text-gray-500 mt-1">Autorizado pelos responsáveis</div>
                </div>
              </div>

              <h4 className="font-semibold text-gray-800 mt-6">Alergias</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span className="text-sm">Amendoim</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span className="text-sm">Pólen</span>
                </div>
              </div>

              <h4 className="font-semibold text-gray-800 mt-6">Contatos de Emergência</h4>
              <div className="space-y-2">
                <div className="text-sm">
                  <div className="font-medium">Hospital Infantil</div>
                  <div className="text-gray-600">(11) 3456-7890</div>
                </div>
                <div className="text-sm">
                  <div className="font-medium">Dr. Ana Silva (Pediatra)</div>
                  <div className="text-gray-600">(11) 9876-5432</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 