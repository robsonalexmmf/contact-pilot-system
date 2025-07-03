
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface TransactionDetailsDialogProps {
  transaction: any;
  isOpen: boolean;
  onClose: () => void;
}

export const TransactionDetailsDialog = ({ transaction, isOpen, onClose }: TransactionDetailsDialogProps) => {
  const { toast } = useToast();

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copiado!",
      description: `${label} copiado para a área de transferência`,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'paid': return 'Pago';
      case 'pending': return 'Pendente';
      case 'failed': return 'Falhou';
      default: return 'Desconhecido';
    }
  };

  if (!transaction) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Detalhes da Transação</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
            >
              <X className="w-4 h-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Transaction ID */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">ID da Transação</p>
                  <p className="font-mono text-sm">{transaction.id}</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(transaction.id, "ID da Transação")}
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Customer Information */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-3">Informações do Cliente</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Nome</p>
                  <p className="font-medium">{transaction.user_name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <div className="flex items-center space-x-2">
                    <p className="font-medium">{transaction.user_email}</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(transaction.user_email, "Email")}
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600">ID do Usuário</p>
                  <div className="flex items-center space-x-2">
                    <p className="font-mono text-sm">{transaction.user_id}</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(transaction.user_id, "ID do Usuário")}
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Plano</p>
                  <Badge variant="outline">{transaction.plan}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Transaction Details */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-3">Detalhes da Transação</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Valor</p>
                  <p className="text-lg font-bold text-green-600">
                    R$ {transaction.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <Badge className={getStatusColor(transaction.status)}>
                    {getStatusText(transaction.status)}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Método de Pagamento</p>
                  <p className="font-medium">{transaction.method}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Data</p>
                  <p className="font-medium">{transaction.date}</p>
                </div>
              </div>
              
              <div className="mt-4">
                <p className="text-sm text-gray-600">Descrição</p>
                <p className="font-medium">{transaction.description}</p>
              </div>
            </CardContent>
          </Card>

          {/* Additional Information */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-3">Informações Adicionais</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Criado em:</span>
                  <span className="text-sm font-medium">{new Date().toLocaleString('pt-BR')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Última atualização:</span>
                  <span className="text-sm font-medium">{new Date().toLocaleString('pt-BR')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Origem:</span>
                  <span className="text-sm font-medium">Sistema CRM</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>
              Fechar
            </Button>
            <Button 
              onClick={() => {
                const transactionData = JSON.stringify(transaction, null, 2);
                copyToClipboard(transactionData, "Dados da Transação");
              }}
            >
              Copiar Dados
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
