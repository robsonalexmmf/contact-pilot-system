
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  Plus, 
  Search, 
  Filter, 
  Download,
  Send,
  Eye,
  Edit,
  Calendar,
  DollarSign,
  User,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const mockProposals = [
  {
    id: 1,
    title: "Proposta Sistema ERP - Empresa XYZ",
    client: "Empresa XYZ Ltda",
    contact: "Maria Santos",
    value: 45000,
    status: "enviada",
    createdDate: "2024-01-10",
    expiryDate: "2024-02-10",
    lastViewed: "2024-01-14",
    description: "Implementação de sistema ERP personalizado com módulos de vendas, estoque e financeiro",
    items: [
      { description: "Licença do Software", quantity: 1, unitPrice: 25000, total: 25000 },
      { description: "Implementação e Configuração", quantity: 40, unitPrice: 300, total: 12000 },
      { description: "Treinamento da Equipe", quantity: 16, unitPrice: 500, total: 8000 }
    ]
  },
  {
    id: 2,
    title: "Consultoria Digital - StartupTech",
    client: "StartupTech",
    contact: "João Silva",
    value: 15000,
    status: "rascunho",
    createdDate: "2024-01-12",
    expiryDate: "2024-02-12",
    lastViewed: null,
    description: "Consultoria para transformação digital e otimização de processos",
    items: [
      { description: "Auditoria Digital", quantity: 1, unitPrice: 5000, total: 5000 },
      { description: "Plano Estratégico", quantity: 1, unitPrice: 10000, total: 10000 }
    ]
  },
  {
    id: 3,
    title: "Desenvolvimento Web - ABC Corp",
    client: "ABC Corporação",
    contact: "Ana Costa",
    value: 32000,
    status: "aceita",
    createdDate: "2024-01-05",
    expiryDate: "2024-02-05",
    lastViewed: "2024-01-13",
    description: "Desenvolvimento de plataforma web responsiva com painel administrativo",
    items: [
      { description: "Design e UX/UI", quantity: 1, unitPrice: 8000, total: 8000 },
      { description: "Desenvolvimento Frontend", quantity: 1, unitPrice: 12000, total: 12000 },
      { description: "Desenvolvimento Backend", quantity: 1, unitPrice: 12000, total: 12000 }
    ]
  },
  {
    id: 4,
    title: "Automação RPA - Indústrias Ltda",
    client: "Indústrias XYZ Ltda",
    contact: "Carlos Oliveira",
    value: 28000,
    status: "rejeitada",
    createdDate: "2024-01-08",
    expiryDate: "2024-02-08",
    lastViewed: "2024-01-11",
    description: "Implementação de robôs de automação para processos administrativos",
    items: [
      { description: "Análise de Processos", quantity: 1, unitPrice: 5000, total: 5000 },
      { description: "Desenvolvimento RPA", quantity: 1, unitPrice: 18000, total: 18000 },
      { description: "Suporte e Manutenção", quantity: 12, unitPrice: 417, total: 5000 }
    ]
  }
];

const statusColors: Record<string, string> = {
  "rascunho": "bg-gray-100 text-gray-800",
  "enviada": "bg-blue-100 text-blue-800",
  "visualizada": "bg-yellow-100 text-yellow-800",
  "aceita": "bg-green-100 text-green-800",
  "rejeitada": "bg-red-100 text-red-800",
  "expirada": "bg-orange-100 text-orange-800"
};

const statusIcons: Record<string, any> = {
  "rascunho": Edit,
  "enviada": Send,
  "visualizada": Eye,
  "aceita": CheckCircle,
  "rejeitada": XCircle,
  "expirada": AlertCircle
};

