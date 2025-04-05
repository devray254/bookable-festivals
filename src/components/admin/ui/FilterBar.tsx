
import React from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

interface FilterOption {
  label: string;
  value: string;
}

interface FilterBarProps {
  searchPlaceholder?: string;
  searchValue: string;
  onSearchChange: (value: string) => void;
  onSearchClear?: () => void;
  filters?: {
    name: string;
    options: FilterOption[];
    value: string;
    onChange: (value: string) => void;
    label?: string;
  }[];
}

export function FilterBar({
  searchPlaceholder = "Search...",
  searchValue,
  onSearchChange,
  onSearchClear,
  filters = []
}: FilterBarProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div className="relative w-full sm:max-w-xs">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input 
          type="text" 
          placeholder={searchPlaceholder} 
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-8"
        />
        {searchValue && onSearchClear && (
          <Button 
            variant="ghost" 
            size="sm" 
            className="absolute right-0 top-0 h-full rounded-l-none"
            onClick={onSearchClear}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {filters.map((filter, index) => (
        <div key={index} className="w-full sm:w-auto">
          {filter.label && (
            <label className="text-sm font-medium block mb-1">{filter.label}</label>
          )}
          <Select value={filter.value} onValueChange={filter.onChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder={filter.name} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All {filter.name}</SelectItem>
              {filter.options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      ))}
    </div>
  );
}
