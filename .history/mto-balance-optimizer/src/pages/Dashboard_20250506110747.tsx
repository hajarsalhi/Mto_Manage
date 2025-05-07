
import { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { MTOCollapsible } from '@/components/dashboard/MTOCollapsible';
import { RecentActivity } from '@/components/dashboard/RecentActivity';
import { Button } from '@/components/ui/button';
import { RefreshCw, History } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  const handleRefresh = () => {
    setIsLoading(true);
    
    // Simulate refresh
    setTimeout(() => {
      setIsLoading(false);
      
      toast({
        title: "Tableau de bord actualisé",
        description: "Toutes les données ont été mises à jour aux dernières valeurs.",
        duration: 3000,
      });
    }, 1500);
  };

  return (
    <Layout>
      <div className="p-6 md:p-10 max-w-7xl animate-scale-in">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="heading-xl">Tableau de bord</h1>
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
            <Button 
              variant="outline" 
              size="sm"
              className="gap-2"
              asChild
            >
              <Link to="/activity-history">
                <History className="h-4 w-4" />
                <span>Historique</span>
              </Link>
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-2 gap-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <MTOCollapsible showCriticalFirst={true} />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-6 mb-6">
          <RecentActivity />
        </div>
      </div>
      </div>
      
      {/* Decorative background elements */}
      <div className="fixed top-0 right-0 w-1/3 h-1/3 bg-gradient-gold opacity-[0.03] blur-3xl rounded-full"></div>
      <div className="fixed bottom-0 left-0 w-1/4 h-1/4 bg-gradient-gold opacity-[0.03] blur-3xl rounded-full"></div>
    </Layout>
  );
}
