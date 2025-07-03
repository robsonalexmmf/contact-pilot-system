
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Ticket, 
  Clock, 
  User, 
  Plus, 
  Search,
  Filter,
  AlertCircle,
  CheckCircle2,
  MessageSquare,
  Calendar,
  Users
} from "lucide-react";

const mockTickets = [
  {
    id: 1,
    title: "Problema com integração API",
    description: "Cliente não consegue conectar sistema externo",
    status: "Aberto",
    priority: "Alta",
    customer: "Empresa XYZ",
    assignee: "João Silva",
    created: "2024-01-15",
    sla: "2h restantes"
  },
  {
    id: 2,
    title: "Dúvida sobre relatórios",
    description: "Como exportar dados personalizados",
    status: "Em Andamento",
    priority: "Média",
    customer: "StartupTech",
    assignee: "Maria Santos",
    created: "2024-01-14",
    sla: "4h restantes"
  }
];

const statusColors: Record<string, string> = {
  "Aberto": "bg-red-100 text-red-800",
  "Em Andamento": "bg-yellow-100 text-yellow-800",
  "Aguardando": "bg-blue-100 text-blue-800",
  "Resolvido": "bg-green-100 text-green-800"
};

const priorityColors: Record<string, string> = {
  "Alta": "bg-red-100 text-red-800",
  "Média": "bg-yellow-100 text-yellow-800",
  "Baixa": "bg-green-100 text-green-800"
};

export const HelpDesk = () => {
  const [tickets] = useState(mockTickets);
  const [filter, setFilter] = useState("all");

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">{tickets.length}</p>
              </div>
              <Ticket className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Abertos</p>
                <p className="text-2xl font-bold text-red-600">1</p>
              </div>
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Em Andamento</p>
                <p className="text-2xl font-bold text-yellow-600">1</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Resolvidos</p>
                <p className="text-2xl font-bold text-green-600">0</p>
              </div>
              <CheckCircle2 className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <div className="flex justify-between items-center">
        <div className="flex space-x-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input placeholder="Buscar tickets..." className="pl-10 w-64" />
          </div>
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filtros
          </Button>
        </div>
        <Button className="bg-gradient-to-r from-blue-600 to-purple-600">
          <Plus className="w-4 h-4 mr-2" />
          Novo Ticket
        </Button>
      </div>

      {/* Tickets List */}
      <div className="space-y-4">
        {tickets.map((ticket) => (
          <Card key={ticket.id} className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">#{ticket.id} - {ticket.title}</h3>
                    <div className="flex space-x-2">
                      <Badge className={statusColors[ticket.status]}>
                        {ticket.status}
                      </Badge>
                      <Badge className={priorityColors[ticket.priority]}>
                        {ticket.priority}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">{ticket.description}</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <User className="w-4 h-4 mr-1" />
                      {ticket.customer}
                    </div>
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      {ticket.assignee}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {ticket.created}
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      SLA: {ticket.sla}
                    </div>
                  </div>
                </div>
                <Button size="sm" variant="outline">
                  <MessageSquare className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
