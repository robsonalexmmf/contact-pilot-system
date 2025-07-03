
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

interface SubscriptionButtonProps {
  planType: 'pro' | 'premium';
  children: React.ReactNode;
  className?: string;
}

export function SubscriptionButton({ planType, children, className }: SubscriptionButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubscribe = () => {
    // Armazenar o plano selecionado no localStorage para usar após o cadastro
    localStorage.setItem('selected_plan', planType);
    
    toast({
      title: "Redirecionando para cadastro",
      description: "Complete seu cadastro para prosseguir com a assinatura.",
    });
  };

  return (
    <Link to="/auth" className="w-full">
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
    </Link>
  );
}
