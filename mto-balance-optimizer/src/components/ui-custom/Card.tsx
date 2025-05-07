
import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  variant?: 'default' | 'glass' | 'interactive';
  size?: 'default' | 'sm' | 'lg';
}

export function Card({ 
  children, 
  className, 
  onClick, 
  variant = 'default',
  size = 'default'
}: CardProps) {
  return (
    <div 
      className={cn(
        "rounded-xl overflow-hidden border border-border",
        "transition-all duration-300 bg-card text-card-foreground",
        "p-6",
        variant === 'glass' && "glass-panel",
        variant === 'interactive' && "glass-panel glass-panel-hover cursor-pointer",
        size === 'sm' && "p-4",
        size === 'lg' && "p-8",
        onClick && "cursor-pointer hover:shadow-md",
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

interface CardHeaderProps {
  children: ReactNode;
  className?: string;
}

export function CardHeader({ children, className }: CardHeaderProps) {
  return (
    <div className={cn("space-y-1.5 mb-4", className)}>
      {children}
    </div>
  );
}

interface CardTitleProps {
  children: ReactNode;
  className?: string;
}

export function CardTitle({ children, className }: CardTitleProps) {
  return (
    <h3 className={cn("heading-md", className)}>
      {children}
    </h3>
  );
}

interface CardDescriptionProps {
  children: ReactNode;
  className?: string;
}

export function CardDescription({ children, className }: CardDescriptionProps) {
  return (
    <p className={cn("text-sm text-muted-foreground", className)}>
      {children}
    </p>
  );
}

interface CardContentProps {
  children: ReactNode;
  className?: string;
}

export function CardContent({ children, className }: CardContentProps) {
  return (
    <div className={cn("", className)}>
      {children}
    </div>
  );
}

interface CardFooterProps {
  children: ReactNode;
  className?: string;
}

export function CardFooter({ children, className }: CardFooterProps) {
  return (
    <div className={cn("flex items-center pt-4 mt-4 border-t border-border", className)}>
      {children}
    </div>
  );
}
