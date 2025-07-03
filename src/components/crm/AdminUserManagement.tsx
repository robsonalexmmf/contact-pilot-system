import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Users, 
  Plus, 
  Search,
  Shield,
  Settings,
  UserCheck,
  UserX,
  Mail,
  Phone,
  Edit,
  Trash2,
  Eye,
  MessageCircle
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { openWhatsApp, whatsappTemplates } from "@/utils/whatsappUtils";
import { useToast } from "@/hooks/use-toast";
import { NewUserDialog } from "./NewUserDialog";
import { ViewUserDialog } from "./ViewUserDialog";
import { EditUserDialog } from "./EditUserDialog";

const mockAdminUsers = [
  {
    id: 1,
    name: "João Silva",
    email: "joao@empresa.com",
    whatsapp: "+55 11 99999-1234",
    plan: "Premium",
    status: "Ativo",
    lastLogin: "2024-01-15 14:30",
    totalLeads: 234,
    monthlyRevenue: 15000,
    joinDate: "2023-06-15"
  },
  {
    id: 2,
    name: "Maria Santos",
    email: "maria@startup.com",
    whatsapp: "+55 21 98888-5678",
    plan: "Pro",
    status: "Ativo",
    lastLogin: "2024-01-15 13:45",
    totalLeads: 156,
    monthlyRevenue: 8500,
    joinDate: "2023-08-22"
  },
  {
    id: 3,
    name: "Pedro Costa",
    email: "pedro@negocio.com",
    whatsapp: "+55 11 97777-9012",
    plan: "Free",
    status: "Inativo",
    lastLogin: "2024-01-10 09:15",
    totalLeads: 45,
    monthlyRevenue: 0,
    joinDate: "2023-12-01"
  },
  {
    id: 4,
    name: "Ana Oliveira",
    email: "ana@consultoria.com",
    whatsapp: "+55 11 96666-3456",
    plan: "Premium",
    status: "Ativo",
    lastLogin: "2024-01-14 16:20",
    totalLeads: 312,
    monthlyRevenue: 22000,
    joinDate: "2023-04-10"
  }
];

