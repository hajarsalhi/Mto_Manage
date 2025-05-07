import React, { useState, useEffect, use } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '../../components/ui/table.tsx';
import { Button } from '../../components/ui/button.tsx';
import { CheckSquare, Upload, Check } from 'lucide-react';
import axios from 'axios';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { getUploadedCompensations, validateCompensations } from '../../services/compensation.service.ts';
import { getProductDevise } from '../../services/product.service.ts';

interface CompensationData {
  id: number;
  date: string;
  productName: string;
  productId : number;
  reference: string;
  compensation: number;
  taux: number;
}

const AllCompensations: React.FC = () => {
  const [compensations, setCompensations] = useState<CompensationData[]>([]);
  const [selectedCompensations, setSelectedCompensations] = useState<number[]>([]);
  const [currencies, setCurrencies] = useState<{[key: number]: string}>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectAll, setSelectAll] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCompensations = async () => {
      try {
        setLoading(true);
        const response = await getUploadedCompensations();
        console.log(response);
        setCompensations(response);
        setError(null);
      } catch (err) {
        console.error('Error fetching compensations data:', err);
        setError('Failed to load compensations data. Please try again later.');
        
        
      } finally {
        setLoading(false);
      }
    };

    fetchCompensations();
  }, []);

  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        const productIds = new Set(compensations.map(comp => comp.productId));
        
        const currenciesMap: {[key: number]: string} = {};
        
        for (const productId of productIds) {
          try {
            const response = await getProductDevise(productId);
            currenciesMap[productId] = response.currency;
          } catch (err) {
            console.error(`Error fetching currency for product ${productId}:`, err);
            currenciesMap[productId] = 'USD';
          }
        }
        
        setCurrencies(currenciesMap);
      } catch (err) {
        console.error('Error fetching currencies:', err);
      }
    };

    if (compensations.length > 0) {
      fetchCurrencies();
    }
  }, [compensations]);

  useEffect(() => {
    if (selectAll) {
      setSelectedCompensations(compensations.map(comp => comp.id));
    } else if (!selectAll && selectedCompensations.length === compensations.length) {
      setSelectedCompensations([]);
    }
  }, [selectAll, compensations]);

  useEffect(() => {
    if (compensations.length > 0) {
      const allSelected = selectedCompensations.length === compensations.length;
      if (allSelected !== selectAll) {
        setSelectAll(allSelected);
      }
    }
  }, [selectedCompensations, compensations.length]);

  const handleSelectCompensation = (id: number) => {
    setSelectedCompensations(prev => {
      if (prev.includes(id)) {
        return prev.filter(compId => compId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const handleSelectAllChange = () => {
    setSelectAll(!selectAll);
  };

  const handleValidate = async () => {
    if (selectedCompensations.length === 0) return;
    
    try {
      setLoading(true);
      await validateCompensations(selectedCompensations);
      setError(null);
      
      setCompensations(prev => 
        prev.filter(comp => !selectedCompensations.includes(comp.id))
      );
      
      setSelectedCompensations([]);
      setSelectAll(false);
    } catch (err) {
      console.error('Error validating compensations:', err);
      setError('Failed to validate compensations. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = () => {
    navigate('/compensations/upload');
  };

  const formatCurrency = (amount: number, currency: string) => {
    const validCurrency = currency || 'USD';
    
    try {
      return new Intl.NumberFormat('fr', {
        style: 'currency',
        currency: validCurrency,
        minimumFractionDigits: 2
      }).format(amount);
    } catch (error) {
      console.warn(`Invalid currency code: ${validCurrency}, falling back to USD`);
      return new Intl.NumberFormat('en', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2
      }).format(amount);
    }
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd/MM/yyyy');
  };

  const getCurrencyForProduct = (productId: number): string => {
    return currencies[productId] || 'USD';
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Pending Compensations</h1>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={handleUpload}
            className="flex items-center gap-2"
          >
            <Upload className="h-4 w-4" />
            Upload Compensations
          </Button>
          <Button 
            variant="outline"
            onClick={handleValidate}
            disabled={selectedCompensations.length === 0 || loading}
            className="flex items-center gap-2"
            
  >
            <Check className="h-4 w-4" />
            Validate
          </Button>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {loading && compensations.length === 0 ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : compensations.length === 0 ? (
        <div className="bg-white shadow-md rounded-lg p-6 text-center">
          <p className="text-gray-500">No pending compensations to display</p>
          <Button 
            variant="outline" 
            onClick={handleUpload}
            className="mt-4 flex items-center gap-2 mx-auto"
          >
            <Upload className="h-4 w-4" />
            Upload Compensations
          </Button>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      checked={selectAll}
                      onChange={handleSelectAllChange}
                    />
                  </div>
                </TableHead>
                <TableHead>Date</TableHead>
                <TableHead>MTO's Name</TableHead>
                <TableHead>Reference</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="text-right">FX Rate</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {compensations.map((compensation) => (
                <TableRow 
                  key={compensation.id}
                  className={selectedCompensations.includes(compensation.id) ? 'bg-blue-50' : ''}
                >
                  <TableCell>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        checked={selectedCompensations.includes(compensation.id)}
                        onChange={() => handleSelectCompensation(compensation.id)}
                      />
                    </div>
                  </TableCell>
                  <TableCell>{formatDate(compensation.date)}</TableCell>
                  <TableCell className="font-medium">{compensation.productName}</TableCell>
                  <TableCell>{compensation.reference}</TableCell>
                  <TableCell className="text-right" style={{ color: 'green' }}>
                    {formatCurrency(compensation.compensation, getCurrencyForProduct(compensation.productId))}
                  </TableCell>
                  <TableCell className="text-right">{compensation.taux.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
      
      {selectedCompensations.length > 0 && (
        <div className="mt-4 p-3 bg-blue-50 rounded-md flex justify-between items-center">
          <div className="flex items-center gap-2">
            <CheckSquare className="h-5 w-5 text-blue-500" />
            <span>{selectedCompensations.length} compensation{selectedCompensations.length !== 1 ? 's' : ''} selected</span>
          </div>
          <Button 
            onClick={handleValidate}
            disabled={loading}
            size="sm"
            className="flex items-center gap-2"
          >
            <Check className="h-4 w-4" />
            Validate Selected
          </Button>
        </div>
      )}
    </div>
  );
};

export default AllCompensations;
