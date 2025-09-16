import React from 'react';
import { Menu, Bell, Search, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

const Header = ({ onMenuClick }) => {
  const handleNotificationClick = () => {
    toast({
      title: "🔔 Notificações",
      description: "🚧 Esta funcionalidade ainda não foi implementada—mas não se preocupe! Você pode solicitá-la no seu próximo prompt! 🚀",
    });
  };

  const handleSearchClick = () => {
    toast({
      title: "🔍 Busca",
      description: "🚧 Esta funcionalidade ainda não foi implementada—mas não se preocupe! Você pode solicitá-la no seu próximo prompt! 🚀",
    });
  };

  const handleProfileClick = () => {
    toast({
      title: "👤 Menu do Usuário",
      description: "🚧 Esta funcionalidade ainda não foi implementada—mas não se preocupe! Você pode solicitá-la no seu próximo prompt! 🚀",
    });
  };

  return (
    <header className="bg-white/10 backdrop-blur-md border-b border-white/20 px-4 lg:px-8 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuClick}
            className="lg:hidden text-white hover:bg-white/10"
          >
            <Menu size={24} />
          </Button>
          
          <div className="hidden md:flex items-center gap-2 bg-white/10 rounded-lg px-4 py-2 min-w-[300px]">
            <Search size={20} className="text-white/60" />
            <input
              type="text"
              placeholder="Buscar agendamentos..."
              className="bg-transparent text-white placeholder-white/60 outline-none flex-1"
              onClick={handleSearchClick}
              readOnly
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 text-white/80">
            <span className="text-sm">admin</span>
            <div className="w-6 h-6 bg-gradient-to-r from-blue-400 to-green-400 rounded-full flex items-center justify-center text-xs font-bold text-white">
              A
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={handleNotificationClick}
            className="text-white hover:bg-white/10 relative"
          >
            <Bell size={20} />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
          </Button>

          <div className="bg-gradient-to-r from-blue-400 to-green-400 text-white px-4 py-2 rounded-lg font-semibold text-sm">
            Sair
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;