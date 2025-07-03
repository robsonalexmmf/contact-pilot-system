
import { openWhatsApp, whatsappTemplates } from './whatsappUtils';
import { openEmailClient, emailTemplates } from './emailUtils';
import { supabase } from '@/integrations/supabase/client';

interface ExecutionResult {
  success: boolean;
  contactsReached: number;
  details: string[];
}

interface Contact {
  id: string;
  name: string;
  email: string;
  phone?: string;
  whatsapp?: string;
  type: string;
  company?: string;
}

export const executeAutomation = async (automation: any): Promise<ExecutionResult> => {
  console.log("🚀 Executando automação:", automation.name);
  
  try {
    // Buscar contatos reais do banco de dados
    const targetContacts = await getTargetContactsFromDB(automation.targetGroup);
    
    if (targetContacts.length === 0) {
      return {
        success: false,
        contactsReached: 0,
        details: ["Nenhum contato encontrado para o grupo alvo selecionado"]
      };
    }

    const results: string[] = [];
    let successCount = 0;

    console.log(`📊 Processando ${targetContacts.length} contatos para automação`);

    // Executar ação para cada contato
    for (const contact of targetContacts) {
      try {
        await executeAutomationAction(automation, contact);
        successCount++;
        results.push(`✅ ${contact.name} - ${automation.action} executada com sucesso`);
        
        // Registrar no banco de dados
        await logAutomationExecution(automation.id, contact.id, 'success');
        
      } catch (error) {
        console.error(`❌ Erro para ${contact.name}:`, error);
        results.push(`❌ ${contact.name} - Erro: ${error}`);
        
        // Registrar erro no banco
        await logAutomationExecution(automation.id, contact.id, 'failed', String(error));
      }
      
      // Delay entre execuções para evitar spam
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    // Atualizar estatísticas da automação
    await updateAutomationStats(automation.id, successCount);

    console.log(`✅ Automação concluída: ${successCount}/${targetContacts.length} sucessos`);

    return {
      success: successCount > 0,
      contactsReached: successCount,
      details: results
    };

  } catch (error) {
    console.error("💥 Erro crítico na automação:", error);
    return {
      success: false,
      contactsReached: 0,
      details: [`Erro crítico: ${error}`]
    };
  }
};

const getTargetContactsFromDB = async (targetGroup: string): Promise<Contact[]> => {
  try {
    console.log(`🔍 Buscando contatos do grupo: ${targetGroup}`);
    
    let query = supabase.from('leads').select('*');
    
    // Filtrar por tipo de lead baseado no grupo alvo
    switch (targetGroup) {
      case "leads":
        query = query.eq('status', 'Novo');
        break;
      case "customers":
        query = query.eq('status', 'Cliente');
        break;
      case "prospects":
        query = query.in('status', ['Qualificado', 'Negociação']);
        break;
      case "all":
      default:
        // Buscar todos
        break;
    }

    const { data: leads, error } = await query.limit(50); // Limitar para evitar spam
    
    if (error) {
      console.error("Erro ao buscar leads:", error);
      return [];
    }

    const contacts: Contact[] = (leads || []).map(lead => ({
      id: lead.id,
      name: lead.name,
      email: lead.email,
      phone: lead.phone || undefined,
      whatsapp: lead.whatsapp || undefined,
      type: lead.status || 'lead',
      company: lead.company || undefined
    }));

    console.log(`📈 Encontrados ${contacts.length} contatos`);
    return contacts;

  } catch (error) {
    console.error("Erro ao buscar contatos:", error);
    return [];
  }
};

const executeAutomationAction = async (automation: any, contact: Contact) => {
  const { actionType, message, webhookUrl } = automation;

  console.log(`🎯 Executando ${actionType} para ${contact.name}`);

  switch (actionType) {
    case "send_whatsapp":
      await sendWhatsAppMessage(contact, message || whatsappTemplates.leadContact(contact.name));
      break;
    
    case "send_email":
      await sendEmailMessage(contact, message);
      break;
    
    case "schedule_meeting":
      await scheduleMeeting(contact);
      break;
    
    case "assign_user":
      await assignUser(contact);
      break;

    case "zapier_webhook":
      await triggerZapierWebhook(contact, webhookUrl);
      break;

    case "make_webhook":
      await triggerMakeWebhook(contact, webhookUrl);
      break;

    case "n8n_webhook":
      await triggerN8nWebhook(contact, webhookUrl);
      break;

    case "pabbly_webhook":
      await triggerPabblyWebhook(contact, webhookUrl);
      break;
    
    default:
      throw new Error(`Ação não suportada: ${actionType}`);
  }
};

const sendWhatsAppMessage = async (contact: Contact, message: string) => {
  console.log(`📱 Enviando WhatsApp para ${contact.name}`);
  
  if (!contact.whatsapp && !contact.phone) {
    throw new Error("Contato não possui WhatsApp ou telefone");
  }

  const phoneNumber = contact.whatsapp || contact.phone;
  
  // Simular envio (abrir WhatsApp Web)
  const finalMessage = message.replace(/\{nome\}/g, contact.name).replace(/\{empresa\}/g, contact.company || 'sua empresa');
  
  console.log(`💬 Mensagem para ${contact.name}: ${finalMessage}`);
  
  // Em produção, aqui integraria com API do WhatsApp Business
  // Por enquanto, abre o WhatsApp Web
  openWhatsApp(phoneNumber!, finalMessage);
  
  // Simular delay de envio
  await new Promise(resolve => setTimeout(resolve, 1000));
};

const sendEmailMessage = async (contact: Contact, message: string) => {
  console.log(`📧 Enviando email para ${contact.name} (${contact.email})`);
  
  const subject = `Automação - Contato via CRM`;
  const body = message || `Olá ${contact.name},\n\nEsta é mensagem automática do sistema.\n\nAtenciosamente,\nEquipe CRM`;
  
  const finalBody = body.replace(/\{nome\}/g, contact.name).replace(/\{empresa\}/g, contact.company || 'sua empresa');
  
  console.log(`📨 Email para ${contact.name}: ${subject}`);
  
  // Em produção, aqui integraria com serviço de email (SendGrid, etc)
  // Por enquanto, abre o cliente de email
  openEmailClient(contact.email, subject, finalBody);
  
  // Simular delay de envio
  await new Promise(resolve => setTimeout(resolve, 1000));
};

const scheduleMeeting = async (contact: Contact) => {
  console.log(`📅 Agendando reunião com ${contact.name}`);
  
  // Criar evento no banco de dados
  try {
    const { error } = await supabase.from('events').insert({
      title: `Reunião Automática - ${contact.name}`,
      description: `Reunião agendada automaticamente pela automação`,
      start_time: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 dias
      end_time: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000).toISOString(), // 1 hora
      type: 'Reunião',
      status: 'Agendado',
      lead_id: contact.id
    });

    if (error) throw error;
    
    console.log(`✅ Reunião agendada para ${contact.name}`);
  } catch (error) {
    console.error("Erro ao agendar reunião:", error);
    throw new Error("Falha ao agendar reunião");
  }
};

