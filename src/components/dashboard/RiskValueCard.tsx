
import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../ui-custom/Card';
import { Button } from '@/components/ui/button';
import { StatusIndicator } from '../ui-custom/StatusIndicator';
import { AlertTriangle, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';

interface RiskValueData {
  currentValue: number;
  maxValue: number;
  threshold: number;
  currency: string;
  status: 'positive' | 'negative' | 'warning' | 'neutral';
}

export function RiskValueCard() {
  const [riskData, setRiskData] = useState<RiskValueData>({
    currentValue: 75000,
    maxValue: 100000,
    threshold: 25000,
    currency: 'EUR',
    status: 'positive'
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);

  // Simulate data fetch
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0
    }).format(amount);
  };

  const calculatePercentage = () => {
    return (riskData.currentValue / riskData.maxValue) * 100;
  };

  const getStatusColor = () => {
    const percentage = calculatePercentage();
    if (percentage < 30) return "bg-finance-negative";
    if (percentage < 60) return "bg-finance-warning";
    return "bg-finance-positive";
  };

  return (
    <Card 
      variant="glass" 
      className={cn(
        "relative transition-colors duration-500",
        isBlocked && "border-finance-negative"
      )}
    >
      <CardHeader className="flex justify-between items-start">
        <div>
          <CardTitle className="text-muted-foreground tracking-wide text-sm uppercase font-medium">
            Risk Value
          </CardTitle>
        </div>
        <StatusIndicator 
          status={riskData.status} 
          pulsate={isBlocked} 
          label={isBlocked ? "Blocked" : "Active"}
        />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {isLoading ? (
            <div className="animate-pulse space-y-3">
              <div className="h-8 w-40 bg-secondary rounded"></div>
              <div className="h-3 w-full bg-secondary rounded-full"></div>
              <div className="h-16 w-full bg-secondary rounded"></div>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold tracking-tight">
                  {formatCurrency(riskData.currentValue, riskData.currency)}
                </h3>
                <span className="text-sm text-muted-foreground">
                  Max: {formatCurrency(riskData.maxValue, riskData.currency)}
                </span>
              </div>
              
              <div className="space-y-1">
                <Progress
                  value={calculatePercentage()}
                  className="h-2"
                  indicatorClassName={getStatusColor()}
                />
                <div className="flex justify-between items-center text-xs text-muted-foreground">
                  <span>Critical: {formatCurrency(riskData.threshold, riskData.currency)}</span>
                  <span>{calculatePercentage().toFixed(0)}%</span>
                </div>
              </div>
              
              <div className={cn(
                "p-4 rounded-lg border text-sm flex items-start gap-3 mt-2 transition-colors duration-500",
                isBlocked ? 
                  "bg-finance-negative/10 border-finance-negative/20 text-finance-negative" : 
                  "bg-finance-positive/10 border-finance-positive/20 text-finance-positive"
              )}>
                {isBlocked ? (
                  <AlertTriangle className="h-5 w-5 flex-shrink-0" />
                ) : (
                  <TrendingUp className="h-5 w-5 flex-shrink-0" />
                )}
                <div>
                  {isBlocked ? (
                    <p>MTO operations are currently blocked. Please adjust the Risk Value to resume operations.</p>
                  ) : (
                    <p>Risk value is within acceptable limits. MTO operations are running normally.</p>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </CardContent>
      <CardFooter className="justify-end">
        <Button 
          variant="default" 
          size="sm"
          className="bg-primary/95 hover:bg-primary text-primary-foreground"
          onClick={() => setIsBlocked(!isBlocked)}
        >
          {isBlocked ? "Unblock MTO" : "Adjust Risk Value"}
        </Button>
      </CardFooter>
    </Card>
  );
}
