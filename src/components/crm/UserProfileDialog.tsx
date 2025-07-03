
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface UserProfileDialogProps {
  open: boolean;
  onClose: () => void;
  userName: string;
  userRole: string;
}

export const UserProfileDialog = ({ open, onClose, userName, userRole }: UserProfileDialogProps) => {
  const [profileData, setProfileData] = useState({
    name: userName,
    email: "joao.silva@empresa.com",
    phone: "(11) 99999-9999",
    department: "Vendas",
    bio: "Especialista em vendas com mais de 5 anos de experiência",
    location: "São Paulo, SP"
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      console.log("Atualizando perfil:", profileData);
      
      // Simular salvamento
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Perfil atualizado!",
        description: "Suas informações foram salvas com sucesso.",
      });
      
      onClose();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao atualizar perfil. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Meu Perfil</DialogTitle>
          <DialogDescription>
            Atualize suas informações pessoais e profissionais.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col items-center space-y-4 py-4">
          <div className="relative">
            <Avatar className="w-20 h-20">
              <AvatarImage src="" />
              <AvatarFallback className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-lg">
                <User className="w-8 h-8" />
              </AvatarFallback>
            </Avatar>
            <Button
              size="sm"
              variant="outline"
              className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full"
            >
              <Camera className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="text-center">
            <h3 className="font-semibold">{userName}</h3>
            <p className="text-sm text-gray-500">{userRole}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome</Label>
                <Input
                  id="name"
                  value={profileData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={profileData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Telefone</Label>
                <Input
                  id="phone"
                  value={profileData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">Departamento</Label>
                <Input
                  id="department"
                  value={profileData.department}
                  onChange={(e) => handleInputChange("department", e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Localização</Label>
              <Input
                id="location"
                value={profileData.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Biografia</Label>
              <Textarea
                id="bio"
                value={profileData.bio}
                onChange={(e) => handleInputChange("bio", e.target.value)}
                rows={3}
              />
            </div>
          </div>

          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
