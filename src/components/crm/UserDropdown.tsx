
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { 
  User, 
  Settings, 
  LogOut, 
  Shield, 
  HelpCircle, 
  CreditCard,
  UserCircle
} from "lucide-react";

interface UserDropdownProps {
  userName: string;
  userRole: string;
}

export const UserDropdown = ({ userName, userRole }: UserDropdownProps) => {
  const handleMenuAction = (action: string) => {
    console.log(`Ação do menu do usuário: ${action}`);
    
    switch (action) {
      case 'profile':
        alert('Abrindo perfil do usuário');
        break;
      case 'settings':
        alert('Abrindo configurações');
        break;
      case 'billing':
        alert('Abrindo faturamento');
        break;
      case 'help':
        alert('Abrindo ajuda');
        break;
      case 'logout':
        if (confirm('Tem certeza que deseja sair?')) {
          alert('Logout realizado');
        }
        break;
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center space-x-2 p-2">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
          <div className="hidden md:block text-left">
            <p className="text-sm font-medium text-gray-900 dark:text-white">{userName}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{userRole}</p>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-sm font-medium">{userName}</p>
            <p className="text-xs text-gray-500">{userRole}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={() => handleMenuAction('profile')} className="cursor-pointer">
          <UserCircle className="w-4 h-4 mr-2" />
          Meu Perfil
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={() => handleMenuAction('settings')} className="cursor-pointer">
          <Settings className="w-4 h-4 mr-2" />
          Configurações
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={() => handleMenuAction('billing')} className="cursor-pointer">
          <CreditCard className="w-4 h-4 mr-2" />
          Faturamento
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={() => handleMenuAction('help')} className="cursor-pointer">
          <HelpCircle className="w-4 h-4 mr-2" />
          Ajuda & Suporte
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem 
          onClick={() => handleMenuAction('logout')} 
          className="cursor-pointer text-red-600 focus:text-red-600"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sair
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
