
import React from 'react';
import { XCircle, RefreshCw, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link, useSearchParams } from 'react-router-dom';

export default function PaymentFailure() {
  const [searchParams] = useSearchParams();
  const status = searchParams.get('status');
  const statusDetail = searchParams.get('status_detail');

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <XCircle className="w-8 h-8 text-red-600" />
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Pagamento não Aprovado
        </h1>
        
        <p className="text-gray-600 mb-6">
          Não foi possível processar seu pagamento. 
          Verifique os dados do cartão e tente novamente.
        </p>

        {statusDetail && (
          <div className="bg-red-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-red-600">
              Motivo: {statusDetail.replace('_', ' ')}
            </p>
          </div>
        )}

        <div className="space-y-3">
          <Link to="/" className="w-full">
            <Button className="w-full" size="lg">
              <RefreshCw className="mr-2 h-4 w-4" />
              Tentar Novamente
            </Button>
          </Link>
          
          <Link to="/" className="w-full">
            <Button variant="outline" className="w-full">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar ao Início
            </Button>
          </Link>
        </div>

        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">
            Precisa de ajuda? Entre em contato conosco:
          </p>
          <p className="text-sm font-medium text-blue-600">
            contato@salesinpro.com
          </p>
        </div>
      </div>
    </div>
  );
}
