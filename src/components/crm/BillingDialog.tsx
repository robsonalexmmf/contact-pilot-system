
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CreditCard, Download, Calendar } from "lucide-react";

interface BillingDialogProps {
  open: boolean;
  onClose: () => void;
}

export const BillingDialog = ({ open, onClose }: BillingDialogProps) => {
  const [currentPlan] = useState({
    name: "Plano Professional",
    price: "R$ 299,00",
    period: "mensal",
    features: [
      "Leads ilimitados",
      "Pipeline completo",
      "Automações avançadas",
      "Relatórios detalhados",
      "Suporte prioritário"
    ],
    nextBilling: "2024-02-15"
  });

  const [invoices] = useState([
    { id: 1, date: "2024-01-15", amount: "R$ 299,00", status: "Pago", downloadUrl: "#" },
    { id: 2, date: "2023-12-15", amount: "R$ 299,00", status: "Pago", downloadUrl: "#" },
    { id: 3, date: "2023-11-15", amount: "R$ 299,00", status: "Pago", downloadUrl: "#" },
  ]);

  const handleUpgradePlan = () => {
    console.log("Upgrade de plano solicitado");
    alert("Redirecionando para página de upgrade...");
  };

  const handleDownloadInvoice = (invoiceId: number) => {
    console.log(`Download da fatura ${invoiceId}`);
    alert(`Baixando fatura ${invoiceId}...`);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] sm:max-h-[800px]">
        <DialogHeader>
          <DialogTitle>Faturamento & Assinatura</DialogTitle>
          <DialogDescription>
            Gerencie sua assinatura, faturas e métodos de pagamento.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Plano Atual */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {currentPlan.name}
                    <Badge variant="default">Ativo</Badge>
                  </CardTitle>
                  <CardDescription>
                    Próxima cobrança em {new Date(currentPlan.nextBilling).toLocaleDateString('pt-BR')}
                  </CardDescription>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">{currentPlan.price}</div>
                  <div className="text-sm text-gray-500">por {currentPlan.period}</div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <h4 className="font-medium">Recursos inclusos:</h4>
                <ul className="list-disc list-inside text-sm space-y-1 text-gray-600">
                  {currentPlan.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>
              <div className="flex gap-2 mt-4">
                <Button onClick={handleUpgradePlan}>
                  Fazer Upgrade
                </Button>
                <Button variant="outline">
                  Alterar Plano
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Método de Pagamento */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Método de Pagamento
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-6 bg-blue-600 rounded"></div>
                  <div>
                    <div className="font-medium">•••• •••• •••• 1234</div>
                    <div className="text-sm text-gray-500">Expira em 12/2025</div>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Alterar
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Histórico de Faturas */}
          <Card>
            <CardHeader>
              <CardTitle>Histórico de Faturas</CardTitle>
              <CardDescription>
                Suas últimas faturas e recibos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {invoices.map((invoice) => (
                  <div key={invoice.id}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <div>
                          <div className="font-medium">
                            {new Date(invoice.date).toLocaleDateString('pt-BR')}
                          </div>
                          <div className="text-sm text-gray-500">{invoice.amount}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={invoice.status === 'Pago' ? 'default' : 'secondary'}>
                          {invoice.status}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDownloadInvoice(invoice.id)}
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    {invoice.id !== invoices[invoices.length - 1].id && <Separator className="mt-3" />}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Uso e Limites */}
          <Card>
            <CardHeader>
              <CardTitle>Uso Atual</CardTitle>
              <CardDescription>
                Seu consumo no período atual
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Leads cadastrados</span>
                    <span>847 / Ilimitado</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '20%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Emails enviados</span>
                    <span>2.543 / 5.000</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '51%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Automações ativas</span>
                    <span>12 / 50</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-purple-600 h-2 rounded-full" style={{ width: '24%' }}></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end">
          <Button variant="outline" onClick={onClose}>
            Fechar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
