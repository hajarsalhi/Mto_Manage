import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button.tsx';
import { ArrowLeft, Save } from 'lucide-react';
import axios from 'axios';
import { getRateReference, updateRateReference } from '../../services/RateReference.service.ts';

interface RateData {
  id: number;
  devise: string;
  coursVirement	: number;
}

const UpdateRate: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  
  // Form state
  const [currency, setCurrency] = useState<"USD" | "EUR">("EUR");
  const [rate, setRate] = useState<string>('');
  const [currentRates, setCurrentRates] = useState<RateData[]>([]);

  useEffect(() => {
    const fetchCurrentRates = async () => {
      try {
        setLoading(true);
        const response = await getRateReference();
        setCurrentRates(response);
        setError(null);
      } catch (err) {
        console.error('Error fetching current rates:', err);
        setError('Failed to load current rates. Please try again later.');
        
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentRates();
  }, []);

  useEffect(() => {
    // Set the initial rate value based on the selected currency
    const selectedRate = currentRates.find(r => r.devise === currency);
    if (selectedRate) {
      setRate(selectedRate.coursVirement.toString());
    }
  }, [currency, currentRates]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!rate) return;
    
    try {
      setSaving(true);
      setError(null);
      setSuccess(false);
      
      
      // Replace with your actual API endpoint
      await updateRateReference(currency,parseFloat(rate));
      
      setSuccess(true);
      
      // Clear form after successful submission
      setTimeout(() => {
        navigate('/reference-rate');
      }, 2000);
      
    } catch (err) {
      console.error('Error updating rate:', err);
      setError('Failed to update rate. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('fr-MA', {
      style: 'decimal',
      minimumFractionDigits: 4,
      maximumFractionDigits: 4
    }).format(value);
  };

  if (loading) {
    return (
      <div className="container mx-auto py-6 max-w-md">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 max-w-md">
      <Button 
        variant="ghost" 
        onClick={() => navigate('/reference-rate')}
        className="mb-6 flex items-center gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Reference Rates
      </Button>
      
      <div className="bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-6">Update Exchange Rate</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}
        
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
            Rate updated successfully! Redirecting...
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Devise
            </label>
            <select
              className="w-full p-2 border border-gray-300 rounded-md"
              value={currency}
              onChange={(e) => setCurrency(e.target.value as 'USD' | 'EUR')}
              required
            >
              <option value="EUR">EUR</option>
              <option value="USD">USD</option>
            </select>
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cours Virement
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.0001"
                min="0"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={rate}
                onChange={(e) => setRate(e.target.value)}
                required
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Current value: {
                formatCurrency(
                  currentRates.find(r => r.devise === currency)?.fcoursVirement || 0
                )
              }
            </p>
          </div>
          
          <div className="mt-8">
            <Button 
              type="submit" 
              className="w-full flex items-center justify-center gap-2"
              disabled={saving}
            >
              {saving ? (
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              Update Rate
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateRate;

