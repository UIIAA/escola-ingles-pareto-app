import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Calendar,
  CheckCircle,
  AlertTriangle,
  Settings,
  Key,
  Link,
  Info,
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import { googleCalendarService } from '@/services/google-calendar';

const GoogleCalendarSetup = () => {
  const [isConfigured, setIsConfigured] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'error' | 'not_configured'>('checking');
  const [calendarId, setCalendarId] = useState<string | null>(null);
  const [testResults, setTestResults] = useState<{
    status: 'testing' | 'success' | 'error';
    message: string;
    data?: { slots: Array<{ time: string; available: boolean }> };
  } | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [credentials, setCredentials] = useState({
    apiKey: '',
    clientId: '',
    clientSecret: ''
  });

  useEffect(() => {
    // Carrega credenciais atuais
    setCredentials({
      apiKey: import.meta.env.VITE_GOOGLE_API_KEY || '',
      clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID || '',
      clientSecret: import.meta.env.VITE_GOOGLE_CLIENT_SECRET || ''
    });
    checkConfiguration();
  }, []);

  const checkConfiguration = async () => {
    setConnectionStatus('checking');

    try {
      const configured = googleCalendarService.isConfigured();
      setIsConfigured(configured);

      if (configured) {
        const initialized = await googleCalendarService.initialize();
        if (initialized) {
          setConnectionStatus('connected');
          // Tenta buscar ou criar o calendário Pareto
          const paretoCalendarId = await googleCalendarService.ensureParetoCalendarExists();
          setCalendarId(paretoCalendarId);
        } else {
          setConnectionStatus('error');
        }
      } else {
        setConnectionStatus('not_configured');
      }
    } catch (error) {
      console.error('Erro ao verificar configuração:', error);
      setConnectionStatus('error');
    }
  };

  const testConnection = async () => {
    try {
      setTestResults({ status: 'testing', message: 'Testando conexão...' });

      // Testa buscar eventos de hoje
      const today = new Date();
      const slots = await googleCalendarService.getAvailableTimeSlots(today);

      setTestResults({
        status: 'success',
        message: `Conexão funcionando! Encontrados ${slots.length} horários para hoje.`,
        data: { slots: slots.slice(0, 5) } // Mostra apenas os primeiros 5
      });
    } catch (error) {
      setTestResults({
        status: 'error',
        message: `Erro no teste: ${(error as Error).message}`
      });
    }
  };

  const saveCredentials = async () => {
    try {
      // Lê o .env atual via fetch (se disponível)
      let currentEnv = '';
      try {
        const response = await fetch('/.env');
        if (response.ok) {
          currentEnv = await response.text();
        }
      } catch {
        // Se não conseguir ler, cria novo conteúdo
      }

      // Função para atualizar ou adicionar variável
      const updateEnvVar = (content, key, value) => {
        const regex = new RegExp(`^${key}=.*$`, 'm');
        const newLine = `${key}=${value}`;

        if (regex.test(content)) {
          return content.replace(regex, newLine);
        } else {
          return content + (content.endsWith('\n') || content === '' ? '' : '\n') + newLine + '\n';
        }
      };

      // Atualiza as variáveis
      let newEnvContent = currentEnv;
      newEnvContent = updateEnvVar(newEnvContent, 'VITE_GOOGLE_API_KEY', credentials.apiKey);
      newEnvContent = updateEnvVar(newEnvContent, 'VITE_GOOGLE_CLIENT_ID', credentials.clientId);
      newEnvContent = updateEnvVar(newEnvContent, 'VITE_GOOGLE_CLIENT_SECRET', credentials.clientSecret);

      // Cria download do arquivo .env atualizado
      const blob = new Blob([newEnvContent], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = '.env';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      alert('Arquivo .env baixado! Substitua o arquivo .env atual e reinicie a aplicação.');
      setEditMode(false);
    } catch (error) {
      console.error('Erro ao gerar .env:', error);
      // Fallback - copia para clipboard
      const envContent = `
# Google Calendar API Credentials
VITE_GOOGLE_API_KEY=${credentials.apiKey}
VITE_GOOGLE_CLIENT_ID=${credentials.clientId}
VITE_GOOGLE_CLIENT_SECRET=${credentials.clientSecret}

# Outras variáveis do projeto (mantenha as existentes)
VITE_SUPABASE_URL=sua_url_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_supabase
VITE_MERCADOPAGO_PUBLIC_KEY=sua_chave_mercadopago
VITE_OPENAI_API_KEY=sua_chave_openai
VITE_ANTHROPIC_API_KEY=sua_chave_anthropic
      `;
      navigator.clipboard.writeText(envContent.trim());
      alert('Credenciais copiadas para clipboard! Cole no arquivo .env e reinicie a aplicação.');
    }
  };

  const getStatusBadge = () => {
    switch (connectionStatus) {
      case 'checking':
        return <Badge variant="outline">Verificando...</Badge>;
      case 'connected':
        return <Badge className="bg-green-600">Conectado</Badge>;
      case 'error':
        return <Badge variant="destructive">Erro</Badge>;
      case 'not_configured':
        return <Badge variant="secondary">Não Configurado</Badge>;
    }
  };

  const getStatusIcon = () => {
    switch (connectionStatus) {
      case 'checking':
        return <RefreshCw className="h-5 w-5 animate-spin" />;
      case 'connected':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'error':
        return <AlertTriangle className="h-5 w-5 text-red-600" />;
      case 'not_configured':
        return <Settings className="h-5 w-5 text-gray-600" />;
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-6 w-6" />
          Configuração do Google Calendar
          {getStatusBadge()}
        </CardTitle>
        <CardDescription>
          Configure a integração com o Google Calendar para verificação real de disponibilidade
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="status" className="space-y-6">
          <TabsList>
            <TabsTrigger value="status">Status</TabsTrigger>
            <TabsTrigger value="setup">Configuração</TabsTrigger>
            <TabsTrigger value="test">Teste</TabsTrigger>
            <TabsTrigger value="help">Ajuda</TabsTrigger>
          </TabsList>

          <TabsContent value="status">
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 border rounded-lg">
                {getStatusIcon()}
                <div className="flex-1">
                  <h3 className="font-medium">Status da Conexão</h3>
                  <p className="text-sm text-muted-foreground">
                    {connectionStatus === 'connected' && 'Google Calendar conectado e funcionando'}
                    {connectionStatus === 'error' && 'Erro na conexão com Google Calendar'}
                    {connectionStatus === 'not_configured' && 'Credenciais do Google Calendar não configuradas'}
                    {connectionStatus === 'checking' && 'Verificando status da conexão...'}
                  </p>
                </div>
                <Button variant="outline" size="sm" onClick={checkConfiguration}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Verificar
                </Button>
              </div>

              {connectionStatus === 'connected' && calendarId && (
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    Calendário "Aulas Inglês Pareto" configurado com ID: <code className="text-xs">{calendarId}</code>
                  </AlertDescription>
                </Alert>
              )}

              {connectionStatus === 'not_configured' && (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Para ativar a verificação real de disponibilidade, configure as credenciais do Google Calendar no arquivo .env
                  </AlertDescription>
                </Alert>
              )}

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="p-4 border rounded-lg text-center">
                  <Key className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                  <h4 className="font-medium">API Key</h4>
                  <p className="text-sm text-muted-foreground">
                    {import.meta.env.VITE_GOOGLE_API_KEY && !import.meta.env.VITE_GOOGLE_API_KEY.includes('your_google_api_key') ? '✅ Configurada' : '❌ Faltando'}
                  </p>
                </div>
                <div className="p-4 border rounded-lg text-center">
                  <Link className="h-8 w-8 mx-auto mb-2 text-green-600" />
                  <h4 className="font-medium">Client ID</h4>
                  <p className="text-sm text-muted-foreground">
                    {import.meta.env.VITE_GOOGLE_CLIENT_ID && !import.meta.env.VITE_GOOGLE_CLIENT_ID.includes('your_google_client_id') ? '✅ Configurada' : '❌ Faltando'}
                  </p>
                </div>
                <div className="p-4 border rounded-lg text-center">
                  <Settings className="h-8 w-8 mx-auto mb-2 text-orange-600" />
                  <h4 className="font-medium">Client Secret</h4>
                  <p className="text-sm text-muted-foreground">
                    {import.meta.env.VITE_GOOGLE_CLIENT_SECRET && !import.meta.env.VITE_GOOGLE_CLIENT_SECRET.includes('your_google_client_secret') ? '✅ Configurada' : '❌ Faltando'}
                  </p>
                </div>
                <div className="p-4 border rounded-lg text-center">
                  <Calendar className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                  <h4 className="font-medium">Calendário</h4>
                  <p className="text-sm text-muted-foreground">
                    {calendarId ? '✅ Configurado' : '❌ Não encontrado'}
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="setup">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <Alert className="flex-1 mr-4">
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    Configure estas credenciais para ativar a integração real com Google Calendar
                  </AlertDescription>
                </Alert>
                <Button
                  variant={editMode ? "secondary" : "outline"}
                  onClick={() => setEditMode(!editMode)}
                >
                  {editMode ? 'Cancelar' : 'Editar'}
                </Button>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="apiKey">VITE_GOOGLE_API_KEY</Label>
                  <Input
                    id="apiKey"
                    placeholder="AIza..."
                    value={editMode ? credentials.apiKey : (credentials.apiKey ? '••••••••••••••••' : '')}
                    onChange={(e) => editMode && setCredentials({...credentials, apiKey: e.target.value})}
                    readOnly={!editMode}
                    className="font-mono text-sm"
                  />
                  <p className="text-xs text-muted-foreground">
                    Chave da API do Google Cloud Console
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="clientId">VITE_GOOGLE_CLIENT_ID</Label>
                  <Input
                    id="clientId"
                    placeholder="123456789..."
                    value={editMode ? credentials.clientId : (credentials.clientId ? '••••••••••••••••' : '')}
                    onChange={(e) => editMode && setCredentials({...credentials, clientId: e.target.value})}
                    readOnly={!editMode}
                    className="font-mono text-sm"
                  />
                  <p className="text-xs text-muted-foreground">
                    Client ID OAuth 2.0 do Google Cloud Console
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="clientSecret">VITE_GOOGLE_CLIENT_SECRET</Label>
                  <Input
                    id="clientSecret"
                    placeholder="GOCSPX-..."
                    value={editMode ? credentials.clientSecret : (credentials.clientSecret ? '••••••••••••••••' : '')}
                    onChange={(e) => editMode && setCredentials({...credentials, clientSecret: e.target.value})}
                    readOnly={!editMode}
                    type={editMode ? "text" : "password"}
                    className="font-mono text-sm"
                  />
                  <p className="text-xs text-muted-foreground">
                    Client Secret OAuth 2.0 do Google Cloud Console
                  </p>
                </div>

                {editMode && (
                  <div className="flex gap-2">
                    <Button onClick={saveCredentials} className="flex-1">
                      Salvar Credenciais
                    </Button>
                    <Button variant="outline" onClick={() => setEditMode(false)}>
                      Cancelar
                    </Button>
                  </div>
                )}
              </div>

              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-medium mb-2">Exemplo do arquivo .env:</h4>
                <pre className="text-xs bg-background p-3 rounded border">
{`VITE_GOOGLE_API_KEY=AIzaSyC...
VITE_GOOGLE_CLIENT_ID=123456789-abc...
VITE_GOOGLE_CLIENT_SECRET=GOCSPX-...`}
                </pre>
              </div>

              <Button asChild>
                <a
                  href="https://console.cloud.google.com/apis/credentials"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Abrir Google Cloud Console
                </a>
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="test">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Teste de Conexão</h3>
                  <p className="text-sm text-muted-foreground">
                    Verifica se a integração está funcionando corretamente
                  </p>
                </div>
                <Button onClick={testConnection} disabled={connectionStatus !== 'connected'}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Testar Agora
                </Button>
              </div>

              {testResults && (
                <Alert className={testResults.status === 'error' ? 'border-red-200' : 'border-green-200'}>
                  {testResults.status === 'error' ? (
                    <AlertTriangle className="h-4 w-4" />
                  ) : (
                    <CheckCircle className="h-4 w-4" />
                  )}
                  <AlertDescription>
                    {testResults.message}
                    {testResults.data?.slots && (
                      <div className="mt-2">
                        <p className="text-sm font-medium">Horários encontrados:</p>
                        <div className="flex gap-2 mt-1">
                          {testResults.data.slots.map((slot, index: number) => (
                            <Badge key={index} variant={slot.available ? 'default' : 'secondary'}>
                              {slot.time} {slot.available ? '✅' : '❌'}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </AlertDescription>
                </Alert>
              )}

              {connectionStatus !== 'connected' && (
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    Configure as credenciais primeiro para realizar o teste de conexão
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </TabsContent>

          <TabsContent value="help">
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-medium">Como Configurar</h3>

                <ol className="list-decimal list-inside space-y-2 text-sm">
                  <li>Acesse o <a href="https://console.cloud.google.com" target="_blank" className="text-blue-600 hover:underline">Google Cloud Console</a></li>
                  <li>Crie um novo projeto ou selecione um existente</li>
                  <li>Ative a API do Google Calendar</li>
                  <li>Crie credenciais OAuth 2.0</li>
                  <li>Configure as variáveis no arquivo .env</li>
                  <li>Reinicie a aplicação</li>
                </ol>
              </div>

              <div className="space-y-4">
                <h3 className="font-medium">Como Funciona</h3>

                <div className="space-y-2 text-sm">
                  <p>• <strong>Calendário Dedicado:</strong> Cria um calendário específico "Aulas Inglês Pareto"</p>
                  <p>• <strong>Verificação Real:</strong> Consulta eventos existentes para calcular disponibilidade</p>
                  <p>• <strong>Fallback Inteligente:</strong> Usa dados mockados quando a API não está configurada</p>
                  <p>• <strong>Sincronização:</strong> Mantém horários sempre atualizados</p>
                </div>
              </div>

              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  <strong>Nota:</strong> Mesmo sem configurar o Google Calendar, o sistema continua funcionando com dados mockados realistas. A configuração é opcional mas recomendada para produção.
                </AlertDescription>
              </Alert>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default GoogleCalendarSetup;