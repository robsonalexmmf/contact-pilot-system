
import React from 'react';
import { Clock, Mail, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link, useSearchParams } from 'react-router-dom';

export default function PaymentPending() {
  const [searchParams] = useSearchParams();
  const paymentId = searchParams.get('payment_id');

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Clock className="w-8 h-8 text-yellow-600" />
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Pagamento Pendente
        </h1>
        
        <p className="text-gray-600 mb-6">
          Seu pagamento está sendo processado. 
          Você receberá uma confirmação por email assim que for aprovado.
        </p>

        {paymentId && (
          <div className="bg-yellow-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-yellow-700">ID do Pagamento:</p>
            <p className="font-mono text-sm text-gray-900">{paymentId}</p>
          </div>
        )}

        <div className="flex items-center justify-center mb-6 text-gray-500">
          <Mail className="w-5 h-5 mr-2" />
          <span className="text-sm">Verificar email para atualizações</span>
        </div>

        <div className="space-y-3">
          <Link to="/app" className="w-full">
            <Button className="w-full" size="lg">
              Acessar CRM
            </Button>
          </Link>
          
          <Link to="/" className="w-full">
            <Button variant="outline" className="w-full">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar ao Início
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
