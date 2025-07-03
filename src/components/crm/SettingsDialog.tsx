
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface SettingsDialogProps {
  open: boolean;
  onClose: () => void;
}

export const SettingsDialog = ({ open, onClose }: SettingsDialogProps) => {
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: true,
      desktop: false,
      leadUpdates: true,
      taskReminders: true
    },
    appearance: {
      theme: "light",
      language: "pt-BR",
      timezone: "America/Sao_Paulo"
    },
    privacy: {
      showOnlineStatus: true,
      allowDataCollection: false,
      shareAnalytics: true
    }
  });
  const { toast } = useToast();

  const handleSave = () => {
    console.log("Salvando configurações:", settings);
    toast({
      title: "Configurações salvas!",
      description: "Suas preferências foram atualizadas com sucesso.",
    });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] sm:max-h-[700px]">
        <DialogHeader>
          <DialogTitle>Configurações</DialogTitle>
          <DialogDescription>
            Gerencie suas preferências e configurações do sistema.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="notifications" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="notifications">Notificações</TabsTrigger>
            <TabsTrigger value="appearance">Aparência</TabsTrigger>
            <TabsTrigger value="privacy">Privacidade</TabsTrigger>
          </TabsList>

          <TabsContent value="notifications" className="space-y-4">
            <div className="space-y-4">
              <h4 className="font-medium">Tipos de Notificação</h4>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Notificações por Email</Label>
                  <p className="text-sm text-gray-500">Receber notificações por email</p>
                </div>
                <Switch
                  checked={settings.notifications.email}
                  onCheckedChange={(checked) =>
                    setSettings(prev => ({
                      ...prev,
                      notifications: { ...prev.notifications, email: checked }
                    }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Notificações Push</Label>
                  <p className="text-sm text-gray-500">Notificações no navegador</p>
                </div>
                <Switch
                  checked={settings.notifications.push}
                  onCheckedChange={(checked) =>
                    setSettings(prev => ({
                      ...prev,
                      notifications: { ...prev.notifications, push: checked }
                    }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Atualizações de Leads</Label>
                  <p className="text-sm text-gray-500">Notificar sobre novos leads</p>
                </div>
                <Switch
                  checked={settings.notifications.leadUpdates}
                  onCheckedChange={(checked) =>
                    setSettings(prev => ({
                      ...prev,
                      notifications: { ...prev.notifications, leadUpdates: checked }
                    }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Lembretes de Tarefas</Label>
                  <p className="text-sm text-gray-500">Notificar sobre tarefas pendentes</p>
                </div>
                <Switch
                  checked={settings.notifications.taskReminders}
                  onCheckedChange={(checked) =>
                    setSettings(prev => ({
                      ...prev,
                      notifications: { ...prev.notifications, taskReminders: checked }
                    }))
                  }
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="appearance" className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Tema</Label>
                <Select
                  value={settings.appearance.theme}
                  onValueChange={(value) =>
                    setSettings(prev => ({
                      ...prev,
                      appearance: { ...prev.appearance, theme: value }
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Claro</SelectItem>
                    <SelectItem value="dark">Escuro</SelectItem>
                    <SelectItem value="system">Sistema</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Idioma</Label>
                <Select
                  value={settings.appearance.language}
                  onValueChange={(value) =>
                    setSettings(prev => ({
                      ...prev,
                      appearance: { ...prev.appearance, language: value }
                    }))
                  }
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
                <Label>Fuso Horário</Label>
                <Select
                  value={settings.appearance.timezone}
                  onValueChange={(value) =>
                    setSettings(prev => ({
                      ...prev,
                      appearance: { ...prev.appearance, timezone: value }
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="America/Sao_Paulo">São Paulo (GMT-3)</SelectItem>
                    <SelectItem value="America/New_York">New York (GMT-5)</SelectItem>
                    <SelectItem value="Europe/London">London (GMT+0)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="privacy" className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Mostrar Status Online</Label>
                  <p className="text-sm text-gray-500">Outros usuários podem ver quando você está online</p>
                </div>
                <Switch
                  checked={settings.privacy.showOnlineStatus}
                  onCheckedChange={(checked) =>
                    setSettings(prev => ({
                      ...prev,
                      privacy: { ...prev.privacy, showOnlineStatus: checked }
                    }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Coleta de Dados</Label>
                  <p className="text-sm text-gray-500">Permitir coleta de dados para melhorar o produto</p>
                </div>
                <Switch
                  checked={settings.privacy.allowDataCollection}
                  onCheckedChange={(checked) =>
                    setSettings(prev => ({
                      ...prev,
                      privacy: { ...prev.privacy, allowDataCollection: checked }
                    }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Compartilhar Analytics</Label>
                  <p className="text-sm text-gray-500">Ajudar a melhorar o produto compartilhando dados de uso</p>
                </div>
                <Switch
                  checked={settings.privacy.shareAnalytics}
                  onCheckedChange={(checked) =>
                    setSettings(prev => ({
                      ...prev,
                      privacy: { ...prev.privacy, shareAnalytics: checked }
                    }))
                  }
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>
            Salvar Configurações
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
