// Sistema de Currículo e Conteúdo - Escola Inglês Pareto
// Tipos e Interfaces para trilhas de aprendizado e materiais didáticos

export type ContentType = 'lesson' | 'exercise' | 'video' | 'audio' | 'reading' | 'quiz' | 'game';
export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';
export type SkillType = 'listening' | 'speaking' | 'reading' | 'writing' | 'grammar' | 'vocabulary';
export type ContentStatus = 'not_started' | 'in_progress' | 'completed' | 'mastered';

// Unidade curricular básica
export interface CurriculumUnit {
  id: string;
  title: string;
  description: string;
  level: DifficultyLevel;
  skills: SkillType[];
  estimatedDuration: number; // em minutos
  prerequisites: string[]; // IDs de outras unidades
  learningObjectives: string[];
  contents: ContentItem[];
  assessments: Assessment[];
  resources: Resource[];
  createdAt: string;
  updatedAt: string;
}

// Item de conteúdo individual
export interface ContentItem {
  id: string;
  title: string;
  description: string;
  type: ContentType;
  level: DifficultyLevel;
  skills: SkillType[];
  duration: number; // em minutos
  content: ContentData;
  tags: string[];
  isRequired: boolean;
  order: number;
}

// Dados específicos por tipo de conteúdo
export interface ContentData {
  // Para vídeos
  videoUrl?: string;
  thumbnail?: string;
  subtitles?: {
    language: string;
    url: string;
  }[];

  // Para áudios
  audioUrl?: string;
  transcript?: string;

  // Para textos/leituras
  text?: string;
  images?: string[];

  // Para exercícios/quizzes
  questions?: Question[];
  exercises?: Exercise[];

  // Para jogos
  gameConfig?: GameConfig;
}

// Pergunta de quiz/exercício
export interface Question {
  id: string;
  type: 'multiple_choice' | 'true_false' | 'fill_blank' | 'matching' | 'ordering' | 'speaking';
  question: string;
  options?: string[];
  correctAnswer: string | string[];
  explanation: string;
  hints?: string[];
  points: number;
  audioUrl?: string; // Para exercícios de listening
}

// Exercício interativo
export interface Exercise {
  id: string;
  type: 'grammar' | 'vocabulary' | 'pronunciation' | 'conversation';
  title: string;
  instructions: string;
  content: Record<string, unknown>; // Configuração específica do exercício
  feedback: {
    correct: string;
    incorrect: string;
    hint: string;
  };
}

// Configuração de jogo
export interface GameConfig {
  gameType: 'memory' | 'word_search' | 'crossword' | 'drag_drop' | 'spelling';
  rules: string;
  config: Record<string, unknown>; // Configurações específicas do jogo
  scoreSystem: {
    maxScore: number;
    passingScore: number;
  };
}

// Avaliação/Assessment
export interface Assessment {
  id: string;
  title: string;
  type: 'quiz' | 'test' | 'project' | 'speaking_test';
  description: string;
  questions: Question[];
  timeLimit?: number; // em minutos
  attempts: number;
  passingScore: number;
  weight: number; // peso na nota final da unidade
}

// Recurso adicional
export interface Resource {
  id: string;
  title: string;
  type: 'pdf' | 'link' | 'book' | 'app' | 'tool';
  description: string;
  url?: string;
  downloadUrl?: string;
  isRequired: boolean;
  tags: string[];
}

// Trilha de aprendizado
export interface LearningPath {
  id: string;
  title: string;
  description: string;
  level: DifficultyLevel;
  totalDuration: number; // em horas
  skills: SkillType[];
  units: string[]; // IDs das unidades em ordem
  prerequisites: string[];
  objectives: string[];
  certification?: {
    title: string;
    description: string;
    badgeUrl: string;
  };
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

// Progresso do usuário
export interface UserProgress {
  userId: string;
  pathId?: string; // Trilha que está seguindo
  unitProgresses: UnitProgress[];
  overallProgress: {
    completedUnits: number;
    totalUnits: number;
    completedHours: number;
    totalHours: number;
    averageScore: number;
    streak: number; // dias consecutivos estudando
    lastStudyDate: string;
  };
  achievements: Achievement[];
  weakAreas: SkillType[];
  strengths: SkillType[];
  studyGoals: StudyGoal[];
}

// Progresso em uma unidade específica
export interface UnitProgress {
  unitId: string;
  status: ContentStatus;
  completedContents: string[]; // IDs dos conteúdos completados
  assessmentScores: {
    assessmentId: string;
    score: number;
    attempts: number;
    completedAt: string;
  }[];
  timeSpent: number; // em minutos
  startedAt: string;
  completedAt?: string;
  notes: string;
}

// Conquista/Achievement
export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'progress' | 'skill' | 'streak' | 'special';
  requirement: string;
  unlockedAt?: string;
  progress?: number; // 0-100
}

