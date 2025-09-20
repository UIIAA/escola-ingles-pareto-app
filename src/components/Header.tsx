import React, { useState } from 'react';
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

  const { toast } = useToast();
  const { user, signOut } = useAuth();
  const { mode, isCollapsed, toggle } = useSidebar();
  const { isMobile, isTablet, isDesktop } = useResponsive();
  const navigate = useNavigate();

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

  // Mock searchable content
  const searchableContent = [
    { type: 'page', title: 'Dashboard', description: 'Overview and progress tracking', path: '/dashboard' },
    { type: 'page', title: 'Learning Paths', description: 'Structured English courses', path: '/learning' },
    { type: 'page', title: 'Class Catalog', description: 'Browse available lesson templates', path: '/catalog' },
    { type: 'page', title: 'Schedule', description: 'Book and manage your classes', path: '/schedule' },
    { type: 'page', title: 'Forum', description: 'Community discussions and Q&A', path: '/forum' },
    { type: 'page', title: 'AI Chat', description: 'Practice English with AI assistant', path: '/ai-chat' },
    { type: 'page', title: 'Credits', description: 'Manage your lesson credits', path: '/credits' },
    { type: 'lesson', title: 'Present Perfect Tense', description: 'Grammar lesson covering present perfect usage', path: '/learning' },
    { type: 'lesson', title: 'Business English Vocabulary', description: 'Professional terminology and phrases', path: '/learning' },
    { type: 'lesson', title: 'Conversation Practice', description: 'Interactive speaking exercises', path: '/learning' },
    { type: 'topic', title: 'Pronunciation Tips', description: 'Forum discussion about English pronunciation', path: '/forum' },
    { type: 'topic', title: 'Grammar Questions', description: 'Common grammar doubts and answers', path: '/forum' }
  ];

  const handleSearch = (query: string) => {
    if (query.trim()) {
      // Search across content
      const results = searchableContent.filter(item =>
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.description.toLowerCase().includes(query.toLowerCase())
      );

      setSearchResults(results);
      setIsSearchOpen(true);

      toast({
        title: "🔍 Search Results",
        description: `Found ${results.length} results for "${query}"`,
      });
    } else {
      setSearchResults([]);
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
            <Search size={18} className="text-gray-400" />
            <Input
              type="text"
              placeholder="Buscar aulas, professores, tópicos..."
              className="bg-transparent text-gray-700 placeholder-gray-400 outline-none border-none focus:ring-0 flex-1 p-0"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSearch(searchQuery);
                }
              }}
            />
            {searchQuery && (
              <Button
                size="sm"
                onClick={() => handleSearch(searchQuery)}
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
          <Search size={16} className="text-gray-400" />
          <Input
            type="text"
            placeholder="Buscar..."
            className="bg-transparent text-gray-700 placeholder-gray-400 outline-none border-none focus:ring-0 flex-1 p-0"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleSearch(searchQuery);
              }
            }}
          />
        </div>
      </div>

      {/* Search Results Modal */}
      <Dialog open={isSearchOpen} onOpenChange={setIsSearchOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl flex items-center gap-2">
              <Search className="w-5 h-5 text-blue-600" />
              Search Results
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            {searchResults.length > 0 ? (
              <>
                <p className="text-sm text-gray-600">
                  Found {searchResults.length} results for "{searchQuery}"
                </p>
                <div className="space-y-3">
                  {searchResults.map((result, index) => (
                    <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer">
                      <CardContent className="p-4">
                        <div
                          className="flex items-start justify-between"
                          onClick={() => {
                            navigate(result.path);
                            setIsSearchOpen(false);
                          }}
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge variant="outline" className="text-xs">
                                {result.type}
                              </Badge>
                              <h4 className="font-medium text-sm">{result.title}</h4>
                            </div>
                            <p className="text-sm text-gray-600">{result.description}</p>
                          </div>
                          <Button variant="ghost" size="sm">
                            Go →
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No results found for "{searchQuery}"</p>
                <p className="text-sm text-gray-500 mt-2">
                  Try searching for pages, lessons, or forum topics
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
