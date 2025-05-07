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
import { Edit, Eye, Search } from 'lucide-react';
import axios from 'axios';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { BalanceResponse, getRecentBalances } from '../../services/balance.service.ts';


const BalanceMto: React.FC = () => {
  const [realTimeBalanceData, setRealTimeBalanceData] = useState<BalanceResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const navigate = useNavigate();


  useEffect(() => {
    const fetchBalanceData = async () => {
      try {
        setLoading(true);
        const realTimeBalance = await getRecentBalances();

        setRealTimeBalanceData(realTimeBalance);
        setError(null);
      } catch (err) {
        console.error('Error fetching balance data:', err);
        setError('Failed to load balance data. Please try again later.');
        
         
      } finally {
        setLoading(false);
      }
    };

    fetchBalanceData();
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


  function renderEmptyState() {
    if (searchQuery) {
      return (
        <>
          <Search className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p className="text-gray-500 mb-4">No MTOs found matching "{searchQuery}"</p>
          <Button onClick={() => setSearchQuery('')}>Clear Search</Button>
        </>
      );
    }
  }

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd/MM/yyyy');
  };

  function dayjs(): React.ReactNode {
    throw new Error('Function not implemented.');
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">MTO Balance Management</h1>
        <div className="relative">
            <input
              type="text"
              placeholder="Search MTO..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
            />
            <Search className="absolute left-3 top-1/3 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        </div>
        <Button 
          variant="outline" 
          onClick={handleViewCorrections}
          className="flex items-center gap-2 bg-green-500 text-white hover:bg-green-600"
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
                <TableHead className="text-right font-bold">RealTime Balance</TableHead>
                <TableHead className="text-right">Balance J-1</TableHead>
                <TableHead className="text-right">Compensations J-1</TableHead>
                <TableHead className="text-right">Transactions J-1</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {realTimeBalanceData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-6">
                    No balance data available
                  </TableCell>
                </TableRow>
              ) : (
                realTimeBalanceData.map((balance) =>(
                  <TableRow key={balance.productId}>
                    
                    <TableCell>{formatDate(balance.dateUpdate)}</TableCell>
                    <TableCell className="font-medium">{balance.productName}</TableCell>
                    <TableCell className="text-right font-bold text-blue-700 text-lg">
                      {formatCurrency(balance.balance)}
                    </TableCell>
                    <TableCell className="text-right">{formatCurrency(balance.balanceJ_1)}</TableCell>
                    <TableCell className="text-right text-green-600 font-medium">
                      {formatCurrency(balance.compensationJ_1)}
                    </TableCell>
                    <TableCell className="text-right text-red-600 font-medium">
                      {formatCurrency(balance.transactionJ_1)}
                    </TableCell>
                    <TableCell className="text-center">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleEdit(balance.productId)}
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
