
import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { 
  Search,
  User,
  FileText,
  Calendar,
  Settings,
  MessageCircle,
  BarChart3,
  Plus,
  ArrowRight
} from "lucide-react";

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (module: string) => void;
}

const commands = [
  { id: "new-lead", label: "Criar novo lead", icon: <Plus className="w-4 h-4" />, action: "leads" },
  { id: "pipeline", label: "Ver pipeline de vendas", icon: <BarChart3 className="w-4 h-4" />, action: "pipeline" },
  { id: "tasks", label: "Minhas tarefas", icon: <FileText className="w-4 h-4" />, action: "tasks" },
  { id: "calendar", label: "Abrir calendário", icon: <Calendar className="w-4 h-4" />, action: "calendar" },
  { id: "chat", label: "Central de atendimento", icon: <MessageCircle className="w-4 h-4" />, action: "chat" },
  { id: "reports", label: "Relatórios", icon: <BarChart3 className="w-4 h-4" />, action: "reports" },
  { id: "settings", label: "Configurações", icon: <Settings className="w-4 h-4" />, action: "settings" },
  { id: "dashboard", label: "Dashboard", icon: <User className="w-4 h-4" />, action: "dashboard" },
];

export const CommandPalette = ({ isOpen, onClose, onNavigate }: CommandPaletteProps) => {
  const [search, setSearch] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  const filteredCommands = commands.filter(cmd =>
    cmd.label.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    if (isOpen) {
      setSearch("");
      setSelectedIndex(0);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setSelectedIndex(prev => 
            prev < filteredCommands.length - 1 ? prev + 1 : 0
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          setSelectedIndex(prev => 
            prev > 0 ? prev - 1 : filteredCommands.length - 1
          );
          break;
        case "Enter":
          e.preventDefault();
          if (filteredCommands[selectedIndex]) {
            handleCommand(filteredCommands[selectedIndex]);
          }
          break;
        case "Escape":
          e.preventDefault();
          onClose();
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, selectedIndex, filteredCommands]);

  const handleCommand = (command: typeof commands[0]) => {
    onNavigate(command.action);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="p-0 max-w-2xl">
        <div className="flex items-center border-b px-4 py-3">
          <Search className="w-4 h-4 text-gray-400 mr-3" />
          <Input
            placeholder="Digite um comando ou pesquise..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border-0 focus-visible:ring-0 text-sm"
            autoFocus
          />
        </div>

        <div className="max-h-96 overflow-y-auto">
          {filteredCommands.length === 0 ? (
            <div className="px-4 py-8 text-center text-gray-500">
              <Search className="w-8 h-8 mx-auto mb-2 text-gray-300" />
              <p>Nenhum comando encontrado</p>
            </div>
          ) : (
            <div className="py-2">
              {filteredCommands.map((command, index) => (
                <button
                  key={command.id}
                  onClick={() => handleCommand(command)}
                  className={`w-full flex items-center px-4 py-3 text-left hover:bg-gray-50 transition-colors ${
                    index === selectedIndex ? "bg-blue-50 border-r-2 border-blue-500" : ""
                  }`}
                >
                  <div className="flex items-center flex-1">
                    {command.icon}
                    <span className="ml-3 text-sm">{command.label}</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="px-4 py-3 border-t bg-gray-50 text-xs text-gray-500">
          <div className="flex justify-between">
            <span>↑↓ para navegar</span>
            <span>Enter para selecionar</span>
            <span>Esc para fechar</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
