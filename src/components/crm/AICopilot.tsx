
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Bot, 
  Send,
  Sparkles,
  FileText,
  Mail,
  BarChart3,
  Target,
  Lightbulb,
  Copy
} from "lucide-react";

const mockSuggestions = [
  {
    id: 1,
    type: "lead_scoring",
    title: "Lead com Alto Potencial",
    description: "Maria Santos da Empresa XYZ possui score de 95/100. Recomendo contato imediato.",
    action: "Entrar em contato",
    priority: "Alta"
  },
  {
    id: 2,
    type: "churn_risk",
    title: "Cliente em Risco",
    description: "StartupTech não teve interações nos últimos 30 dias. Risco de churn: 78%",
    action: "Agendar reunião",
    priority: "Crítica"
  },
  {
    id: 3,
    type: "opportunity",
    title: "Oportunidade de Upsell",
    description: "ABC Corp está usando apenas 40% dos recursos contratados. Potencial para upgrade.",
    action: "Propor upgrade",
    priority: "Média"
  }
];

const quickPrompts = [
  "Gere uma proposta para cliente de software",
  "Crie um e-mail de follow-up para lead frio",
  "Analise performance de vendas do mês",
  "Sugira ações para melhorar conversão",
  "Redija contrato padrão de serviços",
  "Crie campanha de reativação de clientes"
];

export const AICopilot = () => {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState("");
  const [suggestions] = useState(mockSuggestions);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    // Simular geração de conteúdo
    setTimeout(() => {
      setGeneratedContent(`Conteúdo gerado baseado em: "${prompt}"\n\nEste é um exemplo de como a IA pode ajudar a gerar conteúdo personalizado para suas necessidades de vendas e marketing.`);
      setIsGenerating(false);
    }, 2000);
  };

  const handleQuickPrompt = (quickPrompt: string) => {
    setPrompt(quickPrompt);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Crítica": return "bg-red-100 text-red-800";
      case "Alta": return "bg-orange-100 text-orange-800";
      case "Média": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* AI Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Sugestões IA</p>
                <p className="text-2xl font-bold text-purple-600">3</p>
              </div>
              <Lightbulb className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Conteúdo Gerado</p>
                <p className="text-2xl font-bold text-blue-600">47</p>
              </div>
              <FileText className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Leads Qualificados</p>
                <p className="text-2xl font-bold text-green-600">23</p>
              </div>
              <Target className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Precisão IA</p>
                <p className="text-2xl font-bold text-orange-600">94%</p>
              </div>
              <BarChart3 className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* AI Copilot */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bot className="w-5 h-5 mr-2" />
              Copilot IA
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Prompts Rápidos:</h4>
              <div className="grid grid-cols-1 gap-2">
                {quickPrompts.map((quickPrompt, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    className="justify-start text-left h-auto p-2"
                    onClick={() => handleQuickPrompt(quickPrompt)}
                  >
                    <Sparkles className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span className="text-sm">{quickPrompt}</span>
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex space-x-2">
                <Input
                  placeholder="Digite seu prompt para a IA..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleGenerate()}
                />
                <Button
                  onClick={handleGenerate}
                  disabled={isGenerating || !prompt.trim()}
                  className="bg-gradient-to-r from-purple-600 to-blue-600"
                >
                  {isGenerating ? (
                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>

            {generatedContent && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium">Conteúdo Gerado:</h4>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyToClipboard(generatedContent)}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-sm text-gray-700 whitespace-pre-wrap">{generatedContent}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* AI Suggestions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Lightbulb className="w-5 h-5 mr-2" />
              Sugestões Inteligentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {suggestions.map((suggestion) => (
                <div key={suggestion.id} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-gray-900">{suggestion.title}</h4>
                    <Badge className={getPriorityColor(suggestion.priority)}>
                      {suggestion.priority}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{suggestion.description}</p>
                  <div className="flex space-x-2">
                    <Button size="sm" className="bg-gradient-to-r from-blue-600 to-purple-600">
                      {suggestion.action}
                    </Button>
                    <Button size="sm" variant="outline">
                      Ignorar
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6 text-center">
            <Target className="w-12 h-12 text-blue-500 mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Lead Scoring</h3>
            <p className="text-sm text-gray-600">Qualificação automática de leads com base em comportamento e perfil</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <BarChart3 className="w-12 h-12 text-green-500 mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Previsão de Vendas</h3>
            <p className="text-sm text-gray-600">Análise preditiva para forecasting de receita e metas</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <Mail className="w-12 h-12 text-purple-500 mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Gerador de Conteúdo</h3>
            <p className="text-sm text-gray-600">Criação automática de e-mails, propostas e relatórios</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
