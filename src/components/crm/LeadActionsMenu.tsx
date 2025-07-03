
import { 
  ContextMenu, 
  ContextMenuContent, 
  ContextMenuItem, 
  ContextMenuSeparator, 
  ContextMenuTrigger 
} from "@/components/ui/context-menu";
import { Button } from "@/components/ui/button";
import { 
  MoreHorizontal, 
  Edit, 
  Trash, 
  Phone, 
  Mail, 
  Calendar, 
  User, 
  FileText,
  Star
} from "lucide-react";
import { openWhatsApp, whatsappTemplates } from "@/utils/whatsappUtils";
import { openEmailClient, emailTemplates } from "@/utils/emailUtils";
import { useLanguage } from "@/hooks/useLanguage";
import { useEffect, useState } from "react";

interface Lead {
  id: number;
  name: string;
  email: string;
  phone: string;
  company: string;
  status: string;
  score: number;
  source: string;
  lastContact: string;
  value: number;
}

interface LeadActionsMenuProps {
  lead: Lead;
  onEdit: (lead: Lead) => void;
  onDelete: (leadId: number) => void;
  onCall: (leadId: number) => void;
  onEmail: (leadId: number) => void;
  onScheduleMeeting: (leadId: number) => void;
  onCreateProposal: (leadId: number) => void;
  onConvertToCustomer: (leadId: number) => void;
  onMarkAsFavorite: (leadId: number) => void;
}

export const LeadActionsMenu = ({ 
  lead, 
  onEdit, 
  onDelete, 
  onCall, 
  onEmail, 
  onScheduleMeeting,
  onCreateProposal,
  onConvertToCustomer,
  onMarkAsFavorite
}: LeadActionsMenuProps) => {
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

  const handleAction = (action: string) => {
    console.log(`Ação '${action}' executada para lead:`, lead.name);
    
    switch (action) {
      case 'edit':
        onEdit(lead);
        break;
      case 'delete':
        if (window.confirm(`${t('confirmDeleteLead')} ${lead.name}?`)) {
          onDelete(lead.id);
        }
        break;
      case 'call':
        // Use a função do WhatsApp diretamente
        const message = whatsappTemplates.leadContact(lead.name);
        openWhatsApp(lead.phone, message);
        break;
      case 'email':
        // Use a função de email diretamente
        const template = emailTemplates.leadContact(lead.name, lead.company);
        openEmailClient(lead.email, template.subject, template.body);
        break;
      case 'meeting':
        onScheduleMeeting(lead.id);
        break;
      case 'proposal':
        onCreateProposal(lead.id);
        break;
      case 'convert':
        onConvertToCustomer(lead.id);
        break;
      case 'favorite':
        onMarkAsFavorite(lead.id);
        break;
    }
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
          <MoreHorizontal className="w-4 h-4" />
        </Button>
      </ContextMenuTrigger>
      <ContextMenuContent className="w-56 bg-white border shadow-md">
        <ContextMenuItem onClick={() => handleAction('call')} className="cursor-pointer">
          <Phone className="w-4 h-4 mr-2" />
          {t('openWhatsApp')}
        </ContextMenuItem>
        <ContextMenuItem onClick={() => handleAction('email')} className="cursor-pointer">
          <Mail className="w-4 h-4 mr-2" />
          {t('sendEmail')}
        </ContextMenuItem>
        <ContextMenuItem onClick={() => handleAction('meeting')} className="cursor-pointer">
          <Calendar className="w-4 h-4 mr-2" />
          {t('scheduleMeeting')}
        </ContextMenuItem>
        
        <ContextMenuSeparator />
        
        <ContextMenuItem onClick={() => handleAction('proposal')} className="cursor-pointer">
          <FileText className="w-4 h-4 mr-2" />
          {t('createProposal')}
        </ContextMenuItem>
        <ContextMenuItem onClick={() => handleAction('convert')} className="cursor-pointer">
          <User className="w-4 h-4 mr-2" />
          {t('convertToCustomer')}
        </ContextMenuItem>
        
        <ContextMenuSeparator />
        
        <ContextMenuItem onClick={() => handleAction('favorite')} className="cursor-pointer">
          <Star className="w-4 h-4 mr-2" />
          {t('markAsFavorite')}
        </ContextMenuItem>
        <ContextMenuItem onClick={() => handleAction('edit')} className="cursor-pointer">
          <Edit className="w-4 h-4 mr-2" />
          {t('editLead')}
        </ContextMenuItem>
        
        <ContextMenuSeparator />
        
        <ContextMenuItem 
          onClick={() => handleAction('delete')} 
          className="cursor-pointer text-red-600 focus:text-red-600"
        >
          <Trash className="w-4 h-4 mr-2" />
          {t('deleteLead')}
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};
