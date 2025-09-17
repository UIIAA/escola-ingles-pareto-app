import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  XCircle,
  CreditCard,
  ArrowLeft,
  RefreshCw,
  MessageCircle,
  AlertTriangle
} from 'lucide-react';

const PaymentFailure = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [paymentData, setPaymentData] = useState<any>(null);

  const paymentId = searchParams.get('payment_id');
  const status = searchParams.get('status');
  const statusDetail = searchParams.get('status_detail');
  const externalReference = searchParams.get('external_reference');

  const userData = user ? {
    name: user.user_metadata?.name || user.email?.split('@')[0] || 'Estudante',
    email: user.email || ''
  } : null;

  useEffect(() => {
    // Simular carregamento de dados do pagamento
    if (paymentId) {
      setPaymentData({
        id: paymentId,
        status: status || 'rejected',
        status_detail: statusDetail || 'cc_rejected_other_reason',
        external_reference: externalReference,
        transaction_amount: 420,
        currency_id: 'BRL',
        payment_method: 'credit_card',
        date_created: new Date().toISOString()
      });
    }
  }, [paymentId, status, statusDetail, externalReference]);

  const getStatusMessage = () => {
    const detail = paymentData?.status_detail || '';

    switch (detail) {
      case 'cc_rejected_insufficient_amount':
        return {
          title: 'Saldo Insuficiente',
          description: 'Seu cartão não possui saldo suficiente para realizar esta transação.',
          suggestions: ['Verifique o limite do seu cartão', 'Tente outro cartão', 'Use PIX ou boleto']
        };
      case 'cc_rejected_bad_filled_security_code':
        return {
          title: 'Código de Segurança Inválido',
          description: 'O código de segurança (CVV) do cartão está incorreto.',
          suggestions: ['Verifique o código no verso do cartão', 'Confirme os dados do cartão']
        };
      case 'cc_rejected_bad_filled_date':
        return {
          title: 'Data de Vencimento Inválida',
          description: 'A data de vencimento do cartão está incorreta.',
          suggestions: ['Verifique a data no cartão', 'Confirme mês e ano']
        };
      case 'cc_rejected_high_risk':
        return {
          title: 'Transação Negada por Segurança',
          description: 'Sua operadora/banco negou a transação por motivos de segurança.',
          suggestions: ['Entre em contato com seu banco', 'Tente outro método de pagamento']
        };
      default:
        return {
          title: 'Pagamento Rejeitado',
          description: 'Não foi possível processar seu pagamento.',
          suggestions: ['Verifique os dados do cartão', 'Tente outro método de pagamento', 'Entre em contato conosco']
        };
    }
  };

  const statusInfo = getStatusMessage();

  const tryAgainOptions = [
    {
      title: 'Tentar Novamente',
      description: 'Voltar para o checkout e tentar outro método',
      action: () => navigate('/checkout'),
      icon: RefreshCw,
      color: 'bg-blue-500'
    },
    {
      title: 'Escolher Outro Pacote',
      description: 'Ver outros pacotes de créditos disponíveis',
      action: () => navigate('/credits'),
      icon: CreditCard,
      color: 'bg-green-500'
    },
    {
      title: 'Falar Conosco',
      description: 'Precisa de ajuda? Entre em contato',
      action: () => window.open('https://wa.me/5511999999999', '_blank'),
      icon: MessageCircle,
      color: 'bg-purple-500'
    }
  ];

  if (!userData) {
    return null;
  }

  return (
    <div className="container mx-auto py-8 max-w-2xl">
      {/* Header de falha */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <XCircle className="h-8 w-8 text-red-600" />
        </div>
        <h1 className="text-3xl font-bold text-red-800 mb-2">{statusInfo.title}</h1>
        <p className="text-gray-600">{statusInfo.description}</p>
      </div>

      {/* Alerta com informações */}
      <Alert className="mb-8 border-red-200 bg-red-50">
        <AlertTriangle className="h-4 w-4 text-red-600" />
        <AlertDescription className="text-red-800">
          <strong>O que aconteceu?</strong> {statusInfo.description}
          <br />
          <span className="text-sm">Não se preocupe, nenhum valor foi cobrado da sua conta.</span>
        </AlertDescription>
      </Alert>

      {/* Detalhes da tentativa */}
      {paymentData && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <CreditCard className="mr-2 h-5 w-5" />
              Detalhes da Tentativa
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-500">ID da Tentativa:</span>
                <p className="font-mono bg-gray-100 p-1 rounded text-xs">{paymentData.id}</p>
              </div>
              <div>
                <span className="font-medium text-gray-500">Data:</span>
                <p>{new Date(paymentData.date_created).toLocaleString('pt-BR')}</p>
              </div>
              <div>
                <span className="font-medium text-gray-500">Valor:</span>
                <p>R$ {paymentData.transaction_amount.toFixed(2)}</p>
              </div>
              <div>
                <span className="font-medium text-gray-500">Status:</span>
                <p className="text-red-600 font-medium">Rejeitado</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Sugestões */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Como Resolver</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {statusInfo.suggestions.map((suggestion, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-blue-600 text-xs font-bold">{index + 1}</span>
                </div>
                <p className="text-sm">{suggestion}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Opções de ação */}
      <Card>
        <CardHeader>
          <CardTitle>O que Fazer Agora?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {tryAgainOptions.map((option, index) => (
              <div
                key={index}
                className="flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={option.action}
              >
                <div className={`p-3 rounded-full ${option.color} text-white`}>
                  <option.icon className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium">{option.title}</h4>
                  <p className="text-sm text-muted-foreground">{option.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Botões de navegação */}
      <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
        <Button
          onClick={() => navigate('/credits')}
          className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar aos Pacotes
        </Button>
        <Button
          variant="outline"
          onClick={() => navigate('/dashboard')}
        >
          Ir para Dashboard
        </Button>
      </div>
    </div>
  );
};

export default PaymentFailure;