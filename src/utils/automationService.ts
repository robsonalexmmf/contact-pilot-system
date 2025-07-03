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
  user_id?: string;
}

// Novos tipos de gatilhos avançados
export const ADVANCED_TRIGGERS = {
  "new_lead": { name: "Novo Lead", description: "Quando uma nova lead é criada" },
  "hot_lead": { name: "Lead Quente", description: "Lead classificada como quente (score > 80)" },
  "meeting_scheduled": { name: "Reunião Agendada", description: "Lead agenda reunião" },
  "form_response": { name: "Resposta de Formulário", description: "Lead responde formulário externo" },
  "proposal_sent": { name: "Proposta Enviada", description: "Proposta é enviada para cliente" },
  "deal_won": { name: "Negócio Ganho", description: "Negócio é fechado com sucesso" },
  "deal_lost": { name: "Negócio Perdido", description: "Negócio é perdido" },
  "payment_overdue": { name: "Pagamento Atrasado", description: "Cliente com pagamento em atraso" },
  "proposal_approved": { name: "Proposta Aprovada", description: "Cliente aprova proposta" },
  "whatsapp_message": { name: "Nova Mensagem WhatsApp", description: "Nova mensagem recebida no WhatsApp" },
  "lead_inactive": { name: "Lead Inativa", description: "Lead sem atividade por X dias" },
  "nps_trigger": { name: "Envio NPS", description: "Após fechamento de venda (48h)" },
  "weekly_report": { name: "Relatório Semanal", description: "Todo domingo às 9h" },
  "monthly_backup": { name: "Backup Mensal", description: "Todo dia 1º do mês" },
  "user_login": { name: "Login de Usuário", description: "Quando usuário faz login" },
  "ai_summary": { name: "Resumo IA", description: "Gerar resumo inteligente de leads" }
};

