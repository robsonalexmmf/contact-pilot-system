
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { validateInviteToken, markInviteAsUsed, InviteData } from "@/utils/inviteService";
import { UserPlus, Mail, Building, Shield } from "lucide-react";

export const Signup = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [inviteData, setInviteData] = useState<InviteData | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    password: "",
    confirmPassword: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isValidating, setIsValidating] = useState(true);

  useEffect(() => {
    const inviteToken = searchParams.get('invite');
    
    if (!inviteToken) {
      toast({
        title: "Link Inválido",
        description: "Link de convite não encontrado ou inválido",
        variant: "destructive"
      });
      navigate('/');
      return;
    }

    // Validar token de convite
    const invite = validateInviteToken(inviteToken);
    
    if (!invite) {
      toast({
        title: "Convite Inválido",
        description: "Este convite expirou ou não existe",
        variant: "destructive"
      });
      navigate('/');
      return;
    }

    setInviteData(invite);
    setIsValidating(false);
    
    console.log("Convite válido encontrado:", invite);
  }, [searchParams, navigate, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inviteData) return;
    
    // Validações
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Senhas Diferentes",
        description: "As senhas não coincidem",
        variant: "destructive"
      });
      return;
    }

    if (formData.password.length < 8) {
      toast({
        title: "Senha Muito Curta",
        description: "A senha deve ter pelo menos 8 caracteres",
        variant: "destructive"
      });
      return;
    }

    if (!formData.name.trim()) {
      toast({
        title: "Nome Obrigatório",
        description: "Por favor, informe seu nome completo",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      // Simular criação de conta (aqui integraria com sistema de auth real)
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Marcar convite como usado
      markInviteAsUsed(inviteData.token);

      // Salvar usuário na lista de membros da equipe
      const teamMembers = JSON.parse(localStorage.getItem('team_members') || '[]');
      const updatedMembers = teamMembers.map((member: any) => 
        member.email === inviteData.email 
          ? { 
              ...member, 
              name: formData.name,
              status: "Ativo", 
              lastLogin: new Date().toISOString()
            }
          : member
      );
      
      localStorage.setItem('team_members', JSON.stringify(updatedMembers));

      toast({
        title: "Conta Criada com Sucesso",
        description: `Bem-vindo à equipe ${inviteData.companyName}!`,
      });

      console.log("Usuário cadastrado:", {
        name: formData.name,
        email: inviteData.email,
        role: inviteData.role,
        company: inviteData.companyName
      });

      // Redirecionar para login (quando implementado)
      setTimeout(() => {
        navigate('/');
      }, 2000);

    } catch (error) {
      console.error("Erro ao criar conta:", error);
      toast({
        title: "Erro no Cadastro",
        description: "Falha ao criar conta. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isValidating) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardContent className="p-6">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Validando convite...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!inviteData) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mb-4">
            <UserPlus className="w-6 h-6 text-white" />
          </div>
          <CardTitle className="text-2xl">Criar Conta</CardTitle>
          <p className="text-gray-600">Complete seu cadastro para acessar o sistema</p>
        </CardHeader>
        
        <CardContent>
          {/* Informações do Convite */}
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-blue-900 mb-2">Detalhes do Convite</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center">
                <Mail className="w-4 h-4 text-blue-600 mr-2" />
                <span className="text-gray-700">{inviteData.email}</span>
              </div>
              <div className="flex items-center">
                <Building className="w-4 h-4 text-blue-600 mr-2" />
                <span className="text-gray-700">{inviteData.companyName}</span>
              </div>
              <div className="flex items-center">
                <Shield className="w-4 h-4 text-blue-600 mr-2" />
                <span className="text-gray-700">{inviteData.role}</span>
              </div>
            </div>
          </div>

          {/* Formulário de Cadastro */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome Completo *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Seu nome completo"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                value={inviteData.email}
                disabled
                className="bg-gray-100"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Senha *</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                placeholder="Mínimo 8 caracteres"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar Senha *</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                placeholder="Confirme sua senha"
                required
              />
            </div>

            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600"
              disabled={isLoading}
            >
              {isLoading ? "Criando Conta..." : "Criar Conta"}
            </Button>
          </form>

          <div className="mt-6 text-center text-xs text-gray-500">
            <p>Ao criar sua conta, você concorda com nossos</p>
            <p>Termos de Uso e Política de Privacidade</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
