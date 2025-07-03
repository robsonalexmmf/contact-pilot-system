
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { mercadoPagoService, PLANS } from '@/services/mercadoPagoService';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';

interface SubscriptionButtonProps {
  planType: 'pro' | 'premium';
  children: React.ReactNode;
  className?: string;
}

export function SubscriptionButton({ planType, children, className }: SubscriptionButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubscribe = async () => {
    setIsLoading(true);
    
    try {
      // Configurar o Access Token do Mercado Pago
      mercadoPagoService.setAccessToken('TEST-da7a3c0c-ad67-48ac-89d3-04d8064b7844');
      mercadoPagoService.setEnvironment(false); // Modo teste
      
      const plan = PLANS[planType];
      
      const preference = await mercadoPagoService.createPreference({
        title: plan.title,
        quantity: 1,
        unit_price: plan.price,
        plan_type: planType
      });

      // Redirecionar para o checkout do Mercado Pago
      window.location.href = preference.sandbox_init_point;
      
    } catch (error) {
      console.error('Erro ao criar preferência:', error);
      toast({
        title: "Erro no pagamento",
        description: "Não foi possível processar o pagamento. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button 
      onClick={handleSubscribe} 
      disabled={isLoading}
      className={className}
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Processando...
        </>
      ) : (
        children
      )}
    </Button>
  );
}
