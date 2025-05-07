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
import { format } from 'date-fns';
import { getProducts } from '../../services/product.service.ts';
import { getRiskValues } from '../../services/RiskValue.service.ts';
import { TresoProduct } from '../../model/TresoProduct.tsx';

interface RiskValueData {
  id: number;
  productId: number;
  dateStart: string;
  dateEnd: string | null;
  riskValue: number;
  createdBy: string | "admin";
  dateCreated: string;
  state: 'active' | 'expired' | 'pending';
  productName: string;
}

interface Product {
  productId : number;
  productName : string;
}

const RiskValue: React.FC = () => {
  const navigate = useNavigate();
  const [riskValues, setRiskValues] = useState<RiskValueData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<string>('all');
  const [products, setProducts] = useState<Product[]>([]);
  const location = useLocation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch products for the filter
        const productsResponse = await getProducts();
        setProducts(productsResponse);
        
        // Fetch risk values
        const riskValuesResponse = await getRiskValues();
        
        // Transform the response into an array of RiskValueData
        const transformedRiskValues = Object.entries(riskValuesResponse).map(([key, state]) => {
          // Extract the TresoRiskValue object from the string key
          const match = key.match(/TresoRiskValue\((.*?)\)/);
          if (!match) return null;
          
          const riskValueStr = match[1];
          const riskValueObj: any = {};
          
          // Parse the string into an object
          riskValueStr.split(', ').forEach(pair => {
            const [key, value] = pair.split('=');
            riskValueObj[key] = value === 'null' ? null : value;
          });
          
          return {
            id: parseInt(riskValueObj.id),
            productId: parseInt(riskValueObj.productId),
            dateStart: riskValueObj.dateStart,
            dateEnd: riskValueObj.dateEnd,
            riskValue: parseFloat(riskValueObj.riskValue),
            createdBy: riskValueObj.login || 'admin',
            dateCreated: riskValueObj.dateCreated,
            state: (state as string).toLowerCase() as 'active' | 'expired' | 'pending',
            productName: riskValueObj.productName
          };
        }).filter(Boolean) as RiskValueData[];
        
        setRiskValues(transformedRiskValues);
        setError(null);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    // Get productId from URL
    const params = new URLSearchParams(location.search);
    const idFromUrl = params.get('id');
    if (idFromUrl && products.length > 0) {
      // Find the product name for this id
      const product = products.find(p => String(p.productId) === idFromUrl);
      if (product) {
        setSelectedProduct(product.productName);
      }
    }
  }, [location.search, products]);


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
    switch (state.toLowerCase()) {
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

  const filteredRiskValues = selectedProduct === 'all'
    ? riskValues
    : riskValues.filter(rv => rv.productName === selectedProduct);

  const activeRiskValues =  Array.isArray(filteredRiskValues) && filteredRiskValues?.filter(rv => rv.state === 'active');
  const historyRiskValues = Array.isArray(filteredRiskValues) && filteredRiskValues?.filter(rv => rv.state !== 'active');

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
              {Array.isArray(products) &&  products?.map(product => (
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
            { Array.isArray(activeRiskValues) && activeRiskValues?.length === 0 ? (
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
                    {Array.isArray(activeRiskValues) && activeRiskValues?.map((riskValue) => (
                      <TableRow key={riskValue.id}>
                        <TableCell className="font-medium">{riskValue.productName}</TableCell>
                        <TableCell>{formatDate(riskValue.dateStart)}</TableCell>
                        <TableCell>{riskValue.dateEnd ? formatDate(riskValue.dateEnd) : 'N/A'}</TableCell>
                        <TableCell className="text-right">{formatCurrency(riskValue.riskValue)} MAD</TableCell>
                        <TableCell>{riskValue.createdBy}</TableCell>
                        <TableCell>{formatDateTime(riskValue.dateCreated)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            {getStateIcon(riskValue.state)}
                            <span>{riskValue.state}</span>
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
            {Array.isArray(historyRiskValues) && historyRiskValues?.length === 0 ? (
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
                    {Array.isArray(historyRiskValues) && historyRiskValues?.map((riskValue) => (
                      <TableRow key={riskValue.id}>
                        <TableCell className="font-medium">{riskValue.productName}</TableCell>
                        <TableCell>{formatDate(riskValue.dateStart)}</TableCell>
                        <TableCell>{riskValue.dateEnd ? formatDate(riskValue.dateEnd) : 'N/A'}</TableCell>
                        <TableCell className="text-right">{formatCurrency(riskValue.riskValue)} MAD</TableCell>
                        <TableCell>{riskValue.createdBy}</TableCell>
                        <TableCell>{formatDateTime(riskValue.dateCreated)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            {getStateIcon(riskValue.state)}
                            <span>{riskValue.state}</span>
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
