import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  CreditCard,
  Plus,
  Minus,
  Clock,
  TrendingUp,
  Star,
  Gift,
  History,
  AlertCircle
} from 'lucide-react';
import { useCredits } from '@/hooks/useCredits';
import { CREDIT_PACKAGES, formatCurrency } from '@/types/credits';

const Credits = () => {
  const {
    userCredits,
    transactions,
    loading,
    error,
    purchaseCredits,
    canAffordLesson,
    getCreditsNeeded
  } = useCredits();

  const [purchaseLoading, setPurchaseLoading] = useState<string | null>(null);

  const handlePurchase = async (packageId: string, credits: number, bonusCredits: number = 0) => {
    setPurchaseLoading(packageId);
    try {
      const result = await purchaseCredits(packageId, credits, bonusCredits);
      if (result.success) {
        // Success message could be shown via toast
      }
    } catch (err) {
      console.error('Purchase error:', err);
    } finally {
      setPurchaseLoading(null);
    }
  };

  const getTransactionTypeColor = (type: string) => {
    switch (type) {
      case 'purchase': return 'bg-green-100 text-green-800';
      case 'usage': return 'bg-red-100 text-red-800';
      case 'refund': return 'bg-blue-100 text-blue-800';
      case 'bonus': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTransactionTypeLabel = (type: string) => {
    switch (type) {
      case 'purchase': return 'Compra';
      case 'usage': return 'Uso';
      case 'refund': return 'Reembolso';
      case 'bonus': return 'Bônus';
      default: return type;
    }
  };

  if (loading && !userCredits) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-gray-600">Carregando informações de créditos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Gerenciar Créditos</h1>
        <p className="text-gray-600 mt-2">
          Compre créditos para agendar suas aulas e acompanhe seu histórico de transações
        </p>
      </div>

      {error && (
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">{error}</AlertDescription>
        </Alert>
      )}

      {/* Credits Overview */}
      {userCredits && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium flex items-center">
                <CreditCard className="w-5 h-5 mr-2" />
                Créditos Disponíveis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{userCredits.availableCredits}</div>
              <p className="text-blue-100 text-sm">
                De {userCredits.totalCredits} créditos totais
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
                Créditos Usados
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{userCredits.usedCredits}</div>
              <p className="text-gray-600 text-sm">
                Aulas já agendadas
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium flex items-center">
                <Clock className="w-5 h-5 mr-2 text-orange-600" />
                Última Atualização
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-gray-600">
                {new Date(userCredits.lastUpdated).toLocaleDateString('pt-BR', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
              <p className="text-gray-500 text-sm">
                Sistema atualizado
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Credit Packages */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Pacotes de Créditos</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {CREDIT_PACKAGES.map((pkg) => (
            <Card key={pkg.id} className={`relative ${pkg.popular ? 'ring-2 ring-blue-500' : ''}`}>
              {pkg.popular && (
                <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white">
                  <Star className="w-3 h-3 mr-1" />
                  Mais Popular
                </Badge>
              )}

              <CardHeader className="text-center pb-4">
                <CardTitle className="text-lg">{pkg.name}</CardTitle>
                <CardDescription className="text-sm">{pkg.description}</CardDescription>

                <div className="mt-4">
                  <div className="text-3xl font-bold text-blue-600">
                    {formatCurrency(pkg.price)}
                  </div>

                  <div className="flex items-center justify-center gap-2 mt-2">
                    <span className="text-2xl font-bold text-gray-900">{pkg.credits}</span>
                    <span className="text-gray-600">créditos</span>
                    {pkg.bonusCredits && (
                      <Badge variant="outline" className="text-green-600 border-green-600">
                        <Gift className="w-3 h-3 mr-1" />
                        +{pkg.bonusCredits}
                      </Badge>
                    )}
                  </div>

                  {pkg.bonusCredits && (
                    <div className="text-sm text-green-600 mt-1">
                      Total: {pkg.credits + pkg.bonusCredits} créditos
                    </div>
                  )}
                </div>
              </CardHeader>

              <CardContent>
                <Button
                  onClick={() => handlePurchase(pkg.id, pkg.credits, pkg.bonusCredits)}
                  disabled={purchaseLoading === pkg.id}
                  className="w-full"
                  variant={pkg.popular ? "default" : "outline"}
                >
                  {purchaseLoading === pkg.id ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Processando...
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 mr-2" />
                      Comprar Pacote
                    </>
                  )}
                </Button>

                <div className="mt-3 text-center">
                  <div className="text-sm text-gray-500">
                    Aulas em grupo: até {pkg.credits + (pkg.bonusCredits || 0)} aulas
                  </div>
                  <div className="text-sm text-gray-500">
                    Aulas individuais: até {Math.floor((pkg.credits + (pkg.bonusCredits || 0)) / 3)} aulas
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Cost Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <AlertCircle className="w-5 h-5 mr-2 text-blue-600" />
            Como Funciona o Sistema de Créditos
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold text-green-600 mb-2">Aulas em Grupo (1 crédito)</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Grupo Iniciante</li>
                <li>• Grupo Intermediário</li>
                <li>• Grupo Avançado</li>
                <li>• Conversação Aberta</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-purple-600 mb-2">Aulas Individuais (3 créditos)</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Aulas personalizadas</li>
                <li>• Atenção exclusiva do professor</li>
                <li>• Conteúdo adaptado às suas necessidades</li>
                <li>• Flexibilidade total</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transaction History */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
          <History className="w-6 h-6 mr-2" />
          Histórico de Transações
        </h2>

        {transactions.length > 0 ? (
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Descrição</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Créditos</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {transactions.slice(0, 10).map((transaction) => (
                      <tr key={transaction.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge className={getTransactionTypeColor(transaction.type)}>
                            {getTransactionTypeLabel(transaction.type)}
                          </Badge>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">{transaction.description}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className={`text-sm font-medium ${
                            transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {transaction.amount > 0 ? '+' : ''}{transaction.amount}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(transaction.timestamp).toLocaleDateString('pt-BR', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="text-center py-12">
            <CardContent>
              <History className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhuma transação encontrada
              </h3>
              <p className="text-gray-600">
                Suas transações de créditos aparecerão aqui
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Credits;