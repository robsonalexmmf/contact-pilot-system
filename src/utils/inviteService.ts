
import { emailTemplates } from './emailUtils';

export interface InviteData {
  email: string;
  role: string;
  invitedBy: string;
  companyName: string;
  token: string;
  expiresAt: string;
}

/**
 * Gera um token único para o convite
 */
export const generateInviteToken = (): string => {
  return Array.from(crypto.getRandomValues(new Uint8Array(32)))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
};

/**
 * Gera link de convite com token
 */
export const generateInviteLink = (token: string): string => {
  const baseUrl = window.location.origin;
  return `${baseUrl}/signup?invite=${token}`;
};

/**
 * Salva convite no localStorage (temporário até termos backend)
 */
export const saveInvite = (inviteData: InviteData): void => {
  const existingInvites = getStoredInvites();
  existingInvites.push(inviteData);
  localStorage.setItem('pending_invites', JSON.stringify(existingInvites));
  
  console.log('Convite salvo:', {
    email: inviteData.email,
    token: inviteData.token,
    expiresAt: inviteData.expiresAt
  });
};

/**
 * Recupera convites armazenados
 */
export const getStoredInvites = (): InviteData[] => {
  try {
    const stored = localStorage.getItem('pending_invites');
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Erro ao recuperar convites:', error);
    return [];
  }
};

/**
 * Valida se um token de convite é válido
 */
export const validateInviteToken = (token: string): InviteData | null => {
  const invites = getStoredInvites();
  const invite = invites.find(inv => inv.token === token);
  
  if (!invite) return null;
  
  // Verificar se o convite não expirou
  if (new Date() > new Date(invite.expiresAt)) {
    console.log('Convite expirado:', token);
    return null;
  }
  
  return invite;
};

/**
 * Marca convite como usado
 */
export const markInviteAsUsed = (token: string): void => {
  const invites = getStoredInvites();
  const updatedInvites = invites.filter(inv => inv.token !== token);
  localStorage.setItem('pending_invites', JSON.stringify(updatedInvites));
};

/**
 * Envia email de convite usando mailto
 */
export const sendInviteEmail = (inviteData: InviteData): void => {
  const inviteLink = generateInviteLink(inviteData.token);
  
  const emailSubject = `Convite para ${inviteData.companyName} - Salesin Pro`;
  const emailBody = `Olá!

Você foi convidado por ${inviteData.invitedBy} para fazer parte da equipe ${inviteData.companyName} no Salesin Pro.

Clique no link abaixo para aceitar o convite e criar sua conta:
${inviteLink}

Detalhes do convite:
- Função: ${inviteData.role}
- Empresa: ${inviteData.companyName}
- Válido até: ${new Date(inviteData.expiresAt).toLocaleDateString('pt-BR')}

Este convite é válido por 7 dias. Após este período, será necessário solicitar um novo convite.

Se você não esperava este convite, pode ignorar este email.

Atenciosamente,
Equipe Salesin Pro`;

  // Codificar para URL
  const encodedSubject = encodeURIComponent(emailSubject);
  const encodedBody = encodeURIComponent(emailBody);
  
  const mailtoUrl = `mailto:${inviteData.email}?subject=${encodedSubject}&body=${encodedBody}`;
  
  console.log('Enviando convite para:', inviteData.email);
  console.log('Link de convite:', inviteLink);
  console.log('URL do mailto:', mailtoUrl);
  
  // Abrir cliente de email
  try {
    window.open(mailtoUrl, '_blank');
  } catch (error) {
    console.error('Erro ao abrir cliente de email:', error);
    // Fallback usando window.location
    window.location.href = mailtoUrl;
  }
};

/**
 * Cria um convite completo
 */
export const createUserInvite = (
  email: string, 
  role: string, 
  invitedBy: string, 
  companyName: string
): InviteData => {
  const token = generateInviteToken();
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7); // Expira em 7 dias
  
  const inviteData: InviteData = {
    email,
    role,
    invitedBy,
    companyName,
    token,
    expiresAt: expiresAt.toISOString()
  };
  
  // Salvar convite
  saveInvite(inviteData);
  
  // Enviar email
  sendInviteEmail(inviteData);
  
  return inviteData;
};
