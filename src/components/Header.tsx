import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Bell, Search, User, LogOut, Settings, PanelLeft, PanelLeftClose, X, Calendar, MessageSquare, BookOpen, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useSidebar } from '@/contexts/SidebarContext';
import { useResponsive } from '@/hooks/use-responsive';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

interface HeaderProps {
  onMenuClick: () => void;
  userActions?: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick, userActions }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { toast } = useToast();
  const { user, signOut } = useAuth();
  const { mode, isCollapsed, toggle } = useSidebar();
  const { isMobile, isTablet, isDesktop } = useResponsive();
  const navigate = useNavigate();

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  // Get user data from auth context
  const userData = user ? {
    name: user.user_metadata?.name || user.email?.split('@')[0] || 'Usuário',
    email: user.email || '',
    role: user.user_metadata?.role || 'student',
    avatar: user.user_metadata?.avatar_url || null
  } : null;

  // Mock notifications data
  const mockNotifications = [
    {
      id: 1,
      type: 'class',
      title: 'New Class Scheduled',
      message: 'Your English conversation class is scheduled for tomorrow at 3 PM',
      time: '2 minutes ago',
      read: false,
      icon: Calendar
    },
    {
      id: 2,
      type: 'forum',
      title: 'New Reply in Forum',
      message: 'Someone replied to your question about Present Perfect tense',
      time: '1 hour ago',
      read: false,
      icon: MessageSquare
    },
    {
      id: 3,
      type: 'achievement',
      title: 'Achievement Unlocked!',
      message: 'You completed your first week of studies. Keep it up!',
      time: '3 hours ago',
      read: true,
      icon: Award
    },
    {
      id: 4,
      type: 'course',
      title: 'New Course Available',
      message: 'Advanced Business English course is now available',
      time: '1 day ago',
      read: true,
      icon: BookOpen
    }
  ];

  // Expanded searchable content
  const searchableContent = [
    // Pages
    { type: 'page', title: 'Dashboard', description: 'Overview and progress tracking', path: '/dashboard' },
    { type: 'page', title: 'Learning Paths', description: 'Structured English courses and learning tracks', path: '/learning' },
    { type: 'page', title: 'Schedule', description: 'Book and manage your English classes', path: '/schedule' },
    { type: 'page', title: 'Forum', description: 'Community discussions, Q&A, and help', path: '/forum' },
    { type: 'page', title: 'AI Chat', description: 'Practice English with AI assistant and conversation partner', path: '/ai-chat' },
    { type: 'page', title: 'Credits', description: 'Manage your lesson credits and payments', path: '/credits' },
    { type: 'page', title: 'Profile', description: 'Your account settings and personal information', path: '/profile' },

    // Learning content
    { type: 'lesson', title: 'Present Perfect Tense', description: 'Grammar lesson covering present perfect usage and examples', path: '/learning' },
    { type: 'lesson', title: 'Business English Vocabulary', description: 'Professional terminology, phrases and business communication', path: '/learning' },
    { type: 'lesson', title: 'Conversation Practice', description: 'Interactive speaking exercises and role-playing scenarios', path: '/learning' },
    { type: 'lesson', title: 'Past Simple vs Present Perfect', description: 'Understanding the difference between past tenses', path: '/learning' },
    { type: 'lesson', title: 'Phrasal Verbs', description: 'Common phrasal verbs and their meanings in context', path: '/learning' },
    { type: 'lesson', title: 'IELTS Preparation', description: 'Test preparation strategies and practice exercises', path: '/learning' },
    { type: 'lesson', title: 'Daily Conversations', description: 'Common everyday situations and dialogues', path: '/learning' },
    { type: 'lesson', title: 'English Pronunciation', description: 'Phonetics, stress patterns, and accent reduction', path: '/learning' },

    // Travel & Tourism Content
    { type: 'lesson', title: 'Travel English - Airport Conversations', description: 'Essential English for airports, check-in, security, boarding. Turismo, viagem, aeroporto', path: '/learning' },
    { type: 'lesson', title: 'Hotel Booking and Hospitality', description: 'English for hotels, reservations, room service. Turismo, hospedagem, hotel', path: '/learning' },
    { type: 'lesson', title: 'Asking for Directions', description: 'How to ask and give directions while traveling. Turismo, direções, navegação', path: '/learning' },
    { type: 'lesson', title: 'Restaurant and Food Ordering', description: 'English for restaurants, menus, ordering food. Turismo, restaurante, comida', path: '/learning' },
    { type: 'lesson', title: 'Tourist Attractions and Sightseeing', description: 'Vocabulary for museums, monuments, tours. Turismo, atrações, pontos turísticos', path: '/learning' },
    { type: 'lesson', title: 'Shopping and Souvenirs', description: 'English for shopping, bargaining, buying souvenirs. Turismo, compras, lembranças', path: '/learning' },
    { type: 'lesson', title: 'Transportation Vocabulary', description: 'Buses, trains, taxis, ride-sharing. Turismo, transporte, viagem', path: '/learning' },
    { type: 'lesson', title: 'Travel Planning and Itinerary', description: 'Planning trips, making itineraries, booking activities. Turismo, planejamento, roteiro', path: '/learning' },

    // Forum topics
    { type: 'topic', title: 'Pronunciation Tips', description: 'Forum discussion about English pronunciation and accent improvement', path: '/forum' },
    { type: 'topic', title: 'Grammar Questions', description: 'Common grammar doubts, rules, and explanations', path: '/forum' },
    { type: 'topic', title: 'Vocabulary Building', description: 'Strategies for expanding your English vocabulary effectively', path: '/forum' },
    { type: 'topic', title: 'Speaking Practice', description: 'Tips and techniques for improving English speaking skills', path: '/forum' },
    { type: 'topic', title: 'Writing Skills', description: 'How to write better essays, emails, and formal documents', path: '/forum' },
    { type: 'topic', title: 'Listening Comprehension', description: 'Improving your ability to understand spoken English', path: '/forum' },

    // Travel Forum Topics
    { type: 'topic', title: 'Travel English Tips', description: 'Share your travel experiences and English tips. Turismo, viagem, dicas', path: '/forum' },
    { type: 'topic', title: 'Airport English Survival Guide', description: 'Essential phrases for airports and flights. Turismo, aeroporto, voo', path: '/forum' },
    { type: 'topic', title: 'Hotel and Restaurant English', description: 'Common situations in hotels and restaurants. Turismo, hotel, restaurante', path: '/forum' },
    { type: 'topic', title: 'Tourist Destinations Discussion', description: 'Discuss famous places and travel experiences. Turismo, destinos, lugares', path: '/forum' },
    { type: 'topic', title: 'Cultural Differences While Traveling', description: 'Cultural awareness for travelers. Turismo, cultura, diferenças', path: '/forum' },

    // People (Teachers and Students)
    { type: 'teacher', title: 'Prof. Johnson', description: 'Grammar specialist and IELTS expert teacher', path: '/teaching' },
    { type: 'teacher', title: 'Prof. Sarah', description: 'Vocabulary and business English expert', path: '/teaching' },
    { type: 'teacher', title: 'Ana Silva', description: 'Conversation specialist teacher', path: '/teaching' },
    { type: 'teacher', title: 'Carlos Oliveira', description: 'Grammar and writing expert', path: '/teaching' },
    { type: 'teacher', title: 'Mariana Costa', description: 'Business English specialist', path: '/teaching' },

    { type: 'student', title: 'Maria Silva', description: 'Intermediate student - Business English', path: '/teaching' },
    { type: 'student', title: 'João Santos', description: 'Advanced student - IELTS preparation', path: '/teaching' },
    { type: 'student', title: 'Ana Costa', description: 'Intermediate student - Travel English', path: '/teaching' },
    { type: 'student', title: 'Pedro Alves', description: 'Beginner student - General English', path: '/teaching' },
    { type: 'student', title: 'Carla Mendes', description: 'Intermediate student - Conversation practice', path: '/teaching' },

    // Features and tools
    { type: 'feature', title: 'Voice Chat', description: 'Practice speaking with AI using voice recognition', path: '/ai-chat' },
    { type: 'feature', title: 'Grammar Correction', description: 'Automatic grammar checking and suggestions', path: '/ai-chat' },
    { type: 'feature', title: 'Progress Tracking', description: 'Monitor your learning progress and achievements', path: '/learning' },
    { type: 'feature', title: 'Class Booking', description: 'Schedule one-on-one or group lessons with teachers', path: '/schedule' },
    { type: 'feature', title: 'Certificate Tracking', description: 'View your completed courses and certificates', path: '/learning' },
    { type: 'feature', title: 'Study Goals', description: 'Set and track your daily and weekly study objectives', path: '/learning' },

    // Travel Features
    { type: 'feature', title: 'Travel English Simulator', description: 'Practice travel scenarios with AI. Turismo, simulação, prática', path: '/ai-chat' },
    { type: 'feature', title: 'Cultural Context Tips', description: 'Learn cultural context for travel English. Turismo, cultura, contexto', path: '/ai-chat' }
  ];

  // Synonym dictionary for better search results
  const synonyms: Record<string, string[]> = {
    'turismo': ['travel', 'viagem', 'trip', 'tourism', 'vacation', 'holiday', 'journey', 'sightseeing', 'tour'],
    'travel': ['turismo', 'viagem', 'trip', 'tourism', 'vacation', 'holiday', 'journey', 'sightseeing', 'tour'],
    'viagem': ['travel', 'turismo', 'trip', 'tourism', 'vacation', 'holiday', 'journey', 'sightseeing', 'tour'],
    'hotel': ['accommodation', 'hospedagem', 'lodging', 'stay', 'booking', 'reservation'],
    'restaurante': ['restaurant', 'dining', 'food', 'eating', 'meal', 'comida'],
    'aeroporto': ['airport', 'flight', 'plane', 'voo', 'avião', 'boarding', 'check-in'],
    'transporte': ['transportation', 'transport', 'bus', 'train', 'taxi', 'metro', 'subway'],
    'gramática': ['grammar', 'gramatica', 'tense', 'verb', 'noun', 'adjective'],
    'vocabulário': ['vocabulary', 'vocabulario', 'words', 'terms', 'expressions', 'phrases'],
    'conversação': ['conversation', 'speaking', 'talking', 'dialogue', 'chat', 'practice'],
    'pronúncia': ['pronunciation', 'pronounce', 'accent', 'sounds', 'phonics', 'speak'],
    'escrita': ['writing', 'write', 'essay', 'text', 'document', 'email'],
    'leitura': ['reading', 'read', 'comprehension', 'text', 'article', 'book'],
    'audição': ['listening', 'hear', 'audio', 'sound', 'comprehension', 'understand']
  };

  // Function to expand search terms with synonyms
  const expandSearchTerms = (query: string): string[] => {
    const terms = [query.toLowerCase().trim()];
    const words = query.toLowerCase().split(' ');

    words.forEach(word => {
      if (synonyms[word]) {
        terms.push(...synonyms[word]);
      }
    });

    return [...new Set(terms)]; // Remove duplicates
  };

  // Debounced search function
  const debouncedSearch = (query: string) => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      handleSearch(query);
      // Reset the timeout reference after execution to identify manual vs debounced search
      searchTimeoutRef.current = null;
    }, 500); // Wait 500ms after user stops typing
  };

  // Enhanced search function with synonym support
  const handleSearch = (query: string, showToast = false) => {
    if (query.trim()) {
      setIsSearching(true);

      // Expand search terms with synonyms
      const searchTerms = expandSearchTerms(query);

      const results = searchableContent
        .map(item => {
          let score = 0;
          const titleLower = item.title.toLowerCase();
          const descLower = item.description.toLowerCase();

          // Check each search term (including synonyms)
          searchTerms.forEach(term => {
            const titleMatch = titleLower.includes(term);
            const descMatch = descLower.includes(term);

            if (titleMatch) score += 3; // Title matches are more relevant
            if (descMatch) score += 1;

            // Exact matches get higher score
            if (titleLower === term) score += 5;

            // Partial word matching bonus
            const titleWords = titleLower.split(' ');
            const descWords = descLower.split(' ');

            if (titleWords.some(titleWord => titleWord.startsWith(term))) score += 2;
            if (descWords.some(descWord => descWord.startsWith(term))) score += 1;
          });

          return { ...item, score };
        })
        .filter(item => item.score > 0)
        .sort((a, b) => b.score - a.score); // Sort by relevance

      setSearchResults(results);
      setIsSearchOpen(true); // Always open modal when there are results
      setIsSearching(false);

      // Show toast only for manual search (Enter or Button click), not for debounced search
      if (showToast && results.length === 0) {
        toast({
          title: "🔍 No Results",
          description: `No results found for "${query}". Try searching for pages, lessons, or forum topics.`,
          variant: "destructive"
        });
      }
    } else {
      setSearchResults([]);
      setIsSearching(false);
    }
  };

  // Handle search input changes with debouncing
  const handleSearchInputChange = (value: string) => {
    setSearchQuery(value);
    if (value.trim().length > 0) { // Start searching immediately after 1 character
      setIsSearching(true);
      debouncedSearch(value);
    } else {
      setSearchResults([]);
      setIsSearching(false);
      setIsSearchOpen(false); // Close modal when empty
    }
  };

  // Clear search when modal closes
  const handleSearchModalClose = (open: boolean) => {
    setIsSearchOpen(open);
    if (!open) {
      setSearchQuery('');
      setSearchResults([]);
      setIsSearching(false);
    }
  };

  const handleNotificationClick = () => {
    setIsNotificationsOpen(true);
  };

  const markNotificationAsRead = (notificationId: number) => {
    // In a real app, this would update the backend
    toast({
      title: "Notification marked as read",
      description: "Notification has been marked as read",
    });
  };

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao sair",
        description: "Não foi possível fazer logout",
      });
    }
  };

  const handleProfileClick = () => {
    navigate('/profile');
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'student': return 'Aluno';
      case 'teacher': return 'Professor';
      case 'master': return 'Administrador';
      default: return 'Usuário';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'student': return 'from-blue-500 to-cyan-500';
      case 'teacher': return 'from-green-500 to-emerald-500';
      case 'master': return 'from-purple-500 to-pink-500';
      default: return 'from-gray-500 to-slate-500';
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  // If no user data, don't render the header (user is not authenticated)
  if (!userData) {
    return null;
  }

  return (
    <header className="bg-white/90 backdrop-blur-md border-b border-blue-100 px-4 lg:px-8 py-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Responsive Menu/Toggle Button */}
          {!isDesktop && (
            /* Mobile/Tablet - Hamburger Menu */
            <Button
              variant="ghost"
              size="icon"
              onClick={onMenuClick}
              className="text-gray-700 hover:bg-gray-100"
            >
              <Menu size={20} />
            </Button>
          )}

          {isDesktop && (
            /* Desktop - Sidebar Toggle */
            <Button
              variant="ghost"
              size="icon"
              onClick={toggle}
              className="text-gray-700 hover:bg-gray-100"
              title={isCollapsed ? "Expandir sidebar" : "Recolher sidebar"}
            >
              {isCollapsed ? <PanelLeft size={20} /> : <PanelLeftClose size={20} />}
            </Button>
          )}

          {/* Search Bar */}
          <div className="hidden md:flex items-center gap-2 bg-gray-50 rounded-lg px-4 py-2 min-w-[350px] border border-gray-200 focus-within:border-blue-300 focus-within:ring-2 focus-within:ring-blue-100">
            {isSearching ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            ) : (
              <Search size={18} className="text-gray-400" />
            )}
            <Input
              type="text"
              placeholder="Buscar aulas, professores, tópicos..."
              className="bg-transparent text-gray-700 placeholder-gray-400 outline-none border-none focus:ring-0 flex-1 p-0"
              value={searchQuery}
              onChange={(e) => handleSearchInputChange(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleSearch(searchQuery, true); // Show toast for manual search
                }
              }}
            />
            {searchQuery && (
              <Button
                size="sm"
                onClick={() => handleSearch(searchQuery, true)} // Show toast for manual search
                className="h-6 px-2 text-xs bg-blue-500 hover:bg-blue-600"
              >
                Buscar
              </Button>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* User Role Badge */}
          <div className="hidden sm:flex items-center gap-2">
            <span className={`text-xs px-2 py-1 rounded-full text-white bg-gradient-to-r ${getRoleColor(userData.role)}`}>
              {getRoleLabel(userData.role)}
            </span>
          </div>

          {/* Notifications */}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleNotificationClick}
            className="text-gray-600 hover:bg-gray-100 relative"
          >
            <Bell size={18} />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center">
              3
            </span>
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center gap-2 hover:bg-gray-100 px-2 py-1"
              >
                <div className="hidden sm:flex flex-col items-end">
                  <span className="text-sm font-medium text-gray-700">{userData.name}</span>
                  <span className="text-xs text-gray-500">{userData.email}</span>
                </div>
                <div className={`w-8 h-8 bg-gradient-to-r ${getRoleColor(userData.role)} rounded-full flex items-center justify-center text-xs font-bold text-white`}>
                  {userData.avatar ? (
                    <img src={userData.avatar} alt={userData.name} className="w-full h-full rounded-full object-cover" />
                  ) : (
                    getInitials(userData.name)
                  )}
                </div>
              </Button>
            </DropdownMenuTrigger>
            {userActions ? (
              userActions
            ) : (
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleProfileClick}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Perfil</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/profile')}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Configurações</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-600" data-testid="logout-button">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sair</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            )}
          </DropdownMenu>
        </div>
      </div>

      {/* Mobile Search */}
      <div className="md:hidden mt-3">
        <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-4 py-2 border border-gray-200 focus-within:border-blue-300 focus-within:ring-2 focus-within:ring-blue-100">
          {isSearching ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          ) : (
            <Search size={16} className="text-gray-400" />
          )}
          <Input
            type="text"
            placeholder="Buscar..."
            className="bg-transparent text-gray-700 placeholder-gray-400 outline-none border-none focus:ring-0 flex-1 p-0"
            value={searchQuery}
            onChange={(e) => handleSearchInputChange(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleSearch(searchQuery, true); // Show toast for manual search
              }
            }}
          />
        </div>
      </div>

      {/* Search Results Modal */}
      <Dialog open={isSearchOpen} onOpenChange={handleSearchModalClose}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl flex items-center gap-2">
              <Search className="w-5 h-5 text-blue-600" />
              Search Results
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            {isSearching ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Searching...</p>
              </div>
            ) : searchResults.length > 0 ? (
              <>
                <p className="text-sm text-gray-600">
                  Found {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} for "{searchQuery}"
                </p>
                <div className="space-y-3">
                  {searchResults.map((result, index) => (
                    <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer hover:border-blue-200">
                      <CardContent 
                        className="p-4 cursor-pointer hover:shadow-md transition-shadow hover:border-blue-200"
                        onClick={() => {
                          navigate(result.path);
                          handleSearchModalClose(false);
                        }}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge
                                variant="outline"
                                className={`text-xs ${
                                  result.type === 'page' ? 'border-blue-200 text-blue-700 bg-blue-50' :
                                  result.type === 'lesson' ? 'border-green-200 text-green-700 bg-green-50' :
                                  result.type === 'topic' ? 'border-purple-200 text-purple-700 bg-purple-50' :
                                  'border-orange-200 text-orange-700 bg-orange-50'
                                }`}
                              >
                                {result.type}
                              </Badge>
                              <h4 className="font-medium text-sm">{result.title}</h4>
                            </div>
                            <p className="text-sm text-gray-600">{result.description}</p>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-blue-600 hover:text-blue-700"
                            onClick={(e) => {
                              e.stopPropagation(); // Prevent triggering the card click
                              navigate(result.path);
                              handleSearchModalClose(false);
                            }}
                          >
                            Go →
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </>
            ) : searchQuery.trim() ? (
              <div className="text-center py-8">
                <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No results found for "{searchQuery}"</p>
                <p className="text-sm text-gray-500 mt-2">
                  Try searching for pages, lessons, or forum topics
                </p>
                <div className="mt-4 text-left">
                  <p className="text-xs text-gray-500 mb-2">Popular searches:</p>
                  <div className="flex flex-wrap gap-2">
                    {['Dashboard', 'Forum', 'Learning', 'AI Chat', 'Credits'].map((term) => (
                      <Button
                        key={term}
                        variant="outline"
                        size="sm"
                        className="text-xs h-6"
                        onClick={() => {
                          setSearchQuery(term);
                          handleSearch(term, false); // No toast for suggestion clicks
                        }}
                      >
                        {term}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Start typing to search...</p>
                <p className="text-sm text-gray-500 mt-2">
                  Search for pages, lessons, forum topics, and more
                </p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Notifications Panel */}
      <Dialog open={isNotificationsOpen} onOpenChange={setIsNotificationsOpen}>
        <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl flex items-center gap-2">
              <Bell className="w-5 h-5 text-blue-600" />
              Notifications
              <Badge variant="secondary" className="ml-auto">
                {mockNotifications.filter(n => !n.read).length} new
              </Badge>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-3 mt-4">
            {mockNotifications.length > 0 ? (
              mockNotifications.map((notification) => {
                const IconComponent = notification.icon;
                return (
                  <Card
                    key={notification.id}
                    className={`cursor-pointer transition-all ${
                      !notification.read ? 'bg-blue-50 border-blue-200' : 'hover:shadow-md'
                    }`}
                  >
                    <CardContent className="p-4">
                      <div
                        className="flex items-start gap-3"
                        onClick={() => markNotificationAsRead(notification.id)}
                      >
                        <div className={`p-2 rounded-full ${
                          notification.type === 'class' ? 'bg-green-100 text-green-600' :
                          notification.type === 'forum' ? 'bg-blue-100 text-blue-600' :
                          notification.type === 'achievement' ? 'bg-yellow-100 text-yellow-600' :
                          'bg-purple-100 text-purple-600'
                        }`}>
                          <IconComponent className="w-4 h-4" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-medium text-sm truncate">
                              {notification.title}
                            </h4>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 ml-2" />
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mb-2">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-500">
                            {notification.time}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            ) : (
              <div className="text-center py-8">
                <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No notifications</p>
                <p className="text-sm text-gray-500 mt-2">
                  You're all caught up!
                </p>
              </div>
            )}

            {mockNotifications.length > 0 && (
              <div className="pt-4 border-t">
                <Button variant="outline" className="w-full" size="sm">
                  Mark All as Read
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </header>
  );
};

export default Header;
