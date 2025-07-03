
import { openWhatsApp, whatsappTemplates } from './whatsappUtils';
import { openEmailClient, emailTemplates } from './emailUtils';

// Mock de contatos para demonstração
const mockContacts = [
  { id: 1, name: "João Silva", email: "joao@email.com", phone: "11999887766", type: "lead" },
  { id: 2, name: "Maria Santos", email: "maria@email.com", phone: "11988776655", type: "customer" },
  { id: 3, name: "Pedro Costa", email: "pedro@email.com", phone: "11977665544", type: "prospect" },
  { id: 4, name: "Ana Lima", email: "ana@email.com", phone: "11966554433", type: "lead" },
  { id: 5, name: "Carlos Oliveira", email: "carlos@email.com", phone: "11955443322", type: "customer" }
];

interface ExecutionResult {
  success: boolean;
  contactsReached: number;
  details: string[];
}

export const executeAutomation = async (automation: any): Promise<ExecutionResult> => {
  console.log("Executando automação:", automation.name);
  
  // Filtrar contatos com base no grupo alvo
  const targetContacts = getTargetContacts(automation.targetGroup);
  
  if (targetContacts.length === 0) {
    return {
      success: false,
      contactsReached: 0,
      details: ["Nenhum contato encontrado para o grupo alvo selecionado"]
    };
  }

  const results: string[] = [];
  let successCount = 0;

  // Executar ação para cada contato
  for (const contact of targetContacts) {
    try {
      await executeAutomationAction(automation, contact);
      successCount++;
      results.push(`✅ ${contact.name} - ${automation.action} executada com sucesso`);
    } catch (error) {
      results.push(`❌ ${contact.name} - Erro: ${error}`);
    }
    
    // Pequeno delay entre execuções para evitar spam
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  return {
    success: successCount > 0,
    contactsReached: successCount,
    details: results
  };
};

const getTargetContacts = (targetGroup: string) => {
  switch (targetGroup) {
    case "leads":
      return mockContacts.filter(c => c.type === "lead");
    case "customers":
      return mockContacts.filter(c => c.type === "customer");
    case "prospects":
      return mockContacts.filter(c => c.type === "prospect");
    case "all":
    default:
      return mockContacts;
  }
};

const executeAutomationAction = async (automation: any, contact: any) => {
  const { actionType, message, webhookUrl } = automation;

  switch (actionType) {
    case "send_whatsapp":
      await sendWhatsAppMessage(contact, message || whatsappTemplates.leadContact(contact.name));
      break;
    
    case "send_email":
      await sendEmail(contact, message);
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

const sendWhatsAppMessage = async (contact: any, message: string) => {
  console.log(`Enviando WhatsApp para ${contact.name} (${contact.phone}): ${message}`);
  
  await new Promise(resolve => setTimeout(resolve, 500));
  
  if (window.confirm(`Abrir WhatsApp para ${contact.name}?\nMensagem: ${message}`)) {
    openWhatsApp(contact.phone, message);
  }
};

const sendEmail = async (contact: any, message: string) => {
  console.log(`Enviando email para ${contact.name} (${contact.email}): ${message}`);
  
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const subject = `Automação - Contato via Salesin Pro`;
  const body = message || `Olá ${contact.name},\n\nEsta é uma mensagem automática do sistema Salesin Pro.\n\nAtenciosamente,\nEquipe Salesin Pro`;
  
  if (window.confirm(`Abrir cliente de email para ${contact.name}?\nAssunto: ${subject}`)) {
    openEmailClient(contact.email, subject, body);
  }
};

const scheduleMeeting = async (contact: any) => {
  console.log(`Agendando reunião com ${contact.name}`);
  await new Promise(resolve => setTimeout(resolve, 500));
  alert(`Reunião agendada com ${contact.name} para próxima semana!`);
};

const assignUser = async (contact: any) => {
  console.log(`Atribuindo usuário para ${contact.name}`);
  await new Promise(resolve => setTimeout(resolve, 500));
  alert(`${contact.name} foi atribuído ao usuário responsável!`);
};

const triggerZapierWebhook = async (contact: any, webhookUrl?: string) => {
  if (!webhookUrl) {
    throw new Error("URL do webhook Zapier não configurada");
  }

  console.log(`Disparando Zapier webhook para ${contact.name}`);
  
  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      mode: "no-cors",
      body: JSON.stringify({
        contact: contact,
        timestamp: new Date().toISOString(),
        source: "Salesin Pro",
        platform: "Zapier"
      }),
    });
    
    console.log(`Zapier webhook enviado para ${contact.name}`);
  } catch (error) {
    throw new Error(`Erro ao disparar Zapier webhook: ${error}`);
  }
};

const triggerMakeWebhook = async (contact: any, webhookUrl?: string) => {
  if (!webhookUrl) {
    throw new Error("URL do webhook Make.com não configurada");
  }

  console.log(`Disparando Make.com webhook para ${contact.name}`);
  
  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      mode: "no-cors",
      body: JSON.stringify({
        contact: contact,
        timestamp: new Date().toISOString(),
        source: "Salesin Pro",
        platform: "Make.com"
      }),
    });
    
    console.log(`Make.com webhook enviado para ${contact.name}`);
  } catch (error) {
    throw new Error(`Erro ao disparar Make.com webhook: ${error}`);
  }
};

const triggerN8nWebhook = async (contact: any, webhookUrl?: string) => {
  if (!webhookUrl) {
    throw new Error("URL do webhook n8n não configurada");
  }

  console.log(`Disparando n8n webhook para ${contact.name}`);
  
  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      mode: "no-cors",
      body: JSON.stringify({
        contact: contact,
        timestamp: new Date().toISOString(),
        source: "Salesin Pro",
        platform: "n8n"
      }),
    });
    
    console.log(`n8n webhook enviado para ${contact.name}`);
  } catch (error) {
    throw new Error(`Erro ao disparar n8n webhook: ${error}`);
  }
};

const triggerPabblyWebhook = async (contact: any, webhookUrl?: string) => {
  if (!webhookUrl) {
    throw new Error("URL do webhook Pabbly não configurada");
  }

  console.log(`Disparando Pabbly webhook para ${contact.name}`);
  
  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      mode: "no-cors",
      body: JSON.stringify({
        contact: contact,
        timestamp: new Date().toISOString(),
        source: "Salesin Pro",
        platform: "Pabbly"
      }),
    });
    
    console.log(`Pabbly webhook enviado para ${contact.name}`);
  } catch (error) {
    throw new Error(`Erro ao disparar Pabbly webhook: ${error}`);
  }
};

export const validateAutomationTrigger = (triggerType: string, data?: any): boolean => {
  console.log(`Validando gatilho: ${triggerType}`, data);
  
  switch (triggerType) {
    case "new_lead":
      return data?.type === "lead";
    
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
