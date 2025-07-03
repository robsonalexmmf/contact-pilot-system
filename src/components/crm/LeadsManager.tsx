
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Users, 
  Search, 
  Filter,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Star,
  UserPlus
} from "lucide-react";
import { NewLeadDialog } from "./NewLeadDialog";
import { LeadActionsMenu } from "./LeadActionsMenu";

const mockLeads = [
  {
    id: 1,
    name: "Maria Santos",
    email: "maria@empresa.com",
    phone: "(11) 99999-1111",
    company: "Empresa XYZ",
    status: "Novo",
    score: 85,
    source: "Website",
    lastContact: "2024-01-15",
    value: 15000
  },
  {
    id: 2,
    name: "João Silva",
    email: "joao@startup.com", 
    phone: "(11) 99999-2222",
    company: "StartupTech",
    status: "Qualificado",
    score: 92,
    source: "LinkedIn",
    lastContact: "2024-01-14",
    value: 25000
  },
  {
    id: 3,
    name: "Ana Costa",
    email: "ana@corp.com",
    phone: "(11) 99999-3333", 
    company: "ABC Corp",
    status: "Proposta",
    score: 78,
    source: "Indicação",
    lastContact: "2024-01-13",
    value: 45000
  }
];

const statusColors: Record<string, string> = {
  "Novo": "bg-blue-100 text-blue-800",
  "Qualificado": "bg-green-100 text-green-800",
  "Proposta": "bg-yellow-100 text-yellow-800",
  "Negociação": "bg-orange-100 text-orange-800"
};

export const LeadsManager = () => {
  const [leads, setLeads] = useState(mockLeads);
  const [searchTerm, setSearchTerm] = useState("");

  const handleCreateLead = (newLead: any) => {
    setLeads(prev => [...prev, newLead]);
    console.log("Lead adicionado à lista:", newLead);
  };

  const handleEditLead = (lead: any) => {
    console.log(`Editando lead: ${lead.name}`);
    // Aqui você implementaria a lógica de edição
  };

  const handleDeleteLead = (leadId: number) => {
    setLeads(prev => prev.filter(lead => lead.id !== leadId));
    console.log(`Lead ${leadId} removido`);
  };

  const handleCallLead = (leadId: number) => {
    const lead = leads.find(l => l.id === leadId);
    console.log(`Iniciando ligação para ${lead?.name} - ${lead?.phone}`);
    // Aqui você integraria com sistema de telefonia
  };

  const handleEmailLead = (leadId: number) => {
    const lead = leads.find(l => l.id === leadId);
    console.log(`Abrindo composição de email para ${lead?.name} - ${lead?.email}`);
    // Aqui você abriria o composer de email
    window.open(`mailto:${lead?.email}?subject=Contato via Salesin Pro`);
  };

  const handleScheduleMeeting = (leadId: number) => {
    const lead = leads.find(l => l.id === leadId);
    console.log(`Agendando reunião com ${lead?.name}`);
    // Aqui você integraria com sistema de agenda
  };

  const handleCreateProposal = (leadId: number) => {
    const lead = leads.find(l => l.id === leadId);
    console.log(`Criando proposta para ${lead?.name}`);
    // Aqui você redirecionaria para criação de proposta
  };

  const handleConvertToCustomer = (leadId: number) => {
    const lead = leads.find(l => l.id === leadId);
    console.log(`Convertendo lead ${lead?.name} em cliente`);
    // Aqui você implementaria a conversão
  };

  const handleMarkAsFavorite = (leadId: number) => {
    const lead = leads.find(l => l.id === leadId);
    console.log(`Marcando ${lead?.name} como favorito`);
    // Aqui você implementaria a funcionalidade de favoritos
  };

  const handleQuickCall = (leadId: number) => {
    handleCallLead(leadId);
  };

  const handleQuickEmail = (leadId: number) => {
    handleEmailLead(leadId);
  };

  const handleQuickMeeting = (leadId: number) => {
    handleScheduleMeeting(leadId);
  };

  const filteredLeads = leads.filter(lead =>
    lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Leads & Contatos</h1>
          <p className="text-gray-600">Gerencie seus leads e oportunidades</p>
        </div>
        <NewLeadDialog onCreateLead={handleCreateLead} />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total de Leads</p>
                <p className="text-2xl font-bold text-blue-600">{leads.length}</p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Qualificados</p>
                <p className="text-2xl font-bold text-green-600">
                  {leads.filter(l => l.status === "Qualificado").length}
                </p>
              </div>
              <Star className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Score Médio</p>
                <p className="text-2xl font-bold text-purple-600">
                  {Math.round(leads.reduce((sum, lead) => sum + lead.score, 0) / leads.length)}
                </p>
              </div>
              <UserPlus className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Valor Total</p>
                <p className="text-2xl font-bold text-orange-600">
                  R$ {leads.reduce((sum, lead) => sum + lead.value, 0).toLocaleString()}
                </p>
              </div>
              <Calendar className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Buscar leads..."
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

      {/* Leads List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredLeads.map((lead) => (
          <Card key={lead.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold text-gray-900">{lead.name}</h3>
                  <p className="text-sm text-gray-600">{lead.company}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={statusColors[lead.status]}>
                    {lead.status}
                  </Badge>
                  <LeadActionsMenu
                    lead={lead}
                    onEdit={handleEditLead}
                    onDelete={handleDeleteLead}
                    onCall={handleCallLead}
                    onEmail={handleEmailLead}
                    onScheduleMeeting={handleScheduleMeeting}
                    onCreateProposal={handleCreateProposal}
                    onConvertToCustomer={handleConvertToCustomer}
                    onMarkAsFavorite={handleMarkAsFavorite}
                  />
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <Mail className="w-4 h-4 mr-2" />
                  {lead.email}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Phone className="w-4 h-4 mr-2" />
                  {lead.phone}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="w-4 h-4 mr-2" />
                  {lead.source}
                </div>
              </div>

              <div className="flex justify-between items-center mb-4">
                <div>
                  <span className="text-sm text-gray-600">Score: </span>
                  <span className="font-medium text-green-600">{lead.score}</span>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Valor: </span>
                  <span className="font-medium">R$ {lead.value.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex space-x-2">
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => handleQuickCall(lead.id)}
                  className="flex-1"
                >
                  <Phone className="w-4 h-4" />
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => handleQuickEmail(lead.id)}
                  className="flex-1"
                >
                  <Mail className="w-4 h-4" />
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => handleQuickMeeting(lead.id)}
                  className="flex-1"
                >
                  <Calendar className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
