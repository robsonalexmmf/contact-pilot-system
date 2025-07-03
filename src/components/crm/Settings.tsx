
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { 
  Settings as SettingsIcon, 
  Users, 
  Bell, 
  Shield,
  Zap,
  CreditCard,
  Database
} from "lucide-react";

const teamMembers = [
  {
    id: 1,
    name: "João Silva",
    email: "joao@empresa.com",
    role: "Administrador",
    status: "Ativo",
    lastLogin: "2024-01-15"
  },
  {
    id: 2,
    name: "Maria Santos",
    email: "maria@empresa.com",
    role: "Gerente de Vendas",
    status: "Ativo",
    lastLogin: "2024-01-15"
  },
  {
    id: 3,
    name: "Ana Costa",
    email: "ana@empresa.com",
    role: "Vendedor",
    status: "Ativo",
    lastLogin: "2024-01-14"
  }
];

export const Settings = () => {
  return (
    <div className="space-y-6">
      {/* Settings Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Configurações</h1>
        <p className="text-gray-600">Gerencie as configurações do seu CRM</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Company Settings */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <SettingsIcon className="w-5 h-5 mr-2" />
              Configurações da Empresa
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="company-name">Nome da Empresa</Label>
                <Input id="company-name" defaultValue="Minha Empresa Ltda" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company-cnpj">CNPJ</Label>
                <Input id="company-cnpj" defaultValue="12.345.678/0001-99" />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="company-address">Endereço</Label>
              <Input id="company-address" defaultValue="Rua das Empresas, 123 - São Paulo, SP" />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="company-phone">Telefone</Label>
                <Input id="company-phone" defaultValue="(11) 99999-9999" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company-email">E-mail</Label>
                <Input id="company-email" defaultValue="contato@empresa.com" />
              </div>
            </div>
            
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600">
              Salvar Alterações
            </Button>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Ações Rápidas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start">
              <Database className="w-4 h-4 mr-2" />
              Backup dos Dados
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Zap className="w-4 h-4 mr-2" />
              Configurar Integrações
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Shield className="w-4 h-4 mr-2" />
              Logs de Segurança
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <CreditCard className="w-4 h-4 mr-2" />
              Gerenciar Assinatura
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Team Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Users className="w-5 h-5 mr-2" />
              Gestão de Equipe
            </div>
            <Button size="sm" className="bg-gradient-to-r from-blue-600 to-purple-600">
              Convidar Usuário
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {teamMembers.map((member) => (
              <div key={member.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                    {member.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{member.name}</h4>
                    <p className="text-sm text-gray-600">{member.email}</p>
                    <p className="text-xs text-gray-500">
                      Último acesso: {new Date(member.lastLogin).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline">{member.role}</Badge>
                  <Badge className="bg-green-100 text-green-800">{member.status}</Badge>
                  <Button size="sm" variant="outline">
                    Editar
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="w-5 h-5 mr-2" />
              Notificações
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Novos Leads</h4>
                <p className="text-sm text-gray-500">Receber notificação por e-mail</p>
              </div>
              <Switch defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Tarefas Vencidas</h4>
                <p className="text-sm text-gray-500">Alertas de tarefas em atraso</p>
              </div>
              <Switch defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Relatórios Semanais</h4>
                <p className="text-sm text-gray-500">Resumo semanal por e-mail</p>
              </div>
              <Switch />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Negócios Fechados</h4>
                <p className="text-sm text-gray-500">Quando um negócio é fechado</p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="w-5 h-5 mr-2" />
              Segurança
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Autenticação 2FA</h4>
                <p className="text-sm text-gray-500">Camada extra de segurança</p>
              </div>
              <Switch />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Login por IP</h4>
                <p className="text-sm text-gray-500">Restringir acesso por IP</p>
              </div>
              <Switch />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Sessão Única</h4>
                <p className="text-sm text-gray-500">Apenas uma sessão ativa</p>
              </div>
              <Switch defaultChecked />
            </div>
            
            <Button variant="outline" className="w-full">
              Alterar Senha
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* System Status */}
      <Card>
        <CardHeader>
          <CardTitle>Status do Sistema</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">99.9%</div>
              <div className="text-sm text-gray-600">Uptime</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">2.847</div>
              <div className="text-sm text-gray-600">Total de Leads</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">15.2GB</div>
              <div className="text-sm text-gray-600">Armazenamento</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">127</div>
              <div className="text-sm text-gray-600">Usuários Ativos</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
