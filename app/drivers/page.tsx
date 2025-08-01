"use client";

import {useState, useEffect} from "react";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  PlusIcon,
  IdentificationCardIcon,
  CameraIcon,
} from "@phosphor-icons/react";
import {apiClient} from "@/lib/api";
import {useToast} from "@/hooks/use-toast";
import {LoadingSpinner} from "@/components/ui/loading-spinner";

interface Driver {
  id: number;
  nome: string;
  cpf: string;
  cnh: string;
  imagem_path?: string;
}

export default function DriversPage() {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    nome: "",
    cpf: "",
    cnh: "",
    imagem: null as File | null,
  });
  const { toast } = useToast();

  useEffect(() => {
    loadDrivers();
  }, []);

  const loadDrivers = async () => {
    setLoading(true);
    const response = await apiClient.getMotoristas();
    if (response.error) {
      toast({
        title: "Erro ao carregar motoristas",
        description: response.error,
        variant: "destructive",
      });
    } else if (response.data) {
      const mappedDrivers = response.data.map((motorista) => ({
        id: motorista.id,
        nome: motorista.nome,
        cpf: "",
        cnh: "",
        imagem_path: undefined,
      }));
      setDrivers(mappedDrivers);
    }
    setLoading(false);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({...prev, imagem: e.target.files![0]}));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nome || !formData.cpf || !formData.cnh || !formData.imagem) return;

    setLoading(true);
    const form = new FormData();
    form.append("nome", formData.nome);
    form.append("cpf", formData.cpf);
    form.append("cnh", formData.cnh);
    form.append("imagem", formData.imagem);

    const response = await apiClient.cadastrarMotorista(form);

    if (response.error) {
      toast({
        title: "Erro ao cadastrar motorista",
        description: response.error,
        variant: "destructive",
      });
    } else if (response.data) {
      toast({
        title: "Motorista cadastrado",
        description: "Motorista cadastrado com sucesso!",
      });
      setDrivers((prev) => [...prev, response.data]);
      setFormData({nome: "", cpf: "", cnh: "", imagem: null});
      setIsModalOpen(false);
      loadDrivers();
    }
    setLoading(false);
  };

  return (
    <main className="p-4 md:p-6">
      <div className="flex flex-col gap-2 mb-6">
        <h1 className="text-3xl font-bold text-white">
          Gerenciamento de Motoristas
        </h1>
        <p className="text-gray-200">Cadastre e gerencie os motoristas autorizados</p>
      </div>

      <Card className="w-full max-w-none">
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <IdentificationCardIcon className="h-5 w-5" />
              Motoristas Cadastrados
            </CardTitle>

            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <PlusIcon className="h-4 w-4" />
                  Novo Motorista
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Cadastrar Novo Motorista</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="nome">Nome Completo</Label>
                    <Input
                      id="nome"
                      placeholder="Nome do motorista"
                      value={formData.nome}
                      onChange={(e) =>
                        setFormData((prev) => ({...prev, nome: e.target.value}))
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="cpf">CPF</Label>
                    <Input
                      id="cpf"
                      placeholder="CPF do motorista"
                      value={formData.cpf}
                      onChange={(e) =>
                        setFormData((prev) => ({...prev, cpf: e.target.value}))
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="cnh">CNH</Label>
                    <Input
                      id="cnh"
                      placeholder="CNH do motorista"
                      value={formData.cnh}
                      onChange={(e) =>
                        setFormData((prev) => ({...prev, cnh: e.target.value}))
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="imagem">Foto do Motorista</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="imagem"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        required
                        className="flex-1"
                      />
                      <CameraIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    {formData.imagem && (
                      <p className="text-sm text-green-600 mt-1">
                        Imagem selecionada: {formData.imagem.name}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsModalOpen(false)}
                      className="flex-1"
                    >
                      Cancelar
                    </Button>
                    <Button
                      type="submit"
                      disabled={loading}
                      className="flex-1"
                    >
                      {loading ? "Cadastrando..." : "Cadastrar"}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <LoadingSpinner text="Carregando motoristas..." />
          ) : drivers.length === 0 ? (
            <div className="text-center py-12">
              <IdentificationCardIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">Nenhum motorista cadastrado</p>
              <p className="text-sm text-gray-400">
                Clique em <strong>Novo Motorista</strong> para começar
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {drivers.map((driver) => (
                <Card key={driver.id} className="border border-gray-200">
                  <CardContent className="p-4">
                    <div className="flex flex-col items-center text-center space-y-3">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                        {driver.imagem_path ? (
                          <img
                            src={driver.imagem_path}
                            alt={driver.nome}
                            className="w-16 h-16 rounded-full object-cover"
                          />
                        ) : (
                          <IdentificationCardIcon className="h-8 w-8 text-gray-400" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{driver.nome}</h3>
                        {/*<p className="text-sm text-gray-500">CPF: {driver.cpf}</p>*/}
                        {/*<p className="text-sm text-gray-500">CNH: {driver.cnh}</p>*/}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}