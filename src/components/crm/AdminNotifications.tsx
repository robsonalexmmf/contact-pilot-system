
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useAdminNotifications } from "@/hooks/useAdminNotifications";
import { 
  Bell, 
  Plus, 
  Search,
  Mail,
  MessageSquare,
  AlertTriangle,
  CheckCircle,
  X,
  Send,
  Settings,
  Users,
  Clock,
  RefreshCw,
  Trash2,
  Download,
  Filter
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const AdminNotifications = () => {
  const { 
    notifications, 
    settings, 
    loading, 
    stats,
    sendNotification,
    markAsRead,
    deleteNotification,
    updateSettings,
    refreshNotifications
  } = useAdminNotifications();
  
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showNewNotificationForm, setShowNewNotificationForm] = useState(false);
  const [newNotification, setNewNotification] = useState({
    title: "",
    message: "",
    type: "info" as const,
    recipient: "all_admins",
    priority: "medium" as const
  });

  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "all" || notification.type === typeFilter;
    const matchesStatus = statusFilter === "all" || notification.status === statusFilter;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'info': return 'bg-blue-100 text-blue-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'error': return 'bg-red-100 text-red-800';
      case 'success': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'info': return <Bell className="w-4 h-4" />;
      case 'warning': return <AlertTriangle className="w-4 h-4" />;
      case 'error': return <X className="w-4 h-4" />;
      case 'success': return <CheckCircle className="w-4 h-4" />;
      default: return <Bell className="w-4 h-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-l-4 border-red-500';
      case 'medium': return 'border-l-4 border-yellow-500';
      case 'low': return 'border-l-4 border-gray-300';
      default: return '';
    }
  };

  const handleSendNotification = async () => {
    if (!newNotification.title || !newNotification.message) {
      toast({
        title: "Erro",
        description: "Título e mensagem são obrigatórios",
        variant: "destructive"
      });
      return;
    }

    try {
      await sendNotification({
        ...newNotification,
        status: 'sent'
      });

      toast({
        title: "Notificação enviada",
        description: "A notificação foi enviada com sucesso",
      });

      setNewNotification({
        title: "",
        message: "",
        type: "info",
        recipient: "all_admins",
        priority: "medium"
      });
      setShowNewNotificationForm(false);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao enviar notificação",
        variant: "destructive"
      });
    }
  };

  const handleExportNotifications = () => {
    const csvData = [
      ['Título', 'Mensagem', 'Tipo', 'Status', 'Prioridade', 'Destinatário', 'Data', 'Leituras'],
      ...filteredNotifications.map(n => [
        n.title,
        n.message,
        n.type,
        n.status,
        n.priority,
        n.recipient,
        new Date(n.createdAt).toLocaleString('pt-BR'),
        n.readBy.toString()
      ])
    ];

    const csvContent = csvData.map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `notificacoes-admin-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();

    toast({
      title: "Exportação concluída",
      description: "Relatório de notificações baixado com sucesso",
    });
  };

  const toggleSetting = (key: keyof typeof settings) => {
    updateSettings({ [key]: !settings[key] });
    toast({
      title: "Configuração atualizada",
      description: `${key} ${!settings[key] ? 'ativada' : 'desativada'}`,
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notificações</h1>
          <p className="text-gray-600">Gerencie notificações e alertas do sistema</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={refreshNotifications}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Atualizar
          </Button>
          <Button onClick={() => setShowNewNotificationForm(true)} className="bg-gradient-to-r from-blue-600 to-purple-600">
            <Plus className="w-4 h-4 mr-2" />
            Nova Notificação
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <Bell className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Não Lidas</p>
                <p className="text-2xl font-bold text-orange-600">{stats.unread}</p>
              </div>
              <Mail className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Críticas</p>
                <p className="text-2xl font-bold text-red-600">{stats.critical}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pendentes</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* New Notification Form */}
      {showNewNotificationForm && (
        <Card>
          <CardHeader>
            <CardTitle>Nova Notificação</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Título</label>
                <Input
                  value={newNotification.title}
                  onChange={(e) => setNewNotification(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Título da notificação"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Tipo</label>
                <Select value={newNotification.type} onValueChange={(value: any) => setNewNotification(prev => ({ ...prev, type: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="info">Info</SelectItem>
                    <SelectItem value="warning">Aviso</SelectItem>
                    <SelectItem value="error">Erro</SelectItem>
                    <SelectItem value="success">Sucesso</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium">Mensagem</label>
              <Input
                value={newNotification.message}
                onChange={(e) => setNewNotification(prev => ({ ...prev, message: e.target.value }))}
                placeholder="Mensagem da notificação"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Destinatário</label>
                <Select value={newNotification.recipient} onValueChange={(value) => setNewNotification(prev => ({ ...prev, recipient: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all_admins">Todos os Admins</SelectItem>
                    <SelectItem value="tech_team">Equipe Técnica</SelectItem>
                    <SelectItem value="sales_team">Equipe de Vendas</SelectItem>
                    <SelectItem value="security_team">Equipe de Segurança</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Prioridade</label>
                <Select value={newNotification.priority} onValueChange={(value: any) => setNewNotification(prev => ({ ...prev, priority: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Baixa</SelectItem>
                    <SelectItem value="medium">Média</SelectItem>
                    <SelectItem value="high">Alta</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleSendNotification} className="bg-gradient-to-r from-blue-600 to-purple-600">
                <Send className="w-4 h-4 mr-2" />
                Enviar Notificação
              </Button>
              <Button variant="outline" onClick={() => setShowNewNotificationForm(false)}>
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Notifications List */}
        <div className="lg:col-span-2 space-y-4">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Buscar notificações..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="info">Info</SelectItem>
                <SelectItem value="warning">Aviso</SelectItem>
                <SelectItem value="error">Erro</SelectItem>
                <SelectItem value="success">Sucesso</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="sent">Enviada</SelectItem>
                <SelectItem value="pending">Pendente</SelectItem>
                <SelectItem value="failed">Falhou</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={handleExportNotifications}>
              <Download className="w-4 h-4 mr-2" />
              Exportar
            </Button>
          </div>

          {/* Notifications */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Notificações Recentes</CardTitle>
              <Badge variant="outline">{filteredNotifications.length} total</Badge>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {filteredNotifications.map((notification) => (
                  <div key={notification.id} className={`flex items-start space-x-3 p-3 bg-gray-50 rounded-lg ${getPriorityColor(notification.priority)}`}>
                    <div className={`p-2 rounded-lg ${getTypeColor(notification.type)}`}>
                      {getTypeIcon(notification.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-gray-900">{notification.title}</h4>
                        <div className="flex items-center space-x-2">
                          <Badge className={getTypeColor(notification.type)}>
                            {notification.type}
                          </Badge>
                          <Badge variant={notification.status === 'sent' ? 'default' : notification.status === 'pending' ? 'secondary' : 'destructive'}>
                            {notification.status === 'sent' ? 'Enviada' : notification.status === 'pending' ? 'Pendente' : 'Falhou'}
                          </Badge>
                          {notification.priority === 'high' && (
                            <Badge variant="destructive" className="text-xs">
                              Urgente
                            </Badge>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span className="flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {new Date(notification.createdAt).toLocaleString('pt-BR')}
                          </span>
                          <span className="flex items-center">
                            <Users className="w-3 h-3 mr-1" />
                            {notification.readBy} leram
                          </span>
                        </div>
                        <div className="flex gap-1">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => markAsRead(notification.id)}
                          >
                            <CheckCircle className="w-4 h-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => deleteNotification(notification.id)}
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="w-5 h-5 mr-2" />
              Configurações
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Novos Usuários</span>
                <Switch
                  checked={settings.new_users}
                  onCheckedChange={() => toggleSetting('new_users')}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Alertas do Sistema</span>
                <Switch
                  checked={settings.system_alerts}
                  onCheckedChange={() => toggleSetting('system_alerts')}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Status de Backup</span>
                <Switch
                  checked={settings.backup_status}
                  onCheckedChange={() => toggleSetting('backup_status')}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Alto Uso de Recursos</span>
                <Switch
                  checked={settings.high_usage}
                  onCheckedChange={() => toggleSetting('high_usage')}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Eventos de Segurança</span>
                <Switch
                  checked={settings.security_events}
                  onCheckedChange={() => toggleSetting('security_events')}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Tentativas de Login Falhadas</span>
                <Switch
                  checked={settings.failed_logins}
                  onCheckedChange={() => toggleSetting('failed_logins')}
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Alertas de Leads</span>
                <Switch
                  checked={settings.lead_alerts}
                  onCheckedChange={() => toggleSetting('lead_alerts')}
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Alertas de Receita</span>
                <Switch
                  checked={settings.revenue_alerts}
                  onCheckedChange={() => toggleSetting('revenue_alerts')}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