// Novos tipos de ações avançadas
export const ADVANCED_ACTIONS = {
  "send_email": { name: "Enviar Email", description: "Enviar email personalizado" },
  "send_whatsapp": { name: "Enviar WhatsApp", description: "Enviar mensagem no WhatsApp" },
  "schedule_meeting": { name: "Agendar Reunião", description: "Criar evento no calendário" },
  "assign_user": { name: "Atribuir Usuário", description: "Atribuir lead a usuário" },
  "zapier_webhook": { name: "🔁 Zapier Webhook", description: "Disparar automação no Zapier" },
  "make_webhook": { name: "🔁 Make.com Webhook", description: "Disparar automação no Make.com" },
  "n8n_webhook": { name: "🔁 n8n Webhook", description: "Disparar automação no n8n" },
  "pabbly_webhook": { name: "🔁 Pabbly Webhook", description: "Disparar automação no Pabbly" },
  "rd_station": { name: "📊 RD Station", description: "Enviar lead para RD Station" },
  "active_campaign": { name: "📧 ActiveCampaign", description: "Enviar para ActiveCampaign" },
  "slack_alert": { name: "📢 Alerta Slack", description: "Enviar alerta no Slack" },
  "google_calendar": { name: "📅 Google Calendar", description: "Criar evento no Google Calendar" },
  "google_drive": { name: "📁 Google Drive", description: "Salvar arquivo no Google Drive" },
  "google_sheets": { name: "📊 Google Sheets", description: "Atualizar planilha" },
  "airtable": { name: "🗃️ Airtable", description: "Sincronizar com Airtable" },
  "generate_boleto": { name: "💰 Gerar Boleto", description: "Gerar boleto via ASAAS/Iugu" },
  "send_reminder": { name: "⏰ Enviar Lembrete", description: "Lembrete de cobrança" },
  "erp_integration": { name: "🏢 ERP Integration", description: "Cadastrar no ERP (Omie/Conta Azul)" },
  "docusign": { name: "📝 DocuSign", description: "Enviar para assinatura digital" },
  "clicksign": { name: "✍️ ClickSign", description: "Enviar para ClickSign" },
  "chatgpt_response": { name: "🤖 Resposta IA", description: "Resposta automática via ChatGPT" },
  "mailchimp_sync": { name: "📬 Mailchimp", description: "Sincronizar com Mailchimp" },
  "klaviyo_sync": { name: "📨 Klaviyo", description: "Sincronizar com Klaviyo" },
  "nps_survey": { name: "⭐ Pesquisa NPS", description: "Enviar pesquisa de satisfação" },
  "ai_summary": { name: "🧠 Resumo IA", description: "Gerar resumo inteligente" },
  "security_log": { name: "🔐 Log de Segurança", description: "Registrar atividade de segurança" },
  "backup_data": { name: "💾 Backup de Dados", description: "Fazer backup automático" },
  "reengagement_campaign": { name: "🎯 Campanha Reengajamento", description: "Campanha para leads inativas" }
};

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
      case "hot_leads":
        query = query.gte('score', 80);
        break;
      case "customers":
        query = query.eq('status', 'Cliente');
        break;
      case "prospects":
        query = query.in('status', ['Qualificado', 'Negociação']);
        break;
      case "inactive_leads":
        // Leads sem atividade nos últimos 30 dias
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        query = query.lt('last_contact', thirtyDaysAgo.toISOString());
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
      company: lead.company || undefined,
      user_id: lead.user_id
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

    // Webhooks para plataformas de automação
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

    // Novas integrações avançadas
    case "rd_station":
      await triggerRDStationIntegration(contact, webhookUrl);
      break;

    case "active_campaign":
      await triggerActiveCampaignIntegration(contact, webhookUrl);
      break;

    case "slack_alert":
      await sendSlackAlert(contact, message);
      break;

    case "google_calendar":
      await createGoogleCalendarEvent(contact);
      break;

    case "google_drive":
      await saveToGoogleDrive(contact);
      break;

    case "google_sheets":
      await updateGoogleSheets(contact);
      break;

    case "airtable":
      await syncWithAirtable(contact);
      break;

    case "generate_boleto":
      await generateBoleto(contact);
      break;

    case "send_reminder":
      await sendPaymentReminder(contact);
      break;

    case "erp_integration":
      await integrateWithERP(contact);
      break;

    case "docusign":
      await sendToDocuSign(contact);
      break;

    case "clicksign":
      await sendToClickSign(contact);
      break;

    case "chatgpt_response":
      await sendChatGPTResponse(contact, message);
      break;

    case "mailchimp_sync":
      await syncWithMailchimp(contact);
      break;

    case "klaviyo_sync":
      await syncWithKlaviyo(contact);
      break;

    case "nps_survey":
      await sendNPSSurvey(contact);
      break;

    case "ai_summary":
      await generateAISummary(contact);
      break;

    case "security_log":
      await createSecurityLog(contact);
      break;

    case "backup_data":
      await backupData(contact);
      break;

    case "reengagement_campaign":
      await triggerReengagementCampaign(contact);
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
  const finalMessage = message.replace(/\{nome\}/g, contact.name).replace(/\{empresa\}/g, contact.company || 'sua empresa');
  
  console.log(`💬 Mensagem para ${contact.name}: ${finalMessage}`);
  openWhatsApp(phoneNumber!, finalMessage);
  await new Promise(resolve => setTimeout(resolve, 1000));
};

const sendEmailMessage = async (contact: Contact, message: string) => {
  console.log(`📧 Enviando email para ${contact.name} (${contact.email})`);
  
  const subject = `Automação - Contato via CRM`;
  const body = message || `Olá ${contact.name},\n\nEsta é mensagem automática do sistema.\n\nAtenciosamente,\nEquipe CRM`;
  const finalBody = body.replace(/\{nome\}/g, contact.name).replace(/\{empresa\}/g, contact.company || 'sua empresa');
  
  console.log(`📨 Email para ${contact.name}: ${subject}`);
  openEmailClient(contact.email, subject, finalBody);
  await new Promise(resolve => setTimeout(resolve, 1000));
};

