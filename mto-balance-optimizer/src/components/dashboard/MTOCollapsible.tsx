
import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui-custom/Card';
import { Button } from '@/components/ui/button';
import { StatusIndicator, ValueChange } from '../ui-custom/StatusIndicator';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, AlertTriangle, Search, SlidersHorizontal, Calendar, ChevronDown, ChevronUp, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { format } from 'date-fns';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Tabs, TabsList, TabsTrigger } from '@radix-ui/react-tabs';

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
  riskStartDate: Date;
  riskEndDate: Date | null;
  nextRiskValue: number | null;
  nextRiskStartDate: Date | null;
  isCritical?: boolean;
}

interface MTOCollapsibleProps {
  showCriticalFirst?: boolean;
}

export function MTOCollapsible({ showCriticalFirst = false }: MTOCollapsibleProps) {
  const [mtoList, setMtoList] = useState<MTOData[]>([]);
  const [filteredList, setFilteredList] = useState<MTOData[]>([]);

  // Filter MTOs based on selected tab and search term
  const filterMTOs = (mtos: MTOData[]) => {
    let filtered = [...mtos];
    
    // Apply tab filter
    if (mtoFilter === 'active') {
      filtered = filtered.filter(mto => !mto.isBlocked);
    } else if (mtoFilter === 'blocked') {
      filtered = filtered.filter(mto => mto.isBlocked);
    }

    // Apply search filter
    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      filtered = filtered.filter(mto => 
        mto.name.toLowerCase().includes(lowerSearchTerm) ||
        mto.currency.toLowerCase().includes(lowerSearchTerm)
      );
    }

    // Sort by critical status if showCriticalFirst is true
    if (showCriticalFirst) {
      filtered.sort((a, b) => (b.isCritical ? 1 : 0) - (a.isCritical ? 1 : 0));
    }

    return filtered;
  };
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});
  const [mtoFilter, setMtoFilter] = useState<string>('all');
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Filter the list whenever mtoFilter or searchTerm changes
    setFilteredList(filterMTOs(mtoList));
  }, [mtoFilter, searchTerm]);

  useEffect(() => {
    setIsLoading(true);
    
    const mockData: MTOData[] = Array.from({ length: 10 }, (_, index) => {
      const startDate = new Date();
      startDate.setMonth(startDate.getMonth() - Math.floor(Math.random() * 6) - 1);
      
      let endDate: Date | null = null;
      if (Math.random() > 0.3) {
        endDate = new Date(startDate);
        endDate.setMonth(endDate.getMonth() + Math.floor(Math.random() * 6) + 1);
      }
      
      let nextRiskValue: number | null = null;
      let nextRiskStartDate: Date | null = null;
      
      if (Math.random() < 0.3 && endDate) {
        nextRiskValue = Math.random() * 60000;
        nextRiskStartDate = new Date(endDate);
        nextRiskStartDate.setDate(nextRiskStartDate.getDate() + 1);
      }
      
      const balance = Math.random() * 200000 - 50000;
      const riskValue = Math.random() * 60000;
      
      const isBlocked = balance + riskValue <= 0;
      const isCritical = isBlocked || balance < 10000 || (balance + riskValue < 20000);
      
      return {
        id: `mto${index + 1}`,
        name: `Partner MTO ${index + 1}`,
        currency: ['USD', 'EUR', 'GBP'][Math.floor(Math.random() * 3)],
        balance: balance,
        riskValue: riskValue,
        maxRiskValue: balance + riskValue,
        status: ['positive', 'negative', 'warning', 'neutral'][Math.floor(Math.random() * 4)] as 'positive' | 'negative' | 'warning' | 'neutral',
        decote: 0.015 + Math.random() * 0.02,
        change: Math.random() * 10 - 5,
        isBlocked: isBlocked,
        riskStartDate: startDate,
        riskEndDate: endDate,
        nextRiskValue: nextRiskValue,
        nextRiskStartDate: nextRiskStartDate,
        isCritical: isCritical
      };
    });
    
    // Auto-open critical items
    const openState: Record<string, boolean> = {};
    if (showCriticalFirst) {
      mockData.forEach(mto => {
        if (mto.isCritical) {
          openState[mto.id] = true;
        }
      });
    }
    setOpenItems(openState);
    
    const timer = setTimeout(() => {
      setMtoList(mockData);
      setFilteredList(mockData);
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [showCriticalFirst]);

  useEffect(() => {
    let filtered = mtoList.filter(mto =>
      mto.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mto.currency.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    if (showCriticalFirst) {
      filtered = [...filtered].sort((a, b) => {
        if (a.isCritical && !b.isCritical) return -1;
        if (!a.isCritical && b.isCritical) return 1;
        if (a.isBlocked && !b.isBlocked) return -1;
        if (!a.isBlocked && b.isBlocked) return 1;
        return 0;
      });
    }
    
    setFilteredList(filtered);
  }, [searchTerm, mtoList, showCriticalFirst]);

  const formatCurrency = (amount: number, currency: string) => {
    const displayAmount = amount < 0 ? 0 : amount;
    
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2
    }).format(displayAmount);
  };

  const handleAddMTO = () => {
    navigate('/add-mto');
  };

  const handleRiskManagement = (mtoId: string) => {
    navigate(`/risk-management?mtoId=${mtoId}`);
    
    const mto = mtoList.find(m => m.id === mtoId);
    
    toast({
      title: "Gestion des risques",
      description: mto && mto.balance + mto.riskValue < 0 
        ? "Le partenaire est bloqué car la balance + risk value est inférieure à zéro."
        : "Ajustez la valeur de risque pour bloquer ou débloquer ce partenaire.",
      duration: 3000,
    });
  };

  const handleFilterClick = () => {
    
  }
  
  const handleViewDetails = (mtoId: string) => {
    // Redirect to MTO details page instead of risk management
    navigate('/mto-details');
    
    const mto = mtoList.find(m => m.id === mtoId);
    
    toast({
      title: "Détails du partenaire",
      description: "Affichage des détails du partenaire MTO, des transactions et de l'historique des compensations.",
      duration: 3000,
    });
  };

  const toggleItem = (id: string) => {
    setOpenItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const criticalMTOs = filteredList.filter(mto => mto.isCritical);
  const hasCriticalMTOs = criticalMTOs.length > 0;

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Users className="h-5 w-5" />
            Partenaires MTO
          </h2>
          {hasCriticalMTOs && (
            <p className="text-finance-negative text-sm mt-1 flex items-center gap-1">
              <AlertTriangle className="h-4 w-4" />
              {criticalMTOs.length} partenaire(s) en état critique
            </p>
          )}
        </div>
        <div className="relative mt-6">
          <Tabs value={mtoFilter} onValueChange={setMtoFilter} className="mb-6">
              <TabsList className="grid w-full grid-cols-3 bg-gray-100 p-1 rounded-lg items-center justify-center">
                <TabsTrigger value="all" className=" data-[state=active]:rounded-lg data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm">
                  <div className="flex flex-col items-center">
                    <span className="text-sm">All MTOs</span>
                    <span className="text-xs text-muted-foreground">
                      {mtoList.length}
                    </span>
                  </div>
                </TabsTrigger>
                <TabsTrigger value="active" className=" data-[state=active]:rounded-lg data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm">
                  <div className="flex flex-col items-center">
                    <span className="text-sm">Active</span>
                    <span className="text-xs text-muted-foreground">
                      {mtoList.filter(mto => !mto.isBlocked).length}
                    </span>
                  </div>
                </TabsTrigger>
                <TabsTrigger value="blocked" className="data-[state=active]:rounded-lg data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm">
                  <div className="flex flex-col items-center">
                    <span className="text-sm">Blocked</span>
                    <span className="text-xs text-muted-foreground">
                      {mtoList.filter(mto => mto.isBlocked).length}
                    </span>
                  </div>
                </TabsTrigger>
              </TabsList>
          </Tabs>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none sm:min-w-[300px]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher un partenaire..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          {/* <Button variant="outline" size="icon" onClick={handleFilterClick}>
            <SlidersHorizontal className="h-4 w-4" />
          </Button> */}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4">
        {isLoading ? (
          Array(4).fill(0).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-16 bg-secondary rounded-lg"></div>
            </div>
          ))
        ) : (
          <>
            {filteredList.map((mto) => (
              <div key={mto.id} className="w-full">
                <Collapsible
                  open={openItems[mto.id]}
                  onOpenChange={() => toggleItem(mto.id)}
                  className={`rounded-lg border ${
                    mto.isCritical 
                      ? 'border-finance-negative/30 shadow-sm shadow-finance-negative/20' 
                      : mto.isBlocked 
                        ? 'border-finance-negative/30' 
                        : 'border-finance-positive/30'
                  }`}
                >
                <CollapsibleTrigger className="flex items-center justify-between w-full p-4 border-b hover:bg-accent hover:text-accent-foreground relative">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-3">
                      <StatusIndicator 
                        status={mto.isCritical ? "negative" : mto.status} 
                        pulsate={mto.isBlocked || mto.isCritical}
                      />
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{mto.name}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant={mto.isBlocked ? "destructive" : "outline"} 
                        className={`font-normal ${!mto.isBlocked ? 'bg-finance-positive/10 text-finance-positive border-finance-positive' : ''}`}
                      >
                        {mto.isBlocked ? 'Bloqué' : 'Actif'}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right hidden sm:block">
                      <div className="text-sm font-semibold">Balance: {formatCurrency(mto.balance, mto.currency)}
                          <div className="flex items-right justify-end gap-1 text-xs text-right">  
                            <ValueChange 
                              value={mto.change} 
                              percentageChange 
                              size="sm"
                            />
                          </div>
                      </div>
                      <div className="text-xs text-muted-foreground">Risk Value: {formatCurrency(mto.riskValue, mto.currency)}
                        <Progress
                          value={(mto.riskValue / Math.abs(mto.balance + mto.riskValue)) * 100}
                          className="h-2 bg-gray-200"
                          indicatorClassName={
                            mto.isBlocked 
                              ? "bg-finance-negative border-finance-negative rounded-full" 
                              : mto.isCritical 
                                ? "bg-finance-warning border-finance-warning rounded-full" 
                                : "bg-finance-positive border-finance-positive rounded-full"
                          }
                        />
                      </div>
                    </div>
                    {openItems[mto.id] ? (
                      
                      <ChevronUp className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                </CollapsibleTrigger>

                <CollapsibleContent className="p-4 pt-0 border-t">
                  <div className="gap-6 py-4">
                    

                    <div className="space-y-2">
                      <div className='grid grid-cols-2 gap-2 items-center'>
                        <div className='flex items-center gap-2'>
                          <h4 className="text-sm text-muted-foreground  tracking-wide font-medium">
                            Risk Value
                          </h4>
                        </div>
                        <div className='flex items-center gap-2 '>
                          <h4 className="text-sm text-muted-foreground tracking-wide font-medium">
                            Décote :
                          </h4>
                          <Badge 
                              variant="outline" 
                              className="text-xs font-normal border-muted text-muted-foreground"
                            >
                              {(mto.decote * 100).toFixed(2)}% 
                          </Badge>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <p className="text-xl font-semibold">
                            {formatCurrency(mto.riskValue, mto.currency)}
                          </p>
                          <span className="text-sm text-muted-foreground">
                            Max: {formatCurrency(mto.balance + mto.riskValue, mto.currency)}
                          </span>
                        </div>
                        
                        <Progress
                          value={(mto.riskValue / Math.abs(mto.balance + mto.riskValue)) * 100}
                          className="h-2"
                          indicatorClassName={
                            mto.isBlocked 
                              ? "bg-finance-negative" 
                              : mto.isCritical 
                                ? "bg-finance-warning" 
                                : "bg-finance-positive"
                          }
                        />
                        
                        <div className="flex justify-between items-center text-xs text-muted-foreground mt-1">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>Du: {format(mto.riskStartDate, 'dd/MM/yyyy')}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {mto.riskEndDate ? 
                              <span>Au: {format(mto.riskEndDate, 'dd/MM/yyyy')}</span> : 
                              <span>Indéfini</span>
                            }
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={`p-3 rounded-lg border text-xs flex items-start gap-2 ${
                    mto.isBlocked ? 
                      "bg-finance-negative/10 border-finance-negative/20 text-finance-negative" : 
                      mto.isCritical ?
                      "bg-finance-warning/10 border-finance-warning/20 text-finance-warning" :
                      "bg-finance-positive/10 border-finance-positive/20 text-finance-positive"
                  }`}>
                    {mto.isBlocked ? (
                      <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                    ) : mto.isCritical ? (
                      <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                    ) : (
                      <TrendingUp className="h-4 w-4 flex-shrink-0" />
                    )}
                    <p>
                      {mto.nextRiskValue && mto.nextRiskStartDate ? (
                        `Prochain Risk Value: ${formatCurrency(mto.nextRiskValue, mto.currency)} à partir du ${format(mto.nextRiskStartDate, 'dd/MM/yyyy')}`
                      ) : (
                        "Prochain Risk Value: Aucun risk value futur configuré"
                      )}
                    </p>
                  </div>

                  <div className="flex justify-end mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewDetails(mto.id);
                      }}
                      className="mr-2"
                    >
                      Voir détails
                    </Button>
                    <Button
                      variant={mto.isBlocked ? "outline" : "outline"}
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRiskManagement(mto.id);
                      }}
                      className={!mto.isBlocked ? "border-finance-positive text-finance-positive hover:bg-finance-positive/10" : ""}
                    >
                      Gérer le risque
                    </Button>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </div>
          ))}
        </>
      )}
    </div>
  </div>
  );}
