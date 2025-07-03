
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Receipt } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface FinancialReportDialogProps {
  transactions: any[];
  trigger?: React.ReactNode;
}

export const FinancialReportDialog = ({ transactions, trigger }: FinancialReportDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [reportConfig, setReportConfig] = useState({
    period: "current-month",
    startDate: "",
    endDate: "",
    includeReceitas: true,
    includeDespesas: true,
    categories: [],
    format: "pdf",
    groupBy: "category"
  });
  const { toast } = useToast();

  const handleGenerateReport = () => {
    const filteredTransactions = transactions.filter(transaction => {
      // Filter by period
      const transactionDate = new Date(transaction.date);
      const now = new Date();
      
      switch (reportConfig.period) {
        case "current-month":
          return transactionDate.getMonth() === now.getMonth() && 
                 transactionDate.getFullYear() === now.getFullYear();
        case "last-month":
          const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1);
          return transactionDate.getMonth() === lastMonth.getMonth() && 
                 transactionDate.getFullYear() === lastMonth.getFullYear();
        case "current-year":
          return transactionDate.getFullYear() === now.getFullYear();
        case "custom":
          const start = reportConfig.startDate ? new Date(reportConfig.startDate) : new Date(0);
          const end = reportConfig.endDate ? new Date(reportConfig.endDate) : new Date();
          return transactionDate >= start && transactionDate <= end;
        default:
          return true;
      }
    }).filter(transaction => {
      // Filter by type
      if (!reportConfig.includeReceitas && transaction.type === "Receita") return false;
      if (!reportConfig.includeDespesas && transaction.type === "Despesa") return false;
      return true;
    });

    // Calculate totals
    const totalReceitas = filteredTransactions
      .filter(t => t.type === "Receita")
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalDespesas = Math.abs(filteredTransactions
      .filter(t => t.type === "Despesa")
      .reduce((sum, t) => sum + t.amount, 0));
    
    const lucroLiquido = totalReceitas - totalDespesas;

    // Group by category
    const byCategory = filteredTransactions.reduce((acc, transaction) => {
      const category = transaction.category;
      if (!acc[category]) {
        acc[category] = { receitas: 0, despesas: 0, total: 0 };
      }
      if (transaction.type === "Receita") {
        acc[category].receitas += transaction.amount;
      } else {
        acc[category].despesas += Math.abs(transaction.amount);
      }
      acc[category].total = acc[category].receitas - acc[category].despesas;
      return acc;
    }, {});

    // Generate report content
    const reportContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Relatório Financeiro</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .header { text-align: center; margin-bottom: 30px; }
          .summary { background: #f5f5f5; padding: 20px; margin-bottom: 30px; }
          .table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
          .table th, .table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          .table th { background-color: #f2f2f2; }
          .positive { color: green; }
          .negative { color: red; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Relatório Financeiro</h1>
          <p>Gerado em: ${new Date().toLocaleDateString('pt-BR')}</p>
        </div>
        
        <div class="summary">
          <h2>Resumo Financeiro</h2>
          <p><strong>Total de Receitas:</strong> <span class="positive">R$ ${totalReceitas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span></p>
          <p><strong>Total de Despesas:</strong> <span class="negative">R$ ${totalDespesas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span></p>
          <p><strong>Lucro Líquido:</strong> <span class="${lucroLiquido >= 0 ? 'positive' : 'negative'}">R$ ${lucroLiquido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span></p>
          <p><strong>Número de Transações:</strong> ${filteredTransactions.length}</p>
        </div>

        <h2>Por Categoria</h2>
        <table class="table">
          <thead>
            <tr>
              <th>Categoria</th>
              <th>Receitas</th>
              <th>Despesas</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            ${Object.entries(byCategory).map(([category, data]: [string, any]) => `
              <tr>
                <td>${category}</td>
                <td class="positive">R$ ${data.receitas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                <td class="negative">R$ ${data.despesas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                <td class="${data.total >= 0 ? 'positive' : 'negative'}">R$ ${data.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <h2>Transações Detalhadas</h2>
        <table class="table">
          <thead>
            <tr>
              <th>Data</th>
              <th>Descrição</th>
              <th>Categoria</th>
              <th>Cliente</th>
              <th>Tipo</th>
              <th>Valor</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${filteredTransactions.map(transaction => `
              <tr>
                <td>${new Date(transaction.date).toLocaleDateString('pt-BR')}</td>
                <td>${transaction.description}</td>
                <td>${transaction.category}</td>
                <td>${transaction.client || '-'}</td>
                <td>${transaction.type}</td>
                <td class="${transaction.amount >= 0 ? 'positive' : 'negative'}">R$ ${Math.abs(transaction.amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                <td>${transaction.status}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </body>
      </html>
    `;

    // Download report
    const blob = new Blob([reportContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `relatorio-financeiro-${new Date().toISOString().split('T')[0]}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Relatório Gerado",
      description: `Relatório com ${filteredTransactions.length} transações foi baixado com sucesso`,
    });

    console.log("Relatório gerado:", {
      totalTransactions: filteredTransactions.length,
      totalReceitas,
      totalDespesas,
      lucroLiquido,
      categories: Object.keys(byCategory)
    });

    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline">
            <Receipt className="w-4 h-4 mr-2" />
            Relatório
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Gerar Relatório Financeiro</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="period">Período</Label>
            <Select value={reportConfig.period} onValueChange={(value) => setReportConfig(prev => ({ ...prev, period: value }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="current-month">Mês Atual</SelectItem>
                <SelectItem value="last-month">Mês Anterior</SelectItem>
                <SelectItem value="current-year">Ano Atual</SelectItem>
                <SelectItem value="custom">Período Personalizado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {reportConfig.period === "custom" && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startDate">Data Início</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={reportConfig.startDate}
                  onChange={(e) => setReportConfig(prev => ({ ...prev, startDate: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="endDate">Data Fim</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={reportConfig.endDate}
                  onChange={(e) => setReportConfig(prev => ({ ...prev, endDate: e.target.value }))}
                />
              </div>
            </div>
          )}

          <div>
            <Label>Incluir</Label>
            <div className="space-y-2 mt-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="receitas"
                  checked={reportConfig.includeReceitas}
                  onCheckedChange={(checked) => setReportConfig(prev => ({ ...prev, includeReceitas: !!checked }))}
                />
                <Label htmlFor="receitas">Receitas</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="despesas"
                  checked={reportConfig.includeDespesas}
                  onCheckedChange={(checked) => setReportConfig(prev => ({ ...prev, includeDespesas: !!checked }))}
                />
                <Label htmlFor="despesas">Despesas</Label>
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="groupBy">Agrupar Por</Label>
            <Select value={reportConfig.groupBy} onValueChange={(value) => setReportConfig(prev => ({ ...prev, groupBy: value }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="category">Categoria</SelectItem>
                <SelectItem value="client">Cliente</SelectItem>
                <SelectItem value="status">Status</SelectItem>
                <SelectItem value="month">Mês</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)} className="flex-1">
              Cancelar
            </Button>
            <Button onClick={handleGenerateReport} className="flex-1">
              Gerar Relatório
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