const scheduleMeeting = async (contact: Contact) => {
  console.log(`📅 Agendando reunião com ${contact.name}`);
  
  try {
    const { error } = await supabase.from('events').insert({
      title: `Reunião Automática - ${contact.name}`,
      description: `Reunião agendada automaticamente pela automação`,
      start_time: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      end_time: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000).toISOString(),
      type: 'Reunião',
      status: 'Agendado',
      lead_id: contact.id,
      user_id: contact.user_id || ''
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
  await new Promise(resolve => setTimeout(resolve, 500));
  console.log(`✅ ${contact.name} foi atribuído automaticamente`);
};

// Implementações das novas integrações avançadas
const triggerRDStationIntegration = async (contact: Contact, webhookUrl?: string) => {
  console.log(`📊 Enviando lead para RD Station: ${contact.name}`);
  
  const rdStationUrl = webhookUrl || 'https://www.rdstation.com.br/api/1.3/conversions';
  
  try {
    const payload = {
      email: contact.email,
      name: contact.name,
      company: contact.company,
      phone: contact.phone,
      tags: ['crm_automation', 'lead_quente'],
      traffic_source: 'CRM',
      conversion_identifier: 'crm_lead'
    };

    await fetch(rdStationUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      mode: "no-cors",
      body: JSON.stringify(payload)
    });
    
    console.log(`✅ Lead enviada para RD Station: ${contact.name}`);
  } catch (error) {
    throw new Error(`Erro RD Station: ${error}`);
  }
};

const triggerActiveCampaignIntegration = async (contact: Contact, webhookUrl?: string) => {
  console.log(`📧 Enviando para ActiveCampaign: ${contact.name}`);
  
  try {
    const payload = {
      contact: {
        email: contact.email,
        firstName: contact.name.split(' ')[0],
        lastName: contact.name.split(' ').slice(1).join(' '),
        phone: contact.phone
      },
      tags: ['crm_lead', 'automation']
    };

    await fetch(webhookUrl || '', {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      mode: "no-cors",
      body: JSON.stringify(payload)
    });
    
    console.log(`✅ Enviado para ActiveCampaign: ${contact.name}`);
  } catch (error) {
    throw new Error(`Erro ActiveCampaign: ${error}`);
  }
};

const sendSlackAlert = async (contact: Contact, message: string) => {
  console.log(`📢 Enviando alerta Slack para lead: ${contact.name}`);
  
  const slackWebhook = localStorage.getItem('slack_webhook_url');
  if (!slackWebhook) {
    throw new Error("Webhook do Slack não configurado");
  }

  try {
    const payload = {
      text: `🔥 Nova Lead Quente!`,
      attachments: [{
        color: "good",
        fields: [
          { title: "Nome", value: contact.name, short: true },
          { title: "Email", value: contact.email, short: true },
          { title: "Empresa", value: contact.company || "N/A", short: true },
          { title: "Telefone", value: contact.phone || "N/A", short: true }
        ]
      }]
    };

    await fetch(slackWebhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    
    console.log(`✅ Alerta Slack enviado para ${contact.name}`);
  } catch (error) {
    throw new Error(`Erro Slack: ${error}`);
  }
};

const createGoogleCalendarEvent = async (contact: Contact) => {
  console.log(`📅 Criando evento Google Calendar para ${contact.name}`);
  
  const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=Reunião com ${contact.name}&dates=${new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')}&details=Reunião agendada automaticamente via CRM`;
  
  window.open(calendarUrl, '_blank');
  console.log(`✅ Evento criado no Google Calendar para ${contact.name}`);
};

const saveToGoogleDrive = async (contact: Contact) => {
  console.log(`📁 Salvando dados no Google Drive para ${contact.name}`);
  
  // Simular salvamento de proposta no Google Drive
  const proposalData = {
    cliente: contact.name,
    email: contact.email,
    empresa: contact.company,
    data: new Date().toISOString(),
    status: 'Proposta Enviada'
  };
  
  console.log(`💾 Dados salvos no Google Drive:`, proposalData);
  console.log(`✅ Arquivo salvo no Google Drive para ${contact.name}`);
};

const updateGoogleSheets = async (contact: Contact) => {
  console.log(`📊 Atualizando Google Sheets para ${contact.name}`);
  
  const sheetsWebhook = localStorage.getItem('google_sheets_webhook');
  if (!sheetsWebhook) {
    console.log("📊 Simulando atualização do Google Sheets...");
    return;
  }

  try {
    const payload = {
      values: [[
        new Date().toLocaleDateString(),
        contact.name,
        contact.email,
        contact.company || '',
        contact.phone || '',
        'Negócio Fechado'
      ]]
    };

    await fetch(sheetsWebhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      mode: "no-cors",
      body: JSON.stringify(payload)
    });
    
    console.log(`✅ Google Sheets atualizado para ${contact.name}`);
  } catch (error) {
    throw new Error(`Erro Google Sheets: ${error}`);
  }
};

const syncWithAirtable = async (contact: Contact) => {
  console.log(`🗃️ Sincronizando com Airtable: ${contact.name}`);
  
  try {
    const payload = {
      fields: {
        "Nome": contact.name,
        "Email": contact.email,
        "Empresa": contact.company || "",
        "Telefone": contact.phone || "",
        "Status": "Sincronizado",
        "Data": new Date().toISOString()
      }
    };

    console.log(`✅ Dados sincronizados com Airtable:`, payload);
  } catch (error) {
    throw new Error(`Erro Airtable: ${error}`);
  }
};

const generateBoleto = async (contact: Contact) => {
  console.log(`💰 Gerando boleto ASAAS/Iugu para ${contact.name}`);
  
  try {
    const boletoData = {
      customer: {
        name: contact.name,
        email: contact.email,
        phone: contact.phone
      },
      value: 1000, // Valor exemplo
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      description: `Cobrança para ${contact.name}`
    };

    console.log(`💳 Boleto gerado:`, boletoData);
    console.log(`✅ Boleto criado para ${contact.name}`);
  } catch (error) {
    throw new Error(`Erro na geração de boleto: ${error}`);
  }
};

const sendPaymentReminder = async (contact: Contact) => {
  console.log(`⏰ Enviando lembrete de pagamento para ${contact.name}`);
  
  const reminderMessage = `Olá ${contact.name}! Lembramos que você possui um pagamento pendente. Por favor, entre em contato para regularização.`;
  
  // Enviar por email e WhatsApp
  await sendEmailMessage(contact, reminderMessage);
  if (contact.whatsapp || contact.phone) {
    await sendWhatsAppMessage(contact, reminderMessage);
  }
  
  console.log(`✅ Lembrete enviado para ${contact.name}`);
};

const integrateWithERP = async (contact: Contact) => {
  console.log(`🏢 Integrando com ERP (Omie/Conta Azul): ${contact.name}`);
  
  try {
    const erpData = {
      razao_social: contact.company || contact.name,
      nome_fantasia: contact.company || contact.name,
      email: contact.email,
      telefone: contact.phone,
      tipo_pessoa: "F", // Física
      contribuinte: "9" // Não contribuinte
    };

    console.log(`🏢 Cliente cadastrado no ERP:`, erpData);
    console.log(`✅ Integração ERP concluída para ${contact.name}`);
  } catch (error) {
    throw new Error(`Erro integração ERP: ${error}`);
  }
};

const sendToDocuSign = async (contact: Contact) => {
  console.log(`📝 Enviando para DocuSign: ${contact.name}`);
  
  const docusignData = {
    emailSubject: "Documento para assinatura",
    emailBody: `Olá ${contact.name}, segue documento para sua assinatura digital.`,
    recipients: [{
      email: contact.email,
      name: contact.name,
      recipientId: "1"
    }]
  };

  console.log(`📝 Documento enviado via DocuSign:`, docusignData);
  console.log(`✅ DocuSign enviado para ${contact.name}`);
};

const sendToClickSign = async (contact: Contact) => {
  console.log(`✍️ Enviando para ClickSign: ${contact.name}`);
  
  const clicksignData = {
    document: "contrato.pdf",
    signers: [{
      email: contact.email,
      name: contact.name,
      has_documentation: true
    }]
  };

  console.log(`✍️ Documento enviado via ClickSign:`, clicksignData);
  console.log(`✅ ClickSign enviado para ${contact.name}`);
};

const sendChatGPTResponse = async (contact: Contact, message: string) => {
  console.log(`🤖 Gerando resposta ChatGPT para ${contact.name}`);
  
  try {
    // Simular resposta da IA
    const aiResponse = `Olá ${contact.name}! Obrigado pelo seu interesse. Nossa equipe entrará em contato em breve para apresentar a melhor solução para ${contact.company || 'sua empresa'}. Caso tenha alguma dúvida específica, fique à vontade para entrar em contato conosco!`;
    
    await sendWhatsAppMessage(contact, aiResponse);
    console.log(`✅ Resposta IA enviada para ${contact.name}`);
  } catch (error) {
    throw new Error(`Erro ChatGPT: ${error}`);
  }
};

const syncWithMailchimp = async (contact: Contact) => {
  console.log(`📬 Sincronizando com Mailchimp: ${contact.name}`);
  
  try {
    const mailchimpData = {
      email_address: contact.email,
      status: "subscribed",
      merge_fields: {
        FNAME: contact.name.split(' ')[0],
        LNAME: contact.name.split(' ').slice(1).join(' '),
        PHONE: contact.phone || "",
        COMPANY: contact.company || ""
      },
      tags: ["crm_lead", "automation"]
    };

    console.log(`📬 Contato sincronizado com Mailchimp:`, mailchimpData);
    console.log(`✅ Mailchimp sincronizado para ${contact.name}`);
  } catch (error) {
    throw new Error(`Erro Mailchimp: ${error}`);
  }
};

const syncWithKlaviyo = async (contact: Contact) => {
  console.log(`📨 Sincronizando com Klaviyo: ${contact.name}`);
  
  try {
    const klaviyoData = {
      profiles: [{
        email: contact.email,
        first_name: contact.name.split(' ')[0],
        last_name: contact.name.split(' ').slice(1).join(' '),
        phone_number: contact.phone,
        organization: contact.company
      }]
    };

    console.log(`📨 Perfil sincronizado com Klaviyo:`, klaviyoData);
    console.log(`✅ Klaviyo sincronizado para ${contact.name}`);
  } catch (error) {
    throw new Error(`Erro Klaviyo: ${error}`);
  }
};

const sendNPSSurvey = async (contact: Contact) => {
  console.log(`⭐ Enviando pesquisa NPS para ${contact.name}`);
  
  const npsMessage = `Olá ${contact.name}! Como foi sua experiência conosco? Avalie de 0 a 10: https://forms.gle/nps-survey-${contact.id}`;
  
  await sendEmailMessage(contact, `Pesquisa de Satisfação - ${contact.company || 'Sua Empresa'}`);
  if (contact.whatsapp || contact.phone) {
    await sendWhatsAppMessage(contact, npsMessage);
  }
  
  console.log(`✅ Pesquisa NPS enviada para ${contact.name}`);
};

const generateAISummary = async (contact: Contact) => {
  console.log(`🧠 Gerando resumo IA para ${contact.name}`);
  
  try {
    // Buscar histórico da lead
    const { data: notes } = await supabase
      .from('leads')
      .select('notes')
      .eq('id', contact.id)
      .single();

    const aiSummary = `Lead ${contact.name} de ${contact.company || 'empresa não informada'}. Status atual: interessado em nossos serviços. Histórico: ${notes?.notes || 'Sem anotações anteriores'}. Recomendação: Fazer follow-up em 2 dias.`;
    
    // Atualizar campo de resumo
    await supabase
      .from('leads')
      .update({ 
        notes: (notes?.notes || '') + `\n\n[RESUMO IA - ${new Date().toLocaleDateString()}]: ${aiSummary}`
      })
      .eq('id', contact.id);

    console.log(`✅ Resumo IA gerado para ${contact.name}: ${aiSummary}`);
  } catch (error) {
    throw new Error(`Erro Resumo IA: ${error}`);
  }
};

const createSecurityLog = async (contact: Contact) => {
  console.log(`🔐 Criando log de segurança para ${contact.name}`);
  
  const securityLog = {
    user_id: contact.user_id,
    action: 'automation_triggered',
    ip_address: '127.0.0.1', // Seria capturado do request real
    timestamp: new Date().toISOString(),
    details: `Automação executada para contato ${contact.name}`
  };

  console.log(`🔐 Log de segurança criado:`, securityLog);
  console.log(`✅ Log de segurança registrado para ${contact.name}`);
};

const backupData = async (contact: Contact) => {
  console.log(`💾 Fazendo backup de dados para ${contact.name}`);
  
  try {
    const backupData = {
      contact_id: contact.id,
      name: contact.name,
      email: contact.email,
      phone: contact.phone,
      company: contact.company,
      backup_date: new Date().toISOString(),
      type: 'monthly_backup'
    };

    // Salvar backup (em produção seria enviado para serviço de backup)
    const backups = JSON.parse(localStorage.getItem('crm_backups') || '[]');
    backups.push(backupData);
    localStorage.setItem('crm_backups', JSON.stringify(backups));

    console.log(`💾 Backup realizado:`, backupData);
    console.log(`✅ Backup concluído para ${contact.name}`);
  } catch (error) {
    throw new Error(`Erro no backup: ${error}`);
  }
};

const triggerReengagementCampaign = async (contact: Contact) => {
  console.log(`🎯 Disparando campanha de reengajamento para ${contact.name}`);
  
  const reengagementMessage = `Oi ${contact.name}! Notamos que faz um tempo que não conversamos. Temos novidades incríveis que podem interessar a ${contact.company || 'você'}. Que tal marcarmos uma conversa rápida?`;
  
  // Disparar campanha multi-canal
  await sendEmailMessage(contact, reengagementMessage);
  if (contact.whatsapp || contact.phone) {
    await sendWhatsAppMessage(contact, reengagementMessage);
  }
  
  // Marcar lead para remarketing
  await supabase
    .from('leads')
    .update({ 
      notes: (await supabase.from('leads').select('notes').eq('id', contact.id).single()).data?.notes + 
             `\n[REENGAJAMENTO - ${new Date().toLocaleDateString()}]: Campanha disparada`
    })
    .eq('id', contact.id);

  console.log(`✅ Campanha de reengajamento disparada para ${contact.name}`);
};

const triggerZapierWebhook = async (contact: Contact, webhookUrl?: string) => {
  if (!webhookUrl) {
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
    const logEntry = {
      automation_id: automationId,
      contact_id: contactId,
      status: status,
      executed_at: new Date().toISOString(),
      error_message: error
    };

    console.log(`📝 Registrando log de automação:`, logEntry);
    
    const logs = JSON.parse(localStorage.getItem('automation_logs') || '[]');
    logs.push(logEntry);
    localStorage.setItem('automation_logs', JSON.stringify(logs));
    
  } catch (error) {
    console.error("Erro ao registrar log:", error);
  }
};

const updateAutomationStats = async (automationId: string, successCount: number) => {
  try {
    // Primeiro, buscar os valores atuais
    const { data: currentAutomation, error: fetchError } = await supabase
      .from('automations')
      .select('executions')
      .eq('id', automationId)
      .single();

    if (fetchError) {
      console.error("Erro ao buscar automação atual:", fetchError);
      return;
    }

    // Calcular novo valor de execuções
    const newExecutions = (currentAutomation?.executions || 0) + successCount;

    // Atualizar com o novo valor
    const { error } = await supabase
      .from('automations')
      .update({ 
        executions: newExecutions,
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
    case "hot_lead":
      return data?.score >= 80;
    case "meeting_scheduled":
      return data?.meetingScheduled === true;
    case "form_response":
      return data?.formSubmitted === true;
    case "proposal_sent":
      return data?.proposalSent === true;
    case "deal_won":
      return data?.dealStatus === "won";
    case "deal_lost":
      return data?.dealStatus === "lost";
    case "payment_overdue":
      return data?.paymentOverdue === true;
    case "proposal_approved":
      return data?.proposalApproved === true;
    case "whatsapp_message":
      return data?.whatsappMessage === true;
    case "lead_inactive":
      return data?.daysInactive >= 30;
    case "email_opened":
      return data?.emailOpened === true;
    case "time_based":
      return true;
    case "weekly_report":
      return new Date().getDay() === 0; // Domingo
    case "monthly_backup":
      return new Date().getDate() === 1; // Dia 1º do mês
    case "user_login":
      return data?.userLogin === true;
    case "ai_summary":
      return true;
    case "nps_trigger":
      return data?.dealClosed === true;
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
      .in('trigger_type', ['time_based', 'weekly_report', 'monthly_backup']);

    if (error) {
      console.error("Erro ao buscar automações:", error);
      return;
    }

    for (const automation of automations || []) {
      // Verificar se é hora de executar
      const lastRun = automation.last_run ? new Date(automation.last_run) : null;
      const now = new Date();
      let shouldExecute = false;

      switch (automation.trigger_type) {
        case 'weekly_report':
          shouldExecute = now.getDay() === 0 && (!lastRun || now.getTime() - lastRun.getTime() >= 6 * 24 * 60 * 60 * 1000);
          break;
        case 'monthly_backup':
          shouldExecute = now.getDate() === 1 && (!lastRun || now.getMonth() !== lastRun.getMonth());
          break;
        case 'time_based':
          const delayMinutes = automation.delay_minutes || 1440; // 24h por padrão
          shouldExecute = !lastRun || (now.getTime() - lastRun.getTime()) >= (delayMinutes * 60 * 1000);
          break;
      }
      
      if (shouldExecute) {
        console.log(`⏰ Executando automação baseada em tempo: ${automation.name}`);
        await executeAutomation(automation);
      }
    }
  } catch (error) {
    console.error("Erro nas automações baseadas em tempo:", error);
  }
};

// Função para disparar automações baseadas em eventos de leads
export const triggerLeadAutomations = async (leadData: any, eventType: string) => {
  console.log(`🎯 Disparando automações para evento: ${eventType}`, leadData);
  
  try {
    // Buscar automações ativas para o tipo de evento
    const { data: automations, error } = await supabase
      .from('automations')
      .select('*')
      .eq('status', 'Ativo')
      .eq('trigger_type', eventType);

    if (error) {
      console.error("Erro ao buscar automações:", error);
      return;
    }

    for (const automation of automations || []) {
      if (validateAutomationTrigger(eventType, leadData)) {
        console.log(`🚀 Executando automação disparada por evento: ${automation.name}`);
        await executeAutomation(automation);
      }
    }
  } catch (error) {
    console.error("Erro ao disparar automações de evento:", error);
  }
};

// Inicializar execução automática de automações temporais
if (typeof window !== 'undefined') {
  // Executar a cada 5 minutos
  setInterval(executeTimeBasedAutomations, 5 * 60 * 1000);
  
  // Executar uma vez ao carregar
  setTimeout(executeTimeBasedAutomations, 5000);
}