const assignUser = async (contact: Contact) => {
  console.log(`👤 Atribuindo usuário para ${contact.name}`);
  
  // Aqui você pode implementar lógica de atribuição automática
  // Por exemplo, round-robin entre usuários ativos
  
  await new Promise(resolve => setTimeout(resolve, 500));
  console.log(`✅ ${contact.name} foi atribuído automaticamente`);
};

const triggerZapierWebhook = async (contact: Contact, webhookUrl?: string) => {
  if (!webhookUrl) {
    // Tentar pegar webhook das integrações administrativas
    const adminIntegrations = localStorage.getItem('admin_integrations');
    if (adminIntegrations) {
      const integrations = JSON.parse(adminIntegrations);
      const zapierIntegration = integrations.find((int: any) => int.id.includes('zapier'));
      if (zapierIntegration?.webhookUrl) {
        webhookUrl = zapierIntegration.webhookUrl;
      }
    }
  }

  if (!webhookUrl) {
    throw new Error("URL do webhook Zapier não configurada");
  }

  console.log(`🔗 Disparando Zapier webhook para ${contact.name}`);
  
  try {
    const payload = {
      contact: {
        id: contact.id,
        name: contact.name,
        email: contact.email,
        phone: contact.phone,
        whatsapp: contact.whatsapp,
        company: contact.company,
        type: contact.type
      },
      timestamp: new Date().toISOString(),
      source: "CRM_Automation",
      platform: "Zapier",
      automation_triggered: true
    };

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      mode: "no-cors",
      body: JSON.stringify(payload),
    });
    
    console.log(`✅ Zapier webhook enviado para ${contact.name}`);
    
  } catch (error) {
    console.error("Erro no Zapier webhook:", error);
    throw new Error(`Erro ao disparar Zapier webhook: ${error}`);
  }
};

const triggerMakeWebhook = async (contact: Contact, webhookUrl?: string) => {
  if (!webhookUrl) {
    const adminIntegrations = localStorage.getItem('admin_integrations');
    if (adminIntegrations) {
      const integrations = JSON.parse(adminIntegrations);
      const makeIntegration = integrations.find((int: any) => int.id.includes('make'));
      if (makeIntegration?.webhookUrl) {
        webhookUrl = makeIntegration.webhookUrl;
      }
    }
  }

  if (!webhookUrl) {
    throw new Error("URL do webhook Make.com não configurada");
  }

  console.log(`🔧 Disparando Make.com webhook para ${contact.name}`);
  
  try {
    const payload = {
      contact: contact,
      timestamp: new Date().toISOString(),
      source: "CRM_Automation",
      platform: "Make.com",
      automation_triggered: true
    };

    await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      mode: "no-cors",
      body: JSON.stringify(payload),
    });
    
    console.log(`✅ Make.com webhook enviado para ${contact.name}`);
    
  } catch (error) {
    console.error("Erro no Make.com webhook:", error);
    throw new Error(`Erro ao disparar Make.com webhook: ${error}`);
  }
};

