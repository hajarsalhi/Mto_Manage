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
import { ArrowLeft, Search, Download, Mail, FileText } from 'lucide-react';
import { format } from 'date-fns';
import { FxRateNotification, getFxRateNotifications } from '../../services/FxRateNotification.service.ts';



const GetAllNotifications: React.FC = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<FxRateNotification[]>([]);
  const [filteredNotifications, setFilteredNotifications] = useState<FxRateNotification[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        // Replace with your actual API endpoint
        const response = await getFxRateNotifications();
        setNotifications(response);
        setFilteredNotifications(response);
        setError(null);
      } catch (err) {
        console.error('Error fetching notifications history:', err);
        setError('Failed to load notifications history. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  useEffect(() => {
    // Filter notifications based on search term and selected filters
    const filtered = notifications.filter(notification => {
      const matchesSearch = 
        notification.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        notification.recipients.some(r => r.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesType = selectedType === 'all' || notification.type === selectedType;
      const matchesStatus = selectedStatus === 'all' || matchStatus(notification.status) === selectedStatus;
      
      return matchesSearch && matchesType && matchesStatus;
    });
    
    setFilteredNotifications(filtered);
  }, [searchTerm, selectedType, selectedStatus, notifications]);

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd/MM/yyyy HH:mm');
  };

  const formatCurrency = (rate: number) => {
    return new Intl.NumberFormat('fr-MA', {
      style: 'decimal',
      minimumFractionDigits: 4,
      maximumFractionDigits: 4
    }).format(rate);
  };

  const matchStatus = (status: number) => {
    switch (status) {
      case 1:
        return 'Success';
      case 0:
        return 'Failed';
      default:
        return 'Unknown';
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type.toUpperCase()) {
      case 'EMAIL':
        return <Mail className="h-4 w-4 text-blue-600" />;
      case 'SFTP':
        return <FileText className="h-4 w-4 text-green-600" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: number) => {
    switch (status) {
      case 1:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Success</span>;
      case 0:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">Failed</span>;
      default:
        return null;
    }
  };

  const handleViewDetails = (id: number) => {
    // Navigate to notification details page or open a modal
    console.log(`View details for notification ${id}`);
  };

  const handleDownload = (id: number) => {
    // Download notification content
    console.log(`Download notification ${id}`);
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center gap-4 mb-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/notifications')}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Notifications
        </Button>
        <h1 className="text-2xl font-bold">Notification History</h1>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}
      
      <div className="mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Search by subject or recipient..."
              className="w-full rounded-md border border-gray-300 pl-10 pr-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex gap-4">
            <select
              className="rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
            >
              <option value="all">All Types</option>
              <option value="email">Email</option>
              <option value="file">File</option>
            </select>
            
            <select
              className="rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="success">Success</option>
              <option value="failed">Failed</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : filteredNotifications.length === 0 ? (
        <div className="bg-white shadow-md rounded-lg p-6 text-center">
          <p className="text-gray-500">No notifications found matching your criteria</p>
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Recipients</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredNotifications.map((notification) => (
                <TableRow key={notification.id}>
                  <TableCell>{formatDate(notification.date)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getTypeIcon(notification.type)}
                      <span className="capitalize">{notification.type}</span>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{notification.subject}</TableCell>
                  <TableCell>
                    {notification.recipients !== null && notification.recipients.length > 0 
                    <div className="max-w-xs truncate">
                      {notification.recipients.length > 1 
                        ? `${notification.recipients[0]} +${notification.recipients.length - 1} more`
                        : notification.recipients[0]}
                    </div>
                    }
                  </TableCell>
                  <TableCell>{getStatusBadge(notification.status)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleViewDetails(notification.id)}
                        className="h-8 w-8 p-0"
                        title="View Details"
                      >
                        <Search className="h-4 w-4" />
                        <span className="sr-only">View Details</span>
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleDownload(notification.id)}
                        className="h-8 w-8 p-0"
                        title="Download"
                      >
                        <Download className="h-4 w-4" />
                        <span className="sr-only">Download</span>
                      </Button>
                    </div>
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

export default GetAllNotifications;
