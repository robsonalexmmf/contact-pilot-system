
import { useState, useMemo } from "react";

// Mock data para demonstração - em produção viria da API
const mockSearchData = {
  leads: [
    { id: 1, name: "Maria Santos", type: "lead" as const, company: "Empresa XYZ", email: "maria@empresa.com" },
    { id: 2, name: "João Silva", type: "lead" as const, company: "StartupTech", email: "joao@startup.com" },
    { id: 3, name: "Ana Costa", type: "lead" as const, company: "ABC Corp", email: "ana@corp.com" }
  ],
  tasks: [
    { id: 1, name: "Follow-up Maria Santos", type: "task" as const, description: "Agendar reunião", dueDate: "2024-01-20" },
    { id: 2, name: "Proposta João Silva", type: "task" as const, description: "Enviar proposta comercial", dueDate: "2024-01-22" },
    { id: 3, name: "Ligação Ana Costa", type: "task" as const, description: "Retorno sobre proposta", dueDate: "2024-01-18" }
  ],
  companies: [
    { id: 1, name: "Empresa XYZ", type: "company" as const, industry: "Tecnologia", size: "Média" },
    { id: 2, name: "StartupTech", type: "company" as const, industry: "Software", size: "Pequena" },
    { id: 3, name: "ABC Corp", type: "company" as const, industry: "Consultoria", size: "Grande" }
  ]
};

export interface SearchResult {
  id: number;
  name: string;
  type: 'lead' | 'task' | 'company';
  [key: string]: any;
}

export const useGlobalSearch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const searchResults = useMemo(() => {
    if (!searchTerm.trim()) return [];

    setIsSearching(true);
    
    const term = searchTerm.toLowerCase();
    const results: SearchResult[] = [];

    // Buscar em leads
    mockSearchData.leads.forEach(lead => {
      if (
        lead.name.toLowerCase().includes(term) ||
        lead.company.toLowerCase().includes(term) ||
        lead.email.toLowerCase().includes(term)
      ) {
        results.push(lead);
      }
    });

    // Buscar em tarefas
    mockSearchData.tasks.forEach(task => {
      if (
        task.name.toLowerCase().includes(term) ||
        task.description.toLowerCase().includes(term)
      ) {
        results.push(task);
      }
    });

    // Buscar em empresas
    mockSearchData.companies.forEach(company => {
      if (
        company.name.toLowerCase().includes(term) ||
        company.industry.toLowerCase().includes(term)
      ) {
        results.push(company);
      }
    });

    setTimeout(() => setIsSearching(false), 200);
    
    return results;
  }, [searchTerm]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    console.log(`Buscando por: ${term}`);
  };

  const handleResultClick = (result: SearchResult) => {
    console.log(`Clicou no resultado:`, result);
    alert(`Navegando para ${result.type}: ${result.name}`);
    setSearchTerm(""); // Limpar busca após clicar
  };

  return {
    searchTerm,
    searchResults,
    isSearching,
    handleSearch,
    handleResultClick
  };
};
