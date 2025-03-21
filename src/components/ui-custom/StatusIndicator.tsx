
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

type StatusType = 'positive' | 'negative' | 'warning' | 'neutral';

interface StatusIndicatorProps {
  status: StatusType;
  pulsate?: boolean;
  label?: string;
  className?: string;
}

export function StatusIndicator({ 
  status, 
  pulsate = false, 
  label, 
  className 
}: StatusIndicatorProps) {
  const [isVisible, setIsVisible] = useState(true);
  
  useEffect(() => {
    if (pulsate) {
      const interval = setInterval(() => {
        setIsVisible(prev => !prev);
      }, 1000);
      
      return () => clearInterval(interval);
    }
  }, [pulsate]);
  
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div
        className={cn(
          "w-2.5 h-2.5 rounded-full transition-opacity duration-300",
          status === 'positive' && "bg-finance-positive",
          status === 'negative' && "bg-finance-negative",
          status === 'warning' && "bg-finance-warning",
          status === 'neutral' && "bg-finance-neutral",
          pulsate && !isVisible && "opacity-50"
        )}
      />
      {label && (
        <span className={cn(
          "text-xs font-medium",
          status === 'positive' && "text-finance-positive",
          status === 'negative' && "text-finance-negative",
          status === 'warning' && "text-finance-warning",
          status === 'neutral' && "text-finance-neutral"
        )}>
          {label}
        </span>
      )}
    </div>
  );
}

interface ValueChangeProps {
  value: number;
  percentageChange?: boolean;
  size?: 'sm' | 'default' | 'lg';
  showIcon?: boolean;
  className?: string;
}

export function ValueChange({
  value,
  percentageChange = false,
  size = 'default',
  showIcon = true,
  className
}: ValueChangeProps) {
  const isPositive = value > 0;
  const isNeutral = value === 0;
  
  return (
    <div 
      className={cn(
        "flex items-center gap-1",
        isPositive ? "text-finance-positive" : isNeutral ? "text-finance-neutral" : "text-finance-negative",
        size === 'sm' && "text-xs",
        size === 'lg' && "text-base font-semibold",
        className
      )}
    >
      {showIcon && (
        <span className="text-xs">
          {isPositive ? '↑' : isNeutral ? '→' : '↓'}
        </span>
      )}
      <span>
        {isPositive ? '+' : isNeutral ? '' : ''}
        {value.toLocaleString()}
        {percentageChange && '%'}
      </span>
    </div>
  );
}
