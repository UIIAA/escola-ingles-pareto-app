import React, { useState } from 'react';
import AdminPageLayout from '@/components/AdminPageLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DollarSign,
  CreditCard,
  Download,
  Receipt,
  Search,
  Filter,
  Eye,
  Calendar,
  User
} from 'lucide-react';

interface PaymentTransaction {
  id: string;
  transactionId: string;
  user: string;
  email: string;
  package: string;
  amount: number;
  credits: number;
  method: 'credit_card' | 'pix' | 'bank_transfer' | 'mercadopago';
  status: 'completed' | 'pending' | 'failed' | 'refunded';
  date: string;
  time: string;
  processorResponse?: string;
  notes?: string;
}

const AdminPayments = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [methodFilter, setMethodFilter] = useState('all');
  const [selectedPayment, setSelectedPayment] = useState<PaymentTransaction | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Dados mockados de transações
  const mockTransactions: PaymentTransaction[] = [
    {
      id: '1',
      transactionId: 'TXN_MP_20240918_001',
      user: 'João Silva',
      email: 'joao.silva@email.com',
      package: 'Iniciante - 12 créditos',
      amount: 149.90,
      credits: 12,
      method: 'mercadopago',
      status: 'completed',
      date: '2024-09-18',
      time: '14:35:22',
      processorResponse: 'approved',
      notes: 'Pagamento aprovado automaticamente'
    },
    {
      id: '2',
      transactionId: 'TXN_PIX_20240918_002',
      user: 'Maria Santos',
      email: 'maria.santos@email.com',
      package: 'Padrão - 30 créditos',
      amount: 329.90,
      credits: 30,
      method: 'pix',
      status: 'completed',
      date: '2024-09-18',
      time: '10:15:08',
      processorResponse: 'approved',
      notes: 'PIX confirmado em 2 segundos'
    },
    {
      id: '3',
      transactionId: 'TXN_CC_20240917_003',
      user: 'Pedro Costa',
      email: 'pedro.costa@email.com',
      package: 'Premium - 65 créditos',
      amount: 649.90,
      credits: 65,
      method: 'credit_card',
      status: 'pending',
      date: '2024-09-17',
      time: '16:42:15',
      processorResponse: 'processing',
      notes: 'Aguardando confirmação do banco'
    },
    {
      id: '4',
      transactionId: 'TXN_MP_20240917_004',
      user: 'Ana Oliveira',
      email: 'ana.oliveira@email.com',
      package: 'Individual - 18 créditos',
      amount: 449.90,
      credits: 18,
      method: 'mercadopago',
      status: 'completed',
      date: '2024-09-17',
      time: '11:20:33',
      processorResponse: 'approved'
    },
    {
      id: '5',
      transactionId: 'TXN_CC_20240916_005',
      user: 'Carlos Lima',
      email: 'carlos.lima@email.com',
      package: 'Iniciante - 12 créditos',
      amount: 149.90,
      credits: 12,
      method: 'credit_card',
      status: 'failed',
      date: '2024-09-16',
      time: '09:45:12',
      processorResponse: 'insufficient_funds',
      notes: 'Cartão recusado por saldo insuficiente'
    },
    {
      id: '6',
      transactionId: 'TXN_MP_20240916_006',
      user: 'Beatriz Alves',
      email: 'beatriz.alves@email.com',
      package: 'Padrão - 30 créditos',
      amount: 329.90,
      credits: 30,
      method: 'mercadopago',
      status: 'refunded',
      date: '2024-09-16',
      time: '14:22:47',
      processorResponse: 'refund_approved',
      notes: 'Reembolso solicitado pelo cliente - processado'
    },
    {
      id: '7',
      transactionId: 'TXN_PIX_20240915_007',
      user: 'Ricardo Souza',
      email: 'ricardo.souza@email.com',
      package: 'Premium - 65 créditos',
      amount: 649.90,
      credits: 65,
      method: 'pix',
      status: 'completed',
      date: '2024-09-15',
      time: '13:10:55',
      processorResponse: 'approved'
    },
    {
      id: '8',
      transactionId: 'TXN_BT_20240915_008',
      user: 'Fernanda Rocha',
      email: 'fernanda.rocha@email.com',
      package: 'Individual - 18 créditos',
      amount: 449.90,
      credits: 18,
      method: 'bank_transfer',
      status: 'completed',
      date: '2024-09-15',
      time: '08:33:19',
      processorResponse: 'approved'
    }
  ];

  // Filtrar transações
  const filteredTransactions = mockTransactions.filter(transaction => {
    const matchesSearch =
      transaction.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.transactionId.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || transaction.status === statusFilter;
    const matchesMethod = methodFilter === 'all' || transaction.method === methodFilter;

    return matchesSearch && matchesStatus && matchesMethod;
  });

  // Estatísticas calculadas
  const stats = {
    total: filteredTransactions.reduce((sum, t) => sum + (t.status === 'completed' ? t.amount : 0), 0),
    completed: filteredTransactions.filter(t => t.status === 'completed').length,
    pending: filteredTransactions.filter(t => t.status === 'pending').length,
    failed: filteredTransactions.filter(t => t.status === 'failed').length,
    refunded: filteredTransactions.filter(t => t.status === 'refunded').length,
  };

  const getMethodBadge = (method: string) => {
    const config = {
      credit_card: { label: 'Cartão de Crédito', variant: 'default' as const },
      pix: { label: 'PIX', variant: 'secondary' as const },
      bank_transfer: { label: 'Transferência', variant: 'outline' as const },
      mercadopago: { label: 'MercadoPago', variant: 'default' as const },
    };

    const { label, variant } = config[method as keyof typeof config] || { label: method, variant: 'default' as const };
    return <Badge variant={variant}>{label}</Badge>;
  };

  const getStatusBadge = (status: string) => {
    const config = {
      completed: { label: 'Concluído', variant: 'default' as const, className: 'bg-green-500' },
      pending: { label: 'Pendente', variant: 'secondary' as const, className: 'bg-yellow-500' },
      failed: { label: 'Falhou', variant: 'destructive' as const },
      refunded: { label: 'Reembolsado', variant: 'outline' as const, className: 'border-purple-500 text-purple-700' },
    };

    const { label, variant, className } = config[status as keyof typeof config] || { label: status, variant: 'default' as const };
    return <Badge variant={variant} className={className}>{label}</Badge>;
  };

  const handleViewDetails = (transaction: PaymentTransaction) => {
    setSelectedPayment(transaction);
    setDialogOpen(true);
  };

  const handleExport = () => {
    console.log('Exportando transações:', filteredTransactions);
    // TODO: Implementar export real para CSV/PDF
  };

  return (
    <AdminPageLayout
      title="Histórico de Pagamentos"
      description="Visualize e gerencie todas as transações do sistema"
    >
      <div className="space-y-6">
        {/* Cards de Estatísticas */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Recebido</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">R$ {stats.total.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">{stats.completed} transações concluídas</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pending}</div>
              <p className="text-xs text-muted-foreground">Aguardando confirmação</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Falhadas</CardTitle>
              <Receipt className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.failed}</div>
              <p className="text-xs text-muted-foreground">Pagamentos não concluídos</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Reembolsados</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.refunded}</div>
              <p className="text-xs text-muted-foreground">Devoluções processadas</p>
            </CardContent>
          </Card>
        </div>

        {/* Filtros e Busca */}
        <Card>
          <CardHeader>
            <CardTitle>Transações</CardTitle>
            <CardDescription>Lista completa de todas as transações do sistema</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por usuário, email ou ID da transação..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Status</SelectItem>
                  <SelectItem value="completed">Concluídos</SelectItem>
                  <SelectItem value="pending">Pendentes</SelectItem>
                  <SelectItem value="failed">Falhados</SelectItem>
                  <SelectItem value="refunded">Reembolsados</SelectItem>
                </SelectContent>
              </Select>
              <Select value={methodFilter} onValueChange={setMethodFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Método" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Métodos</SelectItem>
                  <SelectItem value="credit_card">Cartão de Crédito</SelectItem>
                  <SelectItem value="pix">PIX</SelectItem>
                  <SelectItem value="bank_transfer">Transferência</SelectItem>
                  <SelectItem value="mercadopago">MercadoPago</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={handleExport} variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Exportar
              </Button>
            </div>

            {/* Tabela de Transações */}
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID Transação</TableHead>
                    <TableHead>Usuário</TableHead>
                    <TableHead>Pacote</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Créditos</TableHead>
                    <TableHead>Método</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Data/Hora</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransactions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center text-muted-foreground">
                        Nenhuma transação encontrada
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredTransactions.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell className="font-mono text-sm">
                          {transaction.transactionId}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium">{transaction.user}</span>
                            <span className="text-xs text-muted-foreground">{transaction.email}</span>
                          </div>
                        </TableCell>
                        <TableCell>{transaction.package}</TableCell>
                        <TableCell className="font-semibold">
                          R$ {transaction.amount.toFixed(2)}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{transaction.credits}</Badge>
                        </TableCell>
                        <TableCell>{getMethodBadge(transaction.method)}</TableCell>
                        <TableCell>{getStatusBadge(transaction.status)}</TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="text-sm">{transaction.date}</span>
                            <span className="text-xs text-muted-foreground">{transaction.time}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewDetails(transaction)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Resumo */}
            <div className="flex justify-between items-center text-sm text-muted-foreground">
              <span>Mostrando {filteredTransactions.length} de {mockTransactions.length} transações</span>
              <span>Total: R$ {stats.total.toFixed(2)}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Dialog de Detalhes */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalhes da Transação</DialogTitle>
            <DialogDescription>
              Informações completas sobre a transação selecionada
            </DialogDescription>
          </DialogHeader>
          {selectedPayment && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">ID da Transação</label>
                  <p className="font-mono text-sm">{selectedPayment.transactionId}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Status</label>
                  <div className="mt-1">{getStatusBadge(selectedPayment.status)}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Usuário</label>
                  <p>{selectedPayment.user}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Email</label>
                  <p className="text-sm">{selectedPayment.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Pacote</label>
                  <p>{selectedPayment.package}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Créditos</label>
                  <p>{selectedPayment.credits} créditos</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Valor</label>
                  <p className="text-lg font-bold">R$ {selectedPayment.amount.toFixed(2)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Método de Pagamento</label>
                  <div className="mt-1">{getMethodBadge(selectedPayment.method)}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Data</label>
                  <p>{selectedPayment.date}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Hora</label>
                  <p>{selectedPayment.time}</p>
                </div>
                {selectedPayment.processorResponse && (
                  <div className="col-span-2">
                    <label className="text-sm font-medium text-muted-foreground">Resposta do Processador</label>
                    <p className="text-sm">{selectedPayment.processorResponse}</p>
                  </div>
                )}
                {selectedPayment.notes && (
                  <div className="col-span-2">
                    <label className="text-sm font-medium text-muted-foreground">Observações</label>
                    <p className="text-sm">{selectedPayment.notes}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminPageLayout>
  );
};

export default AdminPayments;