export const ProposalsManager = () => {
  const [proposals] = useState(mockProposals);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [isNewProposalOpen, setIsNewProposalOpen] = useState(false);
  const [selectedProposal, setSelectedProposal] = useState<any>(null);

  const filteredProposals = proposals.filter(proposal => {
    const matchesSearch = proposal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         proposal.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         proposal.contact.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === "all" || proposal.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const totalValue = proposals.reduce((sum, p) => sum + p.value, 0);
  const acceptedValue = proposals.filter(p => p.status === 'aceita').reduce((sum, p) => sum + p.value, 0);
  const pendingProposals = proposals.filter(p => ['enviada', 'visualizada'].includes(p.status)).length;

  return (
    <div className="space-y-6">
      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Propostas</p>
                <div className="text-2xl font-bold text-gray-900">
                  {proposals.length}
                </div>
              </div>
              <FileText className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Valor Total</p>
                <div className="text-2xl font-bold text-green-600">
                  R$ {totalValue.toLocaleString()}
                </div>
              </div>
              <DollarSign className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Aceitas</p>
                <div className="text-2xl font-bold text-purple-600">
                  R$ {acceptedValue.toLocaleString()}
                </div>
              </div>
              <CheckCircle className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Pendentes</p>
                <div className="text-2xl font-bold text-orange-600">
                  {pendingProposals}
                </div>
              </div>
              <Clock className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros e Ações */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex flex-1 gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Buscar propostas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-40">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value="rascunho">Rascunho</SelectItem>
              <SelectItem value="enviada">Enviada</SelectItem>
              <SelectItem value="visualizada">Visualizada</SelectItem>
              <SelectItem value="aceita">Aceita</SelectItem>
              <SelectItem value="rejeitada">Rejeitada</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Dialog open={isNewProposalOpen} onOpenChange={setIsNewProposalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              <Plus className="w-4 h-4 mr-2" />
              Nova Proposta
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Criar Nova Proposta</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="col-span-2 space-y-2">
                <Label htmlFor="title">Título da Proposta *</Label>
                <Input id="title" placeholder="Título da proposta" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="client">Cliente *</Label>
                <Input id="client" placeholder="Nome do cliente" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact">Contato *</Label>
                <Input id="contact" placeholder="Nome do contato" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">E-mail do Contato</Label>
                <Input id="email" type="email" placeholder="email@cliente.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="expiryDate">Data de Expiração</Label>
                <Input id="expiryDate" type="date" />
              </div>
              <div className="col-span-2 space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea id="description" placeholder="Descrição detalhada da proposta" />
              </div>
              
              {/* Items da Proposta */}
              <div className="col-span-2 space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Itens da Proposta</Label>
                  <Button type="button" size="sm" variant="outline">
                    <Plus className="w-4 h-4 mr-1" />
                    Adicionar Item
                  </Button>
                </div>
                
                <div className="border rounded-lg p-4 space-y-4">
                  <div className="grid grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="item-desc">Descrição</Label>
                      <Input id="item-desc" placeholder="Descrição do item" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="item-qty">Qtd</Label>
                      <Input id="item-qty" type="number" placeholder="1" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="item-price">Preço Unit.</Label>
                      <Input id="item-price" type="number" placeholder="0,00" />
                    </div>
                    <div className="space-y-2">
                      <Label>Total</Label>
                      <Input readOnly value="R$ 0,00" className="bg-gray-50" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-span-2 space-y-2">
                <Label htmlFor="terms">Termos e Condições</Label>
                <Textarea id="terms" placeholder="Termos e condições da proposta" />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsNewProposalOpen(false)}>
                Cancelar
              </Button>
              <Button variant="outline">
                Salvar Rascunho
              </Button>
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600">
                Criar e Enviar
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Lista de Propostas */}
      <div className="grid grid-cols-1 gap-4">
        {filteredProposals.map((proposal) => {
          const StatusIcon = statusIcons[proposal.status];
          
          return (
            <Card key={proposal.id} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {proposal.title}
                      </h3>
                      <Badge className={statusColors[proposal.status]}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {proposal.status}
                      </Badge>
                    </div>
                    
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      {proposal.description}
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center text-gray-500">
                        <User className="w-4 h-4 mr-2" />
                        <div>
                          <span className="block font-medium">{proposal.client}</span>
                          <span className="text-xs">{proposal.contact}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center text-gray-500">
                        <DollarSign className="w-4 h-4 mr-2" />
                        <div>
                          <span className="block font-medium text-green-600">
                            R$ {proposal.value.toLocaleString()}
                          </span>
                          <span className="text-xs">Valor total</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center text-gray-500">
                        <Calendar className="w-4 h-4 mr-2" />
                        <div>
                          <span className="block font-medium">
                            {new Date(proposal.createdDate).toLocaleDateString('pt-BR')}
                          </span>
                          <span className="text-xs">Criada em</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center text-gray-500">
                        <Clock className="w-4 h-4 mr-2" />
                        <div>
                          <span className="block font-medium">
                            {new Date(proposal.expiryDate).toLocaleDateString('pt-BR')}
                          </span>
                          <span className="text-xs">Expira em</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col space-y-2 ml-4">
                    <Button size="sm" variant="outline">
                      <Eye className="w-4 h-4 mr-1" />
                      Ver
                    </Button>
                    <Button size="sm" variant="outline">
                      <Edit className="w-4 h-4 mr-1" />
                      Editar
                    </Button>
                    <Button size="sm" variant="outline">
                      <Download className="w-4 h-4 mr-1" />
                      PDF
                    </Button>
                    {proposal.status === 'rascunho' && (
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                        <Send className="w-4 h-4 mr-1" />
                        Enviar
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}

        {filteredProposals.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma proposta encontrada</h3>
            <p className="text-gray-500 mb-4">
              {searchTerm || selectedStatus !== "all" 
                ? "Tente ajustar os filtros de busca"
                : "Comece criando sua primeira proposta"
              }
            </p>
            <Button onClick={() => setIsNewProposalOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Nova Proposta
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
