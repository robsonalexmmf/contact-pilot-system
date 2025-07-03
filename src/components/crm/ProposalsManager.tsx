
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
  const [proposals] = useState(mockProposals);
  const [searchTerm, setSearchTerm] = useState("");

  const handleNewProposal = () => {
    console.log("Criando nova proposta...");
  };

  const handleViewProposal = (proposalId: number) => {
    console.log(`Visualizando proposta ${proposalId}...`);
  };

  const handleEditProposal = (proposalId: number) => {
    console.log(`Editando proposta ${proposalId}...`);
  };

  const handleSendProposal = (proposalId: number) => {
    console.log(`Enviando proposta ${proposalId}...`);
  };

  const handleDownloadProposal = (proposalId: number) => {
    console.log(`Baixando proposta ${proposalId}...`);
  };

  const filteredProposals = proposals.filter(proposal =>
    proposal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    proposal.client.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Propostas</h1>
          <p className="text-gray-600">Gerencie suas propostas comerciais</p>
        </div>
        <Button onClick={handleNewProposal} className="bg-gradient-to-r from-blue-600 to-purple-600">
          <Plus className="w-4 h-4 mr-2" />
          Nova Proposta
        </Button>
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
              <Badge className="w-8 h-8 text-green-500" />
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
        <Button variant="outline">
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
                      <Button size="sm" variant="outline" onClick={() => handleSendProposal(proposal.id)}>
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
    </div>
  );
};
