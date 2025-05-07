
import { useState, useEffect, useRef } from 'react';
import { Layout } from '@/components/layout/Layout';
import { MTOCollapsible } from '@/components/dashboard/MTOCollapsible';
import { RecentActivity } from '@/components/dashboard/RecentActivity';
import { ProductAlert } from '@/components/dashboard/ProductAlert';
import { Button } from '@/components/ui/button';
import { RefreshCw, History, Bell, ChevronsRight, ChevronsLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(false);
  const [showNotifications, setShowNotifications] = useState(true);
  const [showProductAlert, setShowProductAlert] = useState(true);
  const [blockedProducts, setBlockedProducts] = useState<Array<{ id: string; name: string; blockedSince: string }>>([ { id: '1', name: 'Partner 1', blockedSince: '2023-01-01' }, { id: '2', name: 'Partner 2', blockedSince: '2023-01-02' }]);
  const { toast } = useToast();
  
  const toggleNotifications = () => {
    console.log("Toggling notifications:", !showNotifications);
    setShowNotifications(!showNotifications);
  };

  const handleRefresh = () => {
    setIsLoading(true);
    
    // Simulate refresh
    setTimeout(() => {
      setIsLoading(false);
      
      // Re-fetch blocked partners after refresh
      const getBlockedPartners = () => {
        if (blockedProducts.length > 0) {
          const formattedPartners = blockedProducts.map(partner => ({
            id: partner.id,
            name: partner.name,
            blockedSince: format(new Date(), 'yyyy-MM-dd')
          }));
          setBlockedProducts(formattedPartners);
          setShowProductAlert(true);
        } else {
          setBlockedProducts([]);
          setShowProductAlert(false);
        }
      };

      getBlockedPartners();
      
      toast({
        title: "Tableau de bord actualisé",
        description: "Toutes les données ont été mises à jour aux dernières valeurs.",
        duration: 3000,
      });
    }, 1500);
  };

  useEffect(() => {
    // Get blocked partners from MTOCollapsible
    const getBlockedPartners = () => {
      // Simulate fetching blocked partners from MTOCollapsible
      if (blockedProducts.length > 0) {
        const formattedPartners = blockedProducts.map(partner => ({
          id: partner.id,
          name: partner.name,
          blockedSince: format(new Date(), 'yyyy-MM-dd')
        }));
        setBlockedProducts(formattedPartners);
        setShowProductAlert(true);
      } else {
        setBlockedProducts([]);
        setShowProductAlert(false);
      }
    };

    // Initial fetch
    getBlockedPartners();

    // Re-fetch when MTOCollapsible data changes
    const interval = setInterval(getBlockedPartners, 5000);
    return () => clearInterval(interval);
  }, [blockedProducts]);

  const handleDismissAlert = () => {
    setShowProductAlert(false);
  };

  return (
    <Layout>
      <div className="p-6 md:p-10 max-w-screen animate-scale-in">
      {showProductAlert && (
            <ProductAlert
              blockedProducts={blockedProducts}
              onDismiss={handleDismissAlert}
            />
          )}
        {/*<div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-muted-foreground mt-1">
              Aperçu des soldes et opérations MTO
            </p>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              className="gap-2"
              onClick={handleRefresh}
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Actualiser</span>
            </Button>
          </div>
        </div>  )*/}
        <div className="flex flex-row gap-3 w-full">

          {/* MTO Cards Container */}
          <div className={`flex gap-2 transition-all duration-300 ${showNotifications ? 'w-full max-w-2/3' : 'max-w-full'}`}>
            <div className="grid grid-cols-1 gap-6">
              <MTOCollapsible showCriticalFirst={true} />
            </div>
          </div>

          {/* Notifications Panel */}
        <div className="relative flex flex-col items-end gap-4 mt-6">
          {/* Always visible toggle button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleNotifications}
            className="z-50  text-sidebar-foreground hover:text-sidebar-accent-foreground hover:bg-sidebar-accent"
          >
            <Bell className="h-4 w-4" />
          </Button>

          {/* This container collapses */}
          <div
            className={cn(
              "transition-all duration-300 overflow-hidden mt-6",
              showNotifications ? "w-72 opacity-100" : "w-0 opacity-0"
            )}
          >
            <RecentActivity />
          </div>
        </div>

        </div>
      </div>
      
      {/* Decorative background elements */}
      <div className="fixed top-0 right-0 w-1/3 h-1/3 bg-gradient-gold opacity-[0.03] blur-3xl rounded-full pointer-events-none"></div>
      <div className="fixed bottom-0 left-0 w-1/4 h-1/4 bg-gradient-gold opacity-[0.03] blur-3xl rounded-full pointer-events-none"></div>
    </Layout>
  );
}