export const AdminUserManagement = () => {
  const [users, setUsers] = useState(mockAdminUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [planFilter, setPlanFilter] = useState("all");
  
  // Dialog states
  const [newUserDialog, setNewUserDialog] = useState(false);
  const [viewUserDialog, setViewUserDialog] = useState<{ open: boolean; user: any }>({ open: false, user: null });
  const [editUserDialog, setEditUserDialog] = useState<{ open: boolean; user: any }>({ open: false, user: null });
  
  const { toast } = useToast();

  // Handlers para os botões
  const handleNewUser = () => {
    setNewUserDialog(true);
  };

  const handleUserCreated = (newUser: any) => {
    setUsers(prev => [...prev, newUser]);
  };

  const handleViewUser = (userId: number) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      setViewUserDialog({ open: true, user });
    }
  };

  const handleEditUser = (userId: number) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      setEditUserDialog({ open: true, user });
    }
  };

  const handleUserUpdated = (updatedUser: any) => {
    setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
  };

  const handleSendEmail = (userId: number, userEmail: string) => {
    console.log('Enviando email para:', userEmail);
    
    const subject = encodeURIComponent('Contato do Sistema CRM');
    const body = encodeURIComponent('Olá! Estamos entrando em contato através do nosso sistema CRM.');
    const mailtoLink = `mailto:${userEmail}?subject=${subject}&body=${body}`;
    
    window.open(mailtoLink, '_blank');
    
    toast({
      title: "Email",
      description: `Cliente de email aberto para ${userEmail}`
    });
  };

  const handleWhatsApp = (userId: number, userWhatsApp: string, userName: string) => {
    console.log('Enviando WhatsApp para:', userWhatsApp);
    
    if (!userWhatsApp) {
      toast({
        title: "Erro",
        description: "Número do WhatsApp não informado",
        variant: "destructive"
      });
      return;
    }
    
    const message = whatsappTemplates.leadContact(userName);
    openWhatsApp(userWhatsApp, message);
    
    toast({
      title: "WhatsApp",
      description: `Mensagem enviada para ${userName}`
    });
  };

  const handleDeleteUser = (userId: number, userName: string) => {
    console.log('Deletando usuário:', userId);
    
    const confirmDelete = window.confirm(`Tem certeza que deseja excluir o usuário ${userName}?`);
    
    if (confirmDelete) {
      setUsers(prev => prev.filter(u => u.id !== userId));
      
      toast({
        title: "Usuário Excluído",
        description: `${userName} foi removido do sistema`
      });
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.whatsapp.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || user.status.toLowerCase() === statusFilter;
    const matchesPlan = planFilter === "all" || user.plan.toLowerCase() === planFilter;
    
    return matchesSearch && matchesStatus && matchesPlan;
  });

  const activeUsers = users.filter(u => u.status === "Ativo").length;
  const premiumUsers = users.filter(u => u.plan === "Premium").length;
  const totalRevenue = users.reduce((sum, u) => sum + u.monthlyRevenue, 0);

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'Premium': return 'bg-purple-100 text-purple-800';
      case 'Pro': return 'bg-blue-100 text-blue-800';
      case 'Free': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    return status === "Ativo" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gerenciar Usuários</h1>
          <p className="text-gray-600">Administre todos os usuários do sistema CRM</p>
        </div>
        <Button 
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          onClick={handleNewUser}
        >
          <Plus className="w-4 h-4 mr-2" />
          Novo Usuário
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Usuários</p>
                <p className="text-2xl font-bold text-gray-900">{users.length}</p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Usuários Ativos</p>
                <p className="text-2xl font-bold text-green-600">{activeUsers}</p>
              </div>
              <UserCheck className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Usuários Premium</p>
                <p className="text-2xl font-bold text-purple-600">{premiumUsers}</p>
              </div>
              <Shield className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Receita Total</p>
                <p className="text-2xl font-bold text-green-600">R$ {totalRevenue.toLocaleString()}</p>
              </div>
              <Users className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Buscar usuários por nome, email ou WhatsApp..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos Status</SelectItem>
            <SelectItem value="ativo">Ativo</SelectItem>
            <SelectItem value="inativo">Inativo</SelectItem>
          </SelectContent>
        </Select>
        <Select value={planFilter} onValueChange={setPlanFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Plano" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos Planos</SelectItem>
            <SelectItem value="free">Free</SelectItem>
            <SelectItem value="pro">Pro</SelectItem>
            <SelectItem value="premium">Premium</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Users List */}
      <div className="space-y-4">
        {filteredUsers.map((user) => (
          <Card key={user.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-lg">{user.name}</h3>
                      <p className="text-gray-600">{user.email}</p>
                      <div className="flex items-center mt-1">
                        <Phone className="w-4 h-4 text-gray-500 mr-1" />
                        <p className="text-sm text-gray-600">{user.whatsapp}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Plano</p>
                      <Badge className={getPlanColor(user.plan)}>
                        {user.plan}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Status</p>
                      <Badge className={getStatusColor(user.status)}>
                        {user.status}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Leads</p>
                      <p className="text-sm font-medium">{user.totalLeads}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Receita Mensal</p>
                      <p className="text-sm font-medium text-green-600">R$ {user.monthlyRevenue.toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Último Login</p>
                      <p className="text-sm font-medium">{user.lastLogin}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Data de Cadastro</p>
                      <p className="text-sm font-medium">{user.joinDate}</p>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleViewUser(user.id)}
                    className="hover:bg-blue-50 hover:border-blue-300"
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleEditUser(user.id)}
                    className="hover:bg-green-50 hover:border-green-300"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleSendEmail(user.id, user.email)}
                    className="hover:bg-yellow-50 hover:border-yellow-300"
                  >
                    <Mail className="w-4 h-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleWhatsApp(user.id, user.whatsapp, user.name)}
                    className="hover:bg-green-50 hover:border-green-300"
                  >
                    <MessageCircle className="w-4 h-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => handleDeleteUser(user.id, user.name)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 hover:border-red-300"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredUsers.length === 0 && (
        <div className="text-center py-12">
          <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Nenhum usuário encontrado
          </h3>
          <p className="text-gray-500">
            Ajuste os filtros para encontrar usuários específicos
          </p>
        </div>
      )}

      {/* Dialogs */}
      <NewUserDialog
        open={newUserDialog}
        onOpenChange={setNewUserDialog}
        onUserCreated={handleUserCreated}
      />
      
      <ViewUserDialog
        open={viewUserDialog.open}
        onOpenChange={(open) => setViewUserDialog({ open, user: null })}
        user={viewUserDialog.user}
      />
      
      <EditUserDialog
        open={editUserDialog.open}
        onOpenChange={(open) => setEditUserDialog({ open, user: null })}
        user={editUserDialog.user}
        onUserUpdated={handleUserUpdated}
      />
    </div>
  );
};
