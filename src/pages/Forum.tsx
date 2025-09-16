import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  MessageSquare,
  Plus,
  Search,
  Filter,
  TrendingUp,
  Users,
  Eye,
  Clock,
  Pin,
  CheckCircle,
  ArrowUp,
  ArrowDown,
  MessageCircle
} from 'lucide-react';

import {
  ForumTopic,
  ForumCategory,
  ForumFilters,
  FORUM_CATEGORIES,
  getCategoryInfo,
  getUserRoleColor,
  getTopicStatusColor,
  formatTimeAgo
} from '@/types/forum';

// Mock data - will be replaced with real data from backend
const MOCK_TOPICS: ForumTopic[] = [
  {
    id: '1',
    title: 'When to use Present Perfect vs Simple Past?',
    content: 'I\'m always confused about when to use "I have done" vs "I did". Can someone explain the difference with examples?',
    category: 'grammar',
    status: 'open',
    authorId: 'user1',
    author: {
      id: 'user1',
      name: 'Maria Silva',
      email: 'maria@example.com',
      role: 'student',
      joinDate: '2024-08-15',
      postsCount: 12,
      reputationScore: 45,
      badges: ['new-member', 'active-participant']
    },
    createdAt: '2024-09-14T10:30:00Z',
    updatedAt: '2024-09-15T08:15:00Z',
    viewsCount: 234,
    repliesCount: 8,
    lastReplyAt: '2024-09-15T08:15:00Z',
    lastReplyBy: {
      id: 'teacher1',
      name: 'Prof. Johnson',
      email: 'johnson@paretoingles.com',
      role: 'teacher',
      joinDate: '2024-01-10',
      postsCount: 156,
      reputationScore: 890,
      badges: ['grammar-guru', 'helpful-member']
    },
    tags: ['present-perfect', 'past-simple', 'tenses'],
    isPinned: false,
    isResolved: false,
    votes: {
      upvotes: 15,
      downvotes: 2,
      userVote: null
    }
  },
  {
    id: '2',
    title: 'Common mistakes with phrasal verbs',
    content: 'Let\'s discuss the most common mistakes students make with phrasal verbs and how to avoid them.',
    category: 'vocabulary',
    status: 'pinned',
    authorId: 'teacher2',
    author: {
      id: 'teacher2',
      name: 'Prof. Sarah',
      email: 'sarah@paretoingles.com',
      role: 'teacher',
      joinDate: '2024-02-01',
      postsCount: 89,
      reputationScore: 567,
      badges: ['vocabulary-master', 'topic-starter']
    },
    createdAt: '2024-09-10T14:20:00Z',
    updatedAt: '2024-09-15T09:45:00Z',
    viewsCount: 456,
    repliesCount: 23,
    lastReplyAt: '2024-09-15T09:45:00Z',
    tags: ['phrasal-verbs', 'common-mistakes', 'vocabulary'],
    isPinned: true,
    isResolved: false,
    votes: {
      upvotes: 34,
      downvotes: 1,
      userVote: 'up'
    }
  },
  {
    id: '3',
    title: 'American vs British English - Daily expressions',
    content: 'What are some daily expressions that differ between American and British English?',
    category: 'culture',
    status: 'resolved',
    authorId: 'user3',
    author: {
      id: 'user3',
      name: 'João Santos',
      email: 'joao@example.com',
      role: 'student',
      joinDate: '2024-07-20',
      postsCount: 28,
      reputationScore: 78,
      badges: ['helpful-member', 'topic-starter']
    },
    createdAt: '2024-09-12T16:10:00Z',
    updatedAt: '2024-09-14T11:30:00Z',
    viewsCount: 189,
    repliesCount: 12,
    lastReplyAt: '2024-09-14T11:30:00Z',
    tags: ['american-english', 'british-english', 'expressions'],
    isPinned: false,
    isResolved: true,
    votes: {
      upvotes: 22,
      downvotes: 0,
      userVote: null
    }
  }
];

