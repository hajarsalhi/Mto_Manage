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
import { extractIconType, mapIconToNotificationType } from '../utils/notificationUtils.ts';
import { BalanceForDashBoardRequest, getBalanceForDashboard } from '../services/balance.service.ts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs.tsx';

interface Notification {
  id: number;
  type: 'info' | 'warning' | 'error' | 'success';
  title: string;
  message: string;
  date: string;
  read: boolean;
  source: string;
}

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filteredNotifications, setFilteredNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('all');
  const [mtoBalances, setMtoBalances] = useState<BalanceForDashBoardRequest[]>([]);
  const [loadingBalances, setLoadingBalances] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeTab, setActiveTab] = useState('all');



  // Fetch notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const response = await getSystemMessages();
        setNotifications(response);
        setFilteredNotifications(response);
        setError(null);
      } catch (err) {
        console.error('Error fetching notifications:', err);
        setError('Failed to load notifications. Please try again later.');
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
        const response = await getBalanceForDashboard();
        setMtoBalances(response);
      } catch (err) {
        console.error('Error fetching MTO balances:', err);
      } finally {
        setLoadingBalances(false);
      }
    };

    fetchMTOBalances();
  }, []);

  useEffect(() => {
    let filtered = [...notifications]; // Create a copy of notifications

    // First apply the filter
    if (filter === 'all') {
      // No filtering needed
    } else {
      filtered = filtered.filter(notification => notification.type === filter);
    }

    // Then sort by date (latest first)
    filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    setFilteredNotifications(filtered);
  }, [filter, notifications]);

  const handleRefresh = async () => {
    setLoading(true);
    setLoadingBalances(true);
    try {
      // Replace with your actual API endpoint
      const response = await getSystemMessages();
      setNotifications(response);
      setError(null);
      
      // Also refresh balances
      const balancesResponse = await getBalanceForDashboard();
      setMtoBalances(balancesResponse);
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

  const getNotificationIcon = (type: string, message: string) => {
    // Extract icon type from message if available
    const extractedIconType = extractIconType(message);
    const mappedType = mapIconToNotificationType(extractedIconType);
    
    // Use the mapped type if available, otherwise fall back to the provided type
    const finalType = mappedType || type;
    
    switch (finalType) {
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
  const filteredMTOs = mtoBalances.filter(mto => mto.realTimeBalance != null).filter(mto => 
    mto.productName.toLowerCase().includes(searchQuery.toLowerCase())
  );


  

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
              <div className="container mx-auto py-6">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-2 bg-gray-100 p-1 rounded-lg">
                    <TabsTrigger 
                      value="compensations" 
                      className="data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm"
                    >
                      Compensations reports
                    </TabsTrigger>
                    <TabsTrigger 
                      value="transactions"
                      className="data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm"
                    >
                      Transactions reports
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="active">
                  </TabsContent>
                  
                  <TabsContent value="inactive">
                  </TabsContent>
                </Tabs>
              </div>
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
              {/* Add New MTO button */}
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
                {filteredMTOs.filter(mto => mto.realTimeBalance !== null).map((mto) => (
                    <MtoCard
                      key={mto.productId}
                      id={mto.productId}
                      name={mto.productName}
                      balance={mto.realTimeBalance}
                      prevBalance={mto.balanceJ_1}
                      status={mto.status}
                      riskThreshold={mto.riskValue}
                      onViewMto={(id) => setSelectedMto({ id: mto.productId, name: mto.productName })}
                      onEditBalance={(id) => navigate(`/balance/edit/${id}`)}
                    />
                  ))}
                     
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
                  const time = formatTimestamp(notification.date);
                  
                  return (
                    <div 
                      key={notification.id} 
                      className={`p-4 hover:bg-gray-50 transition-colors ${!notification.read ? 'bg-blue-50' : ''}`}
                      onClick={() => !notification.read && markAsRead(notification.id)}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-1">
                          {getNotificationIcon(notification.type, notification.message)}
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
