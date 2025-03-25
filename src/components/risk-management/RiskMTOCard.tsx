
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
  return (
    <Card 
      key={mtoId} 
      variant="interactive"
      className={cn(
        mto.isBlocked ? "border-finance-negative/30" : "border-finance-positive/30 border-2",
        isSelected && "ring-2 ring-primary ring-opacity-50"
      )}
      onClick={() => onSelect(mtoId)}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-base">{mto.name}</CardTitle>
          <StatusIndicator 
            status={mto.isBlocked ? "negative" : "positive"} 
            label={mto.isBlocked ? "Blocked" : "Active"}
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
              value={(mto.currentRisk / mto.maxRisk) * 100}
              className="h-1.5"
              indicatorClassName={
                mto.currentRisk < mto.threshold 
                  ? "bg-finance-negative" 
                  : mto.currentRisk < mto.maxRisk * 0.6 
                    ? "bg-finance-warning" 
                    : "bg-finance-positive"
              }
            />
          </div>
          
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Min: {formatCurrency(mto.threshold, mto.currency)}</span>
            <span>Max: {formatCurrency(mto.maxRisk, mto.currency)}</span>
          </div>
          
          <div className="flex justify-between items-center mt-2">
            <span className="text-sm text-muted-foreground">Balance</span>
            <span className={cn(
              "font-medium",
              mto.balance < 0 ? "text-finance-negative" : "text-finance-positive"
            )}>
              {formatCurrency(mto.balance, mto.currency)}
            </span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-2 justify-end">
        <Button 
          variant="ghost" 
          size="sm" 
          className={cn(
            "h-7 text-xs gap-1", 
            mto.isBlocked 
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
