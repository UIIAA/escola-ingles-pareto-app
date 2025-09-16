import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CreditCard, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

const CreditBalance = ({ credits = 8, onBuyCredits }: { credits?: number; onBuyCredits?: () => void }) => {
  const isLowBalance = credits <= 2;
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <CreditCard className="mr-2 h-5 w-5" />
          Saldo de Créditos
        </CardTitle>
        <CardDescription>
          Gerencie seus créditos para agendamento de aulas
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Créditos disponíveis:</span>
            <span className={`text-2xl font-bold ${isLowBalance ? 'text-red-600' : ''}`}>
              {credits}
            </span>
          </div>
          
          {isLowBalance && (
            <div className="flex items-center p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2" />
              <div>
                <p className="text-sm font-medium text-yellow-800">Saldo baixo</p>
                <p className="text-xs text-yellow-700">
                  Você tem apenas {credits} créditos restantes
                </p>
              </div>
            </div>
          )}
          
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Próximo desconto:</span>
            <Badge>{credits < 12 ? '5% (ao comprar 12 aulas)' : 
                   credits < 24 ? '10% (ao comprar 24 aulas)' : 
                   credits < 36 ? '15% (ao comprar 36 aulas)' : 
                   '20% (ao comprar 52 aulas)'}</Badge>
          </div>
          
          <Button className="w-full" onClick={onBuyCredits}>
            Comprar Mais Créditos
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CreditBalance;