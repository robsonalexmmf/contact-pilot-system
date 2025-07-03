
import { Button } from "@/components/ui/button";
import { ArrowRight, Users, Target, TrendingUp, Shield } from "lucide-react";
import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="text-2xl font-bold text-blue-600">CRM Pro</div>
          <div className="space-x-4">
            <Link to="/auth">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link to="/auth">
              <Button>Começar Grátis</Button>
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl font-bold text-gray-800 mb-6">
          Gerencie seus clientes com
          <span className="text-blue-600"> inteligência</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Uma plataforma completa de CRM para aumentar suas vendas, automatizar processos e crescer seu negócio.
        </p>
        <Link to="/auth">
          <Button size="lg" className="text-lg px-8 py-3">
            Começar Gratuitamente <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </Link>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center p-6 bg-white rounded-lg shadow-sm">
            <Users className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Gestão de Leads</h3>
            <p className="text-gray-600">Organize e acompanhe todos os seus potenciais clientes em um só lugar.</p>
          </div>
          
          <div className="text-center p-6 bg-white rounded-lg shadow-sm">
            <Target className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Pipeline de Vendas</h3>
            <p className="text-gray-600">Visualize e gerencie todo o processo de vendas com facilidade.</p>
          </div>
          
          <div className="text-center p-6 bg-white rounded-lg shadow-sm">
            <TrendingUp className="h-12 w-12 text-purple-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Relatórios Avançados</h3>
            <p className="text-gray-600">Análises detalhadas para tomar decisões baseadas em dados.</p>
          </div>
          
          <div className="text-center p-6 bg-white rounded-lg shadow-sm">
            <Shield className="h-12 w-12 text-red-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Segurança Total</h3>
            <p className="text-gray-600">Seus dados protegidos com a mais alta tecnologia de segurança.</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Pronto para crescer seu negócio?</h2>
          <p className="text-xl mb-8">Junte-se a milhares de empresas que já usam nosso CRM.</p>
          <Link to="/auth">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-3">
              Começar Agora <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
