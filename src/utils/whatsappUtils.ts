/**
 * Utility functions for WhatsApp integration
 */

/**
 * Formats a phone number to be used in WhatsApp links
 * Removes special characters and ensures proper format
 */
export const formatPhoneForWhatsApp = (phone: string): string => {
  // Remove all non-numeric characters
  const cleanPhone = phone.replace(/\D/g, '');
  
  // If phone starts with 55 (Brazil country code), keep as is
  // If phone starts with 11, 21, etc (area codes), add 55
  // If phone has 11 digits and starts with area code, add 55
  if (cleanPhone.startsWith('55')) {
    return cleanPhone;
  } else if (cleanPhone.length === 11 && !cleanPhone.startsWith('55')) {
    return `55${cleanPhone}`;
  } else if (cleanPhone.length === 10 && !cleanPhone.startsWith('55')) {
    // Add 9 for mobile numbers if missing and country code
    return `559${cleanPhone}`;
  }
  
  return cleanPhone;
};

/**
 * Generates a WhatsApp link with optional message
 */
export const generateWhatsAppLink = (phone: string, message?: string): string => {
  const formattedPhone = formatPhoneForWhatsApp(phone);
  const encodedMessage = message ? encodeURIComponent(message) : '';
  
  return `https://wa.me/${formattedPhone}${encodedMessage ? `?text=${encodedMessage}` : ''}`;
};

/**
 * Opens WhatsApp with the specified phone number and optional message
 */
export const openWhatsApp = (phone: string, message?: string): void => {
  const whatsappUrl = generateWhatsAppLink(phone, message);
  console.log(`Abrindo WhatsApp para: ${phone} - URL: ${whatsappUrl}`);
  window.open(whatsappUrl, '_blank');
};

/**
 * Default message templates for different contexts
 */
export const whatsappTemplates = {
  leadContact: (name: string) => 
    `Olá ${name}! Entrando em contato através do Salesin Pro. Como posso ajudá-lo?`,
  followUp: (name: string) => 
    `Olá ${name}! Dando continuidade ao nosso contato anterior. Gostaria de conversar?`,
  proposal: (name: string) => 
    `Olá ${name}! Tenho uma proposta interessante para apresentar. Podemos conversar?`
};
