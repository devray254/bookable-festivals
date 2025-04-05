
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface DataCardProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
  iconClassName?: string;
  valueClassName?: string;
  labelClassName?: string;
}

export function DataCard({
  label,
  value,
  icon,
  trend,
  className,
  iconClassName,
  valueClassName,
  labelClassName
}: DataCardProps) {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className={cn("text-sm font-medium text-muted-foreground", labelClassName)}>
              {label}
            </p>
            <p className={cn("text-2xl font-bold mt-1", valueClassName)}>
              {value}
            </p>
            
            {trend && (
              <div className="flex items-center mt-1">
                <span className={cn(
                  "text-xs font-medium",
                  trend.isPositive ? "text-green-600" : "text-red-600"
                )}>
                  {trend.isPositive ? "+" : "-"}{Math.abs(trend.value)}%
                </span>
                <span className="text-xs text-muted-foreground ml-1">vs. last period</span>
              </div>
            )}
          </div>
          
          {icon && (
            <div className={cn(
              "h-12 w-12 rounded-full flex items-center justify-center bg-primary/10", 
              iconClassName
            )}>
              {icon}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
