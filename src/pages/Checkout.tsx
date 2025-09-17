import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { mercadoPagoService } from '@/services/mercadopago';
import { CREDIT_PACKAGES, PAYMENT_METHODS, type CreditPackage } from '@/types/payments';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import {
  ShoppingCart,
  CreditCard,
  Zap,
  FileText,
  ArrowLeft,
  Shield,
  Clock,
  Check,
  Star
} from 'lucide-react';

const Checkout = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const packageId = searchParams.get('package');

  const [selectedPackage, setSelectedPackage] = useState<CreditPackage | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'pix' | 'boleto' | 'cartao'>('pix');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const userData = user ? {
    name: user.user_metadata?.name || user.email?.split('@')[0] || 'Estudante',
    email: user.email || ''
  } : null;

  useEffect(() => {
    if (packageId) {
      const pkg = CREDIT_PACKAGES.find(p => p.id === packageId);
      if (pkg) {
        setSelectedPackage(pkg);
      } else {
        navigate('/credits');
      }
    } else {
      navigate('/credits');
    }
  }, [packageId, navigate]);

  const calculateTotal = () => {
    if (!selectedPackage) return 0;
    const finalPrice = mercadoPagoService.calculateFinalPrice(selectedPackage.price, selectedPaymentMethod);
    return finalPrice;
  };

  const calculateDiscount = () => {
    if (!selectedPackage) return 0;
    return mercadoPagoService.calculateDiscount(selectedPackage.price, selectedPaymentMethod);
  };

  const handlePayment = async () => {
    if (!selectedPackage || !userData) return;

    setIsProcessing(true);
    setError(null);

    try {
      const preference = await mercadoPagoService.createPaymentPreference(
        selectedPackage,
        userData.email,
        userData.name,
        selectedPaymentMethod
      );

      // Redirecionar para o Mercado Pago
      window.location.href = preference.sandbox_init_point || preference.init_point;
    } catch (err) {
      setError('Erro ao processar pagamento. Tente novamente.');
      console.error('Erro no pagamento:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!selectedPackage || !userData) {
    return null;
  }

  const paymentMethod = PAYMENT_METHODS.find(pm => pm.id === selectedPaymentMethod);
  const total = calculateTotal();
  const discount = calculateDiscount();

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <div className="flex items-center gap-3 mb-8">
        <Button variant="ghost" onClick={() => navigate('/credits')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Finalizar Compra</h1>
          <p className="text-muted-foreground">Complete sua compra de créditos</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Resumo do pedido */}
        <div className="lg:col-span-2 space-y-6">
          {/* Produto selecionado */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ShoppingCart className="mr-2 h-5 w-5" />
                Seu Pedido
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold">{selectedPackage.name}</h3>
                    {selectedPackage.popular && (
                      <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500">
                        <Star className="h-3 w-3 mr-1" />
                        Popular
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{selectedPackage.description}</p>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">{selectedPackage.credits} créditos</span>
                      <p className="text-muted-foreground">Para suas aulas</p>
                    </div>
                    <div>
                      <span className="font-medium">{selectedPackage.duration_months} meses</span>
                      <p className="text-muted-foreground">Validade</p>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold">R$ {selectedPackage.price.toFixed(2)}</div>
                  {selectedPackage.discount > 0 && (
                    <Badge variant="secondary" className="text-xs">
                      -{selectedPackage.discount}% desconto
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Método de pagamento */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="mr-2 h-5 w-5" />
                Método de Pagamento
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {PAYMENT_METHODS.map((method) => (
                <div
                  key={method.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedPaymentMethod === method.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedPaymentMethod(method.id as any)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{method.icon}</span>
                      <div>
                        <h4 className="font-medium">{method.name}</h4>
                        <p className="text-sm text-muted-foreground">{method.description}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      {method.discount > 0 && (
                        <Badge variant="secondary" className="bg-green-100 text-green-700">
                          -{method.discount}% desconto
                        </Badge>
                      )}
                      <p className="text-xs text-muted-foreground mt-1">
                        <Clock className="h-3 w-3 inline mr-1" />
                        {method.processing_time}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Informações de segurança */}
          <Card className="border-green-200 bg-green-50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-green-600" />
                <div>
                  <h4 className="font-medium text-green-800">Pagamento Seguro</h4>
                  <p className="text-sm text-green-700">
                    Processado pelo Mercado Pago com criptografia SSL de 256 bits
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Resumo financeiro */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Resumo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>R$ {selectedPackage.price.toFixed(2)}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Desconto ({paymentMethod?.name})</span>
                  <span>-R$ {discount.toFixed(2)}</span>
                </div>
              )}

              <Separator />

              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>R$ {total.toFixed(2)}</span>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button
                className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                onClick={handlePayment}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  'Processando...'
                ) : (
                  <>
                    {selectedPaymentMethod === 'pix' && <Zap className="mr-2 h-4 w-4" />}
                    {selectedPaymentMethod === 'boleto' && <FileText className="mr-2 h-4 w-4" />}
                    {selectedPaymentMethod === 'cartao' && <CreditCard className="mr-2 h-4 w-4" />}
                    Pagar R$ {total.toFixed(2)}
                  </>
                )}
              </Button>

              <p className="text-xs text-center text-muted-foreground">
                Ao confirmar, você concorda com nossos termos de uso
              </p>
            </CardContent>
          </Card>

          {/* Benefícios inclusos */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">O que está incluído</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {selectedPackage.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-600" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Checkout;