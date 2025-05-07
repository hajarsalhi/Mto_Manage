import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Bell, 
  AlertTriangle, 
  Info, 
  CheckCircle, 
  Clock, 
  RefreshCw,
  Filter,
  Plus,
  TrendingUp,
  DollarSign,
  ArrowRight,
  Search,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Button } from '../components/ui/button.tsx';
import axios from 'axios';
import { format, formatDistanceToNow } from 'date-fns';
import { MtoDetails } from '../components/Dashboard/MtoDetail.tsx';
import { 
  Card,
  CardHeader, 
  CardContent, 
  CardFooter
} from '../components/ui/card.tsx';
import { MtoCard } from '../components/Dashboard/MtoCard.tsx';
import { getSystemMessages } from '../services/systemMessages.service.ts';

interface Notification {
  id: number;
  type: 'info' | 'warning' | 'error' | 'success';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  source: string;
}

interface MTOBalance {
  id: number;
  name: string;
  balance: number;
  currency: string;
  trend: 'up' | 'down' | 'stable';
  percentChange: number;
  lastUpdated: string;
}

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filteredNotifications, setFilteredNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('all');
  const [mtoBalances, setMtoBalances] = useState<any[]>([]);
  const [loadingBalances, setLoadingBalances] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const cardsPerPage = 8;
  const [selectedMto, setSelectedMto] = useState<{ id: string; name: string } | null>(null);
  const [riskThreshold, setRiskThreshold] = useState(10000);


  // Fetch notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        // Replace with your actual API endpoint
        const response = await getSystemMessages();
        setNotifications(response.data);
        setFilteredNotifications(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching notifications:', err);
        setError('Failed to load notifications. Please try again later.');
        
        // Mock data for development
        const mockData = [
          {
            id: 1,
            type: 'warning',
            title: 'Balance Alert',
            message: 'Western Union balance is below threshold (25,000 MAD)',
            timestamp: new Date(Date.now() - 30 * 60000).toISOString(), // 30 minutes ago
            read: false,
            source: 'System'
          },
          {
            id: 2,
            type: 'error',
            title: 'Failed Transaction',
            message: 'Transaction #WU78945 failed to process. Manual intervention required.',
            timestamp: new Date(Date.now() - 2 * 3600000).toISOString(), // 2 hours ago
            read: false,
            source: 'Transactions'
          },
          {
            id: 3,
            type: 'info',
            title: 'Rate Update',
            message: 'FX rates have been updated for EUR/MAD: 10.85',
            timestamp: new Date(Date.now() - 5 * 3600000).toISOString(), // 5 hours ago
            read: true,
            source: 'FX Rates'
          },
          {
            id: 4,
            type: 'success',
            title: 'Compensation Completed',
            message: 'Daily compensation for MoneyGram completed successfully',
            timestamp: new Date(Date.now() - 8 * 3600000).toISOString(), // 8 hours ago
            read: true,
            source: 'Compensations'
          },
          {
            id: 5,
            type: 'warning',
            title: 'Risk Value Alert',
            message: 'Ria risk value has increased by 15% in the last 24 hours',
            timestamp: new Date(Date.now() - 12 * 3600000).toISOString(), // 12 hours ago
            read: false,
            source: 'Risk Management'
          },
          {
            id: 6,
            type: 'info',
            title: 'System Maintenance',
            message: 'Scheduled system maintenance tonight at 02:00 AM. System will be unavailable for approximately 30 minutes.',
            timestamp: new Date(Date.now() - 24 * 3600000).toISOString(), // 24 hours ago
            read: true,
            source: 'System'
          }
        ] as Notification[];
        
        setNotifications(mockData);
        setFilteredNotifications(mockData);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  // Fetch MTO balances
  useEffect(() => {
    const fetchMTOBalances = async () => {
      try {
        setLoadingBalances(true);
        // Replace with your actual API endpoint
        const response = await axios.get('/api/products/balances');
        setMtoBalances(response.data);
      } catch (err) {
        console.error('Error fetching MTO balances:', err);
        
        // Mock data for development
        const mockBalances = [
          { id: "1", name: "Global Transfer Inc.", balance: 28750.65, prevBalance: 25200.00, lastTransaction: "2 hours ago", status: "active" as const },
          { id: "2", name: "FastPay Solutions", balance: 14320.42, prevBalance: 15100.50, lastTransaction: "1 day ago", status: "active" as const },
          { id: "3", name: "MoneyLink International", balance: 9650.80, prevBalance: 8750.25, lastTransaction: "3 days ago", status: "active" as const },
          { id: "4", name: "Rapid Remit Co.", balance: 6325.35, prevBalance: 5400.00, lastTransaction: "1 week ago", status: "pending" as const },
          { id: "5", name: "Secure Transfer LLC", balance: 11450.60, prevBalance: 11450.60, lastTransaction: "2 weeks ago", status: "inactive" as const },
          { id: "6", name: "Union Exchange", balance: 18760.90, prevBalance: 17500.00, lastTransaction: "5 days ago", status: "active" as const },

          
        ];
        
        setMtoBalances(mockBalances);
      } finally {
        setLoadingBalances(false);
      }
    };

    fetchMTOBalances();
  }, []);

  useEffect(() => {
    if (filter === 'all') {
      setFilteredNotifications(notifications);
    } else if (filter === 'unread') {
      setFilteredNotifications(notifications.filter(notification => !notification.read));
    } else {
      setFilteredNotifications(notifications.filter(notification => notification.type === filter));
    }
  }, [filter, notifications]);

  const handleRefresh = async () => {
    setLoading(true);
    setLoadingBalances(true);
    try {
      // Replace with your actual API endpoint
      const response = await axios.get('/api/notifications');
      setNotifications(response.data);
      setError(null);
      
      // Also refresh balances
      const balancesResponse = await axios.get('/api/products/balances');
      setMtoBalances(balancesResponse.data);
    } catch (err) {
      console.error('Error refreshing data:', err);
      setError('Failed to refresh data. Please try again later.');
      // Keep existing data
    } finally {
      setLoading(false);
      setLoadingBalances(false);
    }
  };
  
  const handleAddProduct = () => {
    navigate('/products/add');
  };

  const markAsRead = async (id: number) => {
    try {
      // Replace with your actual API endpoint
      await axios.put(`/api/notifications/${id}/read`);
      
      // Update local state
      setNotifications(prevNotifications => 
        prevNotifications.map(notification => 
          notification.id === id ? { ...notification, read: true } : notification
        )
      );
    } catch (err) {
      console.error('Error marking notification as read:', err);
      // Handle error appropriately
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'info':
        return <Info className="h-5 w-5 text-blue-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      case 'error':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return {
      relative: formatDistanceToNow(date, { addSuffix: true }),
      absolute: format(date, 'dd/MM/yyyy HH:mm')
    };
  };


  const handleAddNewMTO = () => {
    // Navigate to add new MTO page
    navigate('/mto/new');
  };

  const handleCloseDetails = () => {
    setSelectedMto(null);
  };

  // Filter MTOs based on search query
  const filteredMTOs = mtoBalances.filter(mto => 
    mto.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate pagination
  const totalPages = Math.ceil(filteredMTOs.length / cardsPerPage);
  const indexOfLastCard = currentPage * cardsPerPage;
  const indexOfFirstCard = indexOfLastCard - cardsPerPage;
  const currentMTOs = filteredMTOs.slice(indexOfFirstCard, indexOfLastCard);

  // Pagination controls
  const goToNextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
  const goToPrevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));
  const goToPage = (pageNumber: number) => setCurrentPage(pageNumber);

  // Reset to page 1 when search query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  // Helper function to render the appropriate empty state
  function renderEmptyState() {
    if (searchQuery) {
      return (
        <>
          <Search className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p className="text-gray-500 mb-4">No MTOs found matching "{searchQuery}"</p>
          <Button onClick={() => setSearchQuery('')}>Clear Search</Button>
        </>
      );
    }
    
    return (
      <>
        <DollarSign className="h-12 w-12 mx-auto mb-4 text-gray-300" />
        <p className="text-gray-500 mb-4">No MTO balances available</p>
        <Button onClick={handleAddNewMTO}>Add Your First MTO</Button>
      </>
    );
  }

  // Helper function to get trend color class
  const getTrendColorClass = (trend: string) => {
    if (trend === 'up') return 'text-green-500';
    if (trend === 'down') return 'text-red-500';
    return 'text-gray-500';
  };

  // Helper function to render trend icon
  const renderTrendIcon = (trend: string) => {
    if (trend === 'up') {
      return <TrendingUp className="h-4 w-4 mr-1" />;
    }
    if (trend === 'down') {
      return <TrendingUp className="h-4 w-4 mr-1 transform rotate-180" />;
    }
    return <TrendingUp className="h-4 w-4 mr-1 text-gray-400" />;
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={handleRefresh}
            disabled={loading || loadingBalances}
            className="flex items-center gap-2"
          >
            {(loading || loadingBalances) ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            Refresh
          </Button>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left side: MTO Balance Cards (2/3 of width) */}
        <div className="lg:col-span-2">
          <div className="mb-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
            <h2 className="text-xl font-semibold">MTO Balances</h2>
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Search input */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search MTO..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
              
              <Button 
                variant="outline"
                onClick={handleAddProduct} 
                className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add New MTO
              </Button>
            </div>
          </div>

          {loadingBalances ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : filteredMTOs.length === 0 ? (
            <div className="bg-white shadow-md rounded-lg p-8 text-center">
              {renderEmptyState()}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentMTOs.map((mto) => (
                    <MtoCard
                      key={mto.id}
                      id={mto.id}
                      name={mto.name}
                      balance={mto.balance}
                      prevBalance={mto.prevBalance}
                      status={mto.status}
                      riskThreshold={riskThreshold}
                      onViewMto={(id) => setSelectedMto({ id, name: mto.name })}
                      onEditBalance={(id) => navigate(`/balance/edit/${id}`)}
                    />
                  ))}
                     
              </div>
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center mt-6 gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={goToPrevPage} 
                    disabled={currentPage === 1}
                    className="flex items-center gap-1 px-2"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Prev
                  </Button>
                  
                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => goToPage(page)}
                        className="w-8 h-8 p-0"
                      >
                        {page}
                      </Button>
                    ))}
                  </div>
                  
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={goToNextPage} 
                    disabled={currentPage === totalPages}
                    className="flex items-center gap-1 px-2"
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
              
              {/* Summary information */}
              <div className="text-sm text-gray-500 text-center mt-2">
                Showing {Math.min(filteredMTOs.length, indexOfFirstCard + 1)}-{Math.min(indexOfLastCard, filteredMTOs.length)} of {filteredMTOs.length} MTOs
              </div>
              <div style={{ backgroundColor: 'white', opacity: 1 }}>
                {selectedMto && (
                  <MtoDetails
                    mtoId={selectedMto.id}
                    mtoName={selectedMto.name}
                    open={Boolean(selectedMto)}
                    onClose={handleCloseDetails}
                  />
                )}
              </div>
            </>
          )}
        </div>

        {/* Right side: Notifications (1/3 of width) */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Notifications</h2>
            <div className="relative">
              <select
                className="appearance-none bg-white border border-gray-300 rounded-md pl-3 pr-8 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="all">All</option>
                <option value="unread">Unread</option>
                <option value="info">Info</option>
                <option value="warning">Warnings</option>
                <option value="error">Errors</option>
                <option value="success">Success</option>
              </select>
              <Filter className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
            </div>
          </div>

          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            {loading && filteredNotifications.length === 0 ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : Array.isArray(filteredNotifications) && filteredNotifications?.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                <Bell className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No notifications to display</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200 max-h-[600px] overflow-y-auto">
                {filteredNotifications?.map((notification) => {
                  const time = formatTimestamp(notification.timestamp);
                  
                  return (
                    <div 
                      key={notification.id} 
                      className={`p-4 hover:bg-gray-50 transition-colors ${!notification.read ? 'bg-blue-50' : ''}`}
                      onClick={() => !notification.read && markAsRead(notification.id)}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-1">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-grow">
                          <div className="flex justify-between items-start">
                            <h3 className="font-medium text-gray-900 text-sm">{notification.title}</h3>
                            <span className="text-xs text-gray-500 whitespace-nowrap">{notification.source}</span>
                          </div>
                          <div 
                            className="text-xs text-gray-600 mt-1"
                            dangerouslySetInnerHTML={{ __html: notification.message }}
                          />
                          <div className="flex items-center text-xs text-gray-500 mt-1" title={time.absolute}>
                            <Clock className="h-3 w-3 mr-1" />
                            {time.relative}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
