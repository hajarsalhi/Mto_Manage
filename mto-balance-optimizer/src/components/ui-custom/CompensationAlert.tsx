
import React from 'react';
import { AlertTriangle, XCircle } from 'lucide-react';

interface CompensationAlertProps {
  onClose?: () => void;
}

export const CompensationAlert: React.FC<CompensationAlertProps> = ({ onClose }) => {
  return (
    <div className="bg-amber-50 border-l-4 border-amber-500 p-4 mb-6 rounded-md relative">
      <div className="flex items-start">
        <AlertTriangle className="h-5 w-5 text-amber-500 mr-3 mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-sm font-medium text-amber-800">
            P.S: Les compensations doivent être validées avant 18h00, ou elles seront automatiquement supprimées!
          </p>
        </div>
        {onClose && (
          <button 
            onClick={onClose} 
            className="absolute top-4 right-4 text-amber-500 hover:text-amber-700"
            aria-label="Fermer l'alerte"
          >
            <XCircle className="h-5 w-5" />
          </button>
        )}
      </div>
    </div>
  );
};
