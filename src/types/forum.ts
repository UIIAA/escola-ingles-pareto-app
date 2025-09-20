// Sistema de Fórum - Escola Inglês Pareto
// Tipos e Interfaces para discussões e comunidade

export type UserRole = 'student' | 'teacher' | 'admin';
export type ForumCategory = 'grammar' | 'vocabulary' | 'conversation' | 'culture' | 'homework';
export type TopicStatus = 'open' | 'closed' | 'pinned' | 'resolved';

// Usuário do fórum
export interface ForumUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  joinDate: string;
  postsCount: number;
  reputationScore: number;
  badges: string[];
}

// Tópico do fórum
export interface ForumTopic {
  id: string;
  title: string;
  content: string;
  category: ForumCategory;
  status: TopicStatus;
  authorId: string;
  author: ForumUser;
  createdAt: string;
  updatedAt: string;
  viewsCount: number;
  repliesCount: number;
  lastReplyAt?: string;
  lastReplyBy?: ForumUser;
  tags: string[];
  isPinned: boolean;
  isLocked: boolean;
  isResolved: boolean;
  votes: {
    upvotes: number;
    downvotes: number;
    userVote?: 'up' | 'down' | null;
  };
}

// Resposta/Reply no fórum
export interface ForumReply {
  id: string;
  content: string;
  topicId: string;
  authorId: string;
  author: ForumUser;
  parentReplyId?: string; // For threading/nested replies
  createdAt: string;
  updatedAt: string;
  isEdited: boolean;
  votes: {
    upvotes: number;
    downvotes: number;
    userVote?: 'up' | 'down' | null;
  };
  isModerated: boolean;
  isBestAnswer?: boolean; // Marked by topic author or teacher
}

// Categoria do fórum com estatísticas
export interface ForumCategoryInfo {
  id: ForumCategory;
  name: string;
  description: string;
  icon: string;
  color: string;
  topicsCount: number;
  repliesCount: number;
  lastTopic?: {
    id: string;
    title: string;
    authorName: string;
    createdAt: string;
  };
}

// Filtros e busca do fórum
export interface ForumFilters {
  category?: ForumCategory | 'all';
  status?: TopicStatus | 'all';
  sortBy?: 'recent' | 'popular' | 'replies' | 'views';
  timeRange?: 'today' | 'week' | 'month' | 'all';
  authorRole?: UserRole | 'all';
  hasReplies?: boolean;
  isResolved?: boolean;
}

// Estatísticas do fórum
export interface ForumStats {
  totalTopics: number;
  totalReplies: number;
  activeUsers: number;
  topicsToday: number;
  repliesThisWeek: number;
  byCategory: Record<ForumCategory, {
    topics: number;
    replies: number;
  }>;
}

// Constantes do sistema de fórum
export const FORUM_CATEGORIES: Record<ForumCategory, ForumCategoryInfo> = {
  grammar: {
    id: 'grammar',
    name: 'Grammar',
    description: 'Discuss grammar rules, structures, and clarifications',
    icon: '📝',
    color: 'bg-blue-100 text-blue-800',
    topicsCount: 0,
    repliesCount: 0
  },
  vocabulary: {
    id: 'vocabulary',
    name: 'Vocabulary',
    description: 'Share and learn new words, expressions, and meanings',
    icon: '📚',
    color: 'bg-green-100 text-green-800',
    topicsCount: 0,
    repliesCount: 0
  },
  conversation: {
    id: 'conversation',
    name: 'Conversation',
    description: 'Practice conversations and discuss speaking topics',
    icon: '💬',
    color: 'bg-orange-100 text-orange-800',
    topicsCount: 0,
    repliesCount: 0
  },
  culture: {
    id: 'culture',
    name: 'Culture',
    description: 'Explore English-speaking cultures and traditions',
    icon: '🌍',
    color: 'bg-purple-100 text-purple-800',
    topicsCount: 0,
    repliesCount: 0
  },
  homework: {
    id: 'homework',
    name: 'Homework Help',
    description: 'Get help with assignments and exercises',
    icon: '📋',
    color: 'bg-red-100 text-red-800',
    topicsCount: 0,
    repliesCount: 0
  }
};

// Array de categorias para uso em formulários
export const FORUM_CATEGORIES_ARRAY: ForumCategory[] = ['grammar', 'vocabulary', 'conversation', 'culture', 'homework'];

// Badges disponíveis para usuários
export const USER_BADGES = {
  'new-member': {
    name: 'New Member',
    icon: '🌱',
    description: 'Welcome to the community!',
    requirement: 'Join the forum'
  },
  'active-participant': {
    name: 'Active Participant',
    icon: '⚡',
    description: 'Posted 10+ replies',
    requirement: '10 replies'
  },
  'topic-starter': {
    name: 'Topic Starter',
    icon: '🎯',
    description: 'Created 5+ topics',
    requirement: '5 topics'
  },
  'helpful-member': {
    name: 'Helpful Member',
    icon: '🤝',
    description: 'Received 50+ upvotes',
    requirement: '50 upvotes'
  },
  'grammar-guru': {
    name: 'Grammar Guru',
    icon: '🎓',
    description: 'Expert in grammar discussions',
    requirement: 'Active in grammar category'
  },
  'vocabulary-master': {
    name: 'Vocabulary Master',
    icon: '📖',
    description: 'Vocabulary expert',
    requirement: 'Active in vocabulary category'
  }
};

// Funções helper
export const getCategoryInfo = (category: ForumCategory): ForumCategoryInfo => {
  return FORUM_CATEGORIES[category];
};

export const getUserRoleLabel = (role: UserRole): string => {
  const labels = {
    student: 'Student',
    teacher: 'Teacher',
    admin: 'Administrator'
  };
  return labels[role];
};

export const getUserRoleColor = (role: UserRole): string => {
  const colors = {
    student: 'bg-blue-100 text-blue-800',
    teacher: 'bg-green-100 text-green-800',
    admin: 'bg-red-100 text-red-800'
  };
  return colors[role];
};

export const getTopicStatusColor = (status: TopicStatus): string => {
  const colors = {
    open: 'bg-green-100 text-green-800',
    closed: 'bg-red-100 text-red-800',
    pinned: 'bg-yellow-100 text-yellow-800',
    resolved: 'bg-blue-100 text-blue-800'
  };
  return colors[status];
};

export const formatTimeAgo = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'há poucos segundos';
  if (diffInSeconds < 3600) return `há ${Math.floor(diffInSeconds / 60)} minuto(s)`;
  if (diffInSeconds < 86400) return `há ${Math.floor(diffInSeconds / 3600)} hora(s)`;
  if (diffInSeconds < 2592000) return `há ${Math.floor(diffInSeconds / 86400)} dia(s)`;

  return date.toLocaleDateString('pt-BR');
};