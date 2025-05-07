import React, { useState, useEffect } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '../../components/ui/table.tsx';
import { Button } from '../../components/ui/button.tsx';
import { Edit, Eye, RefreshCw } from 'lucide-react';
import axios from 'axios';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { BalanceResponse, getRecentBalances, getDayBeforeFinanceData } from '../../services/balance.service.ts';


const BalanceMto: React.FC = () => {
  const [balanceData, setBalanceData] = useState<BalanceResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const navigate = useNavigate();


  const fetchBalanceData = async () => {
    try {
      setLoading(true);
      const response = await getDayBeforeFinanceData();
      setBalanceData(response);
      setLastUpdated(new Date());
      setError(null);
    } catch (err) {
      console.error('Error fetching balance data:', err);
      setError('Failed to load balance data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBalanceData();
    
    // Set up an interval to refresh data every 15 minutes
    const intervalId = setInterval(fetchBalanceData, 15 * 60 * 1000);
    
    // Clean up the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []);

  const handleEdit = (id: number) => {
    navigate(`/balance/edit/${id}`);
  };

  const handleViewCorrections = () => {
    navigate('/balance/corrections');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-MA', {
      style: 'currency',
      currency: 'MAD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd/MM/yyyy');
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Balance MTO</h1>
        <div className="flex gap-2">
          <Button 
            onClick={handleViewCorrections}
            className="flex items-center gap-2"
          >
            <Eye className="h-4 w-4" />
            View Corrections
          </Button>
          <Button 
            onClick={fetchBalanceData}
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}
      
      {lastUpdated && (
        <div className="text-sm text-gray-500 mb-4">
          Last updated: {format(lastUpdated, 'dd/MM/yyyy HH:mm:ss')}
        </div>
      )}

      {loading && balanceData.length === 0 ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>MTO Name</TableHead>
                <TableHead className="text-right font-bold">RealTime Balance</TableHead>
                <TableHead className="text-right">Balance J-1</TableHead>
                <TableHead className="text-right">Compensations J-1</TableHead>
                <TableHead className="text-right">Transactions J-1</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {balanceData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-6">
                    No balance data available
                  </TableCell>
                </TableRow>
              ) : (
                balanceData.map((balance) => (
                  <TableRow key={balance.productId}>
                    <TableCell>{balance.dateUpdate ? formatDate(balance.dateUpdate) : 'N/A'}</TableCell>
                    <TableCell>{balance.productName}</TableCell>
                    <TableCell className="text-right font-bold">
                      {balance.balance !== undefined ? formatCurrency(balance.balance) : 'N/A'}
                    </TableCell>
                    <TableCell className="text-right">
                      {balance.balanceJ1 !== undefined ? formatCurrency(balance.balanceJ1) : 'N/A'}
                    </TableCell>
                    <TableCell className="text-right">
                      {balance.compensationJ1 !== undefined ? formatCurrency(balance.compensationJ1) : 'N/A'}
                    </TableCell>
                    <TableCell className="text-right">
                      {balance.transactionsJ1 !== undefined ? formatCurrency(balance.transactionsJ1) : 'N/A'}
                    </TableCell>
                    <TableCell className="text-center">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleEdit(balance.productId)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default BalanceMto;
