
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { 
  Zap, 
  Search,
  Settings,
  Link,
  CheckCircle,
  AlertCircle,
  Globe,
  Mail,
  MessageSquare,
  Calendar
} from "lucide-react";

const mockIntegrations = [
  {
    id: 1,
    name: "Zapier",
    description: "Conecte com mais de 5000 aplicativos",
    category: "Automação",
    status: "Conectado",
    icon: <Zap className="w-6 h-6" />,
    connected: true,
    lastSync: "2024-01-15 14:30"
  },
  {
    id: 2,
    name: "Google Calendar",
    description: "Sincronize compromissos e reuniões",
    category: "Calendário",
    status: "Desconectado",
    icon: <Calendar className="w-6 h-6" />,
    connected: false,
    lastSync: null
  },
  {
    id: 3,
    name: "WhatsApp Business",
    description: "Integração com WhatsApp para atendimento",
    category: "Comunicação",
    status: "Conectado",
    icon: <MessageSquare className="w-6 h-6" />,
    connected: true,
    lastSync: "2024-01-15 15:20"
  },
  {
    id: 4,
    name: "Gmail",
    description: "Sincronize e-mails automaticamente",
    category: "E-mail",
    status: "Conectado",
    icon: <Mail className="w-6 h-6" />,
    connected: true,
    lastSync: "2024-01-15 15:45"
  }
];

export const Integrations = () => {
  const [integrations, setIntegrations] = useState(mockIntegrations);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredIntegrations = integrations.filter(integration =>
    integration.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    integration.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const connectedCount = integrations.filter(i => i.connected).length;
  const availableCount = integrations.length - connectedCount;

  const toggleIntegration = (id: number) => {
    setIntegrations(integrations.map(integration =>
      integration.id === id
        ? { 
            ...integration, 
            connected: !integration.connected,
            status: !integration.connected ? "Conectado" : "Desconectado",
            lastSync: !integration.connected ? new Date().toLocaleString('pt-BR') : null
          }
        : integration
    ));
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Conectadas</p>
                <p className="text-2xl font-bold text-green-600">{connectedCount}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Disponíveis</p>
                <p className="text-2xl font-bold text-blue-600">{availableCount}</p>
              </div>
              <Link className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">{integrations.length}</p>
              </div>
              <Globe className="w-8 h-8 text-gray-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="flex justify-between items-center">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Buscar integrações..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-64"
          />
        </div>
        <Button variant="outline">
          <Settings className="w-4 h-4 mr-2" />
          Configurações
        </Button>
      </div>

      {/* Integrations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredIntegrations.map((integration) => (
          <Card key={integration.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    {integration.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{integration.name}</h3>
                    <p className="text-sm text-gray-600">{integration.description}</p>
                  </div>
                </div>
                <Switch
                  checked={integration.connected}
                  onCheckedChange={() => toggleIntegration(integration.id)}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Categoria:</span>
                  <Badge variant="outline" className="text-xs">
                    {integration.category}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Status:</span>
                  <div className="flex items-center space-x-1">
                    {integration.connected ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-red-500" />
                    )}
                    <Badge className={integration.connected ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                      {integration.status}
                    </Badge>
                  </div>
                </div>

                {integration.connected && integration.lastSync && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Última sinc:</span>
                    <span className="text-xs text-gray-500">{integration.lastSync}</span>
                  </div>
                )}
              </div>

              {integration.connected && (
                <div className="mt-4 pt-4 border-t">
                  <Button size="sm" variant="outline" className="w-full">
                    <Settings className="w-4 h-4 mr-2" />
                    Configurar
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredIntegrations.length === 0 && (
        <div className="text-center py-12">
          <Link className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Nenhuma integração encontrada
          </h3>
          <p className="text-gray-500 mb-4">
            {searchTerm ? "Tente outros termos de busca" : "Explore as integrações disponíveis"}
          </p>
        </div>
      )}
    </div>
  );
};
