import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/hooks/useLanguage";

interface SettingsDialogProps {
  open: boolean;
  onClose: () => void;
}

interface SettingsState {
  notifications: {
    email: boolean;
    push: boolean;
    desktop: boolean;
    leadUpdates: boolean;
    taskReminders: boolean;
  };
  appearance: {
    theme: string;
    language: string;
    timezone: string;
  };
  privacy: {
    showOnlineStatus: boolean;
    allowDataCollection: boolean;
    shareAnalytics: boolean;
  };
}

const defaultSettings: SettingsState = {
  notifications: {
    email: true,
    push: true,
    desktop: false,
    leadUpdates: true,
    taskReminders: true
  },
  appearance: {
    theme: "system",
    language: "pt-BR",
    timezone: "America/Sao_Paulo"
  },
  privacy: {
    showOnlineStatus: true,
    allowDataCollection: false,
    shareAnalytics: true
  }
};

export const SettingsDialog = ({ open, onClose }: SettingsDialogProps) => {
  const [settings, setSettings] = useState<SettingsState>(defaultSettings);
  const [hasChanges, setHasChanges] = useState(false);
  const { toast } = useToast();
  const { t, setLanguage } = useLanguage();

  // Carregar configurações do localStorage ao abrir o dialog
  useEffect(() => {
    if (open) {
      const savedSettings = localStorage.getItem('userSettings');
      if (savedSettings) {
        try {
          const parsed = JSON.parse(savedSettings);
          setSettings(parsed);
          console.log("Configurações carregadas:", parsed);
        } catch (error) {
          console.error("Erro ao carregar configurações:", error);
          setSettings(defaultSettings);
        }
      } else {
        setSettings(defaultSettings);
      }
      setHasChanges(false);
    }
  }, [open]);

  // Aplicar tema quando mudança for detectada
  useEffect(() => {
    applyTheme(settings.appearance.theme);
  }, [settings.appearance.theme]);

  // Aplicar idioma quando mudança for detectada
  useEffect(() => {
    setLanguage(settings.appearance.language as any);
  }, [settings.appearance.language, setLanguage]);

  const applyTheme = (theme: string) => {
    const root = document.documentElement;
    
    switch (theme) {
      case 'light':
        root.classList.remove('dark');
        break;
      case 'dark':
        root.classList.add('dark');
        break;
      case 'system':
        // Detectar preferência do sistema
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (prefersDark) {
          root.classList.add('dark');
        } else {
          root.classList.remove('dark');
        }
        break;
    }
    
    console.log(`Tema aplicado: ${theme}`);
  };

  const handleNotificationChange = (key: keyof SettingsState['notifications'], value: boolean) => {
    setSettings(prev => ({
      ...prev,
      notifications: { ...prev.notifications, [key]: value }
    }));
    setHasChanges(true);
    console.log(`Notificação ${key} alterada para:`, value);
  };

  const handleAppearanceChange = (key: keyof SettingsState['appearance'], value: string) => {
    setSettings(prev => ({
      ...prev,
      appearance: { ...prev.appearance, [key]: value }
    }));
    setHasChanges(true);
    console.log(`Aparência ${key} alterada para:`, value);
  };

  const handlePrivacyChange = (key: keyof SettingsState['privacy'], value: boolean) => {
    setSettings(prev => ({
      ...prev,
      privacy: { ...prev.privacy, [key]: value }
    }));
    setHasChanges(true);
    console.log(`Privacidade ${key} alterada para:`, value);
  };

  const handleSave = async () => {
    try {
      // Salvar no localStorage
      localStorage.setItem('userSettings', JSON.stringify(settings));
      
      // Simular salvamento no servidor
      await new Promise(resolve => setTimeout(resolve, 500));
      
      console.log("Configurações salvas:", settings);
      
      toast({
        title: t('settingsSaved'),
        description: t('settingsSavedDesc'),
      });
      
      setHasChanges(false);
      onClose();
    } catch (error) {
      console.error("Erro ao salvar configurações:", error);
      toast({
        title: t('errorSaving'),
        description: t('errorSavingDesc'),
        variant: "destructive"
      });
    }
  };

  const handleCancel = () => {
    if (hasChanges) {
      const confirm = window.confirm(t('confirmExit'));
      if (!confirm) return;
    }
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleCancel}>
      <DialogContent className="sm:max-w-[600px] sm:max-h-[700px]">
        <DialogHeader>
          <DialogTitle>{t('settingsTitle')}</DialogTitle>
          <DialogDescription>
            {t('settingsDescription')}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="notifications" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="notifications">{t('notifications')}</TabsTrigger>
            <TabsTrigger value="appearance">{t('appearance')}</TabsTrigger>
            <TabsTrigger value="privacy">{t('privacy')}</TabsTrigger>
          </TabsList>

          <TabsContent value="notifications" className="space-y-4">
            <div className="space-y-4">
              <h4 className="font-medium">{t('notificationTypes')}</h4>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>{t('emailNotifications')}</Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{t('emailNotificationsDesc')}</p>
                </div>
                <Switch
                  checked={settings.notifications.email}
                  onCheckedChange={(checked) => handleNotificationChange('email', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>{t('pushNotifications')}</Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{t('pushNotificationsDesc')}</p>
                </div>
                <Switch
                  checked={settings.notifications.push}
                  onCheckedChange={(checked) => handleNotificationChange('push', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>{t('desktopNotifications')}</Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{t('desktopNotificationsDesc')}</p>
                </div>
                <Switch
                  checked={settings.notifications.desktop}
                  onCheckedChange={(checked) => handleNotificationChange('desktop', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>{t('leadUpdates')}</Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{t('leadUpdatesDesc')}</p>
                </div>
                <Switch
                  checked={settings.notifications.leadUpdates}
                  onCheckedChange={(checked) => handleNotificationChange('leadUpdates', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>{t('taskReminders')}</Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{t('taskRemindersDesc')}</p>
                </div>
                <Switch
                  checked={settings.notifications.taskReminders}
                  onCheckedChange={(checked) => handleNotificationChange('taskReminders', checked)}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="appearance" className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>{t('theme')}</Label>
                <Select
                  value={settings.appearance.theme}
                  onValueChange={(value) => handleAppearanceChange('theme', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">{t('themeLight')}</SelectItem>
                    <SelectItem value="dark">{t('themeDark')}</SelectItem>
                    <SelectItem value="system">{t('themeSystem')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>{t('language')}</Label>
                <Select
                  value={settings.appearance.language}
                  onValueChange={(value) => handleAppearanceChange('language', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                    <SelectItem value="en-US">English (US)</SelectItem>
                    <SelectItem value="es-ES">Español</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>{t('timezone')}</Label>
                <Select
                  value={settings.appearance.timezone}
                  onValueChange={(value) => handleAppearanceChange('timezone', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="America/Sao_Paulo">São Paulo (GMT-3)</SelectItem>
                    <SelectItem value="America/New_York">New York (GMT-5)</SelectItem>
                    <SelectItem value="Europe/London">London (GMT+0)</SelectItem>
                    <SelectItem value="America/Los_Angeles">Los Angeles (GMT-8)</SelectItem>
                    <SelectItem value="Asia/Tokyo">Tokyo (GMT+9)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="privacy" className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>{t('showOnlineStatus')}</Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{t('showOnlineStatusDesc')}</p>
                </div>
                <Switch
                  checked={settings.privacy.showOnlineStatus}
                  onCheckedChange={(checked) => handlePrivacyChange('showOnlineStatus', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>{t('allowDataCollection')}</Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{t('allowDataCollectionDesc')}</p>
                </div>
                <Switch
                  checked={settings.privacy.allowDataCollection}
                  onCheckedChange={(checked) => handlePrivacyChange('allowDataCollection', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>{t('shareAnalytics')}</Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{t('shareAnalyticsDesc')}</p>
                </div>
                <Switch
                  checked={settings.privacy.shareAnalytics}
                  onCheckedChange={(checked) => handlePrivacyChange('shareAnalytics', checked)}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {hasChanges && t('unsavedChanges')}
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={handleCancel}>
              {t('cancel')}
            </Button>
            <Button 
              onClick={handleSave}
              disabled={!hasChanges}
              className={hasChanges ? "bg-gradient-to-r from-blue-600 to-purple-600" : ""}
            >
              {t('saveSettings')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
