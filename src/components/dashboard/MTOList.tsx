
import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui-custom/Card';
import { Button } from '@/components/ui/button';
import { StatusIndicator, ValueChange } from '../ui-custom/StatusIndicator';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Plus, TrendingUp, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';

interface MTOData {
  id: string;
  name: string;
  currency: string;
  balance: number;
  riskValue: number;
  maxRiskValue: number;
  status: 'positive' | 'negative' | 'warning' | 'neutral';
  decote: number;
  change: number;
  isBlocked: boolean;
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
        maxRiskValue: 80000,
        status: 'positive',
        decote: 0.015,
        change: 2.4,
        isBlocked: false
      },
      {
        id: "mto2",
        name: "MoneyGram",
        currency: "EUR",
        balance: 87650.20,
        riskValue: 35000,
        maxRiskValue: 50000,
        status: 'positive',
        decote: 0.018,
        change: 1.8,
        isBlocked: false
      },
      {
        id: "mto3",
        name: "Ria Money Transfer",
        currency: "EUR",
        balance: -1240.75,
        riskValue: 20000,
        maxRiskValue: 30000,
        status: 'negative',
        decote: 0.02,
        change: -3.2,
        isBlocked: true
      },
      {
        id: "mto4",
        name: "WorldRemit",
        currency: "GBP",
        balance: 45692.30,
        riskValue: 30000,
        maxRiskValue: 40000,
        status: 'warning',
        decote: 0.025,
        change: 0.5,
        isBlocked: false
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
      title: "Fonctionnalité à venir",
      description: "L'ajout de nouveaux MTO sera disponible dans la prochaine mise à jour.",
      duration: 3000,
    });
  };

  const toggleMTOBlock = (mtoId: string) => {
    setMtoList(prevList => 
      prevList.map(mto => 
        mto.id === mtoId ? { ...mto, isBlocked: !mto.isBlocked } : mto
      )
    );
    
    const mto = mtoList.find(m => m.id === mtoId);
    if (mto) {
      toast({
        title: mto.isBlocked ? `${mto.name} débloqué` : `${mto.name} bloqué`,
        description: mto.isBlocked 
          ? "Les opérations sont maintenant autorisées" 
          : "Les opérations sont temporairement suspendues",
        duration: 3000,
      });
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {isLoading ? (
        Array(4).fill(0).map((_, i) => (
          <div key={i} className="animate-pulse h-80">
            <div className="h-full bg-secondary rounded-lg w-full"></div>
          </div>
        ))
      ) : (
        mtoList.map((mto) => (
          <MTOCard 
            key={mto.id} 
            mto={mto} 
            onClick={() => navigate('/mto-details')}
            onToggleBlock={() => toggleMTOBlock(mto.id)}
          />
        ))
      )}
      <div className="flex items-center justify-center h-80 border-2 border-dashed border-border rounded-lg hover:border-primary/50 transition-colors cursor-pointer">
        <Button 
          variant="ghost" 
          className="gap-2 text-muted-foreground h-auto py-8 px-6 flex-col"
          onClick={handleAddMTO}
        >
          <Plus className="h-12 w-12" />
          <span className="text-lg font-medium mt-2">Ajouter un partenaire MTO</span>
        </Button>
      </div>
    </div>
  );
}

interface MTOCardProps {
  mto: MTOData;
  onClick: () => void;
  onToggleBlock: () => void;
}

function MTOCard({ mto, onClick, onToggleBlock }: MTOCardProps) {
  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2
    }).format(amount);
  };

  const calculatePercentage = () => {
    return (mto.riskValue / mto.maxRiskValue) * 100;
  };

  const getStatusColor = () => {
    const percentage = calculatePercentage();
    if (percentage < 30) return "bg-finance-negative";
    if (percentage < 60) return "bg-finance-warning";
    return "bg-finance-positive";
  };

  return (
    <Card 
      variant="glass" 
      className={`h-full ${mto.isBlocked ? 'border-finance-negative' : ''}`}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center gap-2">
          <StatusIndicator 
            status={mto.status} 
            pulsate={mto.isBlocked}
          />
          <CardTitle className="text-lg font-semibold">
            {mto.name}
          </CardTitle>
        </div>
        <Badge 
          variant={mto.isBlocked ? "destructive" : "outline"} 
          className="font-normal"
        >
          {mto.isBlocked ? 'Bloqué' : 'Actif'}
        </Badge>
      </CardHeader>
      <CardContent>
        <div 
          className="pt-4 space-y-6 cursor-pointer"
          onClick={onClick}
        >
          {/* Current Balance */}
          <div className="space-y-2">
            <h3 className="text-sm text-muted-foreground uppercase tracking-wide font-medium">
              Solde Actuel
            </h3>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-2xl font-bold">
                  {formatCurrency(mto.balance, mto.currency)}
                </p>
                <ValueChange 
                  value={mto.change} 
                  percentageChange 
                  size="sm"
                />
              </div>
              <Badge 
                variant="outline" 
                className="text-xs font-normal border-muted text-muted-foreground"
              >
                {mto.decote * 100}% décote
              </Badge>
            </div>
          </div>

          {/* Risk Value */}
          <div className="space-y-2">
            <h3 className="text-sm text-muted-foreground uppercase tracking-wide font-medium">
              Valeur de Risque
            </h3>
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <p className="text-xl font-semibold">
                  {formatCurrency(mto.riskValue, mto.currency)}
                </p>
                <span className="text-sm text-muted-foreground">
                  Max: {formatCurrency(mto.maxRiskValue, mto.currency)}
                </span>
              </div>
              
              <Progress
                value={calculatePercentage()}
                className="h-2"
                indicatorClassName={getStatusColor()}
              />
              
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{calculatePercentage().toFixed(0)}% utilisé</span>
              </div>
            </div>
          </div>

          {/* Status Message */}
          <div className={`p-3 rounded-lg border text-xs flex items-start gap-2 ${
            mto.isBlocked ? 
              "bg-finance-negative/10 border-finance-negative/20 text-finance-negative" : 
              "bg-finance-positive/10 border-finance-positive/20 text-finance-positive"
          }`}>
            {mto.isBlocked ? (
              <AlertTriangle className="h-4 w-4 flex-shrink-0" />
            ) : (
              <TrendingUp className="h-4 w-4 flex-shrink-0" />
            )}
            <p>
              {mto.isBlocked 
                ? "Les opérations sont bloquées. Ajustez la valeur de risque pour reprendre." 
                : "La valeur de risque est dans les limites acceptables."}
            </p>
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <Button
            variant={mto.isBlocked ? "outline" : "destructive"}
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onToggleBlock();
            }}
          >
            {mto.isBlocked ? "Débloquer" : "Bloquer"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
