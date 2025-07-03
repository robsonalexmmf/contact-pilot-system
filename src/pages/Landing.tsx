
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, X, Star, Users, Calendar, Zap } from "lucide-react";
import { Link } from "react-router-dom";

const Landing = () => {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const plans = [
    {
      id: "free",
      name: "Free",
      price: "R$ 0",
      period: "por 2 dias",
      description: "Teste por 2 dias gratuitamente",
      features: [
        "Dashboard básico",
        "Até 10 leads",
        "1 pipeline",
        "Relatórios básicos",
        "Suporte por email"
      ],
      limitations: [
        "Apenas 2 dias de uso",
        "Funcionalidades limitadas",
        "Sem automações",
        "Sem integrações"
      ],
      color: "border-gray-200",
      badge: null,
      cta: "Começar Grátis"
    },
    {
      id: "pro",
      name: "Pro",
      price: "R$ 99",
      period: "por mês (30 dias)",
      description: "Para pequenas empresas em crescimento",
      features: [
        "Dashboard completo",
        "Até 1.000 leads",
        "5 pipelines",
        "Relatórios avançados",
        "Automações básicas",
        "Integrações limitadas",
        "Suporte prioritário"
      ],
      limitations: [
        "Uso limitado a 30 dias por pagamento",
        "Algumas funcionalidades restritas",
        "Limite de automações"
      ],
      color: "border-blue-500",
      badge: "Mais Popular",
      cta: "Escolher Pro"
    },
    {
      id: "premium",
      name: "Premium",
      price: "R$ 199",
      period: "por mês",
      description: "Para empresas que querem o máximo",
      features: [
        "Todas as funcionalidades",
        "Leads ilimitados",
        "Pipelines ilimitados",
        "Relatórios personalizados",
        "Automações avançadas",
        "Todas as integrações",
        "Suporte 24/7",
        "Treinamento personalizado",
        "API completa"
      ],
      limitations: [],
      color: "border-purple-500",
      badge: "Recomendado",
      cta: "Escolher Premium"
    }
  ];

  const features = [
    {
      icon: <Users className="w-6 h-6" />,
      title: "Gestão de Leads",
      description: "Organize e acompanhe seus leads de forma eficiente"
    },
    {
      icon: <Calendar className="w-6 h-6" />,
      title: "Pipeline de Vendas",
      description: "Visualize e gerencie seu funil de vendas"
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Automações",
      description: "Automatize tarefas repetitivas e economize tempo"
    },
    {
      icon: <Star className="w-6 h-6" />,
      title: "Relatórios",
      description: "Analise performance com relatórios detalhados"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <header className="container mx-auto px-6 py-4">
        <nav className="flex justify-between items-center">
          <div className="text-2xl font-bold text-gray-800">Salesin Pro</div>
          <div className="space-x-4">
            <Link to="/login">
              <Button variant="ghost">Entrar</Button>
            </Link>
            <Link to="/signup">
              <Button>Criar Conta</Button>
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20 text-center">
        <h1 className="text-5xl font-bold text-gray-800 mb-6">
          O CRM que <span className="text-blue-600">revoluciona</span> suas vendas
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Gerencie leads, automatize processos e aumente suas vendas com a plataforma 
          mais completa do mercado brasileiro.
        </p>
        <div className="flex justify-center gap-4">
          <Button size="lg" className="px-8 py-3">
            Começar Teste Grátis
          </Button>
          <Button variant="outline" size="lg" className="px-8 py-3">
            Ver Demo
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
          Tudo que você precisa para vender mais
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="text-center">
              <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section className="container mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Escolha o plano ideal para seu negócio
          </h2>
          <p className="text-xl text-gray-600">
            Comece grátis e escale conforme cresce
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <Card key={plan.id} className={`relative ${plan.color} ${selectedPlan === plan.id ? 'ring-2 ring-blue-500' : ''}`}>
              {plan.badge && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-600">
                  {plan.badge}
                </Badge>
              )}
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <div className="text-3xl font-bold text-gray-800">
                  {plan.price}
                  <span className="text-base font-normal text-gray-600">/{plan.period}</span>
                </div>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-green-600 mb-2">✓ Incluído:</h4>
                  <ul className="space-y-2">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-sm">
                        <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                {plan.limitations.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-red-600 mb-2">⚠ Limitações:</h4>
                    <ul className="space-y-2">
                      {plan.limitations.map((limitation, index) => (
                        <li key={index} className="flex items-center text-sm">
                          <X className="w-4 h-4 text-red-500 mr-2 flex-shrink-0" />
                          {limitation}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <Button 
                  className="w-full mt-6" 
                  variant={plan.id === "pro" ? "default" : "outline"}
                  onClick={() => setSelectedPlan(plan.id)}
                >
                  {plan.cta}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 text-white py-16">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Pronto para revolucionar suas vendas?
          </h2>
          <p className="text-xl mb-8">
            Junte-se a milhares de empresas que já transformaram seus resultados
          </p>
          <Button size="lg" variant="secondary" className="px-8 py-3">
            Começar Agora - Grátis por 2 dias
          </Button>
          <p className="text-sm mt-4 opacity-80">
            Sem cartão de crédito • Cancelamento gratuito
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Salesin Pro</h3>
              <p className="text-gray-400">
                O CRM mais completo para impulsionar suas vendas.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Produto</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Funcionalidades</li>
                <li>Preços</li>
                <li>Integrações</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Suporte</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Central de Ajuda</li>
                <li>Contato</li>
                <li>Treinamentos</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Empresa</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Sobre nós</li>
                <li>Blog</li>
                <li>Carreiras</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Salesin Pro. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
