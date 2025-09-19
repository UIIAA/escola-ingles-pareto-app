import React, { useState } from 'react';
import AdminPageLayout from '@/components/AdminPageLayout';
import GoogleCalendarSetup from '@/components/GoogleCalendarSetup';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Settings,
  Globe,
  Mail,
  CreditCard,
  Shield,
  Bell,
  Database,
  Key,
  Eye,
  EyeOff,
  Save,
  RefreshCw,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

const AdminSettings = () => {
  const [showApiKeys, setShowApiKeys] = useState(false);
  const [unsavedChanges, setUnsavedChanges] = useState(false);

  // Estados para configurações
  const [settings, setSettings] = useState({
    // Configurações Gerais
    siteName: 'Escola Inglês Pareto',
    siteUrl: 'https://inglespareto.com.br',
    supportEmail: 'suporte@inglespareto.com',
    maxUsers: 1000,
    maintenanceMode: false,
    registrationEnabled: true,

    // Configurações de Email
    smtpHost: 'smtp.gmail.com',
    smtpPort: '587',
    smtpUsername: 'noreply@inglespareto.com',
    smtpPassword: '••••••••••••',
    emailFromName: 'Escola Inglês Pareto',

    // Configurações de Pagamento
    mercadoPagoPublicKey: 'APP_USR_••••••••••••',
    mercadoPagoAccessToken: '••••••••••••',
    pixEnabled: true,
    creditCardEnabled: true,
    bankTransferEnabled: true,

    // APIs Externas
    googleApiKey: 'AIza••••••••••••',
    googleClientId: '123456••••••••••',
    openaiApiKey: 'sk-••••••••••••',
    anthropicApiKey: 'sk-ant-••••••••••••',

    // Configurações de Sistema
    sessionTimeout: 60,
    maxFileSize: 10,
    backupFrequency: 'daily',
    logLevel: 'info',

    // Notificações
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,

    // Features
    forumEnabled: true,
    aiChatEnabled: true,
    calendarIntegration: true,
    multiLanguage: false
  });

  const handleSettingChange = (key: string, value: string | number | boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setUnsavedChanges(true);
  };

  const handleSave = () => {
    // Aqui faria a integração com a API
    console.log('Saving settings:', settings);
    setUnsavedChanges(false);
  };

  const maskApiKey = (key: string) => {
    if (!key || key.includes('••••')) return key;
    return key.substring(0, 8) + '••••••••••••';
  };

  const integrationStatus = {
    googleCalendar: { status: 'connected', lastSync: '2024-09-18 14:30' },
    mercadoPago: { status: 'connected', lastSync: '2024-09-18 12:15' },
    openai: { status: 'error', lastSync: 'Falha na conexão' },
    supabase: { status: 'connected', lastSync: '2024-09-18 15:45' }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      connected: 'default',
      error: 'destructive',
      disconnected: 'secondary'
    } as const;

    const labels = {
      connected: 'Conectado',
      error: 'Erro',
      disconnected: 'Desconectado'
    };

    return (
      <Badge variant={variants[status as keyof typeof variants]}>
        {labels[status as keyof typeof labels]}
      </Badge>
    );
  };

  return (
    <AdminPageLayout
      title="Configurações do Sistema"
      description="Gerencie todas as configurações da plataforma"
    >
      {/* Header com ações */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          {unsavedChanges && (
            <Badge variant="outline" className="text-orange-600">
              <AlertTriangle className="h-3 w-3 mr-1" />
              Alterações não salvas
            </Badge>
          )}
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Resetar
          </Button>
          <Button onClick={handleSave} disabled={!unsavedChanges}>
            <Save className="mr-2 h-4 w-4" />
            Salvar Alterações
          </Button>
        </div>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="general">Geral</TabsTrigger>
          <TabsTrigger value="email">Email</TabsTrigger>
          <TabsTrigger value="payment">Pagamentos</TabsTrigger>
          <TabsTrigger value="apis">APIs</TabsTrigger>
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
          <TabsTrigger value="system">Sistema</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Globe className="mr-2 h-5 w-5" />
                  Informações Básicas
                </CardTitle>
                <CardDescription>
                  Configurações gerais da plataforma
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="siteName">Nome do Site</Label>
                  <Input
                    id="siteName"
                    value={settings.siteName}
                    onChange={(e) => handleSettingChange('siteName', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="siteUrl">URL do Site</Label>
                  <Input
                    id="siteUrl"
                    value={settings.siteUrl}
                    onChange={(e) => handleSettingChange('siteUrl', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="supportEmail">Email de Suporte</Label>
                  <Input
                    id="supportEmail"
                    type="email"
                    value={settings.supportEmail}
                    onChange={(e) => handleSettingChange('supportEmail', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxUsers">Limite de Usuários</Label>
                  <Input
                    id="maxUsers"
                    type="number"
                    value={settings.maxUsers}
                    onChange={(e) => handleSettingChange('maxUsers', parseInt(e.target.value))}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="mr-2 h-5 w-5" />
                  Configurações de Acesso
                </CardTitle>
                <CardDescription>
                  Controle de acesso e segurança
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Modo de Manutenção</Label>
                    <p className="text-sm text-muted-foreground">
                      Bloqueia acesso para usuários comuns
                    </p>
                  </div>
                  <Switch
                    checked={settings.maintenanceMode}
                    onCheckedChange={(checked) => handleSettingChange('maintenanceMode', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Registro de Novos Usuários</Label>
                    <p className="text-sm text-muted-foreground">
                      Permite cadastro de novos usuários
                    </p>
                  </div>
                  <Switch
                    checked={settings.registrationEnabled}
                    onCheckedChange={(checked) => handleSettingChange('registrationEnabled', checked)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sessionTimeout">Timeout de Sessão (minutos)</Label>
                  <Input
                    id="sessionTimeout"
                    type="number"
                    value={settings.sessionTimeout}
                    onChange={(e) => handleSettingChange('sessionTimeout', parseInt(e.target.value))}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="email">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Mail className="mr-2 h-5 w-5" />
                Configurações de Email
              </CardTitle>
              <CardDescription>
                Configure o servidor SMTP para envio de emails
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="smtpHost">Servidor SMTP</Label>
                    <Input
                      id="smtpHost"
                      value={settings.smtpHost}
                      onChange={(e) => handleSettingChange('smtpHost', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="smtpPort">Porta</Label>
                    <Input
                      id="smtpPort"
                      value={settings.smtpPort}
                      onChange={(e) => handleSettingChange('smtpPort', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="smtpUsername">Usuário</Label>
                    <Input
                      id="smtpUsername"
                      value={settings.smtpUsername}
                      onChange={(e) => handleSettingChange('smtpUsername', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="smtpPassword">Senha</Label>
                    <Input
                      id="smtpPassword"
                      type="password"
                      value={settings.smtpPassword}
                      onChange={(e) => handleSettingChange('smtpPassword', e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="emailFromName">Nome do Remetente</Label>
                    <Input
                      id="emailFromName"
                      value={settings.emailFromName}
                      onChange={(e) => handleSettingChange('emailFromName', e.target.value)}
                    />
                  </div>

                  <div className="space-y-4 pt-4">
                    <h4 className="font-medium">Tipos de Notificação</h4>
                    <div className="flex items-center justify-between">
                      <Label>Notificações por Email</Label>
                      <Switch
                        checked={settings.emailNotifications}
                        onCheckedChange={(checked) => handleSettingChange('emailNotifications', checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Notificações SMS</Label>
                      <Switch
                        checked={settings.smsNotifications}
                        onCheckedChange={(checked) => handleSettingChange('smsNotifications', checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Notificações Push</Label>
                      <Switch
                        checked={settings.pushNotifications}
                        onCheckedChange={(checked) => handleSettingChange('pushNotifications', checked)}
                      />
                    </div>
                  </div>

                  <Button className="w-full">
                    <Mail className="mr-2 h-4 w-4" />
                    Testar Envio de Email
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payment">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="mr-2 h-5 w-5" />
                Configurações de Pagamento
              </CardTitle>
              <CardDescription>
                Configure gateways de pagamento
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-medium">MercadoPago</h4>
                    <div className="space-y-2">
                      <Label htmlFor="mpPublicKey">Chave Pública</Label>
                      <Input
                        id="mpPublicKey"
                        value={settings.mercadoPagoPublicKey}
                        onChange={(e) => handleSettingChange('mercadoPagoPublicKey', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="mpAccessToken">Access Token</Label>
                      <Input
                        id="mpAccessToken"
                        type="password"
                        value={settings.mercadoPagoAccessToken}
                        onChange={(e) => handleSettingChange('mercadoPagoAccessToken', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium">Métodos de Pagamento</h4>
                    <div className="flex items-center justify-between">
                      <Label>PIX</Label>
                      <Switch
                        checked={settings.pixEnabled}
                        onCheckedChange={(checked) => handleSettingChange('pixEnabled', checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Cartão de Crédito</Label>
                      <Switch
                        checked={settings.creditCardEnabled}
                        onCheckedChange={(checked) => handleSettingChange('creditCardEnabled', checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Transferência Bancária</Label>
                      <Switch
                        checked={settings.bankTransferEnabled}
                        onCheckedChange={(checked) => handleSettingChange('bankTransferEnabled', checked)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calendar">
          <GoogleCalendarSetup />
        </TabsContent>

        <TabsContent value="apis">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Key className="mr-2 h-5 w-5" />
                    Chaves de API
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowApiKeys(!showApiKeys)}
                  >
                    {showApiKeys ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </CardTitle>
                <CardDescription>
                  Configure as integrações com serviços externos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="googleApiKey">Google API Key</Label>
                      <Input
                        id="googleApiKey"
                        type={showApiKeys ? "text" : "password"}
                        value={showApiKeys ? settings.googleApiKey : maskApiKey(settings.googleApiKey)}
                        onChange={(e) => handleSettingChange('googleApiKey', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="googleClientId">Google Client ID</Label>
                      <Input
                        id="googleClientId"
                        type={showApiKeys ? "text" : "password"}
                        value={showApiKeys ? settings.googleClientId : maskApiKey(settings.googleClientId)}
                        onChange={(e) => handleSettingChange('googleClientId', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="openaiApiKey">OpenAI API Key</Label>
                      <Input
                        id="openaiApiKey"
                        type={showApiKeys ? "text" : "password"}
                        value={showApiKeys ? settings.openaiApiKey : maskApiKey(settings.openaiApiKey)}
                        onChange={(e) => handleSettingChange('openaiApiKey', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="anthropicApiKey">Anthropic API Key</Label>
                      <Input
                        id="anthropicApiKey"
                        type={showApiKeys ? "text" : "password"}
                        value={showApiKeys ? settings.anthropicApiKey : maskApiKey(settings.anthropicApiKey)}
                        onChange={(e) => handleSettingChange('anthropicApiKey', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Status das Integrações */}
            <Card>
              <CardHeader>
                <CardTitle>Status das Integrações</CardTitle>
                <CardDescription>
                  Monitoramento das conexões com APIs externas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(integrationStatus).map(([service, status]) => (
                    <div key={service} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <div>
                          <div className="font-medium capitalize">{service.replace(/([A-Z])/g, ' $1')}</div>
                          <div className="text-xs text-muted-foreground">
                            Último sync: {status.lastSync}
                          </div>
                        </div>
                      </div>
                      {getStatusBadge(status.status)}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="system">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Database className="mr-2 h-5 w-5" />
                Configurações de Sistema
              </CardTitle>
              <CardDescription>
                Configurações técnicas e de performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="maxFileSize">Tamanho Máximo de Arquivo (MB)</Label>
                    <Input
                      id="maxFileSize"
                      type="number"
                      value={settings.maxFileSize}
                      onChange={(e) => handleSettingChange('maxFileSize', parseInt(e.target.value))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="backupFrequency">Frequência de Backup</Label>
                    <Select
                      value={settings.backupFrequency}
                      onValueChange={(value) => handleSettingChange('backupFrequency', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hourly">A cada hora</SelectItem>
                        <SelectItem value="daily">Diário</SelectItem>
                        <SelectItem value="weekly">Semanal</SelectItem>
                        <SelectItem value="monthly">Mensal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="logLevel">Nível de Log</Label>
                    <Select
                      value={settings.logLevel}
                      onValueChange={(value) => handleSettingChange('logLevel', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="error">Error</SelectItem>
                        <SelectItem value="warn">Warning</SelectItem>
                        <SelectItem value="info">Info</SelectItem>
                        <SelectItem value="debug">Debug</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-4 pt-4">
                    <Button className="w-full" variant="outline">
                      <Database className="mr-2 h-4 w-4" />
                      Executar Backup Manual
                    </Button>
                    <Button className="w-full" variant="outline">
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Limpar Cache
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="features">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="mr-2 h-5 w-5" />
                Funcionalidades
              </CardTitle>
              <CardDescription>
                Ative ou desative funcionalidades da plataforma
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Fórum de Discussões</Label>
                      <p className="text-sm text-muted-foreground">
                        Permite que usuários criem tópicos e discutam
                      </p>
                    </div>
                    <Switch
                      checked={settings.forumEnabled}
                      onCheckedChange={(checked) => handleSettingChange('forumEnabled', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Chat com IA</Label>
                      <p className="text-sm text-muted-foreground">
                        Assistente virtual para prática
                      </p>
                    </div>
                    <Switch
                      checked={settings.aiChatEnabled}
                      onCheckedChange={(checked) => handleSettingChange('aiChatEnabled', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Integração com Calendário</Label>
                      <p className="text-sm text-muted-foreground">
                        Sincronização com Google Calendar
                      </p>
                    </div>
                    <Switch
                      checked={settings.calendarIntegration}
                      onCheckedChange={(checked) => handleSettingChange('calendarIntegration', checked)}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Multi-idioma</Label>
                      <p className="text-sm text-muted-foreground">
                        Interface em múltiplos idiomas
                      </p>
                    </div>
                    <Switch
                      checked={settings.multiLanguage}
                      onCheckedChange={(checked) => handleSettingChange('multiLanguage', checked)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Outras configurações futuras</Label>
                    <p className="text-sm text-muted-foreground">
                      Mais funcionalidades serão adicionadas aqui conforme necessário.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </AdminPageLayout>
  );
};

export default AdminSettings;