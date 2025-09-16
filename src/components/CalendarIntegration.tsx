import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, CheckCircle, AlertCircle } from "lucide-react";

const CalendarIntegration = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [syncStatus, setSyncStatus] = useState<"idle" | "syncing" | "success" | "error">("idle");

  const handleConnect = () => {
    // Simular processo de conexão
    setIsConnected(true);
    setSyncStatus("syncing");
    
    // Simular sincronização
    setTimeout(() => {
      setSyncStatus("success");
    }, 2000);
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    setSyncStatus("idle");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Calendar className="mr-2 h-5 w-5" />
          Integração com Google Calendar
        </CardTitle>
        <CardDescription>
          Sincronize sua disponibilidade com o Google Calendar
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Status da Conexão</p>
              <div className="flex items-center mt-1">
                {isConnected ? (
                  <>
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    <span className="text-sm text-green-600">Conectado</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="h-4 w-4 text-yellow-500 mr-2" />
                    <span className="text-sm text-yellow-600">Não conectado</span>
                  </>
                )}
              </div>
            </div>
            {isConnected ? (
              <Button variant="outline" onClick={handleDisconnect}>
                Desconectar
              </Button>
            ) : (
              <Button onClick={handleConnect}>
                Conectar ao Google
              </Button>
            )}
          </div>

          {isConnected && (
            <div className="border rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <p className="font-medium">Sincronização</p>
                {syncStatus === "syncing" && (
                  <Badge variant="secondary">Sincronizando...</Badge>
                )}
                {syncStatus === "success" && (
                  <Badge variant="default">Sincronizado</Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                Sua disponibilidade será sincronizada automaticamente com o Google Calendar.
              </p>
            </div>
          )}

          <div className="text-xs text-muted-foreground space-y-1">
            <p>• As aulas agendadas aparecerão no seu calendário</p>
            <p>• Alterações na disponibilidade são sincronizadas em tempo real</p>
            <p>• Você pode desconectar a qualquer momento</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CalendarIntegration;