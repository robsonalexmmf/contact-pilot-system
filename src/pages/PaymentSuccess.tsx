
import React, { useEffect, useState } from 'react';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link, useSearchParams } from 'react-router-dom';
import { EmailConfirmationDialog } from '@/components/EmailConfirmationDialog';

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const [showEmailDialog, setShowEmailDialog] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [planType, setPlanType] = useState('');
  
  const paymentId = searchParams.get('payment_id');
  const status = searchParams.get('status');

  useEffect(() => {
    // Verificar se há dados salvos do pagamento
    const savedEmail = localStorage.getItem('payment_user_email');
    const savedPlan = localStorage.getItem('payment_plan_type');
    
    if (savedEmail && savedPlan) {
      setUserEmail(savedEmail);
      setPlanType(savedPlan);
      
      // Mostrar popup após um pequeno delay
      setTimeout(() => {
        setShowEmailDialog(true);
      }, 1000);
      
      // Limpar dados salvos
      localStorage.removeItem('payment_user_email');
      localStorage.removeItem('payment_plan_type');
      localStorage.removeItem('selected_plan');
    }

    console.log('Pagamento aprovado:', { paymentId, status });
  }, [paymentId, status]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Pagamento Aprovado!
        </h1>
        
        <p className="text-gray-600 mb-6">
          Parabéns! Seu pagamento foi processado com sucesso. 
          {planType && (
            <>
              <br />
              <span className="font-medium text-blue-600">
                Plano {planType === 'pro' ? 'Pro' : 'Premium'} ativado!
              </span>
            </>
          )}
        </p>

        {paymentId && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-500">ID do Pagamento:</p>
            <p className="font-mono text-sm text-gray-900">{paymentId}</p>
          </div>
        )}

        <div className="space-y-3">
          <Link to="/auth" className="w-full">
            <Button className="w-full" size="lg">
              Fazer Login no CRM <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          
          <Link to="/" className="w-full">
            <Button variant="outline" className="w-full">
              Voltar ao Início
            </Button>
          </Link>
        </div>
      </div>

      {/* Dialog de confirmação de email */}
      <EmailConfirmationDialog 
        open={showEmailDialog}
        onOpenChange={setShowEmailDialog}
        userEmail={userEmail}
      />
    </div>
  );
}
