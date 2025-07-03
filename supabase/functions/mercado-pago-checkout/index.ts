
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[MERCADO-PAGO-CHECKOUT] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Iniciando checkout Mercado Pago");

    const mercadoPagoToken = Deno.env.get("MERCADO_PAGO_ACCESS_TOKEN");
    if (!mercadoPagoToken) {
      throw new Error("MERCADO_PAGO_ACCESS_TOKEN não configurado");
    }

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("Token de autorização não fornecido");
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    
    if (userError) throw new Error(`Erro de autenticação: ${userError.message}`);
    
    const user = userData.user;
    if (!user?.email) throw new Error("Usuário não autenticado ou email não disponível");

    logStep("Usuário autenticado", { userId: user.id, email: user.email });

    const { planType } = await req.json();
    if (!planType || !['pro', 'premium'].includes(planType)) {
      throw new Error("Tipo de plano inválido");
    }

    // Configurar preços dos planos
    const planPrices = {
      pro: { price: 97.00, title: "Plano Pro" },
      premium: { price: 197.00, title: "Plano Premium" }
    };

    const selectedPlan = planPrices[planType as keyof typeof planPrices];
    logStep("Plano selecionado", { planType, price: selectedPlan.price });

    // Criar preferência no Mercado Pago
    const preferenceData = {
      items: [
        {
          title: selectedPlan.title,
          quantity: 1,
          unit_price: selectedPlan.price,
          currency_id: "BRL"
        }
      ],
      payer: {
        email: user.email
      },
      payment_methods: {
        excluded_payment_types: [
          { id: "ticket" }
        ],
        installments: 12
      },
      back_urls: {
        success: `${req.headers.get("origin")}/success?plan=${planType}`,
        failure: `${req.headers.get("origin")}/failure`,
        pending: `${req.headers.get("origin")}/pending`
      },
      auto_return: "approved",
      external_reference: `${user.id}_${planType}_${Date.now()}`
    };

    logStep("Criando preferência no Mercado Pago", preferenceData);

    const response = await fetch("https://api.mercadopago.com/checkout/preferences", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${mercadoPagoToken}`
      },
      body: JSON.stringify(preferenceData)
    });

    if (!response.ok) {
      const errorData = await response.text();
      logStep("Erro na API do Mercado Pago", { status: response.status, error: errorData });
      throw new Error(`Erro na API do Mercado Pago: ${response.status}`);
    }

    const preference = await response.json();
    logStep("Preferência criada com sucesso", { preferenceId: preference.id });

    return new Response(JSON.stringify({ 
      preference_id: preference.id,
      checkout_url: preference.init_point,
      sandbox_url: preference.sandbox_init_point 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERRO no checkout", { message: errorMessage });
    
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
