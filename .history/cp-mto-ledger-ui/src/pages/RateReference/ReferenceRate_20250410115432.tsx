import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '../../components/ui/table.tsx';
import { Button } from '../../components/ui/button.tsx';
import { RefreshCw, ArrowUp, ArrowDown, Minus, Edit } from 'lucide-react';
import axios from 'axios';
import { format } from 'date-fns';
import { getRateReference } from '../../services/RateReference.service.ts';

interface ReferenceRateData {
  id: number;
  date: string;
  devise: string;
  ssource: string;
  fcoursVirement : number;
  previousRate?: number;
}

const ReferenceRate: React.FC = () => {
  const navigate = useNavigate();
  const [referenceRates, setReferenceRates] = useState<ReferenceRateData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchReferenceRates = async () => {
    try {
      setLoading(true);
      const response = await getRateReference();
      setReferenceRates(response);
      setLastUpdated(new Date());
      setError(null);
    } catch (err) {
      console.error('Error fetching reference rates:', err);
      setError('Failed to load reference rates. Please try again later.');
            
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReferenceRates();
  }, []);

  const handleUpdateRates = () => {
    navigate('/reference-rate/update');
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd/MM/yyyy HH:mm');
  };

  const formatCurrency = (rate: number) => {
    return new Intl.NumberFormat('fr-MA', {
      style: 'decimal',
      minimumFractionDigits: 4,
      maximumFractionDigits: 4
    }).format(rate);
  };

  const getRateChangeIcon = (current: number, previous?: number) => {
    if (!previous) return <Minus className="h-4 w-4 text-gray-400" />;
    
    if (current > previous) {
      return <ArrowUp className="h-4 w-4 text-green-600" />;
    } else if (current < previous) {
      return <ArrowDown className="h-4 w-4 text-red-600" />;
    } else {
      return <Minus className="h-4 w-4 text-gray-400" />;
    }
  };

  const getRateChangeClass = (current: number, previous?: number) => {
    if (!previous) return '';
    
    if (current > previous) {
      return 'text-green-600';
    } else if (current < previous) {
      return 'text-red-600';
    } else {
      return '';
    }
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Reference Exchange Rates</h1>
          {lastUpdated && (
            <p className="text-sm text-gray-500 mt-1">
              Last updated: {format(lastUpdated, 'dd/MM/yyyy HH:mm:ss')}
            </p>
          )}
        </div>
        <Button 
          onClick={handleUpdateRates}
          className="flex items-center gap-2"
        >
          <Edit className="h-4 w-4" />
          Update Reference Rates
        </Button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : referenceRates?.length === 0 ? (
        <div className="bg-white shadow-md rounded-lg p-6 text-center">
          <p className="text-gray-500">No reference rates available</p>
          <Button 
            onClick={handleUpdateRates}
            className="mt-4 flex items-center gap-2 mx-auto"
          >
            <Edit className="h-4 w-4" />
            Update Reference Rates
          </Button>
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Devise</TableHead>
                <TableHead className="text-right">Cours Virement</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {referenceRates?.map((rate) => (
                <TableRow key={rate.id}>
                  <TableCell>{formatDate(rate.date)}</TableCell>
                  <TableCell className="font-medium">{rate.devise}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <span className={getRateChangeClass(rate.fcoursVirement, rate.previousRate)}>
                        {formatCurrency(rate.fcoursVirement)}
                      </span>
                      {getRateChangeIcon(rate.fcoursVirement, rate.previousRate)}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
      
    </div>
  );
};

export default ReferenceRate;