// Meta de estudo
export interface StudyGoal {
  id: string;
  type: 'daily' | 'weekly' | 'monthly';
  target: number; // minutos por dia/semana/mês
  current: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

// Trilhas de aprendizado pré-definidas
export const LEARNING_PATHS: LearningPath[] = [
  {
    id: 'beginner-foundation',
    title: 'English Foundation - Beginner',
    description: 'Base sólida para iniciantes em inglês com foco em gramática básica e vocabulário essencial',
    level: 'beginner',
    totalDuration: 40, // 40 horas
    skills: ['grammar', 'vocabulary', 'listening', 'reading'],
    units: ['unit-1-greetings', 'unit-2-family', 'unit-3-daily-routine', 'unit-4-food', 'unit-5-shopping'],
    prerequisites: [],
    objectives: [
      'Dominar gramática básica (present simple, articles, pronouns)',
      'Conhecer 500+ palavras essenciais',
      'Conseguir manter conversas simples',
      'Ler textos básicos com compreensão'
    ],
    certification: {
      title: 'English Foundation Certificate',
      description: 'Certificado de conclusão do nível básico',
      badgeUrl: '/badges/foundation.png'
    },
    createdBy: 'pareto-team',
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-09-15T00:00:00Z'
  },
  {
    id: 'intermediate-conversation',
    title: 'Conversation Mastery - Intermediate',
    description: 'Desenvolva fluência em conversação com tópicos variados e estruturas mais complexas',
    level: 'intermediate',
    totalDuration: 60, // 60 horas
    skills: ['speaking', 'listening', 'vocabulary', 'grammar'],
    units: ['unit-6-travel', 'unit-7-work', 'unit-8-culture', 'unit-9-opinions', 'unit-10-future'],
    prerequisites: ['beginner-foundation'],
    objectives: [
      'Fluência em conversação sobre tópicos variados',
      'Dominar tempos verbais intermediários',
      'Usar expressões idiomáticas naturalmente',
      'Compreender sotaques diferentes'
    ],
    certification: {
      title: 'Conversation Mastery Certificate',
      description: 'Certificado de fluência em conversação',
      badgeUrl: '/badges/conversation.png'
    },
    createdBy: 'pareto-team',
    createdAt: '2024-02-01T00:00:00Z',
    updatedAt: '2024-09-15T00:00:00Z'
  },
  {
    id: 'advanced-business',
    title: 'Business English - Advanced',
    description: 'Inglês profissional para o ambiente corporativo e negócios internacionais',
    level: 'advanced',
    totalDuration: 50, // 50 horas
    skills: ['speaking', 'writing', 'reading', 'vocabulary'],
    units: ['unit-11-meetings', 'unit-12-presentations', 'unit-13-negotiations', 'unit-14-emails', 'unit-15-networking'],
    prerequisites: ['intermediate-conversation'],
    objectives: [
      'Comunicação profissional eficaz',
      'Liderança de reuniões em inglês',
      'Apresentações impactantes',
      'Negociação em inglês',
      'Networking internacional'
    ],
    certification: {
      title: 'Business English Certificate',
      description: 'Certificado de inglês para negócios',
      badgeUrl: '/badges/business.png'
    },
    createdBy: 'pareto-team',
    createdAt: '2024-03-01T00:00:00Z',
    updatedAt: '2024-09-15T00:00:00Z'
  }
];

// Conquistas disponíveis
export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first-lesson',
    title: 'Primeiro Passo',
    description: 'Completou sua primeira lição',
    icon: '🎯',
    category: 'progress',
    requirement: 'Complete 1 lição'
  },
  {
    id: 'streak-7',
    title: 'Uma Semana Strong',
    description: 'Estudou por 7 dias consecutivos',
    icon: '🔥',
    category: 'streak',
    requirement: '7 dias consecutivos'
  },
  {
    id: 'grammar-master',
    title: 'Mestre da Gramática',
    description: 'Completou 20 exercícios de gramática',
    icon: '📝',
    category: 'skill',
    requirement: '20 exercícios de gramática'
  },
  {
    id: 'vocabulary-builder',
    title: 'Construtor de Vocabulário',
    description: 'Aprendeu 200 palavras novas',
    icon: '📚',
    category: 'skill',
    requirement: '200 palavras'
  },
  {
    id: 'speaking-star',
    title: 'Estrela da Conversação',
    description: 'Completou 10 exercícios de speaking',
    icon: '🎤',
    category: 'skill',
    requirement: '10 exercícios speaking'
  },
  {
    id: 'perfect-score',
    title: 'Nota Perfeita',
    description: 'Tirou 100% em uma avaliação',
    icon: '⭐',
    category: 'special',
    requirement: '100% em avaliação'
  }
];

// Funções helper
export const getSkillLabel = (skill: SkillType): string => {
  const labels = {
    listening: 'Listening',
    speaking: 'Speaking',
    reading: 'Reading',
    writing: 'Writing',
    grammar: 'Grammar',
    vocabulary: 'Vocabulary'
  };
  return labels[skill];
};

export const getSkillColor = (skill: SkillType): string => {
  const colors = {
    listening: 'bg-blue-100 text-blue-800',
    speaking: 'bg-orange-100 text-orange-800',
    reading: 'bg-green-100 text-green-800',
    writing: 'bg-purple-100 text-purple-800',
    grammar: 'bg-red-100 text-red-800',
    vocabulary: 'bg-yellow-100 text-yellow-800'
  };
  return colors[skill];
};

export const getLevelLabel = (level: DifficultyLevel): string => {
  const labels = {
    beginner: 'Iniciante',
    intermediate: 'Intermediário',
    advanced: 'Avançado'
  };
  return labels[level];
};

export const getLevelColor = (level: DifficultyLevel): string => {
  const colors = {
    beginner: 'bg-green-100 text-green-800',
    intermediate: 'bg-yellow-100 text-yellow-800',
    advanced: 'bg-red-100 text-red-800'
  };
  return colors[level];
};

export const getStatusColor = (status: ContentStatus): string => {
  const colors = {
    not_started: 'bg-gray-100 text-gray-800',
    in_progress: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    mastered: 'bg-purple-100 text-purple-800'
  };
  return colors[status];
};

export const calculateProgress = (completed: number, total: number): number => {
  return total > 0 ? Math.round((completed / total) * 100) : 0;
};

export const formatDuration = (minutes: number): string => {
  if (minutes < 60) return `${minutes}min`;
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}min` : `${hours}h`;
};