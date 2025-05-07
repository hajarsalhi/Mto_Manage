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
import { Plus, Search, CheckCircle, XCircle, History } from 'lucide-react';
import axios from 'axios';
import { format } from 'date-fns';
import { getProducts } from '../../services/product.service.ts';
import { getRiskValues } from '../../services/RiskValue.service.ts';

interface RiskValueData {
  id: number;
  productId: number;
  dateStart: string;
  dateEnd: string | null;
  riskValue: number;
  createdBy: string | "admin";
  dateCreated: string;
  state: 'active' | 'expired' ;
}

const RiskValue: React.FC = () => {
  const navigate = useNavigate();
  const [riskValues, setRiskValues] = useState<RiskValueData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<string>('all');
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch products for the filter
        const productsResponse = await getProducts();
        setProducts(productsResponse);
        
        // Fetch risk values
        const riskValuesResponse = await getRiskValues();
        setRiskValues(riskValuesResponse);
        
        setError(null);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data. Please try again later.');
        
        // Mock data for development
        const mockProducts = [
          { id: 1, name: 'Western Union' },
          { id: 2, name: 'MoneyGram' },
          { id: 3, name: 'Ria' },
          { id: 4, name: 'UAE Exchange' }
        ];
        
        const mockRiskValues = [
          {
            id: 1,
            productId: 1,
            productName: 'Western Union',
            startDate: '2023-01-01',
            endDate: null,
            riskValue: 5000000,
            createdBy: 'admin',
            creationDate: '2022-12-15T10:30:00',
            state: 'active'
          },
          {
            id: 2,
            productId: 2,
            productName: 'MoneyGram',
            startDate: '2023-01-01',
            endDate: null,
            riskValue: 3000000,
            createdBy: 'admin',
            creationDate: '2022-12-15T11:15:00',
            state: 'active'
          },
          {
            id: 3,
            productId: 3,
            productName: 'Ria',
            startDate: '2023-01-01',
            endDate: null,
            riskValue: 2000000,
            createdBy: 'admin',
            creationDate: '2022-12-15T14:20:00',
            state: 'active'
          },
          {
            id: 4,
            productId: 1,
            productName: 'Western Union',
            startDate: '2022-01-01',
            endDate: '2022-12-31',
            riskValue: 4500000,
            createdBy: 'admin',
            creationDate: '2021-12-15T09:45:00',
            state: 'expired'
          },
          {
            id: 5,
            productId: 2,
            productName: 'MoneyGram',
            startDate: '2022-01-01',
            endDate: '2022-12-31',
            riskValue: 2800000,
            createdBy: 'admin',
            creationDate: '2021-12-15T10:30:00',
            state: 'expired'
          }
        ];
        
        //setProducts(mockProducts);
        setRiskValues(mockRiskValues as RiskValueData[]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAddRiskValue = () => {
    navigate('/risk-value/add');
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd/MM/yyyy');
  };

  const formatDateTime = (dateTimeString: string) => {
    return format(new Date(dateTimeString), 'dd/MM/yyyy HH:mm');
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('fr-MA', {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const getStateIcon = (state: string) => {
    switch (state) {
      case 'active':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'expired':
        return <XCircle className="h-5 w-5 text-red-600" />;
      case 'pending':
        return <History className="h-5 w-5 text-amber-600" />;
      default:
        return null;
    }
  };

  const getStateText = (state: string) => {
    switch (state) {
      case 'active':
        return 'Active';
      case 'expired':
        return 'Expired';
      case 'pending':
        return 'Pending';
      default:
        return state;
    }
  };

  const filteredRiskValues = selectedProduct === 'all'
    ? riskValues
    : riskValues.filter(rv => rv.productName === selectedProduct);

  const activeRiskValues = filteredRiskValues?.filter(rv => rv.state === 'active');
  const historyRiskValues = filteredRiskValues?.filter(rv => rv.state !== 'active');

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Risk Value Management</h1>
        <Button 
          onClick={handleAddRiskValue}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add New Risk Value
        </Button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}
      
      <div className="mb-6">
        <div className="flex items-center gap-4">
          <div className="relative flex-grow max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <select
              className="w-full rounded-md border border-gray-300 pl-10 pr-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
            >
              <option value="all">All Products</option>
              {products?.map(product => (
                <option key={product.productId} value={product.productName}>
                  {product.productName}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Active Risk Values</h2>
            {activeRiskValues?.length === 0 ? (
              <div className="bg-white shadow-md rounded-lg p-6 text-center">
                <p className="text-gray-500">No active risk values found</p>
              </div>
            ) : (
              <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>MTO</TableHead>
                      <TableHead>Date Start</TableHead>
                      <TableHead>Date End</TableHead>
                      <TableHead className="text-right">Risk Value</TableHead>
                      <TableHead>Created By</TableHead>
                      <TableHead>Date Creation</TableHead>
                      <TableHead>State</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {activeRiskValues?.map((riskValue) => (
                      <TableRow key={riskValue.id}>
                        <TableCell className="font-medium">{riskValue.productName}</TableCell>
                        <TableCell>{formatDate(riskValue.startDate)}</TableCell>
                        <TableCell>{riskValue.endDate ? formatDate(riskValue.endDate) : 'N/A'}</TableCell>
                        <TableCell className="text-right">{formatCurrency(riskValue.riskValue)} MAD</TableCell>
                        <TableCell>{riskValue.createdBy}</TableCell>
                        <TableCell>{formatDateTime(riskValue.creationDate)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            {getStateIcon(riskValue.state)}
                            <span>{getStateText(riskValue.state)}</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-4">Historique</h2>
            {historyRiskValues?.length === 0 ? (
              <div className="bg-white shadow-md rounded-lg p-6 text-center">
                <p className="text-gray-500">No historical risk values found</p>
              </div>
            ) : (
              <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>MTO</TableHead>
                      <TableHead>Date Start</TableHead>
                      <TableHead>Date End</TableHead>
                      <TableHead className="text-right">Risk Value</TableHead>
                      <TableHead>Created By</TableHead>
                      <TableHead>Date Creation</TableHead>
                      <TableHead>State</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {historyRiskValues?.map((riskValue) => (
                      <TableRow key={riskValue.id}>
                        <TableCell className="font-medium">{riskValue.productName}</TableCell>
                        <TableCell>{riskValue.startDate}</TableCell>
                        <TableCell>{riskValue.endDate ? riskValue.endDate : 'N/A'}</TableCell>
                        <TableCell className="text-right">{formatCurrency(riskValue.riskValue)} MAD</TableCell>
                        <TableCell>{riskValue.createdBy}</TableCell>
                        <TableCell>{riskValue.creationDate}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            {getStateIcon(riskValue.state)}
                            <span>{getStateText(riskValue.state)}</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default RiskValue;
