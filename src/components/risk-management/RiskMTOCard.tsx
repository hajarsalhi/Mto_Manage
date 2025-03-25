
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui-custom/Card';
import { Button } from '@/components/ui/button';
import { StatusIndicator } from '@/components/ui-custom/StatusIndicator';
import { ArrowRight } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface MTOData {
  name: string;
  currency: string;
  balance: number;
  currentRisk: number;
  maxRisk: number;
  threshold: number;
  isBlocked: boolean;
}

interface RiskMTOCardProps {
  mtoId: string;
  mto: MTOData;
  isSelected: boolean;
  onSelect: (mtoId: string) => void;
  formatCurrency: (amount: number, currency: string) => string;
}

export function RiskMTOCard({ 
  mtoId, 
  mto, 
  isSelected, 
  onSelect, 
  formatCurrency 
}: RiskMTOCardProps) {
  const getRiskStatusColor = (currentRisk: number, maxRisk: number) => {
    const percentage = (currentRisk / Math.abs(maxRisk)) * 100;
    if (percentage < 30) return "bg-finance-positive";
    if (percentage < 70) return "bg-finance-warning";
    return "bg-finance-negative";
  };

  // Calculate the actual max risk value (balance + risk value)
  const actualMaxRisk = mto.currentRisk;
  
  // Determine if MTO should be blocked (balance + risk value <= 0)
  const shouldBeBlocked = mto.balance + mto.currentRisk <= 0;

  return (
    <Card 
      key={mtoId} 
      variant="interactive"
      className={cn(
        shouldBeBlocked ? "border-finance-negative/30" : "border-finance-positive/30 border-2",
        isSelected && "ring-2 ring-primary ring-opacity-50"
      )}
      onClick={() => onSelect(mtoId)}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-base">{mto.name}</CardTitle>
          <StatusIndicator 
            status={shouldBeBlocked ? "negative" : "positive"} 
            label={shouldBeBlocked ? "Blocked" : "Active"}
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Risk Value</span>
            <span className="font-medium">{formatCurrency(mto.currentRisk, mto.currency)}</span>
          </div>
          
          <div className="space-y-1">
            <Progress
              value={(mto.currentRisk / Math.abs(actualMaxRisk)) * 100}
              className="h-1.5"
              indicatorClassName={getRiskStatusColor(mto.currentRisk, actualMaxRisk)}
            />
          </div>
          
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Min: {formatCurrency(mto.threshold, mto.currency)}</span>
            <span>Max: {formatCurrency(mto.currentRisk, mto.currency)}</span>
          </div>
          
          <div className="flex justify-between items-center mt-2">
            <span className="text-sm text-muted-foreground">Balance</span>
            <span className="font-medium">
              {formatCurrency(mto.balance, mto.currency)}
            </span>
          </div>
          
          {shouldBeBlocked && (
            <div className="text-xs text-finance-negative mt-1">
              Max Risk Value ≤ 0 (Blocked)
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="pt-2 justify-end">
        <Button 
          variant="ghost" 
          size="sm" 
          className={cn(
            "h-7 text-xs gap-1", 
            shouldBeBlocked 
              ? "text-primary/80 hover:text-primary" 
              : "text-finance-positive hover:text-finance-positive/80"
          )}
        >
          <span>Details</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Button>
      </CardFooter>
    </Card>
  );
}
