import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui-custom/Card';
import { Button } from '@/components/ui/button';
import { StatusIndicator, ValueChange } from '../ui-custom/StatusIndicator';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Plus, TrendingUp, AlertTriangle, Search, SlidersHorizontal, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { format } from 'date-fns';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

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
}

export function MTOList() {
  const [mtoList, setMtoList] = useState<MTOData[]>([]);
  const [filteredList, setFilteredList] = useState<MTOData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    setIsLoading(true);
    
    const mockData: MTOData[] = Array.from({ length: 45 }, (_, index) => {
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
      
      const isBlocked = balance + riskValue < 0;
      
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
        nextRiskStartDate: nextRiskStartDate
      };
    });
    
    const timer = setTimeout(() => {
      setMtoList(mockData);
      setFilteredList(mockData);
      setIsLoading(false);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const filtered = mtoList.filter(mto =>
      mto.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mto.currency.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredList(filtered);
    setCurrentPage(1);
  }, [searchTerm, mtoList]);

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

  const totalPages = Math.ceil(filteredList.length / itemsPerPage);
  const currentItems = filteredList.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <h2 className="text-xl font-semibold">Partenaires MTO</h2>
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
          <Button variant="outline" size="icon">
            <SlidersHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {isLoading ? (
          Array(8).fill(0).map((_, i) => (
            <div key={i} className="animate-pulse h-[280px]">
              <div className="h-full bg-secondary rounded-lg w-full"></div>
            </div>
          ))
        ) : (
          <>
            {currentItems.map((mto) => (
              <MTOCard 
                key={mto.id} 
                mto={mto} 
                onClick={() => navigate('/mto-details')}
                onToggleBlock={() => handleRiskManagement(mto.id)}
              />
            ))}
            <div className="flex items-center justify-center h-[280px] border-2 border-dashed border-border rounded-lg hover:border-primary/50 transition-colors cursor-pointer">
              <Button 
                variant="ghost" 
                className="gap-2 text-muted-foreground h-auto py-8 px-6 flex-col"
                onClick={handleAddMTO}
              >
                <Plus className="h-12 w-12" />
                <span className="text-lg font-medium mt-2">Ajouter un partenaire MTO</span>
              </Button>
            </div>
          </>
        )}
      </div>

      {!isLoading && filteredList.length > itemsPerPage && (
        <Pagination className="mt-6">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
              />
            </PaginationItem>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(page => 
                page === 1 || 
                page === totalPages || 
                (page >= currentPage - 1 && page <= currentPage + 1)
              )
              .map((page, index, array) => {
                if (index > 0 && array[index - 1] !== page - 1) {
                  return (
                    <PaginationItem key={`ellipsis-${page}`}>
                      <PaginationEllipsis />
                    </PaginationItem>
                  );
                }
                return (
                  <PaginationItem key={page}>
                    <PaginationLink
                      isActive={currentPage === page}
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}
            
            <PaginationItem>
              <PaginationNext 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
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

  const combinedValue = mto.balance + mto.riskValue;
  const isNegative = combinedValue < 0;

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
          {/* Real Time Balance (formerly Current Balance) */}
          <div className="space-y-2">
            <h3 className="text-sm text-muted-foreground uppercase tracking-wide font-medium">
              Real Time Balance
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

          {/* Risk Value (formerly Valeur de Risque) */}
          <div className="space-y-2">
            <h3 className="text-sm text-muted-foreground uppercase tracking-wide font-medium">
              Risk Value
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
              
              <div className="text-xs text-muted-foreground mt-2 pt-2 border-t border-border">
                <span className="font-medium">Prochain Risk Value:</span>
                {mto.nextRiskValue && mto.nextRiskStartDate ? (
                  <div className="flex flex-col mt-1">
                    <span>{formatCurrency(mto.nextRiskValue, mto.currency)}</span>
                    <div className="flex items-center gap-1 mt-0.5">
                      <Calendar className="h-3 w-3" />
                      <span>À partir du {format(mto.nextRiskStartDate, 'dd/MM/yyyy')}</span>
                    </div>
                  </div>
                ) : (
                  <span className="ml-1 italic">Aucun risk value futur configuré</span>
                )}
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
                ? "Les opérations sont bloquées car la balance + risk value est inférieure à zéro." 
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
            {mto.isBlocked ? "Gérer le risque" : "Gérer le risque"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
