
import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../ui-custom/Card';
import { Button } from '@/components/ui/button';
import { StatusIndicator } from '../ui-custom/StatusIndicator';
import { AlertTriangle, Calendar, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

interface RiskValueData {
  currentValue: number;
  maxValue: number;
  threshold: number;
  currency: string;
  status: 'positive' | 'negative' | 'warning' | 'neutral';
  startDate: Date;
  endDate: Date | null;
  nextRiskValue: number | null;
  nextStartDate: Date | null;
}

export function RiskValueCard() {
  const [riskData, setRiskData] = useState<RiskValueData>({
    currentValue: 75000,
    maxValue: 100000, // This should be balance + risk value
    threshold: 25000,
    currency: 'EUR',
    status: 'positive',
    startDate: new Date('2024-04-15'),
    endDate: new Date('2024-05-15'),
    nextRiskValue: 60000,
    nextStartDate: new Date('2024-05-16')
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsBlocked(riskData.maxValue <= 0);
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, [riskData.maxValue]);

  const formatCurrency = (amount: number, currency: string) => {
    const displayAmount = amount < 0 ? 0 : amount;
    
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0
    }).format(displayAmount);
  };

  const calculatePercentage = () => {
    return (riskData.currentValue / riskData.maxValue) * 100;
  };

  const getStatusColor = () => {
    const percentage = calculatePercentage();
    if (percentage < 30) return "bg-finance-positive";
    if (percentage < 70) return "bg-finance-warning";
    return "bg-finance-negative";
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
          status={isBlocked ? "negative" : "positive"} 
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
              
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>Validity period:</span>
                </div>
                
                <div className="text-sm flex items-center justify-between">
                  <div>
                    <span className="font-medium">From:</span> {format(riskData.startDate, 'dd/MM/yyyy')}
                  </div>
                  <div>
                    <span className="font-medium">To:</span> {riskData.endDate ? format(riskData.endDate, 'dd/MM/yyyy') : 'Indefinite'}
                  </div>
                </div>
                
                {riskData.nextRiskValue && riskData.nextStartDate && (
                  <div className="text-xs text-muted-foreground mt-1 border-t pt-2">
                    <span className="font-medium">Next Risk Value:</span> {formatCurrency(riskData.nextRiskValue, riskData.currency)} 
                    <span className="ml-1">from {format(riskData.nextStartDate, 'dd/MM/yyyy')}</span>
                  </div>
                )}
              </div>
              
              <div className="space-y-1">
                <Progress
                  value={calculatePercentage()}
                  className="h-2"
                  indicatorClassName={getStatusColor()}
                />
                <div className="flex justify-between items-center text-xs text-muted-foreground">
                  <span>Critical: {formatCurrency(riskData.threshold, riskData.currency)}</span>
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
                    <p>Prochain Risk Value: Aucun risk value futur configuré</p>
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
          asChild
        >
          <Link to="/risk-management">
            {isBlocked ? "Unblock MTO" : "Adjust Risk Value"}
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
