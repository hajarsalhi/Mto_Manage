import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button.tsx';
import { ArrowLeft, Save } from 'lucide-react';
import axios from 'axios';
import { getProductById } from '../../services/product.service.ts';

interface ProductData {
  productId: number;
  productName: string;
  tauxCommission: number;
  emails: string;
  active: number;
  decote: number;
  devise: 'USD' | 'EUR';
  libDecote: string;
  productMethod: 'Aucune' | 'Email' | 'SFTP';
  email : string;
  sendReconciliationFile: number;
  emailReconciliation: string;
}

const ModifyProduct: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [product, setProduct] = useState<ProductData | null>(null);
  
  // Form state
  const [commissionRate, setCommissionRate] = useState<string>('');
  const [currency, setCurrency] = useState<'USD' | 'EUR'>('EUR');
  const [discount, setDiscount] = useState<string>('');
  const [notificationMethod, setNotificationMethod] = useState<'Aucune'|'Email' | 'SFTP' >('Email');
  const [notificationTime, setNotificationTime] = useState<string>('');
  const [fxEmails, setFxEmails] = useState<string>('');
  const [sendReport, setSendReport] = useState<boolean>(false);
  const [reconciliationEmails, setReconciliationEmails] = useState<string>('');
  const [active, setActive] = useState<boolean>(true);

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setLoading(true);
        // Replace with your actual API endpoint
        const response = await getProductById(parseInt(id || '0'));
        setProduct(response.data);
        
        // Initialize form with product data
        setCommissionRate(response.data.commissionRate.toString());
        setCurrency(response.data.fxRateParams.currency);
        setDiscount(response.data.fxRateParams.discount.toString());
        setNotificationMethod(response.data.fxRateParams.notificationMethod);
        setNotificationTime(response.data.fxRateParams.notificationTime);
        setFxEmails(response.data.fxRateParams.fxEmails);
        setSendReport(response.data.reconciliation.sendReport);
        setReconciliationEmails(response.data.reconciliation.emails);
        setActive(response.data.active);
        
        setError(null);
      } catch (err) {
        console.error('Error fetching product data:', err);
        setError('Failed to load product data. Please try again later.');
        
        // Mock data for development
        const mockData: ProductData = {
          productId: parseInt(id || '0'),
          productName: 'Western Union',
          tauxCommission: 1.5,
          active: 1,
          
          email: 'fx@westernunion.com, treasury@westernunion.com',
          decote: 0.5,
          devise : 'USD',
          libDecote: 'Discount',
          productMethod: 'Aucune',
          sendReconciliationFile: 1,
          emailReconciliation: 'reconciliation@westernunion.com, finance@westernunion.com'
          
        };
        
        setProduct(mockData);
        setCommissionRate(mockData.tauxCommission.toString());
        setCurrency(mockData.devise);
        setDiscount(mockData.decote.toString());
        setNotificationMethod(mockData.productMethod);
        setNotificationTime(mockData.fxRateParams.notificationTime);
        setFxEmails(mockData.email);
        setSendReport(mockData.sendReconciliationFile === 1);
        setReconciliationEmails(mockData.emailReconciliation);
        setActive(mockData.active === 1);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProductData();
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!product) return;
    
    try {
      setSaving(true);
      
      const updatedProduct = {
        ...product,
        commissionRate: parseFloat(commissionRate),
        active,
        fxRateParams: {
          currency,
          discount: parseFloat(discount),
          notificationMethod,
          notificationTime,
          fxEmails
        },
        reconciliation: {
          sendReport,
          emails: reconciliationEmails
        }
      };
      
      // Replace with your actual API endpoint
      await axios.put(`/api/products/${id}`, updatedProduct);
      
      // Navigate back to products list
      navigate('/products');
    } catch (err) {
      console.error('Error updating product:', err);
      setError('Failed to update product. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-6 max-w-3xl">
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
        <h1 className="text-2xl font-bold mb-6">Modify MTO: {product?.name}</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          {/* Commission Rate Section */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4 pb-2 border-b">Commission Rate</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Current Commission
                </label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded-md bg-gray-100"
                  value={`${product?.commissionRate.toFixed(2)}%`}
                  disabled
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  New Commission
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    className="w-full p-2 border border-gray-300 rounded-md pr-8"
                    value={commissionRate}
                    onChange={(e) => setCommissionRate(e.target.value)}
                    required
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">%</span>
                </div>
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
                    required
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
                  required
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
                  required
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
                  required
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
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
              ) : (
                <Save className="h-4 w-4" />
              )}
              Update MTO
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModifyProduct; 