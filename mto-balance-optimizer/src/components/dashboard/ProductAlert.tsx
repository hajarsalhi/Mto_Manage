import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, Bell, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import styles from './ProductAlert.module.css';

interface ProductAlertProps {
  blockedProducts: Array<{ id: string; name: string; blockedSince: string }>;
  onDismiss: () => void;
}

export function ProductAlert({ blockedProducts, onDismiss }: ProductAlertProps) {
  if (blockedProducts.length === 0) return null;

  return (
    <div className={styles.alert}>
      <div className={styles.alertTitle}>
        <AlertTriangle className={styles.alertIcon} />
        <h3>MTOs bloqués</h3>
      </div>
      <div className={styles.alertDescription}>
        {blockedProducts.map((product, index) => (
          <div key={product.id} className={styles.productItem}>
            <span className={styles.productName}>{product.name}</span>
            <span className={styles.productDate}>
              bloqué depuis {product.blockedSince}
            </span>
          </div>
        ))}
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={onDismiss}
        className={styles.dismissButton}
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}
