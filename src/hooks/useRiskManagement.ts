
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

interface MTOData {
  name: string;
  currency: string;
  balance: number;
  currentRisk: number;
  maxRisk: number;
  threshold: number;
  isBlocked: boolean;
}

interface RiskHistoryRecord {
  id: number;
  value: number;
  currency: string;
  startDate: Date;
  endDate: Date | null;
  isActive: boolean;
  createdBy: string;
  createdAt: Date;
}

export function useRiskManagement(
  mtoData: Record<string, MTOData>,
  riskHistoryData: Record<string, RiskHistoryRecord[]>
) {
  const [selectedMto, setSelectedMto] = useState("remitly");
  const [riskValue, setRiskValue] = useState(50000);
  const [isBlocked, setIsBlocked] = useState(false);
  const [isAdjusting, setIsAdjusting] = useState(false);
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const { toast } = useToast();

  const handleMtoChange = (value: string) => {
    setSelectedMto(value);
    
    if (value in mtoData) {
      const mto = mtoData[value];
      setRiskValue(mto.currentRisk);
      setIsBlocked(mto.isBlocked);
    }
  };
  
  const handleRiskValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value)) {
      setRiskValue(value);
    } else {
      setRiskValue(0);
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedMto) {
      toast({
        title: "Error",
        description: "Please select an MTO partner.",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    if (!startDate) {
      toast({
        title: "Error",
        description: "Please select a start date for the risk value period.",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }
    
    setIsAdjusting(true);
    
    setTimeout(() => {
      setIsAdjusting(false);
      
      const mto = mtoData[selectedMto];
      
      toast({
        title: "Risk value updated",
        description: `Risk value for ${mto.name} has been updated to ${riskValue} ${mto.currency} from ${startDate ? format(startDate, 'PPP') : 'N/A'} to ${endDate ? format(endDate, 'PPP') : 'indefinitely'}.`,
        duration: 3000,
      });
      
      if (isBlocked && riskValue > mto.currentRisk) {
        setIsBlocked(false);
        
        toast({
          title: "MTO unblocked",
          description: `${mto.name} has been unblocked and operations can resume.`,
          duration: 4000,
        });
      }
    }, 1500);
  };
  
  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0
    }).format(amount);
  };
  
  const calculatePercentage = () => {
    if (!selectedMto) return 0;
    
    const mto = mtoData[selectedMto];
    return (riskValue / mto.maxRisk) * 100;
  };
  
  const getStatusColor = () => {
    const percentage = calculatePercentage();
    if (percentage < 30) return "bg-finance-negative";
    if (percentage < 60) return "bg-finance-warning";
    return "bg-finance-positive";
  };

  return {
    selectedMto,
    riskValue,
    isBlocked,
    isAdjusting,
    startDate,
    endDate,
    handleMtoChange,
    handleRiskValueChange,
    handleSubmit,
    setStartDate,
    setEndDate,
    formatCurrency,
    calculatePercentage,
    getStatusColor
  };
}

// Add missing import
import { format } from 'date-fns';
