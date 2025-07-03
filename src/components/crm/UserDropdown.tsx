
import { useState, useEffect } from "react";
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
  HelpCircle, 
  CreditCard,
  UserCircle
} from "lucide-react";
import { UserProfileDialog } from "./UserProfileDialog";
import { SettingsDialog } from "./SettingsDialog";
import { BillingDialog } from "./BillingDialog";
import { HelpDialog } from "./HelpDialog";
import { useLanguage } from "@/hooks/useLanguage";

interface UserDropdownProps {
  userName: string;
  userRole: string;
}

export const UserDropdown = ({ userName, userRole }: UserDropdownProps) => {
  const [profileOpen, setProfileOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [billingOpen, setBillingOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const { t } = useLanguage();
  const [, forceUpdate] = useState({});

  // Listen for language changes to force re-render
  useEffect(() => {
    const handleLanguageChange = () => {
      forceUpdate({});
    };

    window.addEventListener('languageChanged', handleLanguageChange);
    return () => window.removeEventListener('languageChanged', handleLanguageChange);
  }, []);

  const handleMenuAction = (action: string) => {
    console.log(`Ação do menu do usuário: ${action}`);
    
    switch (action) {
      case 'profile':
        setProfileOpen(true);
        break;
      case 'settings':
        setSettingsOpen(true);
        break;
      case 'billing':
        setBillingOpen(true);
        break;
      case 'help':
        setHelpOpen(true);
        break;
      case 'logout':
        if (confirm(t('confirmLogout'))) {
          alert(t('loggedOut'));
        }
        break;
    }
  };

  return (
    <>
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
            {t('myProfile')}
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={() => handleMenuAction('settings')} className="cursor-pointer">
            <Settings className="w-4 h-4 mr-2" />
            {t('settings')}
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={() => handleMenuAction('billing')} className="cursor-pointer">
            <CreditCard className="w-4 h-4 mr-2" />
            {t('billing')}
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem onClick={() => handleMenuAction('help')} className="cursor-pointer">
            <HelpCircle className="w-4 h-4 mr-2" />
            {t('helpSupport')}
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem 
            onClick={() => handleMenuAction('logout')} 
            className="cursor-pointer text-red-600 focus:text-red-600"
          >
            <LogOut className="w-4 h-4 mr-2" />
            {t('logout')}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Dialogs */}
      <UserProfileDialog 
        open={profileOpen} 
        onClose={() => setProfileOpen(false)}
        userName={userName}
        userRole={userRole}
      />
      <SettingsDialog 
        open={settingsOpen} 
        onClose={() => setSettingsOpen(false)}
      />
      <BillingDialog 
        open={billingOpen} 
        onClose={() => setBillingOpen(false)}
      />
      <HelpDialog 
        open={helpOpen} 
        onClose={() => setHelpOpen(false)}
      />
    </>
  );
};
