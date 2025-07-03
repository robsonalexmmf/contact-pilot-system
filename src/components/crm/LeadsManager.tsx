
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Filter, 
  Plus, 
  Phone, 
  Mail, 
  Calendar,
  MoreHorizontal,
  Star,
  Building,
  MapPin
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const mockLeads = [
  {
    id: 1,
    name: "Maria Santos",
    email: "maria@empresa.com",
    phone: "(11) 99999-9999",
    company: "Empresa XYZ Ltda",
    position: "Diretora Comercial",
    status: "Qualificado",
    source: "Website",
    score: 85,
    value: 25000,
    lastActivity: "2024-01-15",
    location: "São Paulo, SP",
    notes: "Interessada em nossa solução premium"
  },
  {
    id: 2,
    name: "João Silva",
    email: "joao@startup.com",
    phone: "(21) 88888-8888",
    company: "StartupTech",
    position: "CEO",
    status: "Novo",
    source: "LinkedIn",
    score: 72,
    value: 15000,
    lastActivity: "2024-01-14",
    location: "Rio de Janeiro, RJ",
    notes: "Startup em crescimento, orçamento limitado"
  },
  {
    id: 3,
    name: "Ana Costa",
    email: "ana@corporacao.com",
    phone: "(31) 77777-7777",
    company: "Corporação ABC",
    position: "Gerente de TI",
    status: "Em Negociação",
    source: "Indicação",
    score: 92,
    value: 45000,
    lastActivity: "2024-01-13",
    location: "Belo Horizonte, MG",
    notes: "Decisão para próxima semana"
  }
];

const statusColors: Record<string, string> = {
  "Novo": "bg-blue-100 text-blue-800",
  "Qualificado": "bg-green-100 text-green-800",
  "Em Negociação": "bg-yellow-100 text-yellow-800",
  "Perdido": "bg-red-100 text-red-800",
  "Ganho": "bg-purple-100 text-purple-800"
};

export const LeadsManager = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [isNewLeadOpen, setIsNewLeadOpen] = useState(false);

  const filteredLeads = mockLeads.filter(lead => {
    const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === "all" || lead.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex flex-1 gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Buscar leads..."
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
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="Novo">Novo</SelectItem>
              <SelectItem value="Qualificado">Qualificado</SelectItem>
              <SelectItem value="Em Negociação">Em Negociação</SelectItem>
              <SelectItem value="Perdido">Perdido</SelectItem>
              <SelectItem value="Ganho">Ganho</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Dialog open={isNewLeadOpen} onOpenChange={setIsNewLeadOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              <Plus className="w-4 h-4 mr-2" />
              Novo Lead
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Adicionar Novo Lead</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome Completo *</Label>
                <Input id="name" placeholder="Digite o nome" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">E-mail *</Label>
                <Input id="email" type="email" placeholder="email@exemplo.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Telefone</Label>
                <Input id="phone" placeholder="(11) 99999-9999" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company">Empresa</Label>
                <Input id="company" placeholder="Nome da empresa" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="position">Cargo</Label>
                <Input id="position" placeholder="Cargo na empresa" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="source">Origem</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a origem" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="website">Website</SelectItem>
                    <SelectItem value="linkedin">LinkedIn</SelectItem>
                    <SelectItem value="referral">Indicação</SelectItem>
                    <SelectItem value="event">Evento</SelectItem>
                    <SelectItem value="cold-call">Cold Call</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2 space-y-2">
                <Label htmlFor="notes">Observações</Label>
                <Textarea id="notes" placeholder="Informações adicionais sobre o lead" />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsNewLeadOpen(false)}>
                Cancelar
              </Button>
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600">
                Adicionar Lead
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Leads Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredLeads.map((lead) => (
          <Card key={lead.id} className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-2">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                    {lead.name.charAt(0)}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{lead.name}</CardTitle>
                    <p className="text-sm text-gray-500">{lead.position}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-sm font-medium">{lead.score}</span>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <Badge className={statusColors[lead.status]}>
                  {lead.status}
                </Badge>
                <span className="text-sm font-semibold text-green-600">
                  R$ {lead.value.toLocaleString()}
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-600">
                  <Building className="w-4 h-4 mr-2" />
                  {lead.company}
                </div>
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
                  {lead.location}
                </div>
              </div>

              <div className="pt-2 border-t">
                <p className="text-xs text-gray-500 mb-2">
                  Última atividade: {new Date(lead.lastActivity).toLocaleDateString('pt-BR')}
                </p>
                <p className="text-sm text-gray-700 line-clamp-2">{lead.notes}</p>
              </div>

              <div className="flex justify-between pt-2">
                <div className="flex space-x-1">
                  <Button size="sm" variant="outline">
                    <Phone className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <Mail className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <Calendar className="w-4 h-4" />
                  </Button>
                </div>
                <Button size="sm" variant="ghost">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredLeads.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum lead encontrado</h3>
          <p className="text-gray-500 mb-4">
            {searchTerm || selectedStatus !== "all" 
              ? "Tente ajustar os filtros de busca"
              : "Comece adicionando seu primeiro lead"
            }
          </p>
          <Button onClick={() => setIsNewLeadOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Adicionar Lead
          </Button>
        </div>
      )}
    </div>
  );
};
