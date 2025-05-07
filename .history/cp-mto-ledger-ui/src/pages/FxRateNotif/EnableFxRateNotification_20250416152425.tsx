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
import { Bell, BellOff, ArrowUp, ArrowDown, Minus, History } from 'lucide-react';
import axios from 'axios';
import { format } from 'date-fns';
import { getRateReference } from '../../services/RateReference.service.ts';
import { enableFxRateNotification } from '../../services/FxRateNotification.service.ts';

interface FxRateData {
  id: number;
  currency: 'USD' | 'EUR';
  rate: number;
  previousRate?: number;
  date: string;
}

interface ReferenceRateData {
  id: number;
  date: string;
  devise: string;
  ssource: string;
  fcoursVirement : number;
  previousRate?: number;
}

interface NotificationStatus {
  enabled: boolean;
  lastSent: string | null;
  nextScheduled: string | null;
  createdBY?: string;
}

const EnableFxRateNotification: React.FC = () => {
  const [fxRates, setFxRates] = useState<ReferenceRateData[]>([]);
  const [notificationStatus, setNotificationStatus] = useState<NotificationStatus | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [updating, setUpdating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch FX rates
        const ratesResponse = await getRateReference();
        setFxRates(ratesResponse);
        
        // Fetch notification status
        const statusResponse = await axios.get('/api/fx-notifications/status');
        setNotificationStatus(statusResponse.data);
        
        setError(null);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data. Please try again later.');
        
        // Mock data for development
        
        const mockStatus = {
          enabled: false,
          lastSent: new Date(Date.now() - 86400000).toISOString(), // Yesterday
          nextScheduled: null,
          recipients: ['finance@company.com', 'treasury@company.com']
        };
        
        setNotificationStatus(mockStatus);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleToggleNotifications = async () => {
    if (!notificationStatus) return;
    
    try {
      setUpdating(true);
      setError(null);
      setSuccess(null);

      // Update local state
      setNotificationStatus({
        ...notificationStatus,
        enabled: !notificationStatus.enabled,

        nextScheduled: notificationStatus.enabled 
          ? null 
          : (() => {//Tomorrow within business days
              const nextDate = new Date();
              nextDate.setDate(nextDate.getDate() + 1);
              while (nextDate.getDay() === 0 || nextDate.getDay() === 6) {
                nextDate.setDate(nextDate.getDate() + 1);
              }
              return nextDate.toISOString();
            })()
      });
      
      await enableFxRateNotification(notificationStatus);
      setSuccess(`FX rate notifications ${notificationStatus.enabled ? 'disabled' : 'enabled'} successfully.`);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
      
    } catch (err) {
      console.error('Error toggling notifications:', err);
      setError('Failed to update notification status. Please try again.');
    } finally {
      setUpdating(false);
    }
  };

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

  const getRateChangeIcon = (current: number, previous?: number) => {
    if (!previous) return <Minus className="h-4 w-4 text-gray-400" />;
    
    if (current > previous) {
      return <ArrowUp className="h-4 w-4 text-green-600" />;
    } else if (current < previous) {
      return <ArrowDown className="h-4 w-4 text-red-600" />;
    } else {
      return <Minus className="h-4 w-4 text-gray-400" />;
    }
  };

  const getRateChangeClass = (current: number, previous?: number) => {
    if (!previous) return '';
    
    if (current > previous) {
      return 'text-green-600';
    } else if (current < previous) {
      return 'text-red-600';
    } else {
      return '';
    }
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">FX Rate Notifications</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage automatic notifications for daily FX rate updates
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline"
            onClick={() => navigate('/notifications/history')}
            className="flex items-center gap-2"
          >
            <History className="h-4 w-4" />
            View History
          </Button>
          <Button 
            onClick={handleToggleNotifications}
            disabled={updating || !notificationStatus}
            variant={notificationStatus?.enabled ? "destructive" : "primary"}
            className="flex items-center gap-2"
          >
            {updating ? (
              <>
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                Updating...
              </>
            ) : notificationStatus?.enabled ? (
              <>
                <BellOff className="h-4 w-4" />
                Disable Notifications
              </>
            ) : (
              <>
                <Bell className="h-4 w-4" />
                Enable Notifications
              </>
            )}
          </Button>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}
      
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
          {success}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Notification Status</h2>
          {loading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : !notificationStatus ? (
            <p className="text-gray-500">Unable to load notification status</p>
          ) : (
            <div>
              <div className="flex items-center mb-4">
                <div className={`h-3 w-3 rounded-full mr-2 ${notificationStatus.enabled ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className="font-medium">{notificationStatus.enabled ? 'Active' : 'Inactive'}</span>
              </div>
              
              <div className="space-y-2 text-sm">
                {notificationStatus.lastSent && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Last notification sent:</span>
                    <span className="font-medium">{formatDate(notificationStatus.lastSent)}</span>
                  </div>
                )}
                
                {notificationStatus.nextScheduled && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Next notification scheduled:</span>
                    <span className="font-medium">{formatDate(notificationStatus.nextScheduled)}</span>
                  </div>
                )}
                
                <div className="pt-2">
                  <span className="text-gray-600 block mb-1">Activated by:</span>
                  <div className="bg-gray-50 p-2 rounded text-sm">
                    <span className="font-medium">Finance Team : {notificationStatus.createdBY}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Current FX Rates</h2>
          {loading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : fxRates?.length === 0 ? (
            <p className="text-gray-500">No FX rates available</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Currency</TableHead>
                  <TableHead className="text-right">Rate</TableHead>
                  <TableHead>Last Updated</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Array.isArray(fxRates) && fxRates?.map((rate) => (
                  <TableRow key={rate.id}>
                    <TableCell className="font-medium">{rate.devise}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <span className={getRateChangeClass(rate.fcoursVirement, rate.previousRate)}>
                          {formatCurrency(rate.fcoursVirement)}
                        </span>
                        {getRateChangeIcon(rate.fcoursVirement, rate.previousRate)}
                      </div>
                    </TableCell>
                    <TableCell>{formatDate(rate.date)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </div>
      
      <div className="bg-blue-50 p-6 rounded-lg">
        <h2 className="text-lg font-semibold text-blue-800 mb-2">About FX Rate Notifications</h2>
        <p className="text-sm text-blue-700 mb-4">
          When enabled, the system will automatically send daily notifications with the latest FX rates to the configured recipients.
          These notifications include the current rates, any changes from the previous day, and are sent each morning after the rates are updated.
        </p>
        <div className="bg-white p-4 rounded border border-blue-200">
          <h3 className="font-medium text-blue-800 mb-2">Configure Recipients</h3>
          <p className="text-sm text-blue-700 mb-3">
            Recipients for FX rate notifications are configured at the MTO level. To add or modify recipients:
          </p>
          <ol className="text-sm text-blue-700 list-decimal pl-5 space-y-1">
            <li>Go to the Products page</li>
            <li>Select an MTO to edit</li>
            <li>Update the "FX Rate Params" section</li>
            <li>Add email addresses in the "Emails destinataires FX" field</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default EnableFxRateNotification;
