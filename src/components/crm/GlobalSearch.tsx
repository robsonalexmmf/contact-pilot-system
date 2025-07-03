
import { useState, useRef, useEffect } from "react";
import { Search, Command, User, CheckSquare, Building } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useGlobalSearch, SearchResult } from "@/hooks/useGlobalSearch";

export const GlobalSearch = () => {
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const { searchTerm, searchResults, isSearching, handleSearch, handleResultClick } = useGlobalSearch();

  // Fechar dropdown quando clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Atalho Ctrl+K
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleInputChange = (value: string) => {
    handleSearch(value);
    setIsOpen(value.length > 0);
  };

  const getResultIcon = (type: string) => {
    switch (type) {
      case 'lead': return <User className="w-4 h-4 text-blue-500" />;
      case 'task': return <CheckSquare className="w-4 h-4 text-green-500" />;
      case 'company': return <Building className="w-4 h-4 text-purple-500" />;
      default: return <Search className="w-4 h-4" />;
    }
  };

  const getResultLabel = (type: string) => {
    switch (type) {
      case 'lead': return 'Lead';
      case 'task': return 'Tarefa';
      case 'company': return 'Empresa';
      default: return '';
    }
  };

  const onResultClick = (result: SearchResult) => {
    handleResultClick(result);
    setIsOpen(false);
    if (inputRef.current) {
      inputRef.current.blur();
    }
  };

  return (
    <div className="relative hidden md:block">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
      <Input
        ref={inputRef}
        placeholder="Buscar leads, empresas, tarefas... (Ctrl+K)"
        className="pl-10 w-80"
        value={searchTerm}
        onChange={(e) => handleInputChange(e.target.value)}
        onFocus={() => searchTerm && setIsOpen(true)}
      />
      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
        <kbd className="px-2 py-1 text-xs bg-gray-100 rounded border">
          <Command className="w-3 h-3 inline mr-1" />K
        </kbd>
      </div>

      {/* Dropdown de resultados */}
      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute top-full left-0 right-0 mt-1 bg-white border rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto"
        >
          {isSearching ? (
            <div className="p-4 text-center text-gray-500">Buscando...</div>
          ) : searchResults.length > 0 ? (
            <>
              <div className="p-2 text-xs text-gray-500 border-b">
                {searchResults.length} resultado{searchResults.length !== 1 ? 's' : ''} encontrado{searchResults.length !== 1 ? 's' : ''}
              </div>
              {searchResults.map((result) => (
                <div
                  key={`${result.type}-${result.id}`}
                  className="flex items-center space-x-3 p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                  onClick={() => onResultClick(result)}
                >
                  {getResultIcon(result.type)}
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900">{result.name}</p>
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                        {getResultLabel(result.type)}
                      </span>
                    </div>
                    {result.type === 'lead' && (
                      <p className="text-xs text-gray-500">{result.company} • {result.email}</p>
                    )}
                    {result.type === 'task' && (
                      <p className="text-xs text-gray-500">{result.description}</p>
                    )}
                    {result.type === 'company' && (
                      <p className="text-xs text-gray-500">{result.industry} • {result.size}</p>
                    )}
                  </div>
                </div>
              ))}
            </>
          ) : searchTerm ? (
            <div className="p-4 text-center text-gray-500">
              Nenhum resultado encontrado para "{searchTerm}"
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};
