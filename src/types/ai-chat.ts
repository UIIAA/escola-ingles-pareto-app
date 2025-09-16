// Sistema de AI Chat - Escola Inglês Pareto
// Tipos e Interfaces para assistente IA de inglês

export type MessageRole = 'user' | 'assistant' | 'system';
export type MessageType = 'text' | 'voice' | 'image' | 'file';
export type ConversationMode = 'practice' | 'grammar' | 'vocabulary' | 'pronunciation' | 'conversation';
export type VoiceGender = 'male' | 'female';
export type VoiceSpeed = 'slow' | 'normal' | 'fast';
export type LanguageLevel = 'beginner' | 'intermediate' | 'advanced';

// Mensagem do chat
export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  type: MessageType;
  timestamp: string;
  isTyping?: boolean;

  // Para mensagens de voz
  audioUrl?: string;
  duration?: number;
  transcription?: string;

  // Para respostas do assistente
  suggestions?: string[];
  corrections?: GrammarCorrection[];
  vocabulary?: VocabularyTip[];
  pronunciation?: PronunciationTip[];
}

// Correção gramatical
export interface GrammarCorrection {
  original: string;
  corrected: string;
  explanation: string;
  rule: string;
  examples: string[];
}

// Dica de vocabulário
export interface VocabularyTip {
  word: string;
  definition: string;
  synonyms: string[];
  examples: string[];
  level: LanguageLevel;
  pronunciation?: string;
}

// Dica de pronúncia
export interface PronunciationTip {
  word: string;
  phonetic: string;
  audioUrl?: string;
  tips: string[];
  commonMistakes: string[];
}

// Configurações de conversa
export interface ConversationSettings {
  mode: ConversationMode;
  level: LanguageLevel;
  voice: {
    enabled: boolean;
    gender: VoiceGender;
    speed: VoiceSpeed;
    accent: 'american' | 'british' | 'neutral';
  };
  features: {
    grammarCorrection: boolean;
    vocabularyHelp: boolean;
    pronunciationFeedback: boolean;
    conversationSuggestions: boolean;
    translationHelp: boolean;
  };
}

// Sessão de conversa
export interface ChatSession {
  id: string;
  userId: string;
  title: string;
  mode: ConversationMode;
  level: LanguageLevel;
  messages: ChatMessage[];
  settings: ConversationSettings;
  startedAt: string;
  lastActiveAt: string;
  totalMessages: number;
  totalDuration: number; // in minutes
  achievements: string[];
}

// Estatísticas do chat
export interface ChatStatistics {
  totalSessions: number;
  totalMessages: number;
  totalDuration: number;
  averageSessionLength: number;
  mostUsedMode: ConversationMode;
  currentStreak: number;
  longestStreak: number;
  improvementAreas: {
    grammar: number; // score 0-100
    vocabulary: number;
    pronunciation: number;
    fluency: number;
  };
  achievements: Achievement[];
}

// Conquistas
export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  progress: number; // 0-100
  requirement: string;
}

// Prompt templates para diferentes modos
export const CHAT_PROMPTS = {
  practice: {
    system: "You are an English conversation partner for Brazilian Portuguese speakers. Be friendly, encouraging, and help practice natural conversation. Correct mistakes gently and suggest improvements.",
    welcome: "Olá! 👋 Sou seu parceiro de conversa em inglês. Vamos praticar conversação natural? Sobre o que você gostaria de conversar hoje?"
  },
  grammar: {
    system: "You are an English grammar tutor. Focus on explaining grammar rules clearly with examples. Provide corrections and explanations when users make mistakes.",
    welcome: "Oi! 📚 Sou seu tutor de gramática inglesa. Qual tópico gramatical você gostaria de praticar ou esclarecer hoje?"
  },
  vocabulary: {
    system: "You are an English vocabulary teacher. Help expand vocabulary, explain word meanings, provide synonyms, and create usage examples.",
    welcome: "Hello! 📖 Vou te ajudar a expandir seu vocabulário em inglês. Quer aprender palavras novas ou praticar as que já conhece?"
  },
  pronunciation: {
    system: "You are an English pronunciation coach. Focus on helping with correct pronunciation, phonetics, and common pronunciation mistakes for Portuguese speakers.",
    welcome: "Hi! 🎤 Sou seu coach de pronúncia. Vamos trabalhar na sua pronúncia em inglês? Você pode falar ou digitar palavras que quer praticar."
  },
  conversation: {
    system: "You are a casual English conversation partner. Engage in natural, flowing conversations on various topics while subtly helping improve English skills.",
    welcome: "Hey there! 💬 Que tal batermos um papo em inglês? Escolha um tópico ou me conte como foi seu dia!"
  }
};