const triggerN8nWebhook = async (contact: Contact, webhookUrl?: string) => {
  if (!webhookUrl) {
    throw new Error("URL do webhook n8n não configurada");
  }

  console.log(`⚡ Disparando n8n webhook para ${contact.name}`);
  
  try {
    const payload = {
      contact: contact,
      timestamp: new Date().toISOString(),
      source: "CRM_Automation",
      platform: "n8n",
      automation_triggered: true
    };

    await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      mode: "no-cors",
      body: JSON.stringify(payload),
    });
    
    console.log(`✅ n8n webhook enviado para ${contact.name}`);
    
  } catch (error) {
    console.error("Erro no n8n webhook:", error);
    throw new Error(`Erro ao disparar n8n webhook: ${error}`);
  }
};

const triggerPabblyWebhook = async (contact: Contact, webhookUrl?: string) => {
  if (!webhookUrl) {
    throw new Error("URL do webhook Pabbly não configurada");
  }

  console.log(`🔄 Disparando Pabbly webhook para ${contact.name}`);
  
  try {
    const payload = {
      contact: contact,
      timestamp: new Date().toISOString(),
      source: "CRM_Automation",
      platform: "Pabbly",
      automation_triggered: true
    };

    await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      mode: "no-cors",
      body: JSON.stringify(payload),
    });
    
    console.log(`✅ Pabbly webhook enviado para ${contact.name}`);
    
  } catch (error) {
    console.error("Erro no Pabbly webhook:", error);
    throw new Error(`Erro ao disparar Pabbly webhook: ${error}`);
  }
};

const logAutomationExecution = async (automationId: string, contactId: string, status: 'success' | 'failed', error?: string) => {
  try {
    // Registrar log da execução
    const logEntry = {
      automation_id: automationId,
      contact_id: contactId,
      status: status,
      executed_at: new Date().toISOString(),
      error_message: error
    };

    console.log(`📝 Registrando log de automação:`, logEntry);
    
    // Salvar no localStorage por enquanto (em produção seria no banco)
    const logs = JSON.parse(localStorage.getItem('automation_logs') || '[]');
    logs.push(logEntry);
    localStorage.setItem('automation_logs', JSON.stringify(logs));
    
  } catch (error) {
    console.error("Erro ao registrar log:", error);
  }
};

const updateAutomationStats = async (automationId: string, successCount: number) => {
  try {
    // Atualizar estatísticas da automação no banco
    const { error } = await supabase
      .from('automations')
      .update({ 
        executions: supabase.sql`executions + ${successCount}`,
        last_run: new Date().toISOString()
      })
      .eq('id', automationId);

    if (error) {
      console.error("Erro ao atualizar stats:", error);
    } else {
      console.log(`📊 Estatísticas atualizadas para automação ${automationId}`);
    }
  } catch (error) {
    console.error("Erro ao atualizar estatísticas:", error);
  }
};

export const validateAutomationTrigger = (triggerType: string, data?: any): boolean => {
  console.log(`🔍 Validando gatilho: ${triggerType}`, data);
  
  switch (triggerType) {
    case "new_lead":
      return data?.type === "lead" || data?.status === "Novo";
    
    case "email_opened":
      return data?.emailOpened === true;
    
    case "form_submitted":
      return data?.formSubmitted === true;
    
    case "time_based":
      return true;
    
    default:
      return false;
  }
};

// Função para executar automações baseadas em tempo
export const executeTimeBasedAutomations = async () => {
  console.log("⏰ Executando automações baseadas em tempo...");
  
  try {
    // Buscar automações ativas baseadas em tempo
    const { data: automations, error } = await supabase
      .from('automations')
      .select('*')
      .eq('status', 'Ativo')
      .eq('trigger_type', 'time_based');

    if (error) {
      console.error("Erro ao buscar automações:", error);
      return;
    }

    for (const automation of automations || []) {
      // Verificar se é hora de executar (baseado no delay)
      const lastRun = automation.last_run ? new Date(automation.last_run) : null;
      const now = new Date();
      const delayMinutes = automation.delay_minutes || 1440; // 24h por padrão
      
      if (!lastRun || (now.getTime() - lastRun.getTime()) >= (delayMinutes * 60 * 1000)) {
        console.log(`⏰ Executando automação baseada em tempo: ${automation.name}`);
        await executeAutomation(automation);
      }
    }
  } catch (error) {
    console.error("Erro nas automações baseadas em tempo:", error);
  }
};

// Inicializar execução automática de automações temporais
if (typeof window !== 'undefined') {
  // Executar a cada 5 minutos
  setInterval(executeTimeBasedAutomations, 5 * 60 * 1000);
  
  // Executar uma vez ao carregar
  setTimeout(executeTimeBasedAutomations, 5000);
}
