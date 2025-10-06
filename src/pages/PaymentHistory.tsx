import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
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
  Calendar,
  ChevronLeft,
  FileText
} from 'lucide-react';

interface PaymentRecord {
  id: string;
  transactionId: string;
  package: string;
  amount: number;
  credits: number;
  method: 'credit_card' | 'pix' | 'mercadopago';
  status: 'completed' | 'pending' | 'failed';
  date: string;
  time: string;
  invoice?: string;
}

const PaymentHistory = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedPayment, setSelectedPayment] = useState<PaymentRecord | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const userData = user ? {
    name: user.user_metadata?.name || user.email?.split('@')[0] || 'Usuário',
    email: user.email || ''
  } : null;

  // Dados mockados de histórico do usuário
  const mockPayments: PaymentRecord[] = [
    {
      id: '1',
      transactionId: 'TXN_001234',
      package: 'Padrão - 30 créditos',
      amount: 329.90,
      credits: 30,
      method: 'mercadopago',
      status: 'completed',
      date: '2024-09-15',
      time: '14:35:22',
      invoice: 'INV_001234.pdf'
    },
    {
      id: '2',
      transactionId: 'TXN_001189',
      package: 'Iniciante - 12 créditos',
      amount: 149.90,
      credits: 12,
      method: 'pix',
      status: 'completed',
      date: '2024-08-10',
      time: '10:15:08',
      invoice: 'INV_001189.pdf'
    },
    {
      id: '3',
      transactionId: 'TXN_001145',
      package: 'Individual - 18 créditos',
      amount: 449.90,
      credits: 18,
      method: 'credit_card',
      status: 'pending',
      date: '2024-07-22',
      time: '16:42:15'
    },
    {
      id: '4',
      transactionId: 'TXN_001098',
      package: 'Iniciante - 12 créditos',
      amount: 149.90,
      credits: 12,
      method: 'credit_card',
      status: 'failed',
      date: '2024-07-05',
      time: '09:45:12'
    },
    {
      id: '5',
      transactionId: 'TXN_001023',
      package: 'Padrão - 30 créditos',
      amount: 329.90,
      credits: 30,
      method: 'mercadopago',
      status: 'completed',
      date: '2024-06-12',
      time: '13:20:33',
      invoice: 'INV_001023.pdf'
    }
  ];

  // Filtrar pagamentos
  const filteredPayments = mockPayments.filter(payment => {
    const matchesSearch =
      payment.package.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.transactionId.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Estatísticas calculadas
  const stats = {
    totalSpent: mockPayments
      .filter(p => p.status === 'completed')
      .reduce((sum, p) => sum + p.amount, 0),
    totalCredits: mockPayments
      .filter(p => p.status === 'completed')
      .reduce((sum, p) => sum + p.credits, 0),
    totalTransactions: mockPayments.filter(p => p.status === 'completed').length,
  };

  const getMethodBadge = (method: string) => {
    const config = {
      credit_card: { label: 'Cartão', variant: 'default' as const },
      pix: { label: 'PIX', variant: 'secondary' as const },
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
    };

    const { label, variant, className } = config[status as keyof typeof config] || { label: status, variant: 'default' as const };
    return <Badge variant={variant} className={className}>{label}</Badge>;
  };

  const handleViewDetails = (payment: PaymentRecord) => {
    setSelectedPayment(payment);
    setDialogOpen(true);
  };

  const handleDownloadInvoice = (invoice?: string) => {
    if (invoice) {
      console.log('Baixando recibo:', invoice);
      // TODO: Implementar download real
    }
  };

  if (!userData) return null;

  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <Button
            variant="ghost"
            onClick={() => navigate('/credits')}
            className="mb-2"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Voltar para Créditos
          </Button>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
            Histórico de Pagamentos
          </h1>
          <p className="text-muted-foreground">Visualize todas as suas transações</p>
        </div>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Gasto</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {stats.totalSpent.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">{stats.totalTransactions} transações</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Créditos Comprados</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCredits}</div>
            <p className="text-xs text-muted-foreground">Total adquirido</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Compras Realizadas</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalTransactions}</div>
            <p className="text-xs text-muted-foreground">Pagamentos concluídos</p>
          </CardContent>
        </Card>
      </div>

      {/* Histórico de Transações */}
      <Card>
        <CardHeader>
          <CardTitle>Suas Transações</CardTitle>
          <CardDescription>Histórico completo de compras de créditos</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por pacote ou ID da transação..."
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
              </SelectContent>
            </Select>
          </div>

          {/* Tabela de Pagamentos */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID Transação</TableHead>
                  <TableHead>Pacote</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Créditos</TableHead>
                  <TableHead>Método</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Data/Hora</TableHead>
                  <TableHead>Recibo</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPayments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center text-muted-foreground">
                      Nenhuma transação encontrada
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPayments.map((payment) => (
                    <TableRow key={payment.id} className="cursor-pointer hover:bg-muted/50" onClick={() => handleViewDetails(payment)}>
                      <TableCell className="font-mono text-sm">
                        {payment.transactionId}
                      </TableCell>
                      <TableCell>{payment.package}</TableCell>
                      <TableCell className="font-semibold">
                        R$ {payment.amount.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{payment.credits}</Badge>
                      </TableCell>
                      <TableCell>{getMethodBadge(payment.method)}</TableCell>
                      <TableCell>{getStatusBadge(payment.status)}</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="text-sm">{payment.date}</span>
                          <span className="text-xs text-muted-foreground">{payment.time}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {payment.invoice && payment.status === 'completed' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDownloadInvoice(payment.invoice);
                            }}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Resumo */}
          <div className="flex justify-between items-center text-sm text-muted-foreground">
            <span>Mostrando {filteredPayments.length} de {mockPayments.length} transações</span>
            <span>Total gasto: R$ {stats.totalSpent.toFixed(2)}</span>
          </div>
        </CardContent>
      </Card>

      {/* Dialog de Detalhes */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Detalhes da Transação</DialogTitle>
            <DialogDescription>
              Informações completas do pagamento
            </DialogDescription>
          </DialogHeader>
          {selectedPayment && (
            <div className="space-y-4">
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">ID da Transação</label>
                  <p className="font-mono text-sm">{selectedPayment.transactionId}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Status</label>
                  <div className="mt-1">{getStatusBadge(selectedPayment.status)}</div>
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
                  <label className="text-sm font-medium text-muted-foreground">Data e Hora</label>
                  <p>{selectedPayment.date} às {selectedPayment.time}</p>
                </div>
                {selectedPayment.invoice && selectedPayment.status === 'completed' && (
                  <div>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => handleDownloadInvoice(selectedPayment.invoice)}
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Baixar Recibo
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PaymentHistory;
