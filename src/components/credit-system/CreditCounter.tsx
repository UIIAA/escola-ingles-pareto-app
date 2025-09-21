import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Zap, Plus, TrendingDown, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CreditCounterProps {
  currentCredits: number;
  showAnimation?: boolean;
  showPurchaseButton?: boolean;
  onPurchaseClick?: () => void;
  size?: 'sm' | 'md' | 'lg';
  warningThreshold?: number;
  showTrend?: boolean;
  previousCredits?: number;
  className?: string;
}

export const CreditCounter: React.FC<CreditCounterProps> = ({
  currentCredits,
  showAnimation = false,
  showPurchaseButton = true,
  onPurchaseClick,
  size = 'md',
  warningThreshold = 5,
  showTrend = false,
  previousCredits,
  className
}) => {
  const [animatedCredits, setAnimatedCredits] = useState(currentCredits);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (showAnimation && currentCredits !== animatedCredits) {
      setIsAnimating(true);

      // Animate the counter
      const steps = 10;
      const difference = currentCredits - animatedCredits;
      const stepSize = difference / steps;
      let currentStep = 0;

      const interval = setInterval(() => {
        currentStep++;
        if (currentStep >= steps) {
          setAnimatedCredits(currentCredits);
          setIsAnimating(false);
          clearInterval(interval);
        } else {
          setAnimatedCredits(prev => prev + stepSize);
        }
      }, 50);

      return () => clearInterval(interval);
    } else {
      setAnimatedCredits(currentCredits);
    }
  }, [currentCredits, showAnimation]);

  const formatCredits = (amount: number): string => {
    if (showAnimation && isAnimating) {
      return amount % 1 === 0 ? amount.toString() : amount.toFixed(1);
    }
    return amount % 1 === 0 ? amount.toString() : amount.toFixed(1);
  };

  const getCreditsColor = (): string => {
    if (currentCredits <= 0) return 'text-red-600';
    if (currentCredits <= warningThreshold) return 'text-orange-600';
    return 'text-green-600';
  };

  const getCreditsBackgroundColor = (): string => {
    if (currentCredits <= 0) return 'bg-red-50 border-red-200';
    if (currentCredits <= warningThreshold) return 'bg-orange-50 border-orange-200';
    return 'bg-green-50 border-green-200';
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'text-sm px-2 py-1';
      case 'lg':
        return 'text-lg px-4 py-2';
      default:
        return 'text-base px-3 py-1.5';
    }
  };

  const getTrend = () => {
    if (!showTrend || previousCredits === undefined) return null;

    if (currentCredits > previousCredits) {
      return <TrendingUp className="w-3 h-3 text-green-500" />;
    } else if (currentCredits < previousCredits) {
      return <TrendingDown className="w-3 h-3 text-red-500" />;
    }
    return null;
  };

  const getStatusMessage = (): string => {
    if (currentCredits <= 0) {
      return 'Você não possui créditos. Compre mais para continuar usando a plataforma.';
    }
    if (currentCredits <= warningThreshold) {
      return 'Atenção: Seus créditos estão acabando. Considere comprar mais.';
    }
    return 'Você tem créditos suficientes para continuar aprendendo.';
  };

  return (
    <TooltipProvider>
      <div className={cn('flex items-center gap-2', className)}>
        <Tooltip>
          <TooltipTrigger asChild>
            <div
              className={cn(
                'flex items-center gap-2 border rounded-full font-medium transition-all duration-300',
                getCreditsBackgroundColor(),
                getSizeClasses(),
                isAnimating && 'animate-pulse'
              )}
            >
              <Zap className={cn('w-4 h-4', getCreditsColor())} />
              <span className={getCreditsColor()}>
                {formatCredits(animatedCredits)}
              </span>
              <span className="text-gray-500 text-sm">
                {animatedCredits === 1 ? 'crédito' : 'créditos'}
              </span>
              {getTrend()}
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <div className="text-center">
              <p className="font-medium">Seus Créditos</p>
              <p className="text-xs text-gray-600">{getStatusMessage()}</p>
              {showTrend && previousCredits !== undefined && (
                <p className="text-xs mt-1">
                  {currentCredits > previousCredits && (
                    <span className="text-green-600">
                      +{formatCredits(currentCredits - previousCredits)} desde a última visualização
                    </span>
                  )}
                  {currentCredits < previousCredits && (
                    <span className="text-red-600">
                      -{formatCredits(previousCredits - currentCredits)} desde a última visualização
                    </span>
                  )}
                </p>
              )}
            </div>
          </TooltipContent>
        </Tooltip>

        {showPurchaseButton && currentCredits <= warningThreshold && (
          <Button
            variant="outline"
            size="sm"
            onClick={onPurchaseClick}
            className="gap-1 text-xs"
          >
            <Plus className="w-3 h-3" />
            Comprar
          </Button>
        )}
      </div>
    </TooltipProvider>
  );
};

export default CreditCounter;