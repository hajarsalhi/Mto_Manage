
import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui-custom/Card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { ValueChange } from '../ui-custom/StatusIndicator';
import { RefreshCw, Bell, BellRing, Euro, DollarSign, PlusCircle } from 'lucide-react';
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
    updatedAt: '2023-04-15T09:30:00Z',
    notificationsEnabled: false,
    activatedBy: ''
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
  
  const handleToggleNotifications = () => {
    const newState = !fxData.notificationsEnabled;
    
    setFxData(prev => ({
      ...prev,
      notificationsEnabled: newState,
      activatedBy: newState ? "Meriem Nassiri" : ""
    }));
    
    toast({
      title: newState ? "Notifications Enabled" : "Notifications Disabled",
      description: newState 
        ? "Partners will receive FX rate notifications via email." 
        : "Partners will no longer receive FX rate notifications.",
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
          <div className="flex items-center gap-2 bg-muted/80 rounded-md px-3 py-1.5">
            <Switch 
              checked={fxData.notificationsEnabled}
              onCheckedChange={handleToggleNotifications}
              className="data-[state=checked]:bg-primary"
            />
            <span className="text-sm font-medium">FX Rates</span>
          </div>
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
              
              {fxData.notificationsEnabled && (
                <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-md border border-green-200 dark:border-green-800 text-xs">
                  <div className="flex items-center gap-2">
                    <BellRing className="h-4 w-4 text-green-600 dark:text-green-400" />
                    <div>
                      <span className="font-medium text-green-800 dark:text-green-400">Notifications activated</span>
                      {fxData.activatedBy && (
                        <p className="text-muted-foreground mt-0.5">{fxData.activatedBy} a activé les notifications</p>
                      )}
                    </div>
                  </div>
                  <span className="text-muted-foreground">Daily at 16:00</span>
                </div>
              )}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
