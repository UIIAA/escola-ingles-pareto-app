import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { getActivityConfig, ActivityCostConfig } from '@/types/credits';
import { Zap, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ActivityCostIndicatorProps {
  activityType: string;
  userCredits?: number;
  position?: 'inline' | 'tooltip' | 'badge';
  showWarning?: boolean;
  showDescription?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const ActivityCostIndicator: React.FC<ActivityCostIndicatorProps> = ({
  activityType,
  userCredits = 0,
  position = 'badge',
  showWarning = true,
  showDescription = false,
  className,
  size = 'md'
}) => {
  const config = getActivityConfig(activityType);

  if (!config) {
    return null;
  }

  const formatCredits = (amount: number): string => {
    return amount % 1 === 0 ? amount.toString() : amount.toFixed(1);
  };

  const canAfford = userCredits >= config.cost;
  const isLowCredits = userCredits < config.cost * 2; // Warning when less than 2x activity cost

  const getCostColor = (): string => {
    if (!canAfford) return 'text-red-600';
    if (isLowCredits && showWarning) return 'text-orange-600';
    return 'text-green-600';
  };

  const getCostBackgroundColor = (): string => {
    if (!canAfford) return 'bg-red-50 border-red-200';
    if (isLowCredits && showWarning) return 'bg-orange-50 border-orange-200';
    return 'bg-green-50 border-green-200';
  };

  const getStatusIcon = () => {
    if (!canAfford) return <AlertTriangle className="w-3 h-3 text-red-500" />;
    if (isLowCredits && showWarning) return <AlertTriangle className="w-3 h-3 text-orange-500" />;
    return <CheckCircle className="w-3 h-3 text-green-500" />;
  };

  const getCategoryIcon = (category: ActivityCostConfig['category']) => {
    switch (category) {
      case 'communication':
        return '💬';
      case 'learning':
        return '📚';
      case 'assessment':
        return '📝';
      case 'lesson':
        return '🎓';
      default:
        return '⚡';
    }
  };

  const getCategoryColor = (category: ActivityCostConfig['category']): string => {
    switch (category) {
      case 'communication':
        return 'bg-blue-100 text-blue-800';
      case 'learning':
        return 'bg-purple-100 text-purple-800';
      case 'assessment':
        return 'bg-orange-100 text-orange-800';
      case 'lesson':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'text-xs px-1.5 py-0.5';
      case 'lg':
        return 'text-sm px-3 py-1.5';
      default:
        return 'text-xs px-2 py-1';
    }
  };

  const getTooltipContent = () => (
    <div className="space-y-2 text-center">
      <div>
        <p className="font-medium text-sm">Custo da Atividade</p>
        <p className="text-lg font-bold">
          {formatCredits(config.cost)} {config.cost === 1 ? 'crédito' : 'créditos'}
        </p>
      </div>

      <div className="text-xs text-gray-600 space-y-1">
        <p>{config.description}</p>
        <div className="flex items-center justify-center gap-2">
          <Badge variant="outline" className={getCategoryColor(config.category)}>
            {getCategoryIcon(config.category)} {config.category}
          </Badge>
        </div>
      </div>

      <div className="border-t pt-2 space-y-1">
        <div className="flex items-center justify-between text-xs">
          <span>Seus créditos:</span>
          <span className={getCostColor()}>{formatCredits(userCredits)}</span>
        </div>
        <div className="flex items-center justify-between text-xs font-medium">
          <span>Após esta ação:</span>
          <span className={getCostColor()}>
            {formatCredits(Math.max(0, userCredits - config.cost))}
          </span>
        </div>
      </div>

      {!canAfford && (
        <div className="bg-red-50 border border-red-200 rounded p-2 text-xs text-red-700">
          ⚠️ Créditos insuficientes! Você precisa de mais {formatCredits(config.cost - userCredits)} créditos.
        </div>
      )}

      {config.requiresConfirmation && (
        <div className="flex items-center justify-center gap-1 text-xs text-gray-500">
          <Clock className="w-3 h-3" />
          Requer confirmação
        </div>
      )}
    </div>
  );

  const CostBadge = () => (
    <Badge
      variant="outline"
      className={cn(
        'flex items-center gap-1 font-medium border transition-colors',
        getCostBackgroundColor(),
        getSizeClasses(),
        className
      )}
    >
      <Zap className="w-3 h-3" />
      {formatCredits(config.cost)}
      {showWarning && getStatusIcon()}
    </Badge>
  );

  const InlineIndicator = () => (
    <div className={cn('flex items-center gap-2 text-sm', className)}>
      <span className="text-gray-600">Custo:</span>
      <CostBadge />
      {showDescription && (
        <span className="text-xs text-gray-500">{config.description}</span>
      )}
    </div>
  );

  if (position === 'inline') {
    return <InlineIndicator />;
  }

  if (position === 'tooltip') {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className={cn('inline-flex', className)}>
              <CostBadge />
            </div>
          </TooltipTrigger>
          <TooltipContent className="max-w-xs">
            {getTooltipContent()}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  // Default badge position with tooltip
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={cn('inline-flex', className)}>
            <CostBadge />
          </div>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs">
          {getTooltipContent()}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default ActivityCostIndicator;