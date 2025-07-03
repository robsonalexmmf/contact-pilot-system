
import { Bell, Menu, Search, User, Settings, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { getUsageInfo } from "@/utils/planService";
import { getCurrentUser } from "@/utils/testUsers";

interface HeaderProps {
  activeModule: string;
  toggleSidebar: () => void;
}

export const Header = ({ activeModule, toggleSidebar }: HeaderProps) => {
  const navigate = useNavigate();
  const { plan, daysRemaining } = getUsageInfo();
  const currentUser = getCurrentUser();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const getStatusColor = () => {
    if (plan.planType === 'premium') return 'bg-purple-100 text-purple-800';
    if (plan.planType === 'pro') return 'bg-blue-100 text-blue-800';
    return 'bg-gray-100 text-gray-800';
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="lg:hidden"
          >
            <Menu className="w-5 h-5" />
          </Button>

          <div className="hidden md:flex items-center space-x-2">
            <h1 className="text-xl font-semibold text-gray-900 capitalize">
              {activeModule.replace('-', ' ')}
            </h1>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {/* Plano atual */}
          <Badge className={getStatusColor()}>
            {plan.planType.toUpperCase()}
            {daysRemaining !== null && ` - ${daysRemaining}d`}
          </Badge>

          {/* Notificações */}
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
          </Button>

          {/* Menu do usuário */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                  {currentUser?.name.charAt(0) || 'U'}
                </div>
                <span className="hidden md:block font-medium">
                  {currentUser?.name || 'Usuário'}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div>
                  <p className="font-medium">{currentUser?.name}</p>
                  <p className="text-sm text-gray-500">{currentUser?.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="w-4 h-4 mr-2" />
                Perfil
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="w-4 h-4 mr-2" />
                Configurações
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                <LogOut className="w-4 h-4 mr-2" />
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};
</DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};
</DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};
