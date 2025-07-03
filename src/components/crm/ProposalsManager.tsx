
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  FileText, 
  Plus, 
  Search, 
  Filter,
  Send,
  Eye,
  Download,
  Edit,
  Calendar,
  DollarSign
} from "lucide-react";
import { NewProposalDialog } from "./NewProposalDialog";
import { useToast } from "@/hooks/use-toast";

const mockProposals = [
  {
    id: 1,
    title: "Proposta Sistema ERP - Empresa XYZ",
    client: "Maria Santos",
    company: "Empresa XYZ",
    value: 45000,
    status: "Enviada",
    createdAt: "2024-01-15",
    validUntil: "2024-02-15",
    template: "ERP Standard"
  },
  {
    id: 2,
    title: "Consultoria TI - StartupTech",
    client: "João Silva", 
    company: "StartupTech",
    value: 15000,
    status: "Rascunho",
    createdAt: "2024-01-14",
    validUntil: "2024-02-14",
    template: "Consultoria"
  },
  {
    id: 3,
    title: "Software Personalizado - ABC Corp",
    client: "Ana Costa",
    company: "ABC Corp", 
    value: 75000,
    status: "Aceita",
    createdAt: "2024-01-10",
    validUntil: "2024-02-10",
    template: "Desenvolvimento"
  }
];

const statusColors: Record<string, string> = {
  "Rascunho": "bg-gray-100 text-gray-800",
  "Enviada": "bg-blue-100 text-blue-800",
  "Visualizada": "bg-yellow-100 text-yellow-800",
  "Aceita": "bg-green-100 text-green-800",
  "Rejeitada": "bg-red-100 text-red-800"
};

export const ProposalsManager = () => {
  const [proposals, setProposals] = useState(mockProposals);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const { toast } = useToast();

  const handleCreateProposal = (newProposal: any) => {
    setProposals(prev => [...prev, newProposal]);
    console.log("Proposta adicionada:", newProposal);
  };

  const handleViewProposal = (proposalId: number) => {
    const proposal = proposals.find(p => p.id === proposalId);
    console.log(`Visualizando proposta ${proposalId}:`, proposal);
    toast({
      title: "Proposta Visualizada",
      description: `Abrindo visualização da proposta ${proposal?.title}`,
    });
  };

  const handleEditProposal = (proposalId: number) => {
    const proposal = proposals.find(p => p.id === proposalId);
    console.log(`Editando proposta ${proposalId}:`, proposal);
    toast({
      title: "Editar Proposta",
      description: `Abrindo editor para ${proposal?.title}`,
    });
  };

  const handleSendProposal = (proposalId: number) => {
    const proposal = proposals.find(p => p.id === proposalId);
    if (proposal) {
      // Atualizar status para "Enviada"
      setProposals(prev => prev.map(p => 
        p.id === proposalId ? { ...p, status: "Enviada" } : p
      ));
      
      console.log(`Enviando proposta ${proposalId}:`, proposal);
      toast({
        title: "Proposta Enviada",
        description: `${proposal.title} foi enviada com sucesso`,
      });
    }
  };

  const handleDownloadProposal = (proposalId: number) => {
    const proposal = proposals.find(p => p.id === proposalId);
    console.log(`Baixando PDF da proposta ${proposalId}:`, proposal);
    toast({
      title: "Download Iniciado",
      description: `Gerando PDF de ${proposal?.title}`,
    });
    
    // Simular download
    setTimeout(() => {
      const link = document.createElement('a');
      link.href = '#';
      link.download = `proposta-${proposalId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }, 1000);
  };

  const handleFilterChange = () => {
    console.log("Abrindo filtros avançados...");
    toast({
      title: "Filtros",
      description: "Funcionalidade de filtros será implementada em breve",
    });
  };

  const filteredProposals = proposals.filter(proposal => {
    const matchesSearch = proposal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         proposal.client.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || proposal.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Propostas</h1>
          <p className="text-gray-600">Gerencie suas propostas comerciais</p>
        </div>
        <NewProposalDialog onCreateProposal={handleCreateProposal} />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-2xl font-bold text-blue-600">{proposals.length}</p>
              </div>
              <FileText className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Enviadas</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {proposals.filter(p => p.status === "Enviada").length}
                </p>
              </div>
              <Send className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Aceitas</p>
                <p className="text-2xl font-bold text-green-600">
                  {proposals.filter(p => p.status === "Aceita").length}
                </p>
              </div>
              <Calendar className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Valor Total</p>
                <p className="text-2xl font-bold text-purple-600">
                  R$ {proposals.reduce((sum, p) => sum + p.value, 0).toLocaleString()}
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Buscar propostas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex space-x-2">
          <Button
            variant={statusFilter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter("all")}
          >
            Todas
          </Button>
          <Button
            variant={statusFilter === "Rascunho" ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter("Rascunho")}
          >
            Rascunhos
          </Button>
          <Button
            variant={statusFilter === "Enviada" ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter("Enviada")}
          >
            Enviadas
          </Button>
          <Button
            variant={statusFilter === "Aceita" ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter("Aceita")}
          >
            Aceitas
          </Button>
        </div>
        
        <Button variant="outline" onClick={handleFilterChange}>
          <Filter className="w-4 h-4 mr-2" />
          Filtros
        </Button>
      </div>

      {/* Proposals List */}
      <div className="space-y-4">
        {filteredProposals.map((proposal) => (
          <Card key={proposal.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-900">{proposal.title}</h3>
                    <Badge className={statusColors[proposal.status]}>
                      {proposal.status}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                    <div>
                      <span className="text-gray-600">Cliente: </span>
                      <span className="font-medium">{proposal.client}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Empresa: </span>
                      <span className="font-medium">{proposal.company}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Valor: </span>
                      <span className="font-medium text-green-600">R$ {proposal.value.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Válida até: </span>
                      <span className="font-medium">{new Date(proposal.validUntil).toLocaleDateString('pt-BR')}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      <Calendar className="w-4 h-4 inline mr-1" />
                      Criada em {new Date(proposal.createdAt).toLocaleDateString('pt-BR')}
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" onClick={() => handleViewProposal(proposal.id)}>
                        <Eye className="w-4 h-4 mr-1" />
                        Ver
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleEditProposal(proposal.id)}>
                        <Edit className="w-4 h-4 mr-1" />
                        Editar
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleSendProposal(proposal.id)}
                        disabled={proposal.status === "Aceita"}
                      >
                        <Send className="w-4 h-4 mr-1" />
                        Enviar
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleDownloadProposal(proposal.id)}>
                        <Download className="w-4 h-4 mr-1" />
                        PDF
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredProposals.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Nenhuma proposta encontrada
          </h3>
          <p className="text-gray-500 mb-4">
            {searchTerm || statusFilter !== "all" 
              ? "Tente ajustar os filtros de busca"
              : "Comece criando sua primeira proposta"
            }
          </p>
          <NewProposalDialog 
            onCreateProposal={handleCreateProposal}
            trigger={
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Nova Proposta
              </Button>
            }
          />
        </div>
      )}
    </div>
  );
};
