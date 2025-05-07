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

interface RiskValueData {
  id: number;
  productId: number;
  dateStart: string;
  dateEnd: string | null;
  riskValue: number;
  createdBy: string | "admin";
  dateCreated: string;
  state: 'active' | 'expired' | 'pending';
  product : {
    id: number;
    productName: string;
  }
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
      case 'Active':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'Expired':
        return <XCircle className="h-5 w-5 text-red-600" />;
      case 'Pending':
        return <History className="h-5 w-5 text-amber-600" />;
      default:
        return null;
    }
  };

  const getStateText = (dateEnd: string | null , dateStart: string) => {
    const currentDate = new Date();
    const dateEndParsed = dateEnd ? new Date(dateEnd) : null;
    const dateStartParsed = new Date(dateStart);
    if (dateEndParsed && dateEndParsed < currentDate) {
    
      return 'Expired';
    }
    else if ( dateEndParsed && dateEndParsed >= currentDate) {
      return 'Active';
    }
    else if(dateStartParsed > currentDate) {
      return 'Pending';
    }
    
  }


  const filteredRiskValues = selectedProduct === 'all'
    ? riskValues
    : riskValues.filter(rv => rv.product?.productName === selectedProduct);

  const activeRiskValues =  Array.isArray(filteredRiskValues) && filteredRiskValues?.filter(rv => getStateText(rv.dateEnd , rv.dateStart )=== 'Active');
  const historyRiskValues = Array.isArray(filteredRiskValues) && filteredRiskValues?.filter(rv => getStateText(rv.dateEnd, rv.dateStart) !== 'Active');

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
                        <TableCell className="font-medium">{riskValue.product?.productName}</TableCell>
                        <TableCell>{formatDate(riskValue.dateStart)}</TableCell>
                        <TableCell>{riskValue.dateEnd ? formatDate(riskValue.dateEnd) : 'N/A'}</TableCell>
                        <TableCell className="text-right">{formatCurrency(riskValue.riskValue)} MAD</TableCell>
                        <TableCell>{riskValue.createdBy}</TableCell>
                        <TableCell>{formatDateTime(riskValue.dateCreated)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            {getStateIcon(getStateText(riskValue.dateEnd, riskValue.dateStart) || '')}
                            <span>{getStateText(riskValue.dateEnd, riskValue.dateStart)}</span>
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
                        <TableCell className="font-medium">{riskValue.product?.productName}</TableCell>
                        <TableCell>{formatDate(riskValue.dateStart)}</TableCell>
                        <TableCell>{riskValue.dateEnd ? formatDate(riskValue.dateEnd) : 'N/A'}</TableCell>
                        <TableCell className="text-right">{formatCurrency(riskValue.riskValue)} MAD</TableCell>
                        <TableCell>{riskValue.createdBy}</TableCell>
                        <TableCell>{formatDateTime(riskValue.dateCreated)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            {getStateIcon(getStateText(riskValue.dateEnd, riskValue.dateStart) || '')}
                            <span>{getStateText(riskValue.dateEnd,riskValue.dateStart)}</span>
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
