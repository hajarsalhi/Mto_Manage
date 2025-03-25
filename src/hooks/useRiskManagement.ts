import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

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
      
      const shouldBeBlocked = shouldBlockMto(mto.balance, mto.currentRisk);
      setIsBlocked(shouldBeBlocked);
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
      
      const shouldBeBlocked = shouldBlockMto(mto.balance, riskValue);
      
      toast({
        title: "Risk value updated",
        description: `Risk value for ${mto.name} has been updated to ${riskValue} ${mto.currency} from ${startDate ? format(startDate, 'PPP') : 'N/A'} to ${endDate ? format(endDate, 'PPP') : 'indefinitely'}.`,
        duration: 3000,
      });
      
      if (shouldBeBlocked && !isBlocked) {
        setIsBlocked(true);
        
        toast({
          title: "MTO blocked",
          description: `${mto.name} has been blocked because the maximum risk value is less than or equal to zero.`,
          variant: "destructive",
          duration: 4000,
        });
      } else if (!shouldBeBlocked && isBlocked) {
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
    return (riskValue / Math.abs(riskValue)) * 100;
  };
  
  const getStatusColor = () => {
    const percentage = calculatePercentage();
    if (percentage < 30) return "bg-finance-positive";
    if (percentage < 70) return "bg-finance-warning";
    return "bg-finance-negative";
  };

  const calculateMaxRiskValue = (balance: number, riskValue: number) => {
    return riskValue;
  };

  const shouldBlockMto = (balance: number, riskValue: number) => {
    return balance + riskValue <= 0;
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
    getStatusColor,
    shouldBlockMto,
    calculateMaxRiskValue
  };
}
