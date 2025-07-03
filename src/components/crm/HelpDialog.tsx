
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  HelpCircle, 
  MessageCircle, 
  Book, 
  Video, 
  Mail, 
  Phone,
  ExternalLink
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface HelpDialogProps {
  open: boolean;
  onClose: () => void;
}

export const HelpDialog = ({ open, onClose }: HelpDialogProps) => {
  const [supportForm, setSupportForm] = useState({
    subject: "",
    message: "",
    priority: "medium"
  });
  const { toast } = useToast();

  const faqItems = [
    {
      question: "Como adicionar um novo lead?",
      answer: "Clique no botão 'Novo Lead' no canto superior direito da tela e preencha as informações necessárias."
    },
    {
      question: "Como configurar automações de email?",
      answer: "Vá para o módulo 'Automação' no menu lateral e clique em 'Nova Automação' para criar fluxos automatizados."
    },
    {
      question: "Como gerar relatórios?",
      answer: "Acesse o módulo 'Relatórios' e escolha o tipo de relatório que deseja gerar. Você pode personalizar os filtros e período."
    },
    {
      question: "Como integrar com WhatsApp?",
      answer: "As integrações estão disponíveis no módulo 'Integrações'. Selecione WhatsApp e siga as instruções de configuração."
    }
  ];

  const resources = [
    {
      title: "Documentação Completa",
      description: "Guias detalhados sobre todas as funcionalidades",
      icon: Book,
      url: "#"
    },
    {
      title: "Tutoriais em Vídeo",
      description: "Aprenda com vídeos passo a passo",
      icon: Video,
      url: "#"
    },
    {
      title: "Comunidade",
      description: "Tire dúvidas com outros usuários",
      icon: MessageCircle,
      url: "#"
    }
  ];

  const handleSubmitSupport = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Enviando ticket de suporte:", supportForm);
    toast({
      title: "Ticket enviado!",
      description: "Nossa equipe responderá em até 24 horas.",
    });
    setSupportForm({ subject: "", message: "", priority: "medium" });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] sm:max-h-[800px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5" />
            Ajuda & Suporte
          </DialogTitle>
          <DialogDescription>
            Encontre respostas para suas dúvidas ou entre em contato conosco.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="faq" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="faq">FAQ</TabsTrigger>
            <TabsTrigger value="resources">Recursos</TabsTrigger>
            <TabsTrigger value="contact">Contato</TabsTrigger>
            <TabsTrigger value="support">Suporte</TabsTrigger>
          </TabsList>

          <TabsContent value="faq" className="space-y-4">
            <div className="space-y-4">
              <h4 className="font-medium">Perguntas Frequentes</h4>
              {faqItems.map((item, index) => (
                <Card key={index}>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">{item.question}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600">{item.answer}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="resources" className="space-y-4">
            <div className="space-y-4">
              <h4 className="font-medium">Recursos de Aprendizado</h4>
              <div className="grid gap-4">
                {resources.map((resource, index) => (
                  <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <resource.icon className="w-6 h-6 text-blue-600 mt-1" />
                        <div className="flex-1">
                          <h5 className="font-medium flex items-center gap-2">
                            {resource.title}
                            <ExternalLink className="w-4 h-4 text-gray-400" />
                          </h5>
                          <p className="text-sm text-gray-600 mt-1">{resource.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="contact" className="space-y-4">
            <div className="space-y-4">
              <h4 className="font-medium">Entre em Contato</h4>
              
              <div className="grid gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-blue-600" />
                      <div>
                        <div className="font-medium">Email</div>
                        <div className="text-sm text-gray-600">suporte@salesinpro.com</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-green-600" />
                      <div>
                        <div className="font-medium">Telefone</div>
                        <div className="text-sm text-gray-600">(11) 4002-8922</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <MessageCircle className="w-5 h-5 text-purple-600" />
                      <div>
                        <div className="font-medium">Chat Online</div>
                        <div className="text-sm text-gray-600">
                          Segunda a Sexta, 9h às 18h
                          <Badge className="ml-2 bg-green-100 text-green-800">Online</Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="text-sm text-gray-500 bg-gray-50 p-3 rounded">
                <strong>Horário de Atendimento:</strong><br />
                Segunda a Sexta: 9h às 18h<br />
                Sábado: 9h às 14h<br />
                Domingo: Fechado
              </div>
            </div>
          </TabsContent>

          <TabsContent value="support" className="space-y-4">
            <form onSubmit={handleSubmitSupport} className="space-y-4">
              <h4 className="font-medium">Abrir Ticket de Suporte</h4>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Assunto</label>
                <Input
                  value={supportForm.subject}
                  onChange={(e) => setSupportForm(prev => ({...prev, subject: e.target.value}))}
                  placeholder="Descreva brevemente sua dúvida"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Prioridade</label>
                <select 
                  className="w-full p-2 border rounded-md"
                  value={supportForm.priority}
                  onChange={(e) => setSupportForm(prev => ({...prev, priority: e.target.value}))}
                >
                  <option value="low">Baixa</option>
                  <option value="medium">Média</option>
                  <option value="high">Alta</option>
                  <option value="urgent">Urgente</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Descrição</label>
                <Textarea
                  value={supportForm.message}
                  onChange={(e) => setSupportForm(prev => ({...prev, message: e.target.value}))}
                  placeholder="Descreva sua dúvida ou problema detalhadamente..."
                  rows={4}
                  required
                />
              </div>

              <Button type="submit" className="w-full">
                Enviar Ticket
              </Button>
            </form>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end">
          <Button variant="outline" onClick={onClose}>
            Fechar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
