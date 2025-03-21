
import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui-custom/Card';
import { Button } from '@/components/ui/button';
import { StatusIndicator } from '../ui-custom/StatusIndicator';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface MTOData {
  id: string;
  name: string;
  currency: string;
  balance: number;
  riskValue: number;
  status: 'positive' | 'negative' | 'warning' | 'neutral';
  decote: number;
}

export function MTOList() {
  const [mtoList, setMtoList] = useState<MTOData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Simulate data fetch
  useEffect(() => {
    setIsLoading(true);
    
    // Mock data
    const mockData: MTOData[] = [
      {
        id: "mto1",
        name: "Western Union",
        currency: "USD",
        balance: 125780.45,
        riskValue: 50000,
        status: 'positive',
        decote: 0.015
      },
      {
        id: "mto2",
        name: "MoneyGram",
        currency: "EUR",
        balance: 87650.20,
        riskValue: 35000,
        status: 'positive',
        decote: 0.018
      },
      {
        id: "mto3",
        name: "Ria Money Transfer",
        currency: "EUR",
        balance: -1240.75,
        riskValue: 20000,
        status: 'negative',
        decote: 0.02
      },
      {
        id: "mto4",
        name: "WorldRemit",
        currency: "GBP",
        balance: 45692.30,
        riskValue: 30000,
        status: 'warning',
        decote: 0.025
      }
    ];
    
    const timer = setTimeout(() => {
      setMtoList(mockData);
      setIsLoading(false);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2
    }).format(amount);
  };
  
  const handleAddMTO = () => {
    toast({
      title: "Feature coming soon",
      description: "Adding new MTOs will be available in the next update.",
      duration: 3000,
    });
  };

  return (
    <Card variant="glass" className="h-full">
      <CardHeader className="flex justify-between items-center">
        <CardTitle className="text-muted-foreground tracking-wide text-sm uppercase font-medium">
          MTO Partners
        </CardTitle>
        <Button 
          variant="outline" 
          size="sm"
          className="h-8 text-xs gap-1"
          onClick={handleAddMTO}
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Add MTO</span>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {isLoading ? (
            Array(4).fill(0).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-16 bg-secondary rounded-lg w-full"></div>
              </div>
            ))
          ) : (
            mtoList.map((mto) => (
              <MTOItem 
                key={mto.id} 
                mto={mto} 
                onClick={() => navigate('/mto-details')}
              />
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}

interface MTOItemProps {
  mto: MTOData;
  onClick: () => void;
}

function MTOItem({ mto, onClick }: MTOItemProps) {
  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2
    }).format(amount);
  };

  return (
    <div 
      className="p-4 rounded-lg border border-border bg-card/50 hover:bg-card/80 transition-colors cursor-pointer group"
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <StatusIndicator status={mto.status} />
          <div>
            <h3 className="font-medium text-sm">{mto.name}</h3>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">
                {formatCurrency(mto.balance, mto.currency)}
              </span>
              <Badge 
                variant="outline" 
                className="text-[10px] h-4 px-1.5 font-normal border-muted text-muted-foreground"
              >
                {mto.decote * 100}% décote
              </Badge>
            </div>
          </div>
        </div>
        <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
    </div>
  );
}
