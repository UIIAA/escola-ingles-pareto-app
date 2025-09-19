import React, { useState } from 'react';
import AdminPageLayout from '@/components/AdminPageLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  CreditCard,
  Calendar,
  Download,
  Receipt,
  Target,
  Users
} from 'lucide-react';

interface Payment {
  id: string;
  user: string;
  email: string;
  amount: number;
  credits: number;
  method: 'credit_card' | 'pix' | 'bank_transfer';
  status: 'completed' | 'pending' | 'failed';
  date: string;
  transactionId: string;
}

const AdminFinance = () => {
  const [timeFilter, setTimeFilter] = useState('30d');

  // Dados mockados
  const mockPayments: Payment[] = [
    {
      id: '1',
      user: 'João Silva',
      email: 'joao@email.com',
      amount: 180.00,
      credits: 12,
      method: 'credit_card',
      status: 'completed',
      date: '2024-09-18',
      transactionId: 'TXN_001234'
    },
    {
      id: '2',
      user: 'Maria Santos',
      email: 'maria@email.com',
      amount: 280.00,
      credits: 20,
      method: 'pix',
      status: 'completed',
      date: '2024-09-17',
      transactionId: 'TXN_001235'
    },
    {
      id: '3',
      user: 'Pedro Costa',
      email: 'pedro@email.com',
      amount: 90.00,
      credits: 6,
      method: 'credit_card',
      status: 'pending',
      date: '2024-09-17',
      transactionId: 'TXN_001236'
    },
    {
      id: '4',
      user: 'Ana Oliveira',
      email: 'ana@email.com',
      amount: 360.00,
      credits: 24,
      method: 'bank_transfer',
      status: 'completed',
      date: '2024-09-16',
      transactionId: 'TXN_001237'
    },
    {
      id: '5',
      user: 'Carlos Lima',
      email: 'carlos@email.com',
      amount: 180.00,
      credits: 12,
      method: 'credit_card',
      status: 'failed',
      date: '2024-09-16',
      transactionId: 'TXN_001238'
    }
  ];

  // Dados financeiros para gráficos
  const monthlyRevenue = [
    { month: 'Mai', revenue: 12500, transactions: 45 },
    { month: 'Jun', revenue: 15800, transactions: 58 },
    { month: 'Jul', revenue: 18200, transactions: 67 },
    { month: 'Ago', revenue: 21300, transactions: 76 },
    { month: 'Set', revenue: 24700, transactions: 89 }
  ];

  // Estatísticas calculadas
  const stats = {
    totalRevenue: mockPayments.filter(p => p.status === 'completed').reduce((sum, p) => sum + p.amount, 0),
    totalCredits: mockPayments.filter(p => p.status === 'completed').reduce((sum, p) => sum + p.credits, 0),
    completedTransactions: mockPayments.filter(p => p.status === 'completed').length,
    pendingAmount: mockPayments.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0),
    averageTransaction: 0
  };

  stats.averageTransaction = stats.completedTransactions > 0 ? stats.totalRevenue / stats.completedTransactions : 0;

  const getMethodBadge = (method: string) => {
    const labels = {
      credit_card: 'Cartão',
      pix: 'PIX',
      bank_transfer: 'Transferência'
    };

    const variants = {
      credit_card: 'default',
      pix: 'secondary',
      bank_transfer: 'outline'
    } as const;

    return (
      <Badge variant={variants[method as keyof typeof variants]}>
        {labels[method as keyof typeof labels]}
      </Badge>
    );
  };

  const getStatusBadge = (status: string) => {
    const labels = {
      completed: 'Concluído',
      pending: 'Pendente',
      failed: 'Falhou'
    };

    const variants = {
      completed: 'default',
      pending: 'outline',
      failed: 'destructive'
    } as const;

    return (
      <Badge variant={variants[status as keyof typeof variants]}>
        {labels[status as keyof typeof labels]}
      </Badge>
    );
  };

  return (
    <AdminPageLayout
      title="Relatórios Financeiros"
      description="Acompanhe receitas, pagamentos e métricas financeiras"
    >
      {/* Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              R$ {stats.totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              +18% vs mês anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Créditos Vendidos</CardTitle>
            <CreditCard className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.totalCredits}</div>
            <p className="text-xs text-muted-foreground">
              {stats.completedTransactions} transações
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ticket Médio</CardTitle>
            <Target className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              R$ {stats.averageTransaction.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground">
              Por transação
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendente</CardTitle>
            <Receipt className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              R$ {stats.pendingAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground">
              Aguardando processamento
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="transactions">Transações</TabsTrigger>
            <TabsTrigger value="reports">Relatórios</TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-2">
            <Select value={timeFilter} onValueChange={setTimeFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Últimos 7 dias</SelectItem>
                <SelectItem value="30d">Últimos 30 dias</SelectItem>
                <SelectItem value="90d">Últimos 90 dias</SelectItem>
                <SelectItem value="1y">Último ano</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Exportar
            </Button>
          </div>
        </div>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Gráfico de Receita */}
            <Card>
              <CardHeader>
                <CardTitle>Evolução da Receita</CardTitle>
                <CardDescription>Receita mensal dos últimos 5 meses</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {monthlyRevenue.map((data, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium w-8">{data.month}</span>
                        <div className="flex-1">
                          <Progress
                            value={(data.revenue / 25000) * 100}
                            className="h-2 w-40"
                          />
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">
                          R$ {data.revenue.toLocaleString()}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {data.transactions} transações
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Métodos de Pagamento */}
            <Card>
              <CardHeader>
                <CardTitle>Métodos de Pagamento</CardTitle>
                <CardDescription>Distribuição por método</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4 text-blue-600" />
                      <span className="text-sm">Cartão de Crédito</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">60%</div>
                      <div className="text-xs text-muted-foreground">R$ 810</div>
                    </div>
                  </div>
                  <Progress value={60} className="h-2" />

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-green-600" />
                      <span className="text-sm">PIX</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">30%</div>
                      <div className="text-xs text-muted-foreground">R$ 280</div>
                    </div>
                  </div>
                  <Progress value={30} className="h-2" />

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Receipt className="h-4 w-4 text-purple-600" />
                      <span className="text-sm">Transferência</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">10%</div>
                      <div className="text-xs text-muted-foreground">R$ 360</div>
                    </div>
                  </div>
                  <Progress value={10} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="transactions">
          <Card>
            <CardHeader>
              <CardTitle>Histórico de Transações</CardTitle>
              <CardDescription>
                {mockPayments.length} transação(ões) encontrada(s)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Créditos</TableHead>
                    <TableHead>Método</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>ID Transação</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockPayments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{payment.user}</div>
                          <div className="text-sm text-muted-foreground">
                            {payment.email}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        R$ {payment.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{payment.credits} créditos</Badge>
                      </TableCell>
                      <TableCell>{getMethodBadge(payment.method)}</TableCell>
                      <TableCell>{getStatusBadge(payment.status)}</TableCell>
                      <TableCell>
                        <div className="flex items-center text-sm">
                          <Calendar className="mr-1 h-3 w-3 text-muted-foreground" />
                          {new Date(payment.date).toLocaleDateString('pt-BR')}
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-xs">
                        {payment.transactionId}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Resumo Mensal</CardTitle>
                <CardDescription>Métricas consolidadas</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Receita Bruta</span>
                  <span className="font-medium">R$ 1.090,00</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Taxas de Processamento</span>
                  <span className="font-medium text-red-600">- R$ 65,40</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Receita Líquida</span>
                  <span className="font-medium text-green-600">R$ 1.024,60</span>
                </div>
                <hr />
                <div className="flex justify-between items-center">
                  <span>Total de Créditos</span>
                  <span className="font-medium">74 créditos</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Preço Médio/Crédito</span>
                  <span className="font-medium">R$ 14,73</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Metas e Objetivos</CardTitle>
                <CardDescription>Progresso mensal</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm">Meta de Receita</span>
                    <span className="text-sm font-medium">R$ 1.024 / R$ 2.000</span>
                  </div>
                  <Progress value={51.2} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-1">51% da meta mensal</p>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm">Novos Clientes</span>
                    <span className="text-sm font-medium">5 / 10</span>
                  </div>
                  <Progress value={50} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-1">50% da meta mensal</p>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm">Créditos Vendidos</span>
                    <span className="text-sm font-medium">74 / 120</span>
                  </div>
                  <Progress value={61.7} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-1">62% da meta mensal</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </AdminPageLayout>
  );
};

export default AdminFinance;