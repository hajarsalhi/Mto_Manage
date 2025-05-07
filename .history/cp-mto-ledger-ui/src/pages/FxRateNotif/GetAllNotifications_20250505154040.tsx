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
import axios from 'axios';
import { format } from 'date-fns';
import { getFxRateNotifications } from '../../services/FxRateNotification.service.ts';

interface NotificationData {
  id: number;
  sentDate: string;
  type: 'email' | 'file';
  status: 'success' | 'failed';
  recipients: string[];
  subject: string;
  fileName?: string;
  errorMessage?: string;
  rates: {
    currency: string;
    rate: number;
    previousRate: number | null;
  }[];
}

const GetAllNotifications: React.FC = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [filteredNotifications, setFilteredNotifications] = useState<NotificationData[]>([]);
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
        
        // Mock data for development
        const mockData = [
          {
            id: 1,
            sentDate: new Date(Date.now() - 86400000).toISOString(), // Yesterday
            type: 'email',
            status: 'success',
            recipients: ['finance@company.com', 'treasury@company.com'],
            subject: 'Daily FX Rate Update - 15/05/2023',
            rates: [
              { currency: 'USD', rate: 9.95, previousRate: 9.92 },
              { currency: 'EUR', rate: 10.85, previousRate: 10.85 }
            ]
          },
          {
            id: 2,
            sentDate: new Date(Date.now() - 2 * 86400000).toISOString(), // 2 days ago
            type: 'file',
            status: 'success',
            recipients: ['sftp://exchange.company.com/fx-rates/'],
            subject: 'FX_RATES_14052023.csv',
            fileName: 'FX_RATES_14052023.csv',
            rates: [
              { currency: 'USD', rate: 9.92, previousRate: 9.90 },
              { currency: 'EUR', rate: 10.85, previousRate: 10.82 }
            ]
          },
          {
            id: 3,
            sentDate: new Date(Date.now() - 3 * 86400000).toISOString(), // 3 days ago
            type: 'email',
            status: 'failed',
            recipients: ['finance@company.com', 'invalid-email@'],
            subject: 'Daily FX Rate Update - 13/05/2023',
            errorMessage: 'Failed to send to some recipients: invalid-email@',
            rates: [
              { currency: 'USD', rate: 9.90, previousRate: 9.88 },
              { currency: 'EUR', rate: 10.82, previousRate: 10.80 }
            ]
          },
          {
            id: 4,
            sentDate: new Date(Date.now() - 4 * 86400000).toISOString(), // 4 days ago
            type: 'email',
            status: 'success',
            recipients: ['finance@company.com', 'treasury@company.com'],
            subject: 'Daily FX Rate Update - 12/05/2023',
            rates: [
              { currency: 'USD', rate: 9.88, previousRate: 9.85 },
              { currency: 'EUR', rate: 10.80, previousRate: 10.78 }
            ]
          },
          {
            id: 5,
            sentDate: new Date(Date.now() - 5 * 86400000).toISOString(), // 5 days ago
            type: 'file',
            status: 'failed',
            recipients: ['sftp://exchange.company.com/fx-rates/'],
            subject: 'FX_RATES_11052023.csv',
            fileName: 'FX_RATES_11052023.csv',
            errorMessage: 'Failed to connect to SFTP server',
            rates: [
              { currency: 'USD', rate: 9.85, previousRate: 9.83 },
              { currency: 'EUR', rate: 10.78, previousRate: 10.75 }
            ]
          }
        ];
        
        setNotifications(mockData as NotificationData[]);
        setFilteredNotifications(mockData as NotificationData[]);
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
      const matchesStatus = selectedStatus === 'all' || notification.status === selectedStatus;
      
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

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'email':
        return <Mail className="h-4 w-4 text-blue-600" />;
      case 'file':
        return <FileText className="h-4 w-4 text-green-600" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Success</span>;
      case 'failed':
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
                  <TableCell>{formatDate(notification.sentDate)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getTypeIcon(notification.type)}
                      <span className="capitalize">{notification.type}</span>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{notification.subject}</TableCell>
                  <TableCell>
                    <div className="max-w-xs truncate">
                      {notification.recipients.length > 1 
                        ? `${notification.recipients[0]} +${notification.recipients.length - 1} more`
                        : notification.recipients[0]}
                    </div>
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
