
// Simulação do serviço Mercado Pago para demonstração
// Em produção, isso seria integrado com a API real do Mercado Pago

export interface PaymentData {
  amount: number;
  description: string;
  userEmail: string;
  planType: 'pro' | 'premium';
}

export interface PaymentResponse {
  success: boolean;
  paymentId?: string;
  error?: string;
  redirectUrl?: string;
}

export const createPayment = async (paymentData: PaymentData): Promise<PaymentResponse> => {
  // Simular processamento de pagamento
  console.log('Processando pagamento Mercado Pago:', paymentData);
  
  // Simular delay de processamento
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Simular sucesso (em produção, aqui seria a integração real)
  const paymentId = `MP_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  return {
    success: true,
    paymentId,
    redirectUrl: `/payment/success?payment_id=${paymentId}&status=approved`
  };
};

export const getPaymentAmount = (planType: 'pro' | 'premium'): number => {
  return planType === 'pro' ? 97 : 197;
};
