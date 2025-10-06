import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
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
  MessageCircle,
  Lock,
  Unlock,
  PinOff
} from 'lucide-react';

import {
  ForumTopic,
  ForumReply,
  ForumCategory,
  ForumFilters,
  FORUM_CATEGORIES,
  FORUM_CATEGORIES_ARRAY,
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
    isLocked: false,
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
    isLocked: false,
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
    isLocked: false,
    isResolved: true,
    votes: {
      upvotes: 22,
      downvotes: 0,
      userVote: null
    }
  }
];

// Mock replies data
const MOCK_REPLIES: Record<string, ForumReply[]> = {
  '1': [
    {
      id: 'r1',
      content: 'Great question! The Present Perfect is used when we talk about actions that happened at an unspecified time in the past or actions that started in the past and continue to the present. For example: "I have lived in London for 5 years."',
      topicId: '1',
      authorId: 'teacher1',
      author: {
        id: 'teacher1',
        name: 'Prof. Johnson',
        email: 'johnson@paretoingles.com',
        role: 'teacher',
        avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Johnson',
        joinDate: '2024-01-10',
        postsCount: 156,
        reputationScore: 890,
        badges: ['grammar-guru', 'helpful-member']
      },
      createdAt: '2024-09-15T08:15:00Z',
      updatedAt: '2024-09-15T08:15:00Z',
      isEdited: false,
      votes: {
        upvotes: 12,
        downvotes: 0,
        userVote: null
      },
      isModerated: false,
      isBestAnswer: true
    },
    {
      id: 'r2',
      content: 'Thank you Professor! That helps a lot. Can you give me more examples with "already" and "yet"?',
      topicId: '1',
      authorId: 'user1',
      author: {
        id: 'user1',
        name: 'Maria Silva',
        email: 'maria@example.com',
        role: 'student',
        avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Maria',
        joinDate: '2024-08-15',
        postsCount: 12,
        reputationScore: 45,
        badges: ['new-member', 'active-participant']
      },
      createdAt: '2024-09-15T09:30:00Z',
      updatedAt: '2024-09-15T09:30:00Z',
      isEdited: false,
      votes: {
        upvotes: 3,
        downvotes: 0,
        userVote: null
      },
      isModerated: false
    }
  ],
  '2': [
    {
      id: 'r3',
      content: 'One common mistake is using "look up" when you mean "look for". "Look up" means to search for information, while "look for" means to try to find something.',
      topicId: '2',
      authorId: 'teacher2',
      author: {
        id: 'teacher2',
        name: 'Prof. Sarah',
        email: 'sarah@paretoingles.com',
        role: 'teacher',
        avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Sarah',
        joinDate: '2024-02-01',
        postsCount: 89,
        reputationScore: 567,
        badges: ['vocabulary-master', 'topic-starter']
      },
      createdAt: '2024-09-15T09:45:00Z',
      updatedAt: '2024-09-15T09:45:00Z',
      isEdited: false,
      votes: {
        upvotes: 8,
        downvotes: 0,
        userVote: null
      },
      isModerated: false,
      isBestAnswer: true
    }
  ]
};

