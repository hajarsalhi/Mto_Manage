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
import { RefreshCw } from 'lucide-react';
import { getRecentBalances, BalanceResponse } from '../../services/balance.service.ts';
import { format } from 'date-fns';

const RecentBalances: React.FC = () => {
  const [balanceData, setBalanceData] = useState<BalanceResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchBalanceData = async () => {
    try {
      setLoading(true);
      const response = await getRecentBalances();
      setBalanceData(response);
      setLastUpdated(new Date());
      setError(null);
    } catch (err) {
      console.error('Error fetching recent balance data:', err);
      setError('Failed to load recent balance data. Please try again later.');
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MM/dd/yyyy HH:mm:ss');
    } catch (error) {
      return 'Invalid date';
    }
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Recent Product Balances</h1>
        <div className="flex items-center gap-4">
          {lastUpdated && (
            <span className="text-sm text-gray-500">
              Last updated: {format(lastUpdated, 'HH:mm:ss')}
            </span>
          )}
          <Button 
            onClick={fetchBalanceData} 
            disabled={loading}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {loading && balanceData.length === 0 ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product ID</TableHead>
                <TableHead>Product Name</TableHead>
                <TableHead>Balance</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {balanceData.map((balance) => (
                <TableRow key={balance.productId}>
                  <TableCell>{balance.productId}</TableCell>
                  <TableCell>{balance.productName}</TableCell>
                  <TableCell>
                    {balance.balance !== undefined 
                      ? formatCurrency(balance.balance) 
                      : 'N/A'}
                  </TableCell>
                  <TableCell>
                    {balance.dateUpdate 
                      ? formatDate(balance.dateUpdate) 
                      : 'N/A'}
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      balance.status === 'AVAILABLE' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {balance.status}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
              {balanceData.length === 0 && !loading && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4">
                    No balance data available
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default RecentBalances; 