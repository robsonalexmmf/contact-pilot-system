
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPayment, getPaymentAmount } from '@/services/mercadoPagoService';
import { useAuth } from '@/hooks/useAuth';

interface SubscriptionButtonProps {
  planType: 'pro' | 'premium';
  children: React.ReactNode;
  className?: string;
}

export function SubscriptionButton({ planType, children, className }: SubscriptionButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleSubscribe = async () => {
    // Se não estiver logado, redirecionar para cadastro
    if (!user) {
      localStorage.setItem('selected_plan', planType);
      toast({
        title: "Redirecionando para cadastro",
        description: "Complete seu cadastro para prosseguir com a assinatura.",
      });
      return;
    }

    // Se estiver logado, processar pagamento
    setIsLoading(true);
    
    try {
      const paymentData = {
        amount: getPaymentAmount(planType),
        description: `Assinatura ${planType === 'pro' ? 'Pro' : 'Premium'} - Salesin CRM`,
        userEmail: user.email || '',
        planType
      };

      const response = await createPayment(paymentData);
      
      if (response.success && response.redirectUrl) {
        // Salvar dados para mostrar popup após pagamento
        localStorage.setItem('payment_user_email', user.email || '');
        localStorage.setItem('payment_plan_type', planType);
        
        // Redirecionar para página de sucesso
        window.location.href = response.redirectUrl;
      } else {
        toast({
          title: "Erro no pagamento",
          description: response.error || "Não foi possível processar o pagamento",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Erro ao processar pagamento:', error);
      toast({
        title: "Erro no pagamento",
        description: "Ocorreu um erro inesperado. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Se não estiver logado, mostrar como link para cadastro
  if (!user) {
    return (
      <Link to="/auth" className="w-full">
        <Button 
          onClick={() => localStorage.setItem('selected_plan', planType)}
          className={className}
        >
          {children}
        </Button>
      </Link>
    );
  }

  // Se estiver logado, mostrar botão de pagamento
  return (
    <Button 
      onClick={handleSubscribe} 
      disabled={isLoading}
      className={className}
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Processando pagamento...
        </>
      ) : (
        children
      )}
    </Button>
  );
}
