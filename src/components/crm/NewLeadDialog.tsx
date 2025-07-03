
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/hooks/useLanguage";

interface NewLeadDialogProps {
  onCreateLead?: (lead: any) => void;
}

export const NewLeadDialog = ({ onCreateLead }: NewLeadDialogProps) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    source: "",
    notes: "",
    value: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
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

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email) {
      toast({
        title: t("error"),
        description: t("nameEmailRequired"),
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const newLead = {
        id: Date.now(),
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        company: formData.company,
        status: "Novo",
        score: Math.floor(Math.random() * 30) + 70,
        source: formData.source || t("manual"),
        lastContact: new Date().toISOString().split('T')[0],
        value: parseInt(formData.value) || 0,
        notes: formData.notes
      };

      console.log("Criando novo lead:", newLead);
      
      if (onCreateLead) {
        onCreateLead(newLead);
      }

      toast({
        title: t("success"),
        description: `${t("leads")} ${formData.name} ${t("leadCreatedSuccess")}`,
      });

      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        company: "",
        source: "",
        notes: "",
        value: ""
      });
      
      setOpen(false);
    } catch (error) {
      console.error("Erro ao criar lead:", error);
      toast({
        title: t("error"),
        description: t("errorCreatingLead"),
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
          <Plus className="w-4 h-4 mr-2" />
          {t("createNewLead").replace("Criar Novo Lead", "").replace("Create New Lead", "").replace("Crear Nuevo Lead", "") || "Novo Lead"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{t("createNewLead")}</DialogTitle>
          <DialogDescription>
            {t("fillLeadInfo")}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">{t("name")} *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder={t("leadName")}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">{t("email")} *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="email@exemplo.com"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">{t("phone")}</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder="(11) 99999-9999"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company">{t("company")}</Label>
                <Input
                  id="company"
                  value={formData.company}
                  onChange={(e) => handleInputChange("company", e.target.value)}
                  placeholder={t("companyName")}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="source">{t("source")}</Label>
                <Select value={formData.source} onValueChange={(value) => handleInputChange("source", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder={t("selectSource")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Website">{t("website")}</SelectItem>
                    <SelectItem value="LinkedIn">{t("linkedin")}</SelectItem>
                    <SelectItem value="Indicação">{t("referral")}</SelectItem>
                    <SelectItem value="Google Ads">{t("googleAds")}</SelectItem>
                    <SelectItem value="Facebook">{t("facebook")}</SelectItem>
                    <SelectItem value="Email Marketing">{t("emailMarketing")}</SelectItem>
                    <SelectItem value="Evento">{t("event")}</SelectItem>
                    <SelectItem value="Manual">{t("manual")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="value">{t("estimatedValue")}</Label>
                <Input
                  id="value"
                  type="number"
                  value={formData.value}
                  onChange={(e) => handleInputChange("value", e.target.value)}
                  placeholder="0"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">{t("notes")}</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleInputChange("notes", e.target.value)}
                placeholder={t("additionalInfo")}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              {t("cancel")}
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? t("creating") : t("createLead")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
