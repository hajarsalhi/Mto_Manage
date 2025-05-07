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
import { Edit, Plus, Search, CheckCircle, XCircle } from 'lucide-react';
import axios from 'axios';
import { getProductCommissions, getProducts } from '../../services/product.service.ts';

interface GetCommission{
  productId: number;
  productName: string;
  tauxCommission : number;
  isActive: number;
}

const GetProducts: React.FC = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<any[]>([]);
  const [commission, setCommission] = useState<GetCommission[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        // Replace with your actual API endpoint
        const response = await getProductCommissions();
        setCommission(response);
        setFilteredProducts(response);
        setError(null);
      } catch (err) {
        console.error('Error fetching products data:', err);
        setError('Failed to load products data. Please try again later.');
        
        // Mock data for development
        const mockData = [
          {
            id: 1,
            name: 'Western Union',
            commissionRate: 1.5,
            active: true
          },
          {
            id: 2,
            name: 'MoneyGram',
            commissionRate: 1.75,
            active: true
          },
          {
            id: 3,
            name: 'Ria',
            commissionRate: 1.25,
            active: false
          },
          {
            id: 4,
            name: 'UAE Exchange',
            commissionRate: 1.6,
            active: true
          },
          {
            id: 5,
            name: 'Xpress Money',
            commissionRate: 1.4,
            active: false
          }
        ];
        
        setProducts(mockData);
        setFilteredProducts(mockData);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  }, [searchTerm, products]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // The filtering is already handled by the useEffect
  };

  const handleAddProduct = () => {
    navigate('/products/add');
  };

  const handleEditProduct = (id: number) => {
    navigate(`/products/edit/${id}`);
  };

  const handleToggleActive = async (id: number, currentActive: boolean) => {
    try {
      setLoading(true);
      
      // Replace with your actual API endpoint
      await axios.patch(`/api/products/${id}`, {
        active: !currentActive
      });
      
      // Update local state
      setProducts(prevProducts => 
        prevProducts.map(product => 
          product.id === id ? { ...product, active: !currentActive } : product
        )
      );
    } catch (err) {
      console.error('Error updating product status:', err);
      setError('Failed to update product status. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatCommissionRate = (rate: number) => {
    return `${rate?.toFixed(2)}%`;
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">MTO Management</h1>
        <Button 
          onClick={handleAddProduct}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add New MTO
        </Button>
      </div>

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
              placeholder="Search by MTO name..."
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
      ) : filteredProducts.length === 0 ? (
        <div className="bg-white shadow-md rounded-lg p-6 text-center">
          <p className="text-gray-500">
            {searchTerm ? 'No MTOs found matching your search' : 'No MTOs available'}
          </p>
          <Button 
            onClick={handleAddProduct}
            className="mt-4 flex items-center gap-2 mx-auto"
          >
            <Plus className="h-4 w-4" />
            Add New MTO
          </Button>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>MTO's Name</TableHead>
                <TableHead className="text-right">Commission Rate</TableHead>
                <TableHead className="text-center">Actif</TableHead>
                <TableHead className="w-24 text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.isArray(commission) && commission.map((product) => (
                <TableRow key={product.productId}>
                  <TableCell className="font-medium">{product.productName}</TableCell>
                  <TableCell className="text-right">{formatCommissionRate(product.tauxCommission)}</TableCell>
                  <TableCell className="text-center">
                    <div className="flex justify-center">
                      {product.isActive? (
                        <div className="flex items-center text-green-600">
                          <CheckCircle className="h-5 w-5 mr-1" />
                        </div>
                      ) : (
                        <div className="flex items-center text-red-600">
                          <XCircle className="h-5 w-5 mr-1" />
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleEditProduct(product.productId)}
                      className="h-8 w-8 p-0"
                    >
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default GetProducts;