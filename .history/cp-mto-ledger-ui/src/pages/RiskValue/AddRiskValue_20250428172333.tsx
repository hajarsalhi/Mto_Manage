import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button.tsx';
import { ArrowLeft, Save } from 'lucide-react';
import { createRiskValue } from '../../services/RiskValue.service.ts';
import { getProducts } from '../../services/product.service.ts';


const AddRiskValue: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [products, setProducts] = useState<any[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<string>('');
  
  // Form state
  const [MtoId, setMtoId] = useState<string>('');
  const [riskValue, setRiskValue] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const location = useLocation();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        // Replace with your actual API endpoint
        const products =  await getProducts();
        setProducts(products);
        setError(null);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products. Please try again later.');
        
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const idFromUrl = params.get('id');
    if (idFromUrl) {
      setSelectedProduct(idFromUrl);
    }
  }, [location.search]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const idFromUrl = urlParams.get('id');
    if (idFromUrl) {
      setMtoId(idFromUrl);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedProduct || !riskValue || !startDate) {
      setError('Please fill in all required fields.');
      return;
    }
    
    try {
      setSaving(true);
      setError(null);
      setSuccess(false);
      
      const payload = {
        productId: parseInt(selectedProduct),
        riskValue: parseFloat(riskValue),
        validateFrom: startDate,
        validateTo: endDate || null,
    };

      await createRiskValue(payload);
      
      setSuccess(true);
      
      // Clear form after successful submission
      setTimeout(() => {
        navigate('/risk-value');
      }, 2000);
      
    } catch (err) {
      console.error('Error adding risk value:', err);
      setError('Failed to add risk value. Please try again.');
    } finally {
      setSaving(false);
    }
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
        onClick={() => navigate('/risk-value')}
        className="mb-6 flex items-center gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Risk Values
      </Button>
      
      <div className="bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-6">Add New Risk Value</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}
        
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
            Risk value added successfully! Redirecting...
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              MTO
            </label>
            
            <select
              className="w-full p-2 border border-gray-300 rounded-md"
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
              required
            >
            <option value="">Select an MTO</option>
              {products?.map(product => (
                <option key={product.productId} value={product.productId} >
                  {product.productName}
                </option>
              ))}
            </select>
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Risk Value (MAD)
            </label>
            <input
              type="number"
              min="0"
              step="1"
              className="w-full p-2 border border-gray-300 rounded-md"
              value={riskValue}
              onChange={(e) => setRiskValue(e.target.value)}
              required
              placeholder="Enter risk value amount"
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Applicable From
            </label>
            <input
              type="date"
              className="w-full p-2 border border-gray-300 rounded-md"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Applicable To (Optional)
            </label>
            <input
              type="date"
              className="w-full p-2 border border-gray-300 rounded-md"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
            <p className="text-xs text-gray-500 mt-1">
              Leave blank for indefinite validity
            </p>
          </div>
          
          <div className="mt-8">
            <Button 
              type="submit" 
              className="w-full flex items-center justify-center gap-2"
              disabled={saving}
              onClick={handleSubmit}
            >
              {saving ? (
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              Add Risk Value
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddRiskValue;
