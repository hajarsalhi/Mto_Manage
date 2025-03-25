
import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui-custom/Card';
import { Button } from '@/components/ui/button';
import { ValueChange } from '../ui-custom/StatusIndicator';
import { RefreshCw, Bell, Euro, DollarSign, PlusCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';

interface CurrencyRate {
  currency: string;
  rate: number;
  change: number;
  icon: React.ReactNode;
}

export function FXRateCard() {
  const [fxData, setFxData] = useState({
    baseCurrency: 'MAD',
    rates: [
      {
        currency: 'EUR',
        rate: 0.0935,
        change: 0.24,
        icon: <Euro className="h-4 w-4" />
      },
      {
        currency: 'USD',
        rate: 0.0987,
        change: 0.18,
        icon: <DollarSign className="h-4 w-4" />
      }
    ],
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
        rates: [
          {
            currency: 'EUR',
            rate: 0.0942,
            change: 0.37,
            icon: <Euro className="h-4 w-4" />
          },
          {
            currency: 'USD',
            rate: 0.0993,
            change: 0.25,
            icon: <DollarSign className="h-4 w-4" />
          }
        ],
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
            variant="outline" 
            size="sm"
            className="gap-2"
            asChild
          >
            <Link to="/transfer-rates">
              <PlusCircle className="h-4 w-4" />
              <span>Ajouter cours de virement</span>
            </Link>
          </Button>
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
              <div className="grid grid-cols-2 gap-6">
                {fxData.rates.map((rate, index) => (
                  <div key={rate.currency} className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-2xl font-bold tracking-tight">
                        {rate.rate.toFixed(4)}
                      </h3>
                      <ValueChange 
                        value={rate.change} 
                        percentageChange 
                      />
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <span>{fxData.baseCurrency}</span>
                      <span>/</span>
                      <div className="flex items-center gap-1">
                        {rate.icon}
                        <span>{rate.currency}</span>
                      </div>
                    </div>
                  </div>
                ))}
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
