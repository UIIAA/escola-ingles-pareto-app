import React, { useState } from 'react';
import { Menu, Bell, Search, User, LogOut, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';

interface HeaderProps {
  onMenuClick: () => void;
  userActions?: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick, userActions }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();

  // Mock user data - will be replaced with real auth later
  const user = {
    name: 'Marcos Cruz',
    email: 'marcos@exemplo.com',
    role: 'student', // student | teacher | master
    avatar: null
  };

  const handleSearch = (query: string) => {
    if (query.trim()) {
      toast({
        title: "🔍 Buscando...",
        description: `Resultados para: "${query}"`,
      });
      // TODO: Implement actual search functionality
    }
  };

  const handleNotificationClick = () => {
    toast({
      title: "🔔 Notificações",
      description: "Você tem 3 novas notificações",
    });
    // TODO: Open notifications panel
  };

  const handleLogout = () => {
    toast({
      title: "👋 Saindo...",
      description: "Você foi desconectado com sucesso",
    });
    // TODO: Implement logout functionality
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

  return (
    <header className="bg-white/90 backdrop-blur-md border-b border-blue-100 px-4 lg:px-8 py-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuClick}
            className="lg:hidden text-gray-700 hover:bg-gray-100"
          >
            <Menu size={20} />
          </Button>

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
            <span className={`text-xs px-2 py-1 rounded-full text-white bg-gradient-to-r ${getRoleColor(user.role)}`}>
              {getRoleLabel(user.role)}
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
                  <span className="text-sm font-medium text-gray-700">{user.name}</span>
                  <span className="text-xs text-gray-500">{user.email}</span>
                </div>
                <div className={`w-8 h-8 bg-gradient-to-r ${getRoleColor(user.role)} rounded-full flex items-center justify-center text-xs font-bold text-white`}>
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
                  ) : (
                    getInitials(user.name)
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
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Perfil</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
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
    </header>
  );
};

export default Header;