const Forum = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<ForumFilters>({
    category: 'all',
    sortBy: 'recent'
  });

  // Filter and sort topics
  const filteredTopics = useMemo(() => {
    let topics = [...MOCK_TOPICS];

    // Search filter
    if (searchQuery.trim()) {
      topics = topics.filter(topic =>
        topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        topic.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        topic.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Category filter
    if (filters.category && filters.category !== 'all') {
      topics = topics.filter(topic => topic.category === filters.category);
    }

    // Sort
    switch (filters.sortBy) {
      case 'popular':
        topics.sort((a, b) => (b.votes.upvotes - b.votes.downvotes) - (a.votes.upvotes - a.votes.downvotes));
        break;
      case 'replies':
        topics.sort((a, b) => b.repliesCount - a.repliesCount);
        break;
      case 'views':
        topics.sort((a, b) => b.viewsCount - a.viewsCount);
        break;
      case 'recent':
      default:
        topics.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
        break;
    }

    // Pinned topics first
    topics.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return 0;
    });

    return topics;
  }, [searchQuery, filters]);

  const handleCreateTopic = () => {
    // TODO: Implement topic creation modal
    alert('Funcionalidade de criação de tópicos será implementada em breve!');
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">🗣️ Fórum da Comunidade</h1>
          <p className="text-gray-600 mt-2">
            Participe das discussões, tire dúvidas e compartilhe conhecimento
          </p>
        </div>
        <Button onClick={handleCreateTopic} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Novo Tópico
        </Button>
      </div>

      {/* Forum Categories */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Categorias</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {Object.values(FORUM_CATEGORIES).map((category) => (
            <Card key={category.id} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{category.icon}</span>
                  <CardTitle className="text-lg">{category.name}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm mb-3">
                  {category.description}
                </CardDescription>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{category.topicsCount || 0} tópicos</span>
                  <span>{category.repliesCount || 0} respostas</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            Buscar e Filtrar
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Buscar tópicos, conteúdo ou tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select value={filters.category} onValueChange={(value) => setFilters({...filters, category: value as ForumCategory | 'all'})}>
              <SelectTrigger>
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as Categorias</SelectItem>
                {Object.values(FORUM_CATEGORIES).map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.icon} {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filters.sortBy} onValueChange={(value) => setFilters({...filters, sortBy: value as 'recent' | 'popular' | 'most_replies' | 'most_views'})}>
              <SelectTrigger>
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Mais Recentes</SelectItem>
                <SelectItem value="popular">Mais Populares</SelectItem>
                <SelectItem value="replies">Mais Respostas</SelectItem>
                <SelectItem value="views">Mais Visualizações</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Topics List */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">
            {filteredTopics.length} {filteredTopics.length === 1 ? 'tópico encontrado' : 'tópicos encontrados'}
          </h2>
        </div>

        <div className="space-y-4">
          {filteredTopics.map((topic) => {
            const categoryInfo = getCategoryInfo(topic.category);

            return (
              <Card key={topic.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    {/* Topic Info */}
                    <div className="flex-1">
                      <div className="flex items-start gap-2 mb-2">
                        {topic.isPinned && <Pin className="w-4 h-4 text-yellow-600 mt-1" />}
                        {topic.isResolved && <CheckCircle className="w-4 h-4 text-green-600 mt-1" />}
                        <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600 cursor-pointer">
                          {topic.title}
                        </h3>
                      </div>

                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {topic.content}
                      </p>

                      <div className="flex items-center gap-3 mb-3">
                        <Badge className={categoryInfo.color}>
                          {categoryInfo.icon} {categoryInfo.name}
                        </Badge>
                        <Badge className={getTopicStatusColor(topic.status)} variant="outline">
                          {topic.status}
                        </Badge>
                        <Badge className={getUserRoleColor(topic.author.role)} variant="outline">
                          {topic.author.name}
                        </Badge>
                      </div>

                      {topic.tags.length > 0 && (
                        <div className="flex items-center gap-2 mb-3">
                          {topic.tags.map(tag => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              #{tag}
                            </Badge>
                          ))}
                        </div>
                      )}

                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {formatTimeAgo(topic.updatedAt)}
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          {topic.viewsCount}
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageCircle className="w-4 h-4" />
                          {topic.repliesCount}
                        </div>
                        {topic.lastReplyBy && (
                          <div className="text-xs">
                            Última resposta: {topic.lastReplyBy.name}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Voting */}
                    <div className="flex flex-col items-center gap-1 min-w-[60px]">
                      <Button variant="ghost" size="sm" className="p-1">
                        <ArrowUp className="w-4 h-4" />
                      </Button>
                      <span className="font-medium text-sm">
                        {topic.votes.upvotes - topic.votes.downvotes}
                      </span>
                      <Button variant="ghost" size="sm" className="p-1">
                        <ArrowDown className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filteredTopics.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhum tópico encontrado
              </h3>
              <p className="text-gray-600 mb-4">
                Tente ajustar seus filtros ou termos de busca
              </p>
              <Button onClick={handleCreateTopic}>
                <Plus className="w-4 h-4 mr-2" />
                Criar Primeiro Tópico
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Forum;