
interface MercadoPagoPreference {
  title: string;
  quantity: number;
  unit_price: number;
  plan_type: 'pro' | 'premium';
}

interface MercadoPagoResponse {
  id: string;
  init_point: string;
  sandbox_init_point: string;
}

class MercadoPagoService {
  private accessToken: string = '';
  private isProduction: boolean = false;

  setAccessToken(token: string) {
    this.accessToken = token;
  }

  setEnvironment(production: boolean) {
    this.isProduction = production;
  }

  async createPreference(preference: MercadoPagoPreference): Promise<MercadoPagoResponse> {
    if (!this.accessToken) {
      throw new Error('Access Token do Mercado Pago não configurado');
    }

    const url = this.isProduction 
      ? 'https://api.mercadopago.com/checkout/preferences'
      : 'https://api.mercadopago.com/checkout/preferences';

    const requestBody = {
      items: [
        {
          title: preference.title,
          quantity: preference.quantity,
          unit_price: preference.unit_price,
          currency_id: 'BRL'
        }
      ],
      back_urls: {
        success: `${window.location.origin}/payment/success`,
        failure: `${window.location.origin}/payment/failure`,
        pending: `${window.location.origin}/payment/pending`
      },
      auto_return: 'approved',
      external_reference: `salesin_${preference.plan_type}_${Date.now()}`,
      notification_url: `${window.location.origin}/api/mercadopago/webhook`,
      statement_descriptor: 'SALESIN PRO',
      expires: true,
      expiration_date_from: new Date().toISOString(),
      expiration_date_to: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 horas
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.accessToken}`
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        throw new Error(`Erro na API do Mercado Pago: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erro ao criar preferência no Mercado Pago:', error);
      throw error;
    }
  }

  async getPaymentStatus(paymentId: string) {
    if (!this.accessToken) {
      throw new Error('Access Token do Mercado Pago não configurado');
    }

    const url = this.isProduction
      ? `https://api.mercadopago.com/v1/payments/${paymentId}`
      : `https://api.mercadopago.com/v1/payments/${paymentId}`;

    try {
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`
        }
      });

      if (!response.ok) {
        throw new Error(`Erro ao consultar pagamento: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao consultar status do pagamento:', error);
      throw error;
    }
  }
}

export const mercadoPagoService = new MercadoPagoService();

// Planos disponíveis
export const PLANS = {
  pro: {
    title: 'Salesin Pro - Plano Pro',
    price: 97.00,
    description: 'Até 1.000 leads, 5 pipelines, 5 usuários'
  },
  premium: {
    title: 'Salesin Pro - Plano Premium', 
    price: 197.00,
    description: 'Recursos ilimitados, API completa, suporte 24/7'
  }
} as const;
