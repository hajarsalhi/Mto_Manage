import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from '../../components/ui/button.tsx';
import { ArrowLeft, Save } from 'lucide-react';
import { getBalanceByProductId } from '../../services/balance.service.ts';

interface BalanceData {
  id: number;
  mtoName: string;
  currentBalance: number;
}

const EditBalance: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [balanceData, setBalanceData] = useState<BalanceData | null>(null);
  
  // Form state
  const [correctionAmount, setCorrectionAmount] = useState<string>('');
  const [newBalance, setNewBalance] = useState<string>('');
  const [reason, setReason] = useState<string>('');

  useEffect(() => {
    const fetchBalanceData = async () => {
      try {
        setLoading(true);
        if (id) {
          // Replace with your actual API endpoint
          const response = await getProductbalance(id);
          console.log('Fetched balance data:', response);
          setBalanceData(response);
          setError(null);
        } else {
          throw new Error('ID is undefined');
        }
      } catch (err) {
        console.error('Error fetching balance data:', err);
        setError('Failed to load balance data. Please try again later.');
        
        // Mock data for development
        setBalanceData({
          id: parseInt(id || '0'),
          mtoName: 'Western Union',
          currentBalance: 125000.50
        });
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchBalanceData();
    }
  }, [id]);

  // Calculate new balance when correction amount changes
  useEffect(() => {
    if (balanceData && correctionAmount) {
      const currentBalance = balanceData.currentBalance;
      const correction = parseFloat(correctionAmount);
      if (!isNaN(correction)) {
        setNewBalance((currentBalance + correction).toFixed(2));
      }
    }
  }, [correctionAmount, balanceData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!balanceData) return;
    
    try {
      setLoading(true);
      // Replace with your actual API endpoint
      await axios.post('/api/balance/correction', {
        balanceId: balanceData.id,
        correctionAmount: parseFloat(correctionAmount),
        newBalance: parseFloat(newBalance),
        reason
      });
      
      // Navigate back to balance page after successful save
      navigate('/balance');
    } catch (err) {
      console.error('Error saving correction:', err);
      setError('Failed to save correction. Please try again.');
      // In a real app, you would handle the error appropriately
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-MA', {
      style: 'currency',
      currency: 'MAD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  if (loading && !balanceData) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error && !balanceData) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        {error}
        <Button 
          variant="outline" 
          onClick={() => navigate('/balance')}
          className="mt-4"
        >
          Back to Balance
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 max-w-2xl">
      <Button 
        variant="ghost" 
        onClick={() => navigate('/balance')}
        className="mb-6 flex items-center gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Balance
      </Button>
      
      <div className="bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-6">Correct Balance</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  MTO's Name
                </label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded-md bg-gray-100"
                  value={balanceData?.mtoName || ''}
                  disabled
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Current Balance
                </label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded-md bg-gray-100"
                  value={balanceData ? formatCurrency(balanceData.currentBalance) : ''}
                  disabled
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Montant de la correction en devise
              </label>
              <input
                type="number"
                step="0.01"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={correctionAmount}
                onChange={(e) => setCorrectionAmount(e.target.value)}
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Enter a positive value to increase the balance, negative to decrease
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                New Balance
              </label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-md bg-gray-100"
                value={newBalance ? formatCurrency(parseFloat(newBalance)) : ''}
                disabled
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Motif
              </label>
              <textarea
                className="w-full p-2 border border-gray-300 rounded-md"
                rows={3}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                required
              />
            </div>
          </div>
          
          <div className="mt-6">
            <Button 
              type="submit" 
              className="w-full flex items-center justify-center gap-2"
              disabled={loading}
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
              ) : (
                <Save className="h-4 w-4" />
              )}
              Save Correction
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditBalance;
