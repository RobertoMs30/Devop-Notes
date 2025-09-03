import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface SearchBarProps {
  searchQuery: string;
  onSearch: (query: string) => void;
}

export function SearchBar({ searchQuery, onSearch }: SearchBarProps) {
  return (
    <div className="mb-8">
      <h2 className="text-lg font-medium text-foreground mb-4">Buscar nota</h2>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-muted-foreground" />
        </div>
        <Input
          type="text"
          placeholder="Buscar por título o contenido..."
          value={searchQuery}
          onChange={(e) => onSearch(e.target.value)}
          className="pl-10"
          data-testid="input-search"
        />
      </div>
    </div>
  );
}
