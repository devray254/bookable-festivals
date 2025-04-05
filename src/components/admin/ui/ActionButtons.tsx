
import React from "react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";

export interface ActionItem {
  label: string;
  onClick: () => void;
  icon?: React.ReactNode;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  isDestructive?: boolean;
}

interface ActionButtonsProps {
  actions: ActionItem[];
  maxVisibleButtons?: number;
}

export function ActionButtons({ 
  actions, 
  maxVisibleButtons = 2 
}: ActionButtonsProps) {
  // Separate visible actions from dropdown actions
  const visibleActions = actions.slice(0, maxVisibleButtons);
  const dropdownActions = actions.slice(maxVisibleButtons);

  return (
    <div className="flex items-center gap-2">
      {visibleActions.map((action, index) => (
        <Button
          key={index}
          variant={action.variant || "outline"}
          size="sm"
          onClick={action.onClick}
          className={action.isDestructive ? "text-destructive hover:text-destructive" : ""}
        >
          {action.icon && <span className="mr-1">{action.icon}</span>}
          {action.label}
        </Button>
      ))}

      {dropdownActions.length > 0 && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {dropdownActions.map((action, index) => (
              <DropdownMenuItem
                key={index}
                onClick={action.onClick}
                className={action.isDestructive ? "text-destructive" : ""}
              >
                {action.icon && <span className="mr-2">{action.icon}</span>}
                {action.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}
