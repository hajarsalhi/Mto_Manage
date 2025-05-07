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
import { ArrowLeft, Search } from 'lucide-react';
import axios from 'axios';
import { format } from 'date-fns';
import { CorrectionData } from '../../services/balance.service.ts';



const Corrections: React.FC = () => {
  const navigate = useNavigate();
  const [corrections, setCorrections] = useState<CorrectionData[]>([]);
  const [filteredCorrections, setFilteredCorrections] = useState<CorrectionData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    const fetchCorrections = async () => {
      try {
        setLoading(true);
        // Replace with your actual API endpoint
        const response = await 
        setCorrections(response.data);
        setFilteredCorrections(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching corrections data:', err);
        setError('Failed to load corrections data. Please try again later.');
        
        // Mock data for development
        const mockData = [
          {
            id: 1,
            date: '2023-06-15T10:30:00',
            mtoName: 'Western Union',
            mtoId: 101,
            oldBalance: 120000.75,
            correction: 5000.00,
            motif: 'Adjustment for missing transaction #WU45678'
          },
          {
            id: 2,
            date: '2023-06-14T14:45:00',
            mtoName: 'MoneyGram',
            mtoId: 102,
            oldBalance: 82000.50,
            correction: -1500.25,
            motif: 'Correction for duplicate entry #MG98765'
          },
          {
            id: 3,
            date: '2023-06-13T09:15:00',
            mtoName: 'Ria',
            mtoId: 103,
            oldBalance: 43000.25,
            correction: 2500.50,
            motif: 'Adjustment for system error on 12/06/2023'
          },
          {
            id: 4,
            date: '2023-06-12T16:20:00',
            mtoName: 'Western Union',
            mtoId: 101,
            oldBalance: 118500.00,
            correction: 1500.75,
            motif: 'Manual correction for reconciliation'
          }
        ];
        
        setCorrections(mockData);
        setFilteredCorrections(mockData);
      } finally {
        setLoading(false);
      }
    };

    fetchCorrections();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredCorrections(corrections);
    } else {
      const filtered = corrections.filter(correction => 
        correction.mtoName.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCorrections(filtered);
    }
  }, [searchTerm, corrections]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // The filtering is already handled by the useEffect
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-MA', {
      style: 'currency',
      currency: 'MAD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd/MM/yyyy HH:mm');
  };

  return (
    <div className="container mx-auto py-6">
      <Button 
        variant="ghost" 
        onClick={() => navigate('/balance')}
        className="mb-6 flex items-center gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Balance
      </Button>
      
      <h1 className="text-2xl font-bold mb-6">Balance Corrections History</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <div className="mb-6">
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Search by MTO's name..."
              className="w-full rounded-md border border-gray-300 pl-10 pr-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button type="submit">Search</Button>
        </form>
      </div>
      
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
                <TableHead>MTO's Name</TableHead>
                <TableHead>MTO's ID</TableHead>
                <TableHead className="text-right">Old Balance</TableHead>
                <TableHead className="text-right">Correction</TableHead>
                <TableHead>Motif</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCorrections.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6">
                    {searchTerm ? 'No corrections found for this search' : 'No corrections available'}
                  </TableCell>
                </TableRow>
              ) : (
                filteredCorrections.map((correction) => (
                  <TableRow key={correction.id}>
                    <TableCell>{formatDate(correction.date)}</TableCell>
                    <TableCell className="font-medium">{correction.mtoName}</TableCell>
                    <TableCell>{correction.mtoId}</TableCell>
                    <TableCell className="text-right">{formatCurrency(correction.oldBalance)}</TableCell>
                    <TableCell className={`text-right ${correction.correction >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatCurrency(correction.correction)}
                    </TableCell>
                    <TableCell className="max-w-xs truncate" title={correction.motif}>
                      {correction.motif}
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

export default Corrections;
