
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Loader2, AlertCircle, Mail, CheckCircle } from "lucide-react";

export default function Auth() {
  const [isLoading, setIsLoading] = useState(false);
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [signupData, setSignupData] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [shouldRedirectToPayment, setShouldRedirectToPayment] = useState(false);
  const { signIn, signUp, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Verificar se há plano selecionado
  const selectedPlan = localStorage.getItem('selected_plan');

  useEffect(() => {
    if (user) {
      console.log('Usuário autenticado:', user.email);
      
      // Se há plano selecionado e deve redirecionar para pagamento
      if (selectedPlan && shouldRedirectToPayment) {
        console.log('Redirecionando para pagamento após cadastro...');
        handlePaymentRedirect();
      } else if (selectedPlan && !shouldRedirectToPayment) {
        // Se já estava logado e há plano selecionado
        console.log('Usuário já logado, redirecionando para pagamento...');
        handlePaymentRedirect();
      } else {
        // Se não há plano, vai para o app
        navigate('/app');
      }
    }
  }, [user, selectedPlan, shouldRedirectToPayment]);

  const handlePaymentRedirect = async () => {
    if (!user || !selectedPlan) return;
    
    console.log('Processando redirecionamento para pagamento...', { user: user.email, plan: selectedPlan });
    
    try {
      const { createPayment, getPaymentAmount } = await import('@/services/mercadoPagoService');
      
      const paymentData = {
        amount: getPaymentAmount(selectedPlan as 'pro' | 'premium'),
        description: `Assinatura ${selectedPlan === 'pro' ? 'Pro' : 'Premium'} - Salesin CRM`,
        userEmail: user.email || '',
        planType: selectedPlan as 'pro' | 'premium'
      };

      console.log('Criando pagamento com dados:', paymentData);

      const response = await createPayment(paymentData);
      
      if (response.success && response.redirectUrl) {
        // Salvar dados para mostrar popup após pagamento
        localStorage.setItem('payment_user_email', user.email || '');
        localStorage.setItem('payment_plan_type', selectedPlan);
        
        console.log('Redirecionando para:', response.redirectUrl);
        
        // Redirecionar para página de sucesso
        window.location.href = response.redirectUrl;
      } else {
        console.error('Erro na resposta do pagamento:', response);
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
        description: "Ocorreu um erro ao processar o pagamento. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const { error } = await signIn(loginData.email, loginData.password);
    
    if (error) {
      toast({
        title: "Erro no login",
        description: error.message,
        variant: "destructive"
      });
    } else {
      toast({
        title: "Login realizado com sucesso!",
        description: selectedPlan ? "Redirecionando para pagamento..." : "Redirecionando para o CRM..."
      });
    }
    
    setIsLoading(false);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (signupData.password !== signupData.confirmPassword) {
      toast({
        title: "Senhas diferentes",
        description: "As senhas não coincidem",
        variant: "destructive"
      });
      return;
    }

    if (signupData.password.length < 6) {
      toast({
        title: "Senha muito curta",
        description: "A senha deve ter pelo menos 6 caracteres",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    const { error } = await signUp(signupData.email, signupData.password, signupData.name);
    
    if (error) {
      if (error.message.includes('User already registered')) {
        toast({
          title: "Email já cadastrado",
          description: "Este email já está registrado. Tente fazer login.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Erro no cadastro",
          description: error.message,
          variant: "destructive"
        });
      }
    } else {
      console.log('Cadastro realizado com sucesso');
      
      // Marcar que deve redirecionar para pagamento após autenticação
      if (selectedPlan) {
        setShouldRedirectToPayment(true);
        console.log('Marcado para redirecionar para pagamento');
      }
      
      toast({
        title: "Cadastro realizado!",
        description: selectedPlan 
          ? "Aguarde, redirecionando para o pagamento..."
          : "Verifique seu email para confirmar a conta antes de continuar."
      });
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-blue-600">Salesin Pro</CardTitle>
          <CardDescription>
            {selectedPlan ? `Cadastre-se para assinar o plano ${selectedPlan.toUpperCase()}` : 'Acesse sua conta ou crie uma nova'}
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {selectedPlan && (
            <Alert className="mb-6 border-blue-200 bg-blue-50">
              <CheckCircle className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800">
                <strong>Plano selecionado:</strong> {selectedPlan === 'pro' ? 'Pro (R$ 97/mês)' : 'Premium (R$ 197/mês)'}
                <br />Após o cadastro, você será direcionado automaticamente para o pagamento.
              </AlertDescription>
            </Alert>
          )}

          {/* Alerta sobre confirmação de email */}
          <Alert className="mb-6 border-orange-200 bg-orange-50">
            <Mail className="h-4 w-4 text-orange-600" />
            <AlertDescription className="text-orange-800">
              <strong>⚠️ IMPORTANTE:</strong> Confirme seu email para ter acesso ao CRM. Sem confirmação, você não conseguirá fazer login.
            </AlertDescription>
          </Alert>

          <Tabs defaultValue={selectedPlan ? "signup" : "login"} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Cadastro</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <Input
                    id="login-email"
                    type="email"
                    value={loginData.email}
                    onChange={(e) => setLoginData(prev => ({ ...prev, email: e.target.value }))}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="login-password">Senha</Label>
                  <Input
                    id="login-password"
                    type="password"
                    value={loginData.password}
                    onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                    required
                  />
                </div>
                
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Entrando...
                    </>
                  ) : (
                    'Entrar'
                  )}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="signup">
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-name">Nome completo</Label>
                  <Input
                    id="signup-name"
                    type="text"
                    value={signupData.name}
                    onChange={(e) => setSignupData(prev => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    value={signupData.email}
                    onChange={(e) => setSignupData(prev => ({ ...prev, email: e.target.value }))}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Senha</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    value={signupData.password}
                    onChange={(e) => setSignupData(prev => ({ ...prev, password: e.target.value }))}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="signup-confirm-password">Confirmar senha</Label>
                  <Input
                    id="signup-confirm-password"
                    type="password"
                    value={signupData.confirmPassword}
                    onChange={(e) => setSignupData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    required
                  />
                </div>
                
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Criando conta...
                    </>
                  ) : (
                    selectedPlan ? 'Cadastrar e Prosseguir para Pagamento' : 'Criar Conta'
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
