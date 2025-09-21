import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CreditVerification, getActivityConfig } from '@/types/credits';
import { AlertTriangle, CreditCard, Zap, ShoppingCart } from 'lucide-react';

interface CreditWarningModalProps {
  isOpen: boolean;
  onClose: () => void;
  verification: CreditVerification;
  activityName?: string;
  onPurchaseCredits?: () => void;
  showPurchaseButton?: boolean;
}

export const CreditWarningModal: React.FC<CreditWarningModalProps> = ({
  isOpen,
  onClose,
  verification,
  activityName,
  onPurchaseCredits,
  showPurchaseButton = true
}) => {
  const navigate = useNavigate();
  const config = getActivityConfig(verification.activityType);

  const handlePurchaseCredits = () => {
    if (onPurchaseCredits) {
      onPurchaseCredits();
    } else {
      navigate('/credits?reason=insufficient&required=' + verification.required);
    }
    onClose();
  };

  const getActivityTypeLabel = (activityType: string): string => {
    const labels: Record<string, string> = {
      'ai-chat-message': 'Mensagem no Chat IA',
      'learning-unit': 'Unidade de Aprendizado',
      'learning-path-start': 'Iniciar Trilha',
      'quiz-attempt': 'Tentativa de Quiz',
      'exercise-completion': 'Exercício Prático',
      'individual': 'Aula Individual',
      'group-beginner': 'Aula em Grupo - Iniciante',
      'group-intermediate': 'Aula em Grupo - Intermediário',
      'group-advanced': 'Aula em Grupo - Avançado',
      'open-conversation': 'Conversa Aberta'
    };
    return labels[activityType] || activityType;
  };

  const formatCredits = (amount: number): string => {
    return amount % 1 === 0 ? amount.toString() : amount.toFixed(1);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-500" />
            Créditos Insuficientes
          </DialogTitle>
          <DialogDescription>
            Você não possui créditos suficientes para realizar esta ação.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Activity Info */}
          <Alert>
            <Zap className="w-4 h-4" />
            <AlertDescription>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Atividade:</span>
                  <span>{activityName || getActivityTypeLabel(verification.activityType)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium">Custo:</span>
                  <Badge variant="outline" className="bg-orange-50">
                    {formatCredits(verification.required)} {verification.required === 1 ? 'crédito' : 'créditos'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium">Disponível:</span>
                  <Badge variant="outline" className={verification.available > 0 ? 'bg-blue-50' : 'bg-red-50'}>
                    {formatCredits(verification.available)} {verification.available === 1 ? 'crédito' : 'créditos'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between border-t pt-2">
                  <span className="font-medium text-red-600">Necessário comprar:</span>
                  <Badge variant="destructive" className="bg-red-100 text-red-800">
                    {formatCredits(verification.required - verification.available)} {(verification.required - verification.available) === 1 ? 'crédito' : 'créditos'}
                  </Badge>
                </div>
              </div>
            </AlertDescription>
          </Alert>

          {/* Activity Description */}
          {config && (
            <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
              <p><strong>Sobre esta atividade:</strong></p>
              <p>{config.description}</p>
              <p className="mt-1 text-xs">
                Categoria: <Badge variant="outline" className="text-xs">{config.category}</Badge>
              </p>
            </div>
          )}

          {/* Estimated Usage */}
          {verification.estimatedUsage && (
            <div className="text-sm text-blue-600 bg-blue-50 p-3 rounded-lg">
              <p><strong>💡 Dica:</strong> Esta trilha pode consumir até {formatCredits(verification.estimatedUsage)} créditos no total.</p>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          {showPurchaseButton && (
            <Button onClick={handlePurchaseCredits} className="gap-2">
              <CreditCard className="w-4 h-4" />
              Comprar Créditos
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreditWarningModal;