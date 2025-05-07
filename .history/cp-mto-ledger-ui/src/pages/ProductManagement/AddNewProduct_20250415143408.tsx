import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button.tsx';
import { ArrowLeft, Save } from 'lucide-react';
import axios from 'axios';
import { getNewProducts } from '../../services/product.service.ts';

interface ProductData {
  id: number;
  name: string;
}

const AddNewProduct: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [products, setProducts] = useState<ProductData |any>(); // Initialize as an empty array
  
  // Form state
  const [productId, setProductId] = useState<string>('');
  const [commissionRate, setCommissionRate] = useState<string>('');
  const [active, setActive] = useState<boolean>(true);
  const [currency, setCurrency] = useState<'USD' | 'EUR'>('EUR');
  const [discount, setDiscount] = useState<string>('');
  const [notificationMethod, setNotificationMethod] = useState<'Email' | 'SFTP'>('Email');
  const [notificationTime, setNotificationTime] = useState<string>('');
  const [fxEmails, setFxEmails] = useState<string>('');
  const [sendReport, setSendReport] = useState<boolean>(false);
  const [reconciliationEmails, setReconciliationEmails] = useState<string>('');


  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = getNewProducts();
        setProducts(response);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!productId || !commissionRate) {
      setError('Please fill in all required fields.');
      return;
    }
    
    try {
      setSaving(true);
      setError(null);
      setSuccess(false);
      
      // Replace with your actual API endpoint
      await axios.post('/api/products/commission', {
        productId: parseInt(productId),
        commissionRate: parseFloat(commissionRate)
      });
      
      setSuccess(true);
      
      // Clear form after successful submission
      setTimeout(() => {
        navigate('/products');
      }, 2000);
      
    } catch (err) {
      console.error('Error adding product commission:', err);
      setError('Failed to add product commission. Please try again.');
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
    <div className="container mx-auto py-6 max-w-3xl">
      <Button 
        variant="ghost" 
        onClick={() => navigate('/products')}
        className="mb-6 flex items-center gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to MTOs
      </Button>
      
      <div className="bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-6">Add New MTO</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}
        
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
            Product commission added successfully! Redirecting...
          </div>
        )}
        
        {products?.length === 0 ? (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-6">
            All products already have commission rates assigned.
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                MTO
              </label>
              <select
                className="w-full p-2 border border-gray-300 rounded-md"
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
                required
              >
                <option value="">Select an MTO</option>
                {Array.isArray(products) && products?.map(product => (
                  <option key={product.id} value={product.id}>
                    {product.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Commission Rate
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  className="w-full p-2 border border-gray-300 rounded-md pr-8"
                  value={commissionRate}
                  onChange={(e) => setCommissionRate(e.target.value)}
                  required
                  placeholder="Enter commission rate"
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">%</span>
              </div>
            </div>
            <div className="md:col-span-2 mt-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="activeStatus"
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-2"
                  checked={active}
                  onChange={(e) => setActive(e.target.checked)}
                />
                <label htmlFor="activeStatus" className="text-sm font-medium text-gray-700">
                  MTO Actif
                </label>
                <span className="ml-2 text-sm text-gray-500">
                  ({active ? '1' : '0'})
                </span>
              </div>
            </div>

            {/* FX Rate Params Section */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4 pb-2 border-b">FX Rate Params</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Décote
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    className="w-full p-2 border border-gray-300 rounded-md pr-8"
                    value={discount}
                    onChange={(e) => setDiscount(e.target.value)}
                    
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">%</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Méthode d'envoi notification
                </label>
                <select
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={notificationMethod}
                  onChange={(e) => setNotificationMethod(e.target.value as 'Email' | 'SFTP')}
                  
                >
                  <option value="Email">Email</option>
                  <option value="SFTP">SFTP</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Heure d'envoi
                </label>
                <input
                  type="time"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={notificationTime}
                  onChange={(e) => setNotificationTime(e.target.value)}
                  
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Emails destinataires FX
                </label>
                <textarea
                  className="w-full p-2 border border-gray-300 rounded-md"
                  rows={2}
                  placeholder="Enter email addresses separated by commas"
                  value={fxEmails}
                  onChange={(e) => setFxEmails(e.target.value)}
                  
                />
                <p className="text-xs text-gray-500 mt-1">
                  Enter multiple email addresses separated by commas
                </p>
              </div>
            </div>
          </div>
          
          {/* Reconciliation Reports Section */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4 pb-2 border-b">Reconciliation Reports</h2>
            <div className="mb-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="sendReport"
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-2"
                  checked={sendReport}
                  onChange={(e) => setSendReport(e.target.checked)}
                />
                <label htmlFor="sendReport" className="text-sm font-medium text-gray-700">
                  Send reconciliation report
                </label>
              </div>
            </div>
            <div className={sendReport ? 'block' : 'hidden'}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Emails destinataires
              </label>
              <textarea
                className="w-full p-2 border border-gray-300 rounded-md"
                rows={2}
                placeholder="Enter email addresses separated by commas"
                value={reconciliationEmails}
                onChange={(e) => setReconciliationEmails(e.target.value)}
                required={sendReport}
              />
              <p className="text-xs text-gray-500 mt-1">
                Enter multiple email addresses separated by commas
              </p>
            </div>
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
                Create
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AddNewProduct;
