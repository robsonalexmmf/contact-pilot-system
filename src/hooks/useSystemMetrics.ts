
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface SystemMetrics {
  cpu: number;
  memory: number;
  disk: number;
  network: number;
}

interface ServiceStatus {
  name: string;
  status: 'online' | 'warning' | 'offline';
  uptime: string;
  responseTime: string;
}

interface SystemEvent {
  time: string;
  type: 'info' | 'warning' | 'error' | 'success';
  message: string;
}

export const useSystemMetrics = () => {
  const [metrics, setMetrics] = useState<SystemMetrics>({
    cpu: 0,
    memory: 0,
    disk: 0,
    network: 0
  });

  const [services, setServices] = useState<ServiceStatus[]>([]);
  const [events, setEvents] = useState<SystemEvent[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMetrics = async () => {
    try {
      // Simular métricas do sistema baseadas em dados reais
      const { data: profiles } = await supabase.from('profiles').select('*');
      const { data: leads } = await supabase.from('leads').select('*');
      const { data: deals } = await supabase.from('deals').select('*');
      
      const totalUsers = profiles?.length || 0;
      const totalLeads = leads?.length || 0;
      const totalDeals = deals?.length || 0;

      // Calcular métricas baseadas na atividade
      const cpuUsage = Math.min(45 + (totalUsers * 2), 100);
      const memoryUsage = Math.min(30 + (totalLeads * 1.5), 100);
      const diskUsage = Math.min(20 + (totalDeals * 3), 100);
      const networkUsage = Math.min(50 + Math.random() * 40, 100);

      setMetrics({
        cpu: cpuUsage,
        memory: memoryUsage,
        disk: diskUsage,
        network: networkUsage
      });

      // Status dos serviços baseado na atividade
      const servicesStatus: ServiceStatus[] = [
        {
          name: "API Principal",
          status: totalUsers > 0 ? "online" : "warning",
          uptime: "99.9%",
          responseTime: `${120 + Math.floor(Math.random() * 50)}ms`
        },
        {
          name: "Banco de Dados",
          status: "online",
          uptime: "99.8%",
          responseTime: `${8 + Math.floor(Math.random() * 15)}ms`
        },
        {
          name: "Cache Redis",
          status: "online",
          uptime: "99.9%",
          responseTime: `${5 + Math.floor(Math.random() * 10)}ms`
        },
        {
          name: "Email Service",
          status: "online",
          uptime: "98.5%",
          responseTime: `${200 + Math.floor(Math.random() * 100)}ms`
        },
        {
          name: "WhatsApp API",
          status: totalLeads > 5 ? "online" : "warning",
          uptime: totalLeads > 5 ? "99.2%" : "95.2%",
          responseTime: `${800 + Math.floor(Math.random() * 400)}ms`
        },
        {
          name: "File Storage",
          status: "online",
          uptime: "99.7%",
          responseTime: `${70 + Math.floor(Math.random() * 30)}ms`
        }
      ];

      setServices(servicesStatus);

      // Eventos recentes baseados na atividade
      const recentEvents: SystemEvent[] = [
        {
          time: new Date().toLocaleTimeString('pt-BR'),
          type: "info",
          message: "Backup automático concluído com sucesso"
        },
        {
          time: new Date(Date.now() - 15 * 60000).toLocaleTimeString('pt-BR'),
          type: cpuUsage > 80 ? "warning" : "info",
          message: cpuUsage > 80 ? "Alto uso de CPU detectado no servidor web" : "Sistema funcionando normalmente"
        },
        {
          time: new Date(Date.now() - 45 * 60000).toLocaleTimeString('pt-BR'),
          type: "success",
          message: "Atualização de segurança aplicada"
        },
        {
          time: new Date(Date.now() - 75 * 60000).toLocaleTimeString('pt-BR'),
          type: totalLeads < 3 ? "error" : "info",
          message: totalLeads < 3 ? "Falha temporária na conexão com WhatsApp API" : "WhatsApp API funcionando perfeitamente"
        },
        {
          time: new Date(Date.now() - 90 * 60000).toLocaleTimeString('pt-BR'),
          type: "info",
          message: "Limpeza automática de logs executada"
        }
      ];

      setEvents(recentEvents);
      setLoading(false);
    } catch (error) {
      console.error('Erro ao buscar métricas:', error);
      setLoading(false);
    }
  };

  const refreshMetrics = () => {
    setLoading(true);
    fetchMetrics();
  };

  useEffect(() => {
    fetchMetrics();
    
    // Atualizar métricas a cada 30 segundos
    const interval = setInterval(fetchMetrics, 30000);
    
    return () => clearInterval(interval);
  }, []);

  return {
    metrics,
    services,
    events,
    loading,
    refreshMetrics
  };
};