const Forum = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<ForumFilters>({
    category: 'all',
    sortBy: 'recent'
  });

  // Topic creation modal state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newTopic, setNewTopic] = useState({
    title: '',
    content: '',
    category: 'conversation' as ForumCategory,
    tags: ''
  });

  // Topic detail view state
  const [selectedTopic, setSelectedTopic] = useState<ForumTopic | null>(null);
  const [replies, setReplies] = useState<Record<string, ForumReply[]>>(MOCK_REPLIES);
  const [newReply, setNewReply] = useState('');

  // Mock topics state (in a real app, this would come from a backend)
  const [topics, setTopics] = useState<ForumTopic[]>(MOCK_TOPICS);

  // Check if user is a moderator (teacher or master)
  const isModerator = user?.user_metadata?.role === 'teacher' || user?.user_metadata?.role === 'master';

  // Moderation functions
  const handleTogglePin = (topicId: string) => {
    setTopics(prevTopics => prevTopics.map(topic => {
      if (topic.id === topicId) {
        const newPinnedState = !topic.isPinned;
        toast({
          title: newPinnedState ? "📌 Tópico Fixado" : "📍 Tópico Desfixado",
          description: newPinnedState
            ? "Este tópico agora aparecerá no topo da lista."
            : "Este tópico não está mais fixado.",
        });
        return { ...topic, isPinned: newPinnedState };
      }
      return topic;
    }));

    // Update selected topic if viewing
    if (selectedTopic?.id === topicId) {
      setSelectedTopic(prev => prev ? { ...prev, isPinned: !prev.isPinned } : null);
    }
  };

  const handleToggleLock = (topicId: string) => {
    setTopics(prevTopics => prevTopics.map(topic => {
      if (topic.id === topicId) {
        const newLockedState = !topic.isLocked;
        toast({
          title: newLockedState ? "🔒 Tópico Bloqueado" : "🔓 Tópico Desbloqueado",
          description: newLockedState
            ? "Novas respostas estão bloqueadas neste tópico."
            : "Novas respostas foram liberadas.",
        });
        return { ...topic, isLocked: newLockedState };
      }
      return topic;
    }));

    // Update selected topic if viewing
    if (selectedTopic?.id === topicId) {
      setSelectedTopic(prev => prev ? { ...prev, isLocked: !prev.isLocked } : null);
    }
  };

  // Vote handling functions
  const handleVoteTopic = (topicId: string, voteType: 'up' | 'down') => {
    setTopics(prevTopics => prevTopics.map(topic => {
      if (topic.id === topicId) {
        const currentVote = topic.votes.userVote;
        let newUpvotes = topic.votes.upvotes;
        let newDownvotes = topic.votes.downvotes;
        let newUserVote: 'up' | 'down' | null = voteType;

        // Remove previous vote if exists
        if (currentVote === 'up') {
          newUpvotes--;
        } else if (currentVote === 'down') {
          newDownvotes--;
        }

        // If clicking same vote, remove it (toggle off)
        if (currentVote === voteType) {
          newUserVote = null;
        } else {
          // Add new vote
          if (voteType === 'up') {
            newUpvotes++;
          } else {
            newDownvotes++;
          }
        }

        return {
          ...topic,
          votes: {
            upvotes: newUpvotes,
            downvotes: newDownvotes,
            userVote: newUserVote
          }
        };
      }
      return topic;
    }));

    // Update selected topic if it's open
    if (selectedTopic?.id === topicId) {
      const updatedTopic = topics.find(t => t.id === topicId);
      if (updatedTopic) {
        const currentVote = updatedTopic.votes.userVote;
        let newUpvotes = updatedTopic.votes.upvotes;
        let newDownvotes = updatedTopic.votes.downvotes;
        let newUserVote: 'up' | 'down' | null = voteType;

        if (currentVote === 'up') newUpvotes--;
        else if (currentVote === 'down') newDownvotes--;

        if (currentVote === voteType) {
          newUserVote = null;
        } else {
          if (voteType === 'up') newUpvotes++;
          else newDownvotes++;
        }

        setSelectedTopic({
          ...updatedTopic,
          votes: { upvotes: newUpvotes, downvotes: newDownvotes, userVote: newUserVote }
        });
      }
    }

    toast({
      title: voteType === 'up' ? "👍 Voto positivo" : "👎 Voto negativo",
      description: `Seu voto foi registrado!`,
      duration: 2000
    });
  };

  const handleVoteReply = (replyId: string, voteType: 'up' | 'down') => {
    setReplies(prevReplies => {
      const updated = { ...prevReplies };
      Object.keys(updated).forEach(topicId => {
        updated[topicId] = updated[topicId].map(reply => {
          if (reply.id === replyId) {
            const currentVote = reply.votes.userVote;
            let newUpvotes = reply.votes.upvotes;
            let newDownvotes = reply.votes.downvotes;
            let newUserVote: 'up' | 'down' | null = voteType;

            if (currentVote === 'up') newUpvotes--;
            else if (currentVote === 'down') newDownvotes--;

            if (currentVote === voteType) {
              newUserVote = null;
            } else {
              if (voteType === 'up') newUpvotes++;
              else newDownvotes++;
            }

            return {
              ...reply,
              votes: { upvotes: newUpvotes, downvotes: newDownvotes, userVote: newUserVote }
            };
          }
          return reply;
        });
      });
      return updated;
    });

    toast({
      title: voteType === 'up' ? "👍 Voto positivo" : "👎 Voto negativo",
      description: `Seu voto na resposta foi registrado!`,
      duration: 2000
    });
  };

  // Filter and sort topics
  const filteredTopics = useMemo(() => {
    let topicsList = [...topics];

    // Search filter
    if (searchQuery.trim()) {
      topicsList = topicsList.filter(topic =>
        topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        topic.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        topic.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Category filter
    if (filters.category && filters.category !== 'all') {
      topicsList = topicsList.filter(topic => topic.category === filters.category);
    }

    // Sort
    switch (filters.sortBy) {
      case 'popular':
        topicsList.sort((a, b) => (b.votes.upvotes - b.votes.downvotes) - (a.votes.upvotes - a.votes.downvotes));
        break;
      case 'replies':
        topicsList.sort((a, b) => b.repliesCount - a.repliesCount);
        break;
      case 'views':
        topicsList.sort((a, b) => b.viewsCount - a.viewsCount);
        break;
      case 'recent':
      default:
        topicsList.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
        break;
    }

    // Pinned topics first
    topicsList.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return 0;
    });

    return topicsList;
  }, [searchQuery, filters, topics]);

  const handleCreateTopic = () => {
    setIsCreateModalOpen(true);
  };

  const handleTopicClick = (topic: ForumTopic) => {
    // Increment view count
    setTopics(prev => prev.map(t =>
      t.id === topic.id
        ? { ...t, viewsCount: t.viewsCount + 1 }
        : t
    ));
    setSelectedTopic(topic);
  };

  const handleBackToList = () => {
    setSelectedTopic(null);
    setNewReply('');
  };

  const handleSubmitReply = () => {
    if (!newReply.trim() || !selectedTopic) {
      toast({
        title: "Error",
        description: "Please enter a reply message.",
        variant: "destructive"
      });
      return;
    }

    const reply: ForumReply = {
      id: Date.now().toString(),
      content: newReply,
      topicId: selectedTopic.id,
      authorId: user?.id || 'anonymous',
      author: {
        id: user?.id || 'anonymous',
        name: user?.user_metadata?.full_name || user?.email || 'Anonymous User',
        email: user?.email || 'anonymous@example.com',
        role: user?.user_metadata?.role || 'student',
        avatar: user?.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${user?.email || 'Anonymous'}`,
        joinDate: user?.created_at || new Date().toISOString(),
        postsCount: 1,
        reputationScore: 0,
        badges: ['new-member']
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isEdited: false,
      votes: { upvotes: 0, downvotes: 0 },
      isModerated: false
    };

    // Add reply to the topic
    setReplies(prev => ({
      ...prev,
      [selectedTopic.id]: [...(prev[selectedTopic.id] || []), reply]
    }));

    // Update topic reply count and last reply info
    setTopics(prev => prev.map(t =>
      t.id === selectedTopic.id
        ? {
            ...t,
            repliesCount: t.repliesCount + 1,
            lastReplyAt: new Date().toISOString(),
            lastReplyBy: reply.author,
            updatedAt: new Date().toISOString()
          }
        : t
    ));

    setNewReply('');
    toast({
      title: "Reply Posted!",
      description: "Your reply has been successfully added to the topic.",
    });
  };

  const handleSubmitTopic = () => {
    if (!newTopic.title.trim() || !newTopic.content.trim()) {
      toast({
        title: "Error",
        description: "Please fill in both title and content fields.",
        variant: "destructive"
      });
      return;
    }

    // Parse tags
    const tags = newTopic.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);

    // Create new topic
    const createdTopic: ForumTopic = {
      id: Date.now().toString(),
      title: newTopic.title,
      content: newTopic.content,
      category: newTopic.category,
      status: 'open',
      authorId: user?.id || 'anonymous',
      author: {
        id: user?.id || 'anonymous',
        name: user?.user_metadata?.full_name || user?.email || 'Anonymous User',
        email: user?.email || 'anonymous@example.com',
        role: user?.user_metadata?.role || 'student',
        avatar: user?.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${user?.email || 'Anonymous'}`,
        joinDate: user?.created_at || new Date().toISOString(),
        postsCount: 1,
        reputationScore: 0,
        badges: ['new-member']
      },
      tags,
      votes: { upvotes: 0, downvotes: 0 },
      repliesCount: 0,
      viewsCount: 0,
      isPinned: false,
      isLocked: false,
      isResolved: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Add to topics array
    setTopics(prev => [createdTopic, ...prev]);

    // Reset form and close modal
    setNewTopic({
      title: '',
      content: '',
      category: 'conversation',
      tags: ''
    });
    setIsCreateModalOpen(false);

    toast({
      title: "Topic Created!",
      description: "Your topic has been successfully created and posted to the forum.",
    });
  };

  // If a topic is selected, show topic detail view
  if (selectedTopic) {
    const topicReplies = replies[selectedTopic.id] || [];
    const categoryInfo = getCategoryInfo(selectedTopic.category);

    return (
      <div className="space-y-8">
        {/* Topic Detail Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={handleBackToList} className="flex items-center gap-2">
              <ArrowUp className="w-4 h-4 rotate-90" />
              Back to Forum
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{selectedTopic.title}</h1>
              <div className="flex items-center gap-3 mt-2">
                <Badge className={categoryInfo.color}>
                  {categoryInfo.icon} {categoryInfo.name}
                </Badge>
                <Badge className={getTopicStatusColor(selectedTopic.status)} variant="outline">
                  {selectedTopic.status}
                </Badge>
                {selectedTopic.isPinned && (
                  <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                    <Pin className="w-3 h-3 mr-1" />
                    Fixado
                  </Badge>
                )}
                {selectedTopic.isLocked && (
                  <Badge variant="secondary" className="bg-red-100 text-red-800">
                    <Lock className="w-3 h-3 mr-1" />
                    Bloqueado
                  </Badge>
                )}
                <span className="text-gray-500 text-sm">
                  {selectedTopic.viewsCount} views • {selectedTopic.repliesCount} replies
                </span>
              </div>
            </div>
          </div>

          {/* Moderation Actions (Teachers and Admins only) */}
          {isModerator && (
            <div className="flex items-center gap-2">
              <Button
                variant={selectedTopic.isPinned ? "default" : "outline"}
                size="sm"
                onClick={() => handleTogglePin(selectedTopic.id)}
                className="flex items-center gap-2"
              >
                {selectedTopic.isPinned ? (
                  <>
                    <PinOff className="w-4 h-4" />
                    Desfixar
                  </>
                ) : (
                  <>
                    <Pin className="w-4 h-4" />
                    Fixar
                  </>
                )}
              </Button>
              <Button
                variant={selectedTopic.isLocked ? "default" : "outline"}
                size="sm"
                onClick={() => handleToggleLock(selectedTopic.id)}
                className="flex items-center gap-2"
              >
                {selectedTopic.isLocked ? (
                  <>
                    <Unlock className="w-4 h-4" />
                    Desbloquear
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    Bloquear
                  </>
                )}
              </Button>
            </div>
          )}
        </div>

        {/* Original Topic */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <img
                  src={selectedTopic.author.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${selectedTopic.author.name}`}
                  alt={selectedTopic.author.name}
                  className="w-12 h-12 rounded-full"
                />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-semibold">{selectedTopic.author.name}</span>
                  <Badge className={getUserRoleColor(selectedTopic.author.role)} variant="outline">
                    {selectedTopic.author.role}
                  </Badge>
                  <span className="text-gray-500 text-sm">
                    {formatTimeAgo(selectedTopic.createdAt)}
                  </span>
                </div>
                <div className="text-gray-700 whitespace-pre-wrap mb-4">
                  {selectedTopic.content}
                </div>
                {selectedTopic.tags.length > 0 && (
                  <div className="flex items-center gap-2">
                    {selectedTopic.tags.map(tag => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex flex-col items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className={`p-1 ${selectedTopic.votes.userVote === 'up' ? 'text-green-600' : ''}`}
                  onClick={() => handleVoteTopic(selectedTopic.id, 'up')}
                >
                  <ArrowUp className="w-4 h-4" />
                </Button>
                <span className="font-medium text-sm">
                  {selectedTopic.votes.upvotes - selectedTopic.votes.downvotes}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`p-1 ${selectedTopic.votes.userVote === 'down' ? 'text-red-600' : ''}`}
                  onClick={() => handleVoteTopic(selectedTopic.id, 'down')}
                >
                  <ArrowDown className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Replies Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">
            {topicReplies.length} {topicReplies.length === 1 ? 'Reply' : 'Replies'}
          </h2>

          {topicReplies.map((reply) => (
            <Card key={reply.id} className={reply.isBestAnswer ? 'border-green-200 bg-green-50' : ''}>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <img
                      src={reply.author.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${reply.author.name}`}
                      alt={reply.author.name}
                      className="w-10 h-10 rounded-full"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-semibold">{reply.author.name}</span>
                      <Badge className={getUserRoleColor(reply.author.role)} variant="outline">
                        {reply.author.role}
                      </Badge>
                      {reply.isBestAnswer && (
                        <Badge className="bg-green-100 text-green-800">
                          ✓ Best Answer
                        </Badge>
                      )}
                      <span className="text-gray-500 text-sm">
                        {formatTimeAgo(reply.createdAt)}
                      </span>
                    </div>
                    <div className="text-gray-700 whitespace-pre-wrap">
                      {reply.content}
                    </div>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`p-1 ${reply.votes.userVote === 'up' ? 'text-green-600' : ''}`}
                      onClick={() => handleVoteReply(reply.id, 'up')}
                    >
                      <ArrowUp className="w-4 h-4" />
                    </Button>
                    <span className="font-medium text-sm">
                      {reply.votes.upvotes - reply.votes.downvotes}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`p-1 ${reply.votes.userVote === 'down' ? 'text-red-600' : ''}`}
                      onClick={() => handleVoteReply(reply.id, 'down')}
                    >
                      <ArrowDown className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Reply Form */}
          <Card>
            <CardContent className="p-6">
              {selectedTopic.isLocked ? (
                <div className="text-center py-8">
                  <Lock className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">
                    Este tópico está bloqueado
                  </h3>
                  <p className="text-gray-500">
                    Novas respostas não são permitidas neste momento. Entre em contato com um moderador se tiver dúvidas.
                  </p>
                </div>
              ) : (
                <>
                  <h3 className="text-lg font-semibold mb-4">Add Your Reply</h3>
                  <div className="space-y-4">
                    <Textarea
                      placeholder="Share your thoughts, provide help, or ask follow-up questions..."
                      value={newReply}
                      onChange={(e) => setNewReply(e.target.value)}
                      rows={4}
                      className="w-full"
                    />
                    <div className="flex justify-end">
                      <Button onClick={handleSubmitReply} className="flex items-center gap-2">
                        <MessageSquare className="w-4 h-4" />
                        Post Reply
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

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
                        {topic.isLocked && <Lock className="w-4 h-4 text-red-600 mt-1" />}
                        {topic.isResolved && <CheckCircle className="w-4 h-4 text-green-600 mt-1" />}
                        <h3
                          className="text-lg font-semibold text-gray-900 hover:text-blue-600 cursor-pointer"
                          onClick={() => handleTopicClick(topic)}
                        >
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
                      <Button
                        variant="ghost"
                        size="sm"
                        className={`p-1 ${topic.votes.userVote === 'up' ? 'text-green-600' : ''}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleVoteTopic(topic.id, 'up');
                        }}
                      >
                        <ArrowUp className="w-4 h-4" />
                      </Button>
                      <span className="font-medium text-sm">
                        {topic.votes.upvotes - topic.votes.downvotes}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className={`p-1 ${topic.votes.userVote === 'down' ? 'text-red-600' : ''}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleVoteTopic(topic.id, 'down');
                        }}
                      >
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

      {/* Create Topic Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-blue-600" />
              Create New Topic
            </DialogTitle>
            <DialogDescription>
              Share your questions, ideas, or start a discussion with the community.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            {/* Title */}
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">
                Topic Title *
              </label>
              <Input
                placeholder="What's your topic about?"
                value={newTopic.title}
                onChange={(e) => setNewTopic(prev => ({ ...prev, title: e.target.value }))}
                className="w-full"
              />
            </div>

            {/* Category */}
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">
                Category *
              </label>
              <Select
                value={newTopic.category}
                onValueChange={(value) => setNewTopic(prev => ({ ...prev, category: value as ForumCategory }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {FORUM_CATEGORIES_ARRAY.map(category => {
                    const categoryInfo = getCategoryInfo(category);
                    return (
                      <SelectItem key={category} value={category}>
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{categoryInfo.icon}</span>
                          <span>{categoryInfo.name}</span>
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            {/* Content */}
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">
                Content *
              </label>
              <Textarea
                placeholder="Describe your question, share your thoughts, or provide context..."
                value={newTopic.content}
                onChange={(e) => setNewTopic(prev => ({ ...prev, content: e.target.value }))}
                className="min-h-[120px] resize-none"
              />
            </div>

            {/* Tags */}
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">
                Tags (optional)
              </label>
              <Input
                placeholder="beginner, grammar, pronunciation (separate with commas)"
                value={newTopic.tags}
                onChange={(e) => setNewTopic(prev => ({ ...prev, tags: e.target.value }))}
                className="w-full"
              />
              <p className="text-xs text-gray-500 mt-1">
                Add relevant tags to help others find your topic. Separate multiple tags with commas.
              </p>
            </div>

            {/* Preview Tags */}
            {newTopic.tags.trim() && (
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">
                  Preview Tags:
                </label>
                <div className="flex flex-wrap gap-2">
                  {newTopic.tags.split(',').map((tag, index) => {
                    const trimmedTag = tag.trim();
                    if (!trimmedTag) return null;
                    return (
                      <Badge key={index} variant="secondary" className="text-xs">
                        #{trimmedTag}
                      </Badge>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => setIsCreateModalOpen(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmitTopic}
                className="flex-1"
                disabled={!newTopic.title.trim() || !newTopic.content.trim()}
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Topic
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Forum;