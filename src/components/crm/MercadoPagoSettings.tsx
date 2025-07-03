
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { AlertCircle, Key, CheckCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { createPayment } from "@/services/mercadoPagoService";

export function MercadoPagoSettings() {
  const [accessToken, setAccessToken] = useState('');
  const [isProduction, setIsProduction] = useState(false);
  const [isConfigured, setIsConfigured] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [testResult, setTestResult] = useState<string>('');

  useEffect(() => {
    // Carregar configurações salvas
    const savedToken = localStorage.getItem('mercadopago_access_token');
    const savedEnv = localStorage.getItem('mercadopago_environment') === 'production';
    
    if (savedToken) {
      setAccessToken(savedToken);
      setIsConfigured(true);
    }
    setIsProduction(savedEnv);
  }, []);

  const handleSaveSettings = () => {
    if (!accessToken.trim()) {
      setTestResult('Por favor, insira o Access Token');
      return;
    }

    localStorage.setItem('mercadopago_access_token', accessToken);
    localStorage.setItem('mercadopago_environment', isProduction ? 'production' : 'sandbox');
    
    setIsConfigured(true);
    setTestResult('Configurações salvas com sucesso!');
  };

  const handleTestConnection = async () => {
    if (!accessToken.trim()) {
      setTestResult('Configure o Access Token primeiro');
      return;
    }

    setIsLoading(true);
    setTestResult('');

    try {
      // Teste simples: tentar criar um pagamento de teste
      await createPayment({
        amount: 0.01,
        description: 'Teste de Conexão',
        userEmail: 'test@test.com',
        planType: 'pro'
      });
      
      setTestResult('✅ Conexão com Mercado Pago estabelecida com sucesso!');
    } catch (error: any) {
      setTestResult(`❌ Erro na conexão: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Key className="h-5 w-5" />
          Configuração Mercado Pago
        </CardTitle>
        <CardDescription>
          Configure sua chave de acesso do Mercado Pago para processar pagamentos
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {isConfigured && (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              Mercado Pago configurado e pronto para uso
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-4">
          <div>
            <Label htmlFor="access-token">Access Token</Label>
            <Input
              id="access-token"
              type="password"
              placeholder="Insira seu Access Token do Mercado Pago"
              value={accessToken}
              onChange={(e) => setAccessToken(e.target.value)}
            />
            <p className="text-sm text-gray-500 mt-1">
              Você pode encontrar seu Access Token no painel do Mercado Pago
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="production-mode"
              checked={isProduction}
              onCheckedChange={setIsProduction}
            />
            <Label htmlFor="production-mode">Modo Produção</Label>
            <p className="text-sm text-gray-500">
              {isProduction ? 'Pagamentos reais' : 'Modo teste/sandbox'}
            </p>
          </div>
        </div>

        <div className="flex gap-4">
          <Button onClick={handleSaveSettings}>
            Salvar Configurações
          </Button>
          
          <Button 
            variant="outline" 
            onClick={handleTestConnection}
            disabled={isLoading || !accessToken.trim()}
          >
            {isLoading ? 'Testando...' : 'Testar Conexão'}
          </Button>
        </div>

        {testResult && (
          <Alert variant={testResult.includes('❌') ? 'destructive' : 'default'}>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{testResult}</AlertDescription>
          </Alert>
        )}

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-2">Como obter seu Access Token:</h4>
          <ol className="text-sm text-blue-800 space-y-1">
            <li>1. Acesse sua conta no Mercado Pago</li>
            <li>2. Vá em "Seu negócio" → "Configurações" → "Credenciais"</li>
            <li>3. Para testes: copie o "Access Token" da seção "Credenciais de teste"</li>
            <li>4. Para produção: copie o "Access Token" da seção "Credenciais de produção"</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  );
}
