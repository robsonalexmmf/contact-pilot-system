
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Download, 
  Calendar, 
  BarChart3, 
  TrendingUp,
  Users,
  Target,
  DollarSign
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

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
  return (
    <div className="space-y-6">
      {/* Report Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Relatórios e Analytics</h1>
          <p className="text-gray-600">Análise completa do desempenho de vendas</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Calendar className="w-4 h-4 mr-2" />
            Filtrar Período
          </Button>
          <Button className="bg-gradient-to-r from-blue-600 to-purple-600">
            <Download className="w-4 h-4 mr-2" />
            Exportar PDF
          </Button>
        </div>
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

      {/* Export Options */}
      <Card>
        <CardHeader>
          <CardTitle>Opções de Exportação</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="flex items-center justify-center p-6">
              <Download className="w-5 h-5 mr-2" />
              Relatório Completo (PDF)
            </Button>
            <Button variant="outline" className="flex items-center justify-center p-6">
              <Download className="w-5 h-5 mr-2" />
              Dados de Leads (CSV)
            </Button>
            <Button variant="outline" className="flex items-center justify-center p-6">
              <Download className="w-5 h-5 mr-2" />
              Performance de Vendas (Excel)
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
