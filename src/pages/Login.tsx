
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Info } from "lucide-react";
import { authenticateTestUser, TEST_USERS } from "@/utils/testUsers";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simular delay de autenticação
    setTimeout(() => {
      const user = authenticateTestUser(email, password);
      
      if (user) {
        toast({
          title: "Login realizado com sucesso!",
          description: `Bem-vindo, ${user.name} (${user.plan.toUpperCase()})`,
        });
        navigate("/app");
      } else {
        toast({
          title: "Erro no login",
          description: "Email ou senha incorretos",
          variant: "destructive"
        });
      }
      
      setIsLoading(false);
    }, 1000);
  };

  const handleTestLogin = (testUser: typeof TEST_USERS[0]) => {
    setEmail(testUser.email);
    setPassword(testUser.password);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="text-2xl font-bold text-gray-800">
            Salesin Pro
          </Link>
          <p className="text-gray-600 mt-2">Entre em sua conta</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Fazer Login</CardTitle>
            <CardDescription>
              Entre com suas credenciais para acessar o sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Usuários de Teste */}
            <div className="mb-6 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center mb-2">
                <Info className="w-4 h-4 text-blue-600 mr-2" />
                <span className="text-sm font-medium text-blue-900">Usuários de Teste</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {TEST_USERS.map((user) => (
                  <Button
                    key={user.id}
                    variant="outline"
                    size="sm"
                    onClick={() => handleTestLogin(user)}
                    className="text-xs"
                  >
                    {user.plan.toUpperCase()}
                  </Button>
                ))}
              </div>
              <p className="text-xs text-blue-700 mt-2">
                Clique em um plano para preencher automaticamente
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Sua senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Link to="/forgot-password" className="text-sm text-blue-600 hover:underline">
                  Esqueceu sua senha?
                </Link>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Entrando..." : "Entrar"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Não tem uma conta?{" "}
                <Link to="/signup" className="text-blue-600 hover:underline">
                  Criar conta
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-6">
          <Link to="/" className="text-sm text-gray-600 hover:underline">
            ← Voltar para a página inicial
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
