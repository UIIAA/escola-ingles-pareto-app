import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const NotificationSettings = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Preferências de Notificação</CardTitle>
        <CardDescription>
          Configure como deseja receber notificações
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="email-notifications" className="font-medium">
                Notificações por Email
              </Label>
              <p className="text-sm text-muted-foreground">
                Receba atualizações sobre suas aulas e pagamentos
              </p>
            </div>
            <Switch id="email-notifications" defaultChecked />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="lesson-reminders" className="font-medium">
                Lembretes de Aulas
              </Label>
              <p className="text-sm text-muted-foreground">
                Receba lembretes 30 minutos antes das aulas
              </p>
            </div>
            <Switch id="lesson-reminders" defaultChecked />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="credit-alerts" className="font-medium">
                Alertas de Créditos
              </Label>
              <p className="text-sm text-muted-foreground">
                Receba alertas quando seus créditos estiverem baixos
              </p>
            </div>
            <Switch id="credit-alerts" defaultChecked />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="promotional" className="font-medium">
                Ofertas e Promoções
              </Label>
              <p className="text-sm text-muted-foreground">
                Receba informações sobre pacotes promocionais
              </p>
            </div>
            <Switch id="promotional" />
          </div>
          
          <Button className="w-full">
            Salvar Preferências
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationSettings;