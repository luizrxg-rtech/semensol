"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ClockIcon, DownloadIcon } from "@phosphor-icons/react";
import { apiClient } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

interface HistoricoItem {
  id: number;
  placa: string;
  motorista: string;
  peso_entrada: number;
  peso_saida?: number;
  data_entrada: string;
  data_saida?: string;
  status: string;
}

export default function HistoryPage() {
  const [historico, setHistorico] = useState<HistoricoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtros, setFiltros] = useState({
    placa: "",
    motorista: "",
    dataInicio: "",
    dataFim: "",
    status: "",
  });
  const { toast } = useToast();

  useEffect(() => {
    loadHistorico();
  }, []);

  const loadHistorico = async () => {
    setLoading(true);
    const response = await apiClient.getHistorico();
    if (response.error) {
      toast({
        title: "Erro ao carregar histórico",
        description: response.error,
        variant: "destructive",
      });
    } else if (response.data) {
      setHistorico(response.data);
    }
    setLoading(false);
  };

  const historicoFiltrado = historico.filter((item) => {
    return (
      (!filtros.placa ||
        item.placa.toLowerCase().includes(filtros.placa.toLowerCase())) &&
      (!filtros.motorista ||
        item.motorista.toLowerCase().includes(filtros.motorista.toLowerCase())) &&
      (!filtros.status || item.status === filtros.status)
    );
  });

  const exportarDados = () => {
    try {
      const csvContent = [
        "Placa,Motorista,Peso Entrada,Peso Saída,Data Entrada,Data Saída,Status",
        ...historicoFiltrado.map((item) =>
          `${item.placa},${item.motorista},${item.peso_entrada},${
            item.peso_saida || ""
          },${item.data_entrada},${item.data_saida || ""},${item.status}`
        ),
      ].join("\n");

      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "historico-pesagem.csv";
      a.click();
      window.URL.revokeObjectURL(url);

      toast({
        title: "Exportação concluída",
        description: "Arquivo CSV exportado com sucesso!",
      });
    } catch (error) {
      toast({
        title: "Erro na exportação",
        description: "Não foi possível exportar o arquivo CSV.",
        variant: "destructive",
      });
    }
  };

  return (
    <main className="p-4 md:p-6">
      <div className="flex flex-col gap-2 mb-6">
        <h1 className="text-3xl font-bold text-white">
          Histórico de Pesagem
        </h1>
        <p className="text-gray-200">
          Consulte e exporte o histórico completo das operações de pesagem
        </p>
      </div>

      <Card className="w-full max-w-none">
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <ClockIcon className="h-5 w-5" />
              Registros de Pesagem
            </CardTitle>
            <Button
              onClick={exportarDados}
              className="flex items-center gap-2"
            >
              <DownloadIcon className="h-4 w-4" />
              Exportar CSV
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <Label htmlFor="placa-filter">Placa</Label>
              <Input
                id="placa-filter"
                placeholder="Filtrar por placa"
                value={filtros.placa}
                onChange={(e) =>
                  setFiltros((prev) => ({ ...prev, placa: e.target.value }))
                }
              />
            </div>
            <div>
              <Label htmlFor="motorista-filter">Motorista</Label>
              <Input
                id="motorista-filter"
                placeholder="Filtrar por motorista"
                value={filtros.motorista}
                onChange={(e) =>
                  setFiltros((prev) => ({ ...prev, motorista: e.target.value }))
                }
              />
            </div>
            <div>
              <Label htmlFor="status-filter">Status</Label>
              <Select
                value={filtros.status}
                onValueChange={(value) =>
                  setFiltros((prev) => ({ ...prev, status: value === "todos" ? "" : value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="aberto">Em Andamento</SelectItem>
                  <SelectItem value="concluido">Concluído</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button
                variant="outline"
                onClick={() =>
                  setFiltros({
                    placa: "",
                    motorista: "",
                    dataInicio: "",
                    dataFim: "",
                    status: "",
                  })
                }
                className="w-full"
              >
                Limpar Filtros
              </Button>
            </div>
          </div>

          {loading ? (
            <LoadingSpinner text="Carregando histórico..." />
          ) : historicoFiltrado.length === 0 ? (
            <div className="text-center py-8">
              <ClockIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Nenhum registro encontrado</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4 font-semibold">Placa</th>
                    <th className="text-left p-4 font-semibold">Motorista</th>
                    <th className="text-left p-4 font-semibold">Peso Entrada</th>
                    <th className="text-left p-4 font-semibold">Peso Saída</th>
                    <th className="text-left p-4 font-semibold">Data Entrada</th>
                    <th className="text-left p-4 font-semibold">Data Saída</th>
                    <th className="text-left p-4 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {historicoFiltrado.map((item) => (
                    <tr key={item.id} className="border-b hover:bg-gray-50">
                      <td className="p-4 font-medium">{item.placa}</td>
                      <td className="p-4">{item.motorista}</td>
                      <td className="p-4">{item.peso_entrada} kg</td>
                      <td className="p-4">
                        {item.peso_saida ? `${item.peso_saida} kg` : "-"}
                      </td>
                      <td className="p-4">
                        {new Date(item.data_entrada).toLocaleString("pt-BR")}
                      </td>
                      <td className="p-4">
                        {item.data_saida
                          ? new Date(item.data_saida).toLocaleString("pt-BR")
                          : "-"}
                      </td>
                      <td className="p-4">
                        <Badge
                          variant="secondary"
                          className={
                            item.status === "concluido"
                              ? "bg-green-100 text-green-700"
                              : "bg-amber-100 text-amber-700"
                          }
                        >
                          {item.status === "concluido"
                            ? "Concluído"
                            : "Em Andamento"}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}