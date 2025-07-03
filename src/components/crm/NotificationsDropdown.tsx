
import { useState, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, CheckCircle, Clock, User, Calendar, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Notification {
  id: number;
  type: "lead" | "meeting" | "task" | "system" | "alert";
  title: string;
  message: string;
  time: string;
  read: boolean;
  priority?: "low" | "medium" | "high";
}

export const NotificationsDropdown = () => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      type: "lead",
      title: "Novo lead cadastrado",
      message: "Maria Santos foi adicionada como novo lead",
      time: "5 min atrás",
      read: false,
      priority: "medium"
    },
    {
      id: 2,
      type: "meeting",
      title: "Reunião agendada",
      message: "Reunião com João Silva às 15h",
      time: "1 hora atrás",
      read: false,
      priority: "high"
    },
    {
      id: 3,
      type: "task",
      title: "Tarefa vencendo",
      message: "Follow-up com Ana Costa vence hoje",
      time: "3 horas atrás",
      read: true,
      priority: "medium"
    }
  ]);

  const [permissionGranted, setPermissionGranted] = useState(false);
  const { toast } = useToast();
  const unreadCount = notifications.filter(n => !n.read).length;

  // Solicitar permissão para notificações do navegador
  useEffect(() => {
    if ("Notification" in window) {
      if (Notification.permission === "granted") {
        setPermissionGranted(true);
      } else if (Notification.permission === "default") {
        Notification.requestPermission().then((permission) => {
          setPermissionGranted(permission === "granted");
        });
      }
    }
  }, []);

  // Simular novas notificações periodicamente
  useEffect(() => {
    const interval = setInterval(() => {
      // Simular chegada de nova notificação (30% de chance a cada 30 segundos)
      if (Math.random() < 0.3) {
        addNewNotification();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const addNewNotification = () => {
    const newNotifications = [
      {
        type: "lead" as const,
        title: "Novo lead capturado",
        message: "Lead capturado via formulário do site",
        priority: "medium" as const
      },
      {
        type: "task" as const,
        title: "Tarefa atribuída",
        message: "Nova tarefa de follow-up foi atribuída a você",
        priority: "high" as const
      },
      {
        type: "meeting" as const,
        title: "Lembrete de reunião",
        message: "Reunião em 30 minutos",
        priority: "high" as const
      },
      {
        type: "system" as const,
        title: "Relatório disponível",
        message: "Seu relatório mensal está pronto",
        priority: "low" as const
      }
    ];

    const randomNotification = newNotifications[Math.floor(Math.random() * newNotifications.length)];
    const newNotification: Notification = {
      id: Date.now(),
      ...randomNotification,
      time: "agora",
      read: false
    };

    setNotifications(prev => [newNotification, ...prev]);

    // Mostrar notificação do navegador se permitido
    if (permissionGranted && "Notification" in window) {
      new Notification(newNotification.title, {
        body: newNotification.message,
        icon: "/favicon.ico",
        tag: `notification-${newNotification.id}`
      });
    }

    // Mostrar toast interno
    toast({
      title: newNotification.title,
      description: newNotification.message,
    });

    console.log("Nova notificação adicionada:", newNotification);
  };

  const markAsRead = (id: number) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
    console.log(`Notificação ${id} marcada como lida`);
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    console.log("Todas as notificações marcadas como lidas");
    toast({
      title: "Notificações",
      description: "Todas as notificações foram marcadas como lidas",
    });
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    console.log("Todas as notificações foram removidas");
    toast({
      title: "Notificações",
      description: "Todas as notificações foram removidas",
    });
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'lead': return <User className="w-4 h-4 text-blue-500" />;
      case 'meeting': return <Calendar className="w-4 h-4 text-green-500" />;
      case 'task': return <Clock className="w-4 h-4 text-orange-500" />;
      case 'system': return <Bell className="w-4 h-4 text-gray-500" />;
      case 'alert': return <AlertCircle className="w-4 h-4 text-red-500" />;
      default: return <Bell className="w-4 h-4" />;
    }
  };

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'high': return 'border-l-4 border-red-500';
      case 'medium': return 'border-l-4 border-yellow-500';
      case 'low': return 'border-l-4 border-gray-300';
      default: return '';
    }
  };

  // Função para testar notificações
  const testNotification = () => {
    addNewNotification();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center bg-red-500 text-xs animate-pulse">
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 max-h-96 overflow-y-auto">
        <DropdownMenuLabel className="flex justify-between items-center">
          <span>Notificações</span>
          <div className="flex gap-2">
            {unreadCount > 0 && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={markAllAsRead}
                className="text-xs h-6"
              >
                Marcar todas como lidas
              </Button>
            )}
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={testNotification}
              className="text-xs h-6"
              title="Testar notificação"
            >
              Teste
            </Button>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {notifications.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Nenhuma notificação</p>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={testNotification}
              className="mt-2 text-xs"
            >
              Gerar notificação de teste
            </Button>
          </div>
        ) : (
          <div className="max-h-80 overflow-y-auto">
            {notifications.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className={`flex items-start space-x-3 p-3 cursor-pointer hover:bg-gray-50 ${getPriorityColor(notification.priority)}`}
                onClick={() => markAsRead(notification.id)}
              >
                <div className="flex-shrink-0 mt-1">
                  {getIcon(notification.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className={`text-sm font-medium ${!notification.read ? 'text-gray-900' : 'text-gray-600'}`}>
                      {notification.title}
                    </p>
                    {!notification.read && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 animate-pulse"></div>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 truncate">{notification.message}</p>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-xs text-gray-400">{notification.time}</p>
                    {notification.priority === 'high' && (
                      <Badge variant="destructive" className="text-xs py-0">
                        Urgente
                      </Badge>
                    )}
                  </div>
                </div>
              </DropdownMenuItem>
            ))}
          </div>
        )}
        
        {notifications.length > 0 && (
          <>
            <DropdownMenuSeparator />
            <div className="p-2">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={clearAllNotifications}
                className="w-full text-sm text-gray-500 hover:text-gray-700"
              >
                Limpar todas as notificações
              </Button>
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