// Modos de conversa disponíveis
export const CONVERSATION_MODES = {
  practice: {
    id: 'practice' as ConversationMode,
    name: 'Prática Geral',
    description: 'Conversação livre para praticar inglês no dia a dia',
    icon: '💫',
    color: 'bg-blue-100 text-blue-800',
    features: ['Correções gentis', 'Sugestões de melhoria', 'Conversação natural']
  },
  grammar: {
    id: 'grammar' as ConversationMode,
    name: 'Gramática',
    description: 'Foco em regras gramaticais e estruturas',
    icon: '📝',
    color: 'bg-green-100 text-green-800',
    features: ['Explicações detalhadas', 'Exemplos práticos', 'Exercícios direcionados']
  },
  vocabulary: {
    id: 'vocabulary' as ConversationMode,
    name: 'Vocabulário',
    description: 'Expandir vocabulário e aprender palavras novas',
    icon: '📚',
    color: 'bg-purple-100 text-purple-800',
    features: ['Palavras do dia', 'Sinônimos', 'Contexto de uso']
  },
  pronunciation: {
    id: 'pronunciation' as ConversationMode,
    name: 'Pronúncia',
    description: 'Melhorar pronúncia e dicção',
    icon: '🎤',
    color: 'bg-orange-100 text-orange-800',
    features: ['Feedback de áudio', 'Exercícios de dicção', 'Fonética']
  },
  conversation: {
    id: 'conversation' as ConversationMode,
    name: 'Conversação',
    description: 'Bate-papo natural e fluente',
    icon: '💬',
    color: 'bg-pink-100 text-pink-800',
    features: ['Tópicos variados', 'Expressões idiomáticas', 'Fluência']
  }
};

// Achievements disponíveis
export const AVAILABLE_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first-chat',
    title: 'Primeira Conversa',
    description: 'Iniciou sua primeira conversa com a IA',
    icon: '🎉',
    progress: 0,
    requirement: 'Enviar primeira mensagem'
  },
  {
    id: 'chat-streak-7',
    title: 'Sequência de 7 dias',
    description: 'Conversou com a IA por 7 dias consecutivos',
    icon: '🔥',
    progress: 0,
    requirement: '7 dias consecutivos'
  },
  {
    id: 'grammar-master',
    title: 'Mestre da Gramática',
    description: 'Completou 50 correções gramaticais',
    icon: '📝',
    progress: 0,
    requirement: '50 correções gramaticais'
  },
  {
    id: 'vocabulary-builder',
    title: 'Construtor de Vocabulário',
    description: 'Aprendeu 100 palavras novas',
    icon: '📖',
    progress: 0,
    requirement: '100 palavras novas'
  },
  {
    id: 'pronunciation-pro',
    title: 'Pro em Pronúncia',
    description: 'Praticou pronúncia por 30 sessões',
    icon: '🎙️',
    progress: 0,
    requirement: '30 sessões de pronúncia'
  }
];

// Funções helper
export const getModeInfo = (mode: ConversationMode) => {
  return CONVERSATION_MODES[mode];
};

export const getLevelLabel = (level: LanguageLevel): string => {
  const labels = {
    beginner: 'Iniciante',
    intermediate: 'Intermediário',
    advanced: 'Avançado'
  };
  return labels[level];
};

export const getLevelColor = (level: LanguageLevel): string => {
  const colors = {
    beginner: 'bg-green-100 text-green-800',
    intermediate: 'bg-yellow-100 text-yellow-800',
    advanced: 'bg-red-100 text-red-800'
  };
  return colors[level];
};

export const formatDuration = (minutes: number): string => {
  if (minutes < 60) return `${minutes}min`;
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}min` : `${hours}h`;
};

export const generateSessionId = (): string => {
  return `chat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export const generateMessageId = (): string => {
  return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};