/**
 * Utility functions for email integration
 */

/**
 * Opens the default email client with pre-filled information
 */
export const openEmailClient = (
  to: string, 
  subject: string = '', 
  body: string = ''
): void => {
  const encodedSubject = encodeURIComponent(subject);
  const encodedBody = encodeURIComponent(body);
  
  const mailtoUrl = `mailto:${to}?subject=${encodedSubject}&body=${encodedBody}`;
  console.log(`Abrindo cliente de email para: ${to}`);
  console.log(`URL do mailto: ${mailtoUrl}`);
  
  // Tentar abrir o cliente de email
  try {
    window.open(mailtoUrl, '_blank');
  } catch (error) {
    console.error('Erro ao abrir cliente de email:', error);
    // Fallback usando window.location
    window.location.href = mailtoUrl;
  }
};

/**
 * Email templates for different contexts
 */
export const emailTemplates = {
  leadContact: (name: string, company: string) => ({
    subject: `Contato via Salesin Pro - ${company}`,
    body: `Olá ${name},

Espero que este email o encontre bem.

Entrando em contato através do sistema Salesin Pro para dar continuidade ao nosso relacionamento comercial.

Gostaria de agendar uma conversa para entendermos melhor suas necessidades e como podemos ajudá-lo.

Fico à disposição para qualquer esclarecimento.

Atenciosamente,
Equipe Salesin Pro`
  }),

  followUp: (name: string, company: string) => ({
    subject: `Follow-up - ${company}`,
    body: `Olá ${name},

Dando continuidade ao nosso último contato, gostaria de saber se houve algum desenvolvimento em relação ao que conversamos.

Estou à disposição para esclarecer qualquer dúvida ou fornecer informações adicionais.

Aguardo seu retorno.

Atenciosamente,
Equipe Salesin Pro`
  }),

  proposal: (name: string, company: string) => ({
    subject: `Proposta Comercial - ${company}`,
    body: `Olá ${name},

Conforme conversamos, segue em anexo nossa proposta comercial personalizada para ${company}.

A proposta foi elaborada considerando suas necessidades específicas e inclui todos os detalhes discutidos.

Fico à disposição para esclarecer qualquer dúvida ou ajustar algum ponto da proposta.

Atenciosamente,
Equipe Salesin Pro`
  })
};
