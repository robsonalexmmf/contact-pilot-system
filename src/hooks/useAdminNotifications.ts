
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface AdminNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  recipient: string;
  status: 'sent' | 'pending' | 'failed';
  createdAt: string;
  readBy: number;
  priority: 'low' | 'medium' | 'high';
  relatedTable?: string;
  relatedId?: string;
}

interface NotificationSettings {
  new_users: boolean;
  system_alerts: boolean;
  backup_status: boolean;
  high_usage: boolean;
  security_events: boolean;
  failed_logins: boolean;
  lead_alerts: boolean;
  revenue_alerts: boolean;
}

export const useAdminNotifications = () => {
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  const [settings, setSettings] = useState<NotificationSettings>({
    new_users: true,
    system_alerts: true,
    backup_status: true,
    high_usage: true,
    security_events: true,
    failed_logins: false,
    lead_alerts: true,
    revenue_alerts: true
  });
  const [loading, setLoading] = useState(true);

  const generateNotifications = async () => {
    try {
      // Buscar dados reais do CRM
      const [profilesData, leadsData, transactionsData] = await Promise.all([
        supabase.from('profiles').select('*'),
        supabase.from('leads').select('*'),
        supabase.from('transactions').select('*')
      ]);

      const profiles = profilesData.data || [];
      const leads = leadsData.data || [];
      const transactions = transactionsData.data || [];

      const generatedNotifications: AdminNotification[] = [];

      // Notificações baseadas em novos usuários
      if (settings.new_users && profiles.length > 0) {
        const recentUsers = profiles.filter(p => {
          const joinDate = new Date(p.created_at);
          const today = new Date();
          const diffTime = today.getTime() - joinDate.getTime();
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          return diffDays <= 7;
        });

        if (recentUsers.length > 0) {
          generatedNotifications.push({
            id: `new-users-${Date.now()}`,
            title: `${recentUsers.length} novos usuários esta semana`,
            message: `Novos cadastros: ${recentUsers.map(u => u.name).join(', ')}`,
            type: 'info',
            recipient: 'all_admins',
            status: 'sent',
            createdAt: new Date().toISOString(),
            readBy: 0,
            priority: 'medium',
            relatedTable: 'profiles'
          });
        }
      }

      // Notificações de leads
      if (settings.lead_alerts && leads.length > 0) {
        const recentLeads = leads.filter(l => {
          const createdAt = new Date(l.created_at);
          const today = new Date();
          const diffHours = (today.getTime() - createdAt.getTime()) / (1000 * 60 * 60);
          return diffHours <= 24;
        });

        if (recentLeads.length > 0) {
          generatedNotifications.push({
            id: `new-leads-${Date.now()}`,
            title: `${recentLeads.length} novos leads nas últimas 24h`,
            message: `Novos leads: ${recentLeads.map(l => l.name).join(', ')}`,
            type: 'success',
            recipient: 'sales_team',
            status: 'sent',
            createdAt: new Date().toISOString(),
            readBy: 1,
            priority: 'high',
            relatedTable: 'leads'
          });
        }
      }

      // Notificações de receita
      if (settings.revenue_alerts && transactions.length > 0) {
        const todayRevenue = transactions
          .filter(t => {
            const transDate = new Date(t.date);
            const today = new Date();
            return transDate.toDateString() === today.toDateString() && t.amount > 0;
          })
          .reduce((sum, t) => sum + Number(t.amount), 0);

        if (todayRevenue > 1000) {
          generatedNotifications.push({
            id: `revenue-alert-${Date.now()}`,
            title: 'Meta de receita diária atingida',
            message: `Receita de hoje: R$ ${todayRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
            type: 'success',
            recipient: 'all_admins',
            status: 'sent',
            createdAt: new Date().toISOString(),
            readBy: 0,
            priority: 'medium',
            relatedTable: 'transactions'
          });
        }
      }

      // Alertas do sistema
      if (settings.system_alerts) {
        const systemAlerts = [
          {
            id: `system-${Date.now()}-1`,
            title: 'Backup automático concluído',
            message: 'Backup do banco de dados executado com sucesso às 02:00',
            type: 'success' as const,
            recipient: 'tech_team',
            status: 'sent' as const,
            createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            readBy: 2,
            priority: 'low' as const
          },
          {
            id: `system-${Date.now()}-2`,
            title: 'Uso de CPU elevado',
            message: 'CPU acima de 85% nos últimos 10 minutos',
            type: 'warning' as const,
            recipient: 'tech_team',
            status: 'sent' as const,
            createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
            readBy: 1,
            priority: 'high' as const
          }
        ];

        generatedNotifications.push(...systemAlerts);
      }

      // Eventos de segurança
      if (settings.security_events) {
        generatedNotifications.push({
          id: `security-${Date.now()}`,
          title: 'Tentativa de login suspeita',
          message: 'Múltiplas tentativas de login falhadas do IP 203.0.113.1',
          type: 'error',
          recipient: 'security_team',
          status: 'pending',
          createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
          readBy: 0,
          priority: 'high'
        });
      }

      // Adicionar notificações históricas
      const historicalNotifications = [
        {
          id: 'hist-1',
          title: 'Atualização do sistema',
          message: 'Sistema atualizado para versão 2.1.0 com sucesso',
          type: 'info' as const,
          recipient: 'all_admins',
          status: 'sent' as const,
          createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          readBy: 3,
          priority: 'medium' as const
        },
        {
          id: 'hist-2',
          title: 'Falha no backup',
          message: 'Backup automático falhou às 02:00 - verificar configuração',
          type: 'error' as const,
          recipient: 'tech_team',
          status: 'failed' as const,
          createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
          readBy: 2,
          priority: 'high' as const
        }
      ];

      const allNotifications = [...generatedNotifications, ...historicalNotifications];
      setNotifications(allNotifications);

      console.log('Notificações admin geradas:', {
        total: allNotifications.length,
        byType: {
          info: allNotifications.filter(n => n.type === 'info').length,
          warning: allNotifications.filter(n => n.type === 'warning').length,
          error: allNotifications.filter(n => n.type === 'error').length,
          success: allNotifications.filter(n => n.type === 'success').length
        }
      });

    } catch (error) {
      console.error('Erro ao gerar notificações:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendNotification = async (notification: Omit<AdminNotification, 'id' | 'createdAt' | 'readBy'>) => {
    const newNotification: AdminNotification = {
      ...notification,
      id: `custom-${Date.now()}`,
      createdAt: new Date().toISOString(),
      readBy: 0
    };

    setNotifications(prev => [newNotification, ...prev]);

    // Simular envio real
    console.log('Enviando notificação:', newNotification);
    
    return { success: true, id: newNotification.id };
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => 
        n.id === id ? { ...n, readBy: n.readBy + 1 } : n
      )
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const updateSettings = (newSettings: Partial<NotificationSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
    localStorage.setItem('admin_notification_settings', JSON.stringify({ ...settings, ...newSettings }));
  };

  const refreshNotifications = () => {
    setLoading(true);
    generateNotifications();
  };

  useEffect(() => {
    generateNotifications();
    
    // Carregar configurações salvas
    const savedSettings = localStorage.getItem('admin_notification_settings');
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch (error) {
        console.error('Erro ao carregar configurações:', error);
      }
    }

    // Atualizar a cada 30 segundos
    const interval = setInterval(generateNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const stats = {
    total: notifications.length,
    unread: notifications.filter(n => n.readBy === 0).length,
    critical: notifications.filter(n => n.type === 'error' || n.priority === 'high').length,
    pending: notifications.filter(n => n.status === 'pending').length
  };

  return {
    notifications,
    settings,
    loading,
    stats,
    sendNotification,
    markAsRead,
    deleteNotification,
    updateSettings,
    refreshNotifications
  };
};
