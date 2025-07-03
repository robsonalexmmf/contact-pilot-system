
import React, { useEffect } from 'react';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link, useSearchParams } from 'react-router-dom';

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const paymentId = searchParams.get('payment_id');
  const status = searchParams.get('status');

  useEffect(() => {
    // Aqui você pode fazer uma chamada para confirmar o pagamento
    // e atualizar o plano do usuário
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
          Seu plano já está ativo e você pode começar a usar todos os recursos.
        </p>

        {paymentId && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-500">ID do Pagamento:</p>
            <p className="font-mono text-sm text-gray-900">{paymentId}</p>
          </div>
        )}

        <div className="space-y-3">
          <Link to="/app" className="w-full">
            <Button className="w-full" size="lg">
              Acessar CRM <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          
          <Link to="/" className="w-full">
            <Button variant="outline" className="w-full">
              Voltar ao Início
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
