
import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui-custom/Card';
import { ValueChange } from '../ui-custom/StatusIndicator';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BalanceData {
  amount: number;
  currency: string;
  change: number;
  status: 'positive' | 'negative' | 'neutral';
}

export function BalanceOverview() {
  const [currentBalance, setCurrentBalance] = useState<BalanceData>({
    amount: 326709.94,
    currency: 'EUR',
    change: 2.4,
    status: 'positive'
  });
  
  const [isLoading, setIsLoading] = useState(false);

  // Simulate data fetch
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2
    }).format(amount);
  };

  return (
    <Card 
      variant="glass" 
      className="relative overflow-hidden"
    >
      <CardHeader>
        <CardTitle className="text-muted-foreground tracking-wide text-sm uppercase font-medium">
          Current Balance
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative space-y-2">
          {isLoading ? (
            <div className="animate-pulse">
              <div className="h-10 w-48 bg-secondary rounded"></div>
              <div className="h-5 w-24 bg-secondary rounded mt-2"></div>
            </div>
          ) : (
            <>
              <h3 className="text-3xl font-bold tracking-tight">
                {formatCurrency(currentBalance.amount, currentBalance.currency)}
              </h3>
              
              <div className="flex items-center justify-between">
                <ValueChange 
                  value={currentBalance.change} 
                  percentageChange 
                  size="sm"
                  className="font-medium"
                />
                <div className="flex items-center text-sm font-medium text-primary transition-opacity hover:opacity-80">
                  <span>View details</span>
                  <ArrowRight className="ml-1 h-4 w-4" />
                </div>
              </div>
            </>
          )}
        </div>
        
        <div className="mt-6 pt-6 border-t border-border">
          <div className="grid grid-cols-2 gap-4">
            <BalanceMetric
              label="Today's Transactions"
              value="12,450.00"
              currency="EUR"
              change={-3.2}
              isLoading={isLoading}
            />
            <BalanceMetric
              label="Month-to-Date"
              value="156,432.50"
              currency="EUR"
              change={8.7}
              isLoading={isLoading}
            />
          </div>
        </div>
      </CardContent>
      
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-gold opacity-10 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2"></div>
    </Card>
  );
}

interface BalanceMetricProps {
  label: string;
  value: string;
  currency: string;
  change: number;
  isLoading?: boolean;
}

function BalanceMetric({
  label,
  value,
  currency,
  change,
  isLoading = false
}: BalanceMetricProps) {
  return (
    <div className="space-y-1">
      <p className="text-xs text-muted-foreground">{label}</p>
      
      {isLoading ? (
        <div className="animate-pulse">
          <div className="h-6 w-24 bg-secondary rounded"></div>
        </div>
      ) : (
        <>
          <p className="text-base font-semibold tracking-tight">
            {value} {currency}
          </p>
          <ValueChange 
            value={change} 
            percentageChange 
            size="sm" 
          />
        </>
      )}
    </div>
  );
}
