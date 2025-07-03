
import { Button } from "@/components/ui/button";
import { ArrowRight, Users, Target, TrendingUp, Shield, Check, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import { Link } from "react-router-dom";
import { SubscriptionButton } from "@/components/mercadopago/SubscriptionButton";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-gray-200 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center justify-between">
            <div className="text-2xl font-bold text-blue-600">Salesin Pro</div>
            <div className="space-x-4">
              <Link to="/auth">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link to="/auth">
                <Button>Começar Grátis</Button>
              </Link>
            </div>
          </nav>
        </div>
      </header>

      {/* Hero Section - Added top padding for fixed header */}
      <section className="container mx-auto px-4 py-20 pt-32 text-center">
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

      {/* Pricing Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Escolha o plano ideal para você</h2>
          <p className="text-xl text-gray-600">Comece grátis e evolua conforme seu negócio cresce</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Plano Free */}
          <div className="bg-white rounded-lg shadow-lg p-8 border-2 border-gray-200">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Free</h3>
              <div className="text-4xl font-bold text-blue-600 mb-2">R$ 0</div>
              <p className="text-gray-600">Para começar</p>
            </div>
            
            <ul className="space-y-4 mb-8">
              <li className="flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-3" />
                <span>Até 10 leads</span>
              </li>
              <li className="flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-3" />
                <span>1 pipeline de vendas</span>
              </li>
              <li className="flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-3" />
                <span>1 usuário</span>
              </li>
              <li className="flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-3" />
                <span>2 dias de teste</span>
              </li>
              <li className="flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-3" />
                <span>Suporte básico</span>
              </li>
            </ul>
            
            <Link to="/auth" className="w-full">
              <Button className="w-full">Começar Grátis</Button>
            </Link>
          </div>

          {/* Plano Pro */}
          <div className="bg-white rounded-lg shadow-lg p-8 border-2 border-blue-500 relative">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <span className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-medium">
                Mais Popular
              </span>
            </div>
            
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Pro</h3>
              <div className="text-4xl font-bold text-blue-600 mb-2">R$ 97</div>
              <p className="text-gray-600">por mês</p>
            </div>
            
            <ul className="space-y-4 mb-8">
              <li className="flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-3" />
                <span>Até 1.000 leads</span>
              </li>
              <li className="flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-3" />
                <span>5 pipelines de vendas</span>
              </li>
              <li className="flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-3" />
                <span>Até 5 usuários</span>
              </li>
              <li className="flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-3" />
                <span>10 automações</span>
              </li>
              <li className="flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-3" />
                <span>5 integrações</span>
              </li>
              <li className="flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-3" />
                <span>Relatórios avançados</span>
              </li>
              <li className="flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-3" />
                <span>Suporte prioritário</span>
              </li>
            </ul>
            
            <SubscriptionButton planType="pro" className="w-full bg-blue-600 hover:bg-blue-700">
              Assinar Pro
            </SubscriptionButton>
          </div>

          {/* Plano Premium */}
          <div className="bg-white rounded-lg shadow-lg p-8 border-2 border-purple-500">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Premium</h3>
              <div className="text-4xl font-bold text-purple-600 mb-2">R$ 197</div>
              <p className="text-gray-600">por mês</p>
            </div>
            
            <ul className="space-y-4 mb-8">
              <li className="flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-3" />
                <span>Leads ilimitados</span>
              </li>
              <li className="flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-3" />
                <span>Pipelines ilimitados</span>
              </li>
              <li className="flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-3" />
                <span>Usuários ilimitados</span>
              </li>
              <li className="flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-3" />
                <span>Automações ilimitadas</span>
              </li>
              <li className="flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-3" />
                <span>Integrações ilimitadas</span>
              </li>
              <li className="flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-3" />
                <span>Acesso à API</span>
              </li>
              <li className="flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-3" />
                <span>Suporte 24/7</span>
              </li>
            </ul>
            
            <SubscriptionButton planType="premium" className="w-full bg-purple-600 hover:bg-purple-700">
              Assinar Premium
            </SubscriptionButton>
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

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div>
              <div className="text-2xl font-bold text-blue-400 mb-4">Salesin Pro</div>
              <p className="text-gray-300 mb-4">
                A plataforma completa de CRM que transforma a gestão de relacionamento com clientes.
              </p>
              <div className="flex space-x-4">
                <Facebook className="h-6 w-6 text-gray-400 hover:text-blue-400 cursor-pointer transition-colors" />
                <Twitter className="h-6 w-6 text-gray-400 hover:text-blue-400 cursor-pointer transition-colors" />
                <Instagram className="h-6 w-6 text-gray-400 hover:text-pink-400 cursor-pointer transition-colors" />
                <Linkedin className="h-6 w-6 text-gray-400 hover:text-blue-400 cursor-pointer transition-colors" />
              </div>
            </div>

            {/* Product */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Produto</h3>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#" className="hover:text-white transition-colors">Funcionalidades</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Preços</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Integrações</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Segurança</a></li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Suporte</h3>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#" className="hover:text-white transition-colors">Central de Ajuda</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Documentação</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Tutoriais</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Status do Sistema</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contato</a></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Contato</h3>
              <div className="space-y-3 text-gray-300">
                <div className="flex items-center">
                  <Mail className="h-5 w-5 mr-3" />
                  <span>contato@salesinpro.com</span>
                </div>
                <div className="flex items-center">
                  <Phone className="h-5 w-5 mr-3" />
                  <span>(11) 9999-8888</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 mr-3" />
                  <span>São Paulo, SP - Brasil</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Footer */}
          <div className="border-t border-gray-700 mt-12 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="text-gray-400 text-sm">
                © 2024 Salesin Pro. Todos os direitos reservados.
              </div>
              <div className="flex space-x-6 mt-4 md:mt-0 text-gray-400 text-sm">
                <a href="#" className="hover:text-white transition-colors">Termos de Uso</a>
                <a href="#" className="hover:text-white transition-colors">Política de Privacidade</a>
                <a href="#" className="hover:text-white transition-colors">Cookies</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
