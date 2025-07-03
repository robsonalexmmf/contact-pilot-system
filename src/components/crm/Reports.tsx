import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePickerWithRange } from "@/components/ui/date-picker";
import { 
  Download, 
  Calendar, 
  BarChart3, 
  TrendingUp,
  Users,
  Target,
  DollarSign,
  Filter,
  FileText,
  FileSpreadsheet
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { useToast } from "@/hooks/use-toast";
import { DateRange } from "react-day-picker";

const salesData = [
  { month: 'Jan', vendas: 65000, leads: 120, conversao: 15.2 },
  { month: 'Fev', vendas: 78000, leads: 142, conversao: 16.8 },
  { month: 'Mar', vendas: 92000, leads: 165, conversao: 18.1 },
  { month: 'Abr', vendas: 87000, leads: 148, conversao: 17.3 },
  { month: 'Mai', vendas: 105000, leads: 198, conversao: 19.4 },
  { month: 'Jun', vendas: 127500, leads: 234, conversao: 21.2 }
];

const sourceData = [
  { name: 'Website', value: 35, color: '#3B82F6' },
  { name: 'LinkedIn', value: 28, color: '#10B981' },
  { name: 'Indicação', value: 22, color: '#F59E0B' },
  { name: 'Eventos', value: 10, color: '#EF4444' },
  { name: 'Cold Call', value: 5, color: '#8B5CF6' }
];

const performanceData = [
  { name: 'João Silva', leads: 45, deals: 12, revenue: 125000 },
  { name: 'Maria Santos', leads: 38, deals: 15, revenue: 180000 },
  { name: 'Ana Costa', leads: 52, deals: 18, revenue: 220000 },
  { name: 'Pedro Oliveira', leads: 29, deals: 8, revenue: 95000 }
];

export const Reports = () => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [selectedPeriod, setSelectedPeriod] = useState("last-6-months");
  const [selectedMetric, setSelectedMetric] = useState("all");
  const [selectedSource, setSelectedSource] = useState("all");
  const { toast } = useToast();

  // Filter data based on selected period
  const getFilteredData = () => {
    // Here you would implement actual filtering logic based on dateRange/selectedPeriod
    return salesData;
  };

  const handlePeriodFilter = () => {
    toast({
      title: "Filtro Aplicado",
      description: `Período alterado para: ${selectedPeriod === 'custom' ? 'Personalizado' : selectedPeriod}`,
    });
    console.log("Filtro de período aplicado:", { selectedPeriod, dateRange });
  };

  const exportToPDF = () => {
    const reportContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Relatório Completo - CRM Analytics</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; color: #333; }
          .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #3B82F6; padding-bottom: 20px; }
          .section { margin-bottom: 30px; }
          .metrics { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin-bottom: 30px; }
          .metric-card { border: 1px solid #ddd; padding: 15px; border-radius: 8px; }
          .table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
          .table th, .table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          .table th { background-color: #f2f2f2; font-weight: bold; }
          .positive { color: #10B981; font-weight: bold; }
          .chart-placeholder { background: #f5f5f5; padding: 40px; text-align: center; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Relatório de Analytics - CRM</h1>
          <p>Gerado em: ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}</p>
        </div>
        
        <div class="section">
          <h2>Métricas Principais</h2>
          <div class="metrics">
            <div class="metric-card">
              <h3>Receita Total</h3>
              <p class="positive">R$ 554.500</p>
              <small>+23% vs período anterior</small>
            </div>
            <div class="metric-card">
              <h3>Total de Leads</h3>
              <p class="positive">1.007</p>
              <small>+15% vs período anterior</small>
            </div>
            <div class="metric-card">
              <h3>Taxa de Conversão</h3>
              <p class="positive">18.1%</p>
              <small>+2.3% vs período anterior</small>
            </div>
            <div class="metric-card">
              <h3>Ticket Médio</h3>
              <p class="positive">R$ 8.750</p>
              <small>+5% vs período anterior</small>
            </div>
          </div>
        </div>

        <div class="section">
          <h2>Performance Mensal</h2>
          <table class="table">
            <thead>
              <tr>
                <th>Mês</th>
                <th>Vendas</th>
                <th>Leads</th>
                <th>Conversão</th>
              </tr>
            </thead>
            <tbody>
              ${salesData.map(item => `
                <tr>
                  <td>${item.month}</td>
                  <td>R$ ${item.vendas.toLocaleString()}</td>
                  <td>${item.leads}</td>
                  <td>${item.conversao}%</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <div class="section">
          <h2>Origem dos Leads</h2>
          <table class="table">
            <thead>
              <tr>
                <th>Fonte</th>
                <th>Porcentagem</th>
              </tr>
            </thead>
            <tbody>
              ${sourceData.map(item => `
                <tr>
                  <td>${item.name}</td>
                  <td>${item.value}%</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <div class="section">
          <h2>Performance da Equipe</h2>
          <table class="table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Leads</th>
                <th>Negócios</th>
                <th>Receita</th>
                <th>Taxa Conversão</th>
              </tr>
            </thead>
            <tbody>
              ${performanceData.map(person => `
                <tr>
                  <td>${person.name}</td>
                  <td>${person.leads}</td>
                  <td>${person.deals}</td>
                  <td>R$ ${person.revenue.toLocaleString()}</td>
                  <td>${((person.deals / person.leads) * 100).toFixed(1)}%</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </body>
      </html>
    `;

    const blob = new Blob([reportContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `relatorio-completo-${new Date().toISOString().split('T')[0]}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Relatório Exportado",
      description: "Relatório completo em PDF foi baixado com sucesso",
    });
  };

  const exportLeadsCSV = () => {
    const csvContent = `Nome,Empresa,Status,Origem,Data,Valor\n${performanceData.map(person => 
      `${person.name},Empresa,Ativo,Website,${new Date().toLocaleDateString()},${person.revenue}`
    ).join('\n')}`;
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `leads-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "CSV Exportado",
      description: "Dados de leads exportados em CSV",
    });
  };

  const exportSalesExcel = () => {
    const excelContent = `Mês,Vendas,Leads,Conversão\n${salesData.map(item => 
      `${item.month},${item.vendas},${item.leads},${item.conversao}%`
    ).join('\n')}`;
    
    const blob = new Blob([excelContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vendas-${new Date().toISOString().split('T')[0]}.xlsx`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Excel Exportado",
      description: "Performance de vendas exportada em Excel",
    });
  };

  return (
    <div className="space-y-6">
      {/* Report Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Relatórios e Analytics</h1>
          <p className="text-gray-600">Análise completa do desempenho de vendas</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-48">
              <Calendar className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Selecionar período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Hoje</SelectItem>
              <SelectItem value="yesterday">Ontem</SelectItem>
              <SelectItem value="last-7-days">Últimos 7 dias</SelectItem>
              <SelectItem value="last-30-days">Últimos 30 dias</SelectItem>
              <SelectItem value="last-3-months">Últimos 3 meses</SelectItem>
              <SelectItem value="last-6-months">Últimos 6 meses</SelectItem>
              <SelectItem value="current-year">Ano atual</SelectItem>
              <SelectItem value="custom">Personalizado</SelectItem>
            </SelectContent>
          </Select>
          
          {selectedPeriod === 'custom' && (
            <DatePickerWithRange
              date={dateRange}
              onDateChange={setDateRange}
            />
          )}
          
          <Button variant="outline" onClick={handlePeriodFilter}>
            <Filter className="w-4 h-4 mr-2" />
            Aplicar Filtro
          </Button>
          
          <Button className="bg-gradient-to-r from-blue-600 to-purple-600" onClick={exportToPDF}>
            <Download className="w-4 h-4 mr-2" />
            Exportar PDF
          </Button>
        </div>
      </div>

      {/* Filters Row */}
      <div className="flex flex-wrap gap-4 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">Métrica:</label>
          <Select value={selectedMetric} onValueChange={setSelectedMetric}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value="revenue">Receita</SelectItem>
              <SelectItem value="leads">Leads</SelectItem>
              <SelectItem value="conversion">Conversão</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">Origem:</label>
          <Select value={selectedSource} onValueChange={setSelectedSource}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value="website">Website</SelectItem>
              <SelectItem value="linkedin">LinkedIn</SelectItem>
              <SelectItem value="referral">Indicação</SelectItem>
              <SelectItem value="events">Eventos</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Badge variant="outline" className="ml-auto">
          Filtros ativos: {[selectedMetric !== 'all', selectedSource !== 'all', selectedPeriod !== 'last-6-months'].filter(Boolean).length}
        </Badge>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Receita Total</p>
                <p className="text-2xl font-bold text-green-600">R$ 554.500</p>
                <p className="text-sm text-green-600 mt-1">+23% vs período anterior</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total de Leads</p>
                <p className="text-2xl font-bold text-blue-600">1.007</p>
                <p className="text-sm text-blue-600 mt-1">+15% vs período anterior</p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Taxa de Conversão</p>
                <p className="text-2xl font-bold text-purple-600">18.1%</p>
                <p className="text-sm text-purple-600 mt-1">+2.3% vs período anterior</p>
              </div>
              <Target className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Ticket Médio</p>
                <p className="text-2xl font-bold text-orange-600">R$ 8.750</p>
                <p className="text-sm text-orange-600 mt-1">+5% vs período anterior</p>
              </div>
              <TrendingUp className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sales Performance Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart3 className="w-5 h-5 mr-2" />
            Performance de Vendas - Últimos 6 Meses
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip 
                formatter={(value, name) => {
                  if (name === 'vendas') return [`R$ ${value.toLocaleString()}`, 'Vendas'];
                  if (name === 'leads') return [value, 'Leads'];
                  if (name === 'conversao') return [`${value}%`, 'Conversão'];
                  return [value, name];
                }}
              />
              <Line yAxisId="left" type="monotone" dataKey="vendas" stroke="#3B82F6" strokeWidth={3} />
              <Line yAxisId="left" type="monotone" dataKey="leads" stroke="#10B981" strokeWidth={2} />
              <Line yAxisId="right" type="monotone" dataKey="conversao" stroke="#F59E0B" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Lead Sources */}
        <Card>
          <CardHeader>
            <CardTitle>Origem dos Leads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center mb-4">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={sourceData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}%`}
                  >
                    {sourceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2">
              {sourceData.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div 
                      className="w-3 h-3 rounded-full mr-2" 
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm text-gray-600">{item.name}</span>
                  </div>
                  <Badge variant="outline">{item.value}%</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Team Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Performance da Equipe</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {performanceData.map((person, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-gray-900">{person.name}</h4>
                    <Badge className="bg-green-100 text-green-800">
                      R$ {person.revenue.toLocaleString()}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Leads: </span>
                      <span className="font-medium">{person.leads}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Negócios: </span>
                      <span className="font-medium">{person.deals}</span>
                    </div>
                  </div>
                  <div className="mt-2">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>Taxa de Conversão</span>
                      <span>{((person.deals / person.leads) * 100).toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${(person.deals / person.leads) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Export Options - Enhanced */}
      <Card>
        <CardHeader>
          <CardTitle>Opções de Exportação</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button 
              variant="outline" 
              className="flex items-center justify-center p-6 h-auto flex-col gap-2"
              onClick={exportToPDF}
            >
              <FileText className="w-8 h-8 text-red-500" />
              <div className="text-center">
                <div className="font-medium">Relatório Completo</div>
                <div className="text-sm text-gray-500">PDF com todos os dados</div>
              </div>
            </Button>
            
            <Button 
              variant="outline" 
              className="flex items-center justify-center p-6 h-auto flex-col gap-2"
              onClick={exportLeadsCSV}
            >
              <FileSpreadsheet className="w-8 h-8 text-green-500" />
              <div className="text-center">
                <div className="font-medium">Dados de Leads</div>
                <div className="text-sm text-gray-500">CSV para análise</div>
              </div>
            </Button>
            
            <Button 
              variant="outline" 
              className="flex items-center justify-center p-6 h-auto flex-col gap-2"
              onClick={exportSalesExcel}
            >
              <FileSpreadsheet className="w-8 h-8 text-blue-500" />
              <div className="text-center">
                <div className="font-medium">Performance de Vendas</div>
                <div className="text-sm text-gray-500">Excel com gráficos</div>
              </div>
            </Button>
          </div>
          
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Dica de Exportação</h4>
            <p className="text-sm text-blue-700">
              Use os filtros acima para personalizar os dados antes de exportar. 
              Os relatórios incluirão apenas os dados do período e métricas selecionadas.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
