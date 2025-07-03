
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface EditTransactionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: any;
  onUpdateTransaction: (updatedTransaction: any) => void;
}

export const EditTransactionDialog = ({ isOpen, onClose, transaction, onUpdateTransaction }: EditTransactionDialogProps) => {
  const [formData, setFormData] = useState({
    type: "Receita",
    description: "",
    amount: "",
    category: "",
    client: "",
    status: "Confirmado",
    notes: ""
  });
  const { toast } = useToast();

  useEffect(() => {
    if (transaction) {
      setFormData({
        type: transaction.type,
        description: transaction.description,
        amount: Math.abs(transaction.amount).toString(),
        category: transaction.category,
        client: transaction.client || "",
        status: transaction.status,
        notes: transaction.notes || ""
      });
    }
  }, [transaction]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.description || !formData.amount || !formData.category) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive"
      });
      return;
    }

    const amount = parseFloat(formData.amount);
    if (isNaN(amount) || amount === 0) {
      toast({
        title: "Erro",
        description: "Insira um valor válido",
        variant: "destructive"
      });
      return;
    }

    const updatedTransaction = {
      ...transaction,
      type: formData.type,
      description: formData.description,
      amount: formData.type === "Despesa" ? -Math.abs(amount) : Math.abs(amount),
      category: formData.category,
      client: formData.client,
      status: formData.status,
      notes: formData.notes,
      updatedAt: new Date().toISOString()
    };

    console.log("Atualizando transação:", updatedTransaction);
    onUpdateTransaction(updatedTransaction);

    toast({
      title: "Sucesso",
      description: `Transação "${formData.description}" atualizada com sucesso`,
    });

    onClose();
  };

  const handleDelete = () => {
    if (window.confirm("Tem certeza que deseja excluir esta transação?")) {
      onUpdateTransaction({ ...transaction, deleted: true });
      toast({
        title: "Sucesso",
        description: "Transação excluída com sucesso",
      });
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Transação</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="type">Tipo *</Label>
            <Select value={formData.type} onValueChange={(value) => handleInputChange("type", value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Receita">Receita</SelectItem>
                <SelectItem value="Despesa">Despesa</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="description">Descrição *</Label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Descrição da transação"
              required
            />
          </div>

          <div>
            <Label htmlFor="amount">Valor (R$) *</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0"
              value={formData.amount}
              onChange={(e) => handleInputChange("amount", e.target.value)}
              placeholder="0,00"
              required
            />
          </div>

          <div>
            <Label htmlFor="category">Categoria *</Label>
            <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Vendas">Vendas</SelectItem>
                <SelectItem value="Serviços">Serviços</SelectItem>
                <SelectItem value="Consultoria">Consultoria</SelectItem>
                <SelectItem value="Operacional">Operacional</SelectItem>
                <SelectItem value="Marketing">Marketing</SelectItem>
                <SelectItem value="Tecnologia">Tecnologia</SelectItem>
                <SelectItem value="Administrativo">Administrativo</SelectItem>
                <SelectItem value="Outros">Outros</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="client">Cliente</Label>
            <Input
              id="client"
              value={formData.client}
              onChange={(e) => handleInputChange("client", e.target.value)}
              placeholder="Nome do cliente (opcional)"
            />
          </div>

          <div>
            <Label htmlFor="status">Status</Label>
            <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Confirmado">Confirmado</SelectItem>
                <SelectItem value="Pendente">Pendente</SelectItem>
                <SelectItem value="Pago">Pago</SelectItem>
                <SelectItem value="Atrasado">Atrasado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="notes">Observações</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleInputChange("notes", e.target.value)}
              placeholder="Observações adicionais..."
              rows={3}
            />
          </div>

          <div className="flex space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancelar
            </Button>
            <Button type="button" variant="destructive" onClick={handleDelete} className="flex-1">
              Excluir
            </Button>
            <Button type="submit" className="flex-1">
              Salvar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
