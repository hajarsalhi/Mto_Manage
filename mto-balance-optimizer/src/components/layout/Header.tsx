
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Bell, Sun, Moon, Menu, Euro, DollarSign, Link, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import { ValueChange } from '../ui-custom/StatusIndicator';
import { format } from 'date-fns';
import { useNavigate, useLocation } from 'react-router-dom';

interface HeaderProps {
  toggleSidebar: () => void;
}

interface FXRate {
  currency: string;
  rate: number;
  change: number;
  icon: React.ReactNode;
}

export function Header({ toggleSidebar }: HeaderProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const isDashboard = location.pathname === '/';
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [fxRates, setFxRates] = useState<FXRate[]>([
    {
      currency: 'EUR',
      rate: 10.69,
      change: 0.24,
      icon: <Euro className="h-4 w-4" />
    },
    {
      currency: 'USD',
      rate: 10.13,
      change: 0.18,
      icon: <DollarSign className="h-4 w-4" />
    }
  ]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Simulate FX rates refresh every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate small random changes in rates
      setFxRates(prev => prev.map(rate => ({
        ...rate,
        rate: parseFloat((rate.rate + (Math.random() * 0.2 - 0.1)).toFixed(2)),
        change: parseFloat((rate.change + (Math.random() * 0.1 - 0.05)).toFixed(2))
      })));
      setLastUpdated(new Date());
    }, 300000); // 5 minutes

    return () => clearInterval(interval);
  }, []);

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    document.documentElement.classList.toggle('dark', newMode);
    
    toast({
      title: `${newMode ? 'Dark' : 'Light'} mode activated`,
      description: `Interface switched to ${newMode ? 'dark' : 'light'} mode.`,
      duration: 2000,
    });
  };

  const formatUpdateTime = (date: Date) => {
    return format(date, 'dd/MM/yyyy HH:mm');
  };

  return (
    <header 
      className={cn(
        "fixed top-0 right-0 left-0 z-40 transition-all duration-300",
        "py-4 px-6 md:py-5 md:px-10",
        "flex items-center justify-between",
        "bg-background/80 backdrop-blur-md",
        isScrolled && "shadow-sm border-b border-border"
      )}
      style={{ left: isMobile ? '0' : '280px' }}
    >
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleSidebar} 
          className="md:hidden"
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* FX Rates display with last updated date */}
        <div className="hidden md:flex flex-col">
          <div className="flex items-center gap-4 px-4 py-1.5 bg-muted/40 rounded-lg">
            {fxRates.map((rate, index) => (
              <div key={rate.currency} className="flex items-center gap-2">
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    {rate.icon}
                    <span>{rate.currency}</span>
                  </div>
                  <span>/</span>
                  <span>MAD</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="font-semibold">{rate.rate.toFixed(2)}</span>
                  <ValueChange value={rate.change} percentageChange size="sm" />
                </div>
              </div>
            ))}
          </div>
          <div className="text-xs text-muted-foreground ml-4 mt-1">
            Mise à jour: {formatUpdateTime(lastUpdated)}
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-2">

        <Button 
          variant="outline" 
          size="sm"
          className="gap-2"
          onClick={() => navigate("/")}
          disabled={isDashboard}
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Retour au tableau de bord</span>
          
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleDarkMode}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>
        
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-muted-foreground hover:text-foreground transition-colors relative"
          onClick={() => {
            toast({
              title: "No new notifications",
              description: "You're all caught up!",
              duration: 3000,
            });
          }}
        >
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-finance-warning rounded-full"></span>
        </Button>
      </div>
    </header>
  );
}
