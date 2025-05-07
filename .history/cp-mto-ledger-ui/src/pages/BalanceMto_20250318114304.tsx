import React, { useState, useEffect } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '../components/ui/table';
import { Button } from '../components/ui/button';
import { Edit, Eye } from 'lucide-react';
import axios from 'axios';
import { format } from 'date-fns';

interface BalanceData {
  id: number;
  date: string;
  mtoName: string;
  realTimeBalance: number;
  balanceJ1: number;
  compensationsJ1: number;
  transactionsJ1: number;
}

const BalanceMto: React.FC = () => {
  const [balanceData, setBalanceData] = useState<BalanceData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBalanceData = async () => {
      try {
        setLoading(true);
        // Replace with your actual API endpoint
        const response = await axios.get('/api/balance');
        setBalanceData(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching balance data:', err);
        setError('Failed to load balance data. Please try again later.');
        
        // Mock data for development
        setBalanceData([
          {
            id: 1,
            date: '2023-06-15',
            mtoName: 'Western Union',
            realTimeBalance: 125000.50,
            balanceJ1: 120000.75,
            compensationsJ1: 5000.00,
            transactionsJ1: 10000.25
          },
          {
            id: 2,
            date: '2023-06-15',
            mtoName: 'MoneyGram',
            realTimeBalance: 85000.25,
            balanceJ1: 82000.50,
            compensationsJ1: 3000.00,
            transactionsJ1: 6000.75
          },
          {
            id: 3,
            date: '2023-06-15',
            mtoName: 'Ria',
            realTimeBalance: 45000.75,
            balanceJ1: 43000.25,
            compensationsJ1: 2000.50,
            transactionsJ1: 4000.00
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchBalanceData();
  }, []);

  const handleEdit = (id: number) => {
    console.log(`Edit balance with ID: ${id}`);
    // Implement edit functionality
  };

  const handleViewCorrections = () => {
    console.log('View corrections clicked');
    // Implement view corrections functionality
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
        <h1 className="text-2xl font-bold">MTO Balance Management</h1>
        <Button 
          variant="outline" 
          onClick={handleViewCorrections}
          className="flex items-center gap-2"
        >
          <Eye className="h-4 w-4" />
          View Corrections
        </Button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {loading ? (
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
                <TableHead className="text-right">RealTime Balance</TableHead>
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
                  <TableRow key={balance.id}>
                    <TableCell>{formatDate(balance.date)}</TableCell>
                    <TableCell className="font-medium">{balance.mtoName}</TableCell>
                    <TableCell className="text-right">{formatCurrency(balance.realTimeBalance)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(balance.balanceJ1)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(balance.compensationsJ1)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(balance.transactionsJ1)}</TableCell>
                    <TableCell className="text-center">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleEdit(balance.id)}
                        className="h-8 w-8 p-0"
                      >
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
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
