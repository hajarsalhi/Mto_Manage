import React from "react";
import { ArrowDownRight, ArrowUpRight, Edit, ArrowDownUp, EllipsisVertical, EllipsisVertical  } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu.tsx"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card.tsx";
import { Button } from "../ui/button.tsx";
import { cn } from "../../lib/utils.ts";
import { Progress } from "../ui/progress.tsx";
import { useNavigate } from "react-router-dom";

interface MtoCardProps {
  id: number;
  name: string;
  balance: number;
  prevBalance: number;
  status: string; // "active" | "inactive";
  riskThreshold: number;
  onViewMto: (mtoId: number) => void;
  onEditBalance: (mtoId: number) => void;
}

export function MtoCard({ 
  id, 
  name, 
  balance, 
  prevBalance, 
  status, 
  riskThreshold,
  onViewMto
}: MtoCardProps) {
  const change = prevBalance ? ((balance - prevBalance) / prevBalance) * 100: 0;
  const isPositive = change >= 0;
  const isAtRisk = balance < riskThreshold;
  const navigate = useNavigate();

  
  // Calculate risk value usage percentage
  const maxValue = balance + riskThreshold;
  const riskUsagePercentage = (balance / maxValue) * 100;

  const handleViewTransANDComp = () => {
    navigate('/products/add');
  };
  
  return (
    <Card className={cn(
      "overflow-hidden transition-all duration-200 hover:shadow-soft animate-fade-in card-shine border-2 border-green-500",
      status.toLowerCase() === 'inactive' && "border-2 border-grey-500"
    )}>
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="font-medium text-base">{name}</CardTitle>
        <div className="flex space-x-1">
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8"
            onClick={() => onViewMto(id)
          
            }
          >
            <ArrowDownUp className="h-3.5 w-3.5"  />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger>
              <EllipsisVertical  className="h-3.5 w-3.5"  />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Menu</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Edit Risk Value</DropdownMenuItem>
              <DropdownMenuItem>View Latest Transactions & Compensations</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        <div 
          className={cn(
            "text-2xl font-bold tracking-tight animate-fade-in",
            isAtRisk ? "text-red-500" : "text-primary"
          )}
        >
          {balance?.toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD'
          })}
        </div>
        <div className="mt-1 flex flex-col">
          <div className="flex items-center text-xs">
            <div
              className={cn(
                "flex items-center rounded-full px-1.5 py-0.5 tracking-tight",
                isPositive ? "text-emerald-700 bg-emerald-100" : "text-rose-700 bg-rose-100"
              )}
            >
              {isPositive ? (
                <ArrowUpRight className="h-3 w-3 mr-0.5" />
              ) : (
                <ArrowDownRight className="h-3 w-3 mr-0.5" />
              )}
              <span>{Math.abs(change).toFixed(2)}%</span>
            </div>
            <span className="text-muted-foreground ml-1.5">from yesterday</span>
          </div>

        {/* Risk Value Progress Bar */}
        <div className="mt-2 space-y-1">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Risk Value Usage</span>
            <span>{riskUsagePercentage.toFixed(1)}% of {maxValue}</span>
          </div>
          <Progress 
            value={riskUsagePercentage} 
            className={cn(
              "h-2",
              riskUsagePercentage > 80 ? "bg-red-100" : 
              riskUsagePercentage > 60 ? "bg-yellow-100" : "bg-green-100"
            )}
          />
        </div>
        
        
          
          <div className="mt-2 flex justify-between items-center">
            <Button 
              variant="outline" 
              size="sm" 
              className="p-0 h-auto text-xs text-muted-foreground bg-blue-100 hover:text-green-700" 
              onClick={handleViewTransANDComp}
            >
              Edit Risk Value
            </Button>
            <span 
              className={cn(
                "px-2 py-1 rounded-full text-xs capitalize",
                status === "active" && "bg-emerald-100 text-emerald-700",
                status === "inactive" && "bg-red-100 text-slate-700"
              )}
            >
              {status}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
