import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  Bot,
  User,
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Settings,
  RotateCcw,
  Sparkles,
  MessageSquare,
  BookOpen,
  Award,
  Clock,
  Zap
} from 'lucide-react';

// Toast notifications
import { useToast } from '@/hooks/use-toast';

import {
  ChatMessage,
  ChatSession,
  ConversationMode,
  LanguageLevel,
  ConversationSettings,
  CONVERSATION_MODES,
  CHAT_PROMPTS,
  generateSessionId,
  generateMessageId,
  getModeInfo,
  getLevelLabel,
  getLevelColor,
  formatDuration
} from '@/types/ai-chat';
import { aiChatService } from '@/services/ai-chat';
import { speechService, type RecognitionResult } from '@/services/speech';

const AIChat = () => {
  // Estados principais
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speechError, setSpeechError] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);

  // Session stats
  const [messagesThisSession, setMessagesThisSession] = useState(0);

  // Chat session control
  const [chatEnabled, setChatEnabled] = useState(false);
  const [sessionTimeLeft, setSessionTimeLeft] = useState(0); // em segundos
  const [sessionCost] = useState(5); // créditos para ativar uma sessão de 30 minutos
  const [sessionDuration] = useState(30 * 60); // 30 minutos em segundos
  const [userCredits, setUserCredits] = useState(10); // Mock - seria carregado do backend

  // Hooks
  const { toast } = useToast();
  const userId = 'user-123'; // Mock user ID

  // Configurações
  const [settings, setSettings] = useState<ConversationSettings>({
    mode: 'practice',
    level: 'intermediate',
    voice: {
      enabled: true,
      gender: 'female',
      speed: 'normal',
      accent: 'american'
    },
    features: {
      grammarCorrection: true,
      vocabularyHelp: true,
      pronunciationFeedback: true,
      conversationSuggestions: true,
      translationHelp: false
    }
  });

  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto scroll para última mensagem
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Timer para controlar a sessão
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (chatEnabled && sessionTimeLeft > 0) {
      interval = setInterval(() => {
        setSessionTimeLeft(prev => {
          if (prev <= 1) {
            setChatEnabled(false);
            toast({
              title: "Sessão Expirada",
              description: "Sua sessão de chat IA expirou. Ative uma nova sessão para continuar.",
              variant: "destructive"
            });
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [chatEnabled, sessionTimeLeft, toast]);

  // Ativar sessão de chat
  const activateChatSession = () => {
    if (userCredits < sessionCost) {
      toast({
        title: "Créditos Insuficientes",
        description: `Você precisa de ${sessionCost} créditos para ativar uma sessão de 30 minutos.`,
        variant: "destructive"
      });
      return;
    }

    setUserCredits(prev => prev - sessionCost);
    setChatEnabled(true);
    setSessionTimeLeft(sessionDuration);
    setMessagesThisSession(0);

    toast({
      title: "Chat IA Ativado!",
      description: `Sessão de 30 minutos ativada. ${sessionCost} créditos debitados.`,
    });
  };

  // Formatar tempo restante
  const formatTimeLeft = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Iniciar nova sessão
  const startNewSession = useCallback((mode: ConversationMode = 'practice') => {
    const newSession: ChatSession = {
      id: generateSessionId(),
      userId: 'user-123', // Mock user ID
      title: `${getModeInfo(mode).name} - ${new Date().toLocaleDateString('pt-BR')}`,
      mode,
      level: settings.level,
      messages: [],
      settings: { ...settings, mode },
      startedAt: new Date().toISOString(),
      lastActiveAt: new Date().toISOString(),
      totalMessages: 0,
      totalDuration: 0,
      achievements: []
    };

    setCurrentSession(newSession);
    setMessages([]);
    setSettings({ ...settings, mode });

    // Mensagem de boas-vindas
    const welcomeMessage: ChatMessage = {
      id: generateMessageId(),
      role: 'assistant',
      content: CHAT_PROMPTS[mode].welcome,
      type: 'text',
      timestamp: new Date().toISOString(),
      suggestions: [
        'Tell me about your day',
        'I want to practice grammar',
        'Help me with pronunciation',
        'Let\'s have a conversation'
      ]
    };

    setMessages([welcomeMessage]);
  }, [settings]);

  // Enviar mensagem (com verificação de sessão ativa)
  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    if (!chatEnabled) {
      toast({
        title: "Chat IA Desabilitado",
        description: "Ative uma sessão de chat para usar a IA real.",
        variant: "destructive"
      });
      return;
    }

    const userMessage: ChatMessage = {
      id: generateMessageId(),
      role: 'user',
      content: inputMessage.trim(),
      type: 'text',
      timestamp: new Date().toISOString()
    };

    // Adicionar mensagem do usuário
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const previousMessages = messages
        .slice(-6) // Últimas 6 mensagens para contexto
        .map(msg => msg.content);

      const aiResponse = await aiChatService.sendMessage(
        userMessage.content,
        settings.mode,
        previousMessages
      );

      const chatResponse: ChatMessage = {
        id: generateMessageId(),
        role: 'assistant',
        content: aiResponse.content,
        type: 'text',
        timestamp: new Date().toISOString(),
        corrections: aiResponse.corrections,
        suggestions: aiResponse.suggestions,
        grammarFeedback: aiResponse.grammarFeedback
      };

      setMessages(prev => [...prev, chatResponse]);
      setMessagesThisSession(prev => prev + 1);

      toast({
        title: "Mensagem enviada!",
        description: "Resposta da IA gerada com sucesso.",
        duration: 2000
      });
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      // Fallback para resposta simulada
      const aiResponse = generateAIResponse(userMessage.content, settings.mode);
      setMessages(prev => [...prev, aiResponse]);

      toast({
        title: "Usando resposta simulada",
        description: "API não disponível, usando resposta simulada.",
        duration: 2000
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Gerar resposta da IA (simulada)
  const generateAIResponse = (userMessage: string, mode: ConversationMode): ChatMessage => {
    const responses = {
      practice: [
        "That's interesting! Can you tell me more about that?",
        "I understand. How do you feel about this situation?",
        "That sounds like a great experience! What was the best part?",
        "Let me help you express that better. You could say..."
      ],
      grammar: [
        "Good effort! Let me help you with the grammar here.",
        "I notice a small grammar mistake. The correct form would be...",
        "Excellent use of that grammar structure! Let's practice more.",
        "Here's a grammar tip that might help you..."
      ],
      vocabulary: [
        "Great vocabulary choice! Do you know any synonyms for that word?",
        "That's a useful word! Let me give you some example sentences.",
        "I can suggest a better word for this context...",
        "Here are some related words you might find useful..."
      ],
      pronunciation: [
        "Let me help you with the pronunciation of that word.",
        "I heard that! The stress should be on the first syllable.",
        "Good pronunciation! Try to focus on the 'th' sound.",
        "Remember to pronounce the final consonant clearly."
      ],
      conversation: [
        "That's fascinating! I've always wondered about that too.",
        "What an interesting perspective! Have you always thought this way?",
        "I completely understand. Many people feel the same way.",
        "That reminds me of something similar. Have you ever...?"
      ]
    };

    const modeResponses = responses[mode];
    const randomResponse = modeResponses[Math.floor(Math.random() * modeResponses.length)];

    return {
      id: generateMessageId(),
      role: 'assistant',
      content: randomResponse,
      type: 'text',
      timestamp: new Date().toISOString(),
      suggestions: [
        'Can you give me an example?',
        'What do you think about...?',
        'How would you say...?',
        'Tell me more'
      ],
      corrections: mode === 'grammar' ? [{
        original: userMessage,
        corrected: userMessage.replace(/\b(is)\b/g, 'was'),
        explanation: 'Use past tense for completed actions',
        rule: 'Past Simple Tense',
        examples: ['I was happy yesterday', 'She was at home']
      }] : undefined
    };
  };

  // Iniciar/parar gravação
  const toggleRecording = async () => {
    if (!speechService.isSpeechRecognitionAvailable()) {
      setSpeechError('Reconhecimento de voz não está disponível neste navegador');
      return;
    }

    if (isRecording) {
      speechService.stopRecording();
      setIsRecording(false);
      return;
    }

    // Solicita permissão do microfone
    const hasPermission = await speechService.requestMicrophonePermission();
    if (!hasPermission) {
      setSpeechError('Permissão do microfone negada');
      return;
    }

    const success = speechService.startRecording(
      {
        language: 'en-US',
        accent: settings.voice.accent,
        enabled: settings.voice.enabled
      },
      (result: RecognitionResult) => {
        if (result.isFinal) {
          setInputMessage(result.transcript);
          setIsRecording(false);
          setSpeechError(null);
        } else {
          // Mostra transcrição em tempo real
          setInputMessage(result.transcript);
        }
      },
      (error: string) => {
        setSpeechError(error);
        setIsRecording(false);
      }
    );

    if (success) {
      setIsRecording(true);
      setSpeechError(null);
    }
  };

  // Reproduzir áudio
  const playAudio = (content: string) => {
    if (!speechService.isSpeechSynthesisAvailable()) {
      setSpeechError('Síntese de voz não está disponível neste navegador');
      return;
    }

    if (speechService.isSpeaking()) {
      speechService.stopSpeaking();
      setIsPlaying(false);
      return;
    }

    const success = speechService.speak(
      content,
      {
        language: 'en-US',
        accent: settings.voice.accent,
        enabled: settings.voice.enabled
      },
      () => {
        setIsPlaying(true);
        setSpeechError(null);
      },
      () => {
        setIsPlaying(false);
      },
      (error: string) => {
        setSpeechError(error);
        setIsPlaying(false);
      }
    );

    if (!success) {
      setSpeechError('Erro ao reproduzir áudio');
    }
  };

  // Iniciar sessão padrão na primeira renderização
  useEffect(() => {
    if (!currentSession) {
      startNewSession('practice');
    }
  }, [startNewSession]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Bot className="text-blue-600" />
            AI Chat Assistant
          </h1>
          <p className="text-gray-600 mt-1">
            Pratique inglês com seu assistente pessoal de IA
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 text-sm">
            <Badge variant="outline">
              Créditos: {userCredits}
            </Badge>
            {chatEnabled && (
              <Badge variant="default" className="bg-green-600">
                ⏱️ {formatTimeLeft(sessionTimeLeft)}
              </Badge>
            )}
          </div>

          {!chatEnabled ? (
            <Button
              onClick={activateChatSession}
              disabled={userCredits < sessionCost}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Zap className="w-4 h-4 mr-1" />
              Ativar Chat IA ({sessionCost} créditos)
            </Button>
          ) : (
            <Button
              variant="outline"
              onClick={() => setShowSettings(!showSettings)}
            >
              <Settings className="w-4 h-4 mr-1" />
              Configurações
            </Button>
          )}

          <Button
            variant="outline"
            onClick={() => startNewSession(settings.mode)}
          >
            <RotateCcw className="w-4 h-4 mr-1" />
            Nova Conversa
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 min-h-[600px]">
        {/* Sidebar com modos e configurações */}
        <div className="lg:col-span-1 space-y-4">
          {/* Modos de Conversa */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Modos de Conversa</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {Object.values(CONVERSATION_MODES).map((mode) => (
                <Button
                  key={mode.id}
                  variant={settings.mode === mode.id ? "default" : "outline"}
                  className="w-full justify-start"
                  onClick={() => startNewSession(mode.id)}
                >
                  <span className="mr-2">{mode.icon}</span>
                  {mode.name}
                </Button>
              ))}
            </CardContent>
          </Card>

          {/* Configurações */}
          {showSettings && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Configurações</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Nível</label>
                  <Select
                    value={settings.level}
                    onValueChange={(value: LanguageLevel) =>
                      setSettings({...settings, level: value})}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Iniciante</SelectItem>
                      <SelectItem value="intermediate">Intermediário</SelectItem>
                      <SelectItem value="advanced">Avançado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium">Sotaque</label>
                  <Select
                    value={settings.voice.accent}
                    onValueChange={(value: string) =>
                      setSettings({...settings, voice: {...settings.voice, accent: value}})}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="american">Americano</SelectItem>
                      <SelectItem value="british">Britânico</SelectItem>
                      <SelectItem value="neutral">Neutro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Estatísticas */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Sua Jornada</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Nível:</span>
                <Badge className={getLevelColor(settings.level)}>
                  {getLevelLabel(settings.level)}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Sessões:</span>
                <span className="text-sm font-medium">12</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Tempo total:</span>
                <span className="text-sm font-medium">{formatDuration(145)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Sequência:</span>
                <span className="text-sm font-medium flex items-center gap-1">
                  🔥 3 dias
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Chat Principal */}
        <div className="lg:col-span-3">
          <Card className="h-[600px] flex flex-col">
            {/* Chat Header */}
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span>{getModeInfo(settings.mode).icon}</span>
                  <CardTitle className="text-lg">
                    {getModeInfo(settings.mode).name}
                  </CardTitle>
                  <Badge className={getModeInfo(settings.mode).color} variant="outline">
                    {getLevelLabel(settings.level)}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm">
                    <Clock className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSettings({
                      ...settings,
                      voice: {...settings.voice, enabled: !settings.voice.enabled}
                    })}
                  >
                    {settings.voice.enabled ?
                      <Volume2 className="w-4 h-4" /> :
                      <VolumeX className="w-4 h-4" />
                    }
                  </Button>
                </div>
              </div>
              <p className="text-sm text-gray-600">
                {getModeInfo(settings.mode).description}
              </p>
            </CardHeader>

            {/* Messages */}
            <CardContent className="flex-1 overflow-y-auto space-y-4 pb-4">
              {!chatEnabled && (
                <div className="text-center p-8 border-2 border-dashed border-gray-300 rounded-lg">
                  <Bot className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">Chat IA Desabilitado</h3>
                  <p className="text-gray-500 mb-4">
                    Ative uma sessão de 30 minutos por apenas {sessionCost} créditos para conversar com a IA real.
                  </p>
                  <Button
                    onClick={activateChatSession}
                    disabled={userCredits < sessionCost}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Zap className="w-4 h-4 mr-1" />
                    Ativar por {sessionCost} créditos
                  </Button>
                </div>
              )}
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {message.role === 'assistant' && (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                  )}

                  <div
                    className={`max-w-[80%] rounded-lg px-4 py-2 ${
                      message.role === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>

                    {/* Grammar corrections */}
                    {message.corrections && message.corrections.length > 0 && message.corrections[0] && (
                      <div className="mt-2 p-2 bg-yellow-50 rounded text-xs">
                        <p className="font-medium text-yellow-800">Correção:</p>
                        <p className="text-yellow-700">
                          <span className="line-through">{message.corrections[0].original}</span>
                          {' → '}
                          <span className="font-medium">{message.corrections[0].corrected}</span>
                        </p>
                        <p className="text-yellow-600 mt-1">{message.corrections[0].explanation}</p>
                      </div>
                    )}

                    {/* Suggestions */}
                    {message.suggestions && message.role === 'assistant' && (
                      <div className="mt-3 flex flex-wrap gap-1">
                        {message.suggestions.map((suggestion, index) => (
                          <Button
                            key={index}
                            variant="ghost"
                            size="sm"
                            className="h-auto p-1 text-xs text-blue-600 hover:text-blue-800"
                            onClick={() => setInputMessage(suggestion)}
                          >
                            {suggestion}
                          </Button>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs opacity-70">
                        {new Date(message.timestamp).toLocaleTimeString('pt-BR', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>

                      {message.role === 'assistant' && settings.voice.enabled && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-auto p-1"
                          onClick={() => playAudio(message.content)}
                          disabled={isPlaying}
                        >
                          {isPlaying ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
                        </Button>
                      )}
                    </div>
                  </div>

                  {message.role === 'user' && (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
              ))}

              {isLoading && (
                <div className="flex gap-3 justify-start">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-gray-100 rounded-lg px-4 py-2">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </CardContent>

            {/* Input */}
            <div className="p-4 border-t">
              {/* Session Info */}
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">
                    ({messagesThisSession} mensagens nesta sessão)
                  </span>
                </div>
                <div className="text-xs text-gray-500">
                  Modo: {getModeInfo(settings.mode).name}
                </div>
              </div>

              {/* Erro de voz */}
              {speechError && (
                <div className="mb-2 p-2 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
                  {speechError}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="ml-2 h-auto p-1"
                    onClick={() => setSpeechError(null)}
                  >
                    ×
                  </Button>
                </div>
              )}

              {/* Status de gravação */}
              {isRecording && (
                <div className="mb-2 p-2 bg-blue-50 border border-blue-200 rounded text-blue-600 text-sm flex items-center">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse mr-2"></div>
                  Gravando... Fale agora
                </div>
              )}

              <div className="flex items-end gap-2">
                <div className="flex-1">
                  <Textarea
                    ref={inputRef}
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Digite sua mensagem..."
                    className="min-h-[2.5rem] max-h-32 resize-none"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage();
                      }
                    }}
                  />
                </div>

                <Button
                  variant={isRecording ? "destructive" : "outline"}
                  size="sm"
                  onClick={toggleRecording}
                  className="h-10 w-10 p-0"
                >
                  {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </Button>

                <Button
                  onClick={sendMessage}
                  disabled={!inputMessage.trim() || isLoading || !chatEnabled}
                  className="h-10 w-10 p-0"
                  title={chatEnabled ? "Enviar mensagem" : "Ative o chat IA primeiro"}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>

    </div>
  );
};

export default AIChat;