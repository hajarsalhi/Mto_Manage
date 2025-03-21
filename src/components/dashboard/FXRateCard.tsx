
import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui-custom/Card';
import { Button } from '@/components/ui/button';
import { ValueChange } from '../ui-custom/StatusIndicator';
import { RefreshCw, Bell } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface FXRateData {
  baseCurrency: string;
  targetCurrency: string;
  rate: number;
  decote: number;
  effectiveRate: number;
  change: number;
  updatedAt: string;
}

export function FXRateCard() {
  const [fxData, setFxData] = useState<FXRateData>({
    baseCurrency: 'EUR',
    targetCurrency: 'MAD',
    rate: 10.897,
    decote: 0.018,
    effectiveRate: 10.701,
    change: 0.24,
    updatedAt: '2023-04-15T09:30:00Z'
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Simulate data fetch
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1800);
    return () => clearTimeout(timer);
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  const handleRefresh = () => {
    setIsLoading(true);
    
    // Simulate refresh
    setTimeout(() => {
      setFxData(prev => ({
        ...prev,
        rate: 10.912,
        effectiveRate: 10.715,
        change: 0.37,
        updatedAt: new Date().toISOString()
      }));
      
      setIsLoading(false);
      
      toast({
        title: "FX Rates updated",
        description: "Latest exchange rates have been retrieved.",
        duration: 3000,
      });
    }, 1500);
  };
  
  const handleNotify = () => {
    toast({
      title: "Notification settings",
      description: "Configure FX rate notification settings in the Notifications page.",
      duration: 3000,
    });
  };

  return (
    <Card 
      variant="glass" 
      className="relative overflow-hidden h-full"
    >
      <CardHeader className="flex justify-between items-start">
        <div>
          <CardTitle className="text-muted-foreground tracking-wide text-sm uppercase font-medium">
            FX Rate
          </CardTitle>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8"
            onClick={handleNotify}
          >
            <Bell className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className={cn("h-8 w-8", isLoading && "animate-spin")}
            onClick={handleRefresh}
            disabled={isLoading}
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {isLoading ? (
            <div className="animate-pulse space-y-3">
              <div className="h-10 w-40 bg-secondary rounded"></div>
              <div className="h-4 w-24 bg-secondary rounded"></div>
              <div className="h-16 w-full bg-secondary rounded-lg"></div>
            </div>
          ) : (
            <>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-2xl font-bold tracking-tight">
                    {fxData.effectiveRate.toFixed(3)}
                  </h3>
                  <ValueChange 
                    value={fxData.change} 
                    percentageChange 
                  />
                </div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <span>{fxData.baseCurrency}</span>
                  <span>/</span>
                  <span>{fxData.targetCurrency}</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Base Rate</p>
                  <p className="text-base font-medium">{fxData.rate.toFixed(3)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Décote</p>
                  <p className="text-base font-medium">{(fxData.decote * 100).toFixed(2)}%</p>
                </div>
              </div>
              
              <div className="text-xs text-muted-foreground flex items-center justify-between pt-2 border-t border-border">
                <span>Last Updated</span>
                <span>{formatDate(fxData.updatedAt)}</span>
              </div>
              
              <div className="p-3 rounded-lg bg-accent/50 border border-border text-xs">
                <p className="font-medium mb-1">Tomorrow's FX Rate Notification</p>
                <p className="text-muted-foreground">Notifications will be sent at 16:00 today with tomorrow's applicable rate.</p>
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
