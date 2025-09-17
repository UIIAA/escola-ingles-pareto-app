import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { PaymentData } from '@/types/mercadopago';
import {
  CheckCircle,
  CreditCard,
  Calendar,
  Download,
  Home,
  MessageCircle
} from 'lucide-react';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);

  const paymentId = searchParams.get('payment_id');
  const status = searchParams.get('status');
  const externalReference = searchParams.get('external_reference');

  const userData = user ? {
    name: user.user_metadata?.name || user.email?.split('@')[0] || 'Estudante',
    email: user.email || ''
  } : null;

  useEffect(() => {
    // Simular carregamento de dados do pagamento
    if (paymentId && status === 'approved') {
      setPaymentData({
        id: paymentId,
        status: 'approved',
        transaction_amount: 420,
        currency_id: 'BRL',
        payment_method: 'pix',
        credits_purchased: 30,
        package_name: 'Pacote Padrão',
        date_approved: new Date().toISOString(),
        external_reference: externalReference
      });
    }
  }, [paymentId, status, externalReference]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const nextSteps = [
    {
      title: 'Agende sua primeira aula',
      description: 'Use seus créditos para agendar aulas com nossos professores',
      action: () => navigate('/catalog'),
      icon: Calendar,
      color: 'bg-blue-500'
    },
    {
      title: 'Explore o AI Chat',
      description: 'Pratique conversação com nosso assistente de IA',
      action: () => navigate('/ai-chat'),
      icon: MessageCircle,
      color: 'bg-purple-500'
    },
    {
      title: 'Acesse o dashboard',
      description: 'Acompanhe seu progresso e conquistas',
      action: () => navigate('/dashboard'),
      icon: Home,
      color: 'bg-green-500'
    }
  ];

  if (!paymentData || !userData) {
    return (
      <div className="container mx-auto py-8 max-w-2xl">
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p>Confirmando seu pagamento...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      {/* Header de sucesso */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold text-green-800 mb-2">Pagamento Confirmado!</h1>
        <p className="text-gray-600">Parabéns, {userData.name}! Seus créditos foram adicionados à sua conta.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Detalhes do pagamento */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="mr-2 h-5 w-5" />
                Detalhes da Compra
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-sm text-gray-500 uppercase tracking-wide">Pacote</h4>
                  <p className="text-lg font-semibold">{paymentData.package_name}</p>
                </div>
                <div>
                  <h4 className="font-medium text-sm text-gray-500 uppercase tracking-wide">Créditos</h4>
                  <p className="text-lg font-semibold text-blue-600">{paymentData.credits_purchased} créditos</p>
                </div>
                <div>
                  <h4 className="font-medium text-sm text-gray-500 uppercase tracking-wide">Valor Pago</h4>
                  <p className="text-lg font-semibold">R$ {paymentData.transaction_amount.toFixed(2)}</p>
                </div>
                <div>
                  <h4 className="font-medium text-sm text-gray-500 uppercase tracking-wide">Data</h4>
                  <p className="text-lg font-semibold">{formatDate(paymentData.date_approved)}</p>
                </div>
                <div>
                  <h4 className="font-medium text-sm text-gray-500 uppercase tracking-wide">ID do Pagamento</h4>
                  <p className="text-sm font-mono bg-gray-100 p-2 rounded">{paymentData.id}</p>
                </div>
                <div>
                  <h4 className="font-medium text-sm text-gray-500 uppercase tracking-wide">Status</h4>
                  <Badge className="bg-green-100 text-green-800">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Aprovado
                  </Badge>
                </div>
              </div>

              <div className="pt-4 border-t">
                <Button variant="outline" className="w-full sm:w-auto">
                  <Download className="h-4 w-4 mr-2" />
                  Baixar Comprovante
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Próximos passos */}
          <Card>
            <CardHeader>
              <CardTitle>Próximos Passos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {nextSteps.map((step, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={step.action}
                  >
                    <div className={`p-3 rounded-full ${step.color} text-white`}>
                      <step.icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{step.title}</h4>
                      <p className="text-sm text-muted-foreground">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Resumo da conta */}
        <div className="space-y-6">
          <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-blue-800">Sua Conta Agora</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {paymentData.credits_purchased}
                </div>
                <p className="text-blue-700 mb-4">Créditos Disponíveis</p>
                <div className="text-sm text-blue-600 space-y-1">
                  <p>• {paymentData.credits_purchased} aulas em grupo</p>
                  <p>• {Math.floor(paymentData.credits_purchased / 3)} aulas individuais</p>
                  <p>• Acesso completo à plataforma</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Dicas para Começar</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <p>Agende sua primeira aula o quanto antes para manter a motivação alta</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <p>Use o AI Chat diariamente para praticar conversação</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <p>Participe do fórum para tirar dúvidas e conhecer outros alunos</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <p>Acompanhe seu progresso nas trilhas de aprendizado</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl mb-2">🎉</div>
                <h4 className="font-medium text-yellow-800 mb-2">Bem-vindo(a) à nossa comunidade!</h4>
                <p className="text-sm text-yellow-700">
                  Você faz parte de mais de 1.000 estudantes que estão aprendendo inglês conosco.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Botões de ação */}
      <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
        <Button
          onClick={() => navigate('/catalog')}
          className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
        >
          <Calendar className="h-4 w-4 mr-2" />
          Agendar Primeira Aula
        </Button>
        <Button
          variant="outline"
          onClick={() => navigate('/dashboard')}
        >
          <Home className="h-4 w-4 mr-2" />
          Ir para Dashboard
        </Button>
      </div>
    </div>
  );
};

export default PaymentSuccess;