
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Bell, Sun, Moon, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';

interface HeaderProps {
  toggleSidebar: () => void;
}

export function Header({ toggleSidebar }: HeaderProps) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const isMobile = useIsMobile();
  const { toast } = useToast();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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
      </div>
      
      <div className="flex items-center gap-2">
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
