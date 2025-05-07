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
import { ArrowLeft, Download, FileText, Calendar, Search, Filter } from 'lucide-react';
import axios from 'axios';
import { format } from 'date-fns';
import { getValidatedTransactions } from '../../services/transaction.service';

export type TransactionData = {
  id: number
  date: string
  mtoName: string
  transaction: number
  fxRate: number
  currency: 'USD' | 'EUR' | 'MAD'
}

const TransactionsReport = () => {
  const [transactions, setTransactions] = useState<TransactionData[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<TransactionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<string>('');
  const [selectedMonth, setSelectedMonth] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  const navigate = useNavigate();


  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 6 }, (_, i) => currentYear - i);
  
  // Array of months
  const months = [
    { value: '01', label: 'January' },
    { value: '02', label: 'February' },
    { value: '03', label: 'March' },
    { value: '04', label: 'April' },
    { value: '05', label: 'May' },
    { value: '06', label: 'June' },
    { value: '07', label: 'July' },
    { value: '08', label: 'August' },
    { value: '09', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' }
  ];

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const response = await getValidatedTransactions();
      setTransactions(response);
      setFilteredTransactions(response);
      setError(null);
    } catch (err) {
      console.error('Error fetching transactions data:', err);
      setError('Failed to load transactions data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const month = e.target.value;
    setSelectedMonth(month);
    
    // Reset date range when month is selected
    if (month) {
      setStartDate('');
      setEndDate('');
    }
  };

  const handleDateChange = (field: 'startDate' | 'endDate', value: string) => {
    if (field === 'startDate') {
      setStartDate(value);
    } else {
      setEndDate(value);
    }
  };

  const applyFilters = () => {
    const filtered = transactions.filter(transaction => {
      const date = new Date(transaction.date);
      const startDateObj = startDate ? new Date(startDate) : null;
      const endDateObj = endDate ? new Date(endDate) : null;

      if (startDateObj && endDateObj) {
        return date >= startDateObj && date <= endDateObj;
      }

      if (startDateObj) {
        return date >= startDateObj;
      }

      if (endDateObj) {
        return date <= endDateObj;
      }

      return true;
    });

    setFilteredTransactions(filtered);
  };

  return (
    <div className="flex flex-col p-4">
      <div className="flex items-center justify-between">
        <Button onClick={() => navigate(-1)}>
          <ArrowLeft className="h-6 w-6 mr-2" />
          Back
        </Button>

        <div className="flex items-center">
          <div className="mr-4">
            <label htmlFor="month" className="block text-sm font-medium text-gray-700">
              Month
            </label>
            <select
              className="w-full p-2 border border-gray-300 rounded-md"
              value={selectedMonth}
              onChange={handleMonthChange}
              disabled={!selectedYear}
            >
              <option value="">All Months</option>
              {months.map(month => (
                <option key={month.value} value={month.value}>
                  {month.label}
                </option>
              ))}
            </select>
          </div>

          <div className="mr-4">
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
              Start Date
            </label>
            <input
              type="date"
              id="startDate"
              className="mt-1 block w-full pl-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              onChange={e => handleDateChange('startDate', e.target.value)}
              value={startDate}
            />
          </div>

          <div className="mr-4">
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
              End Date
            </label>
            <input
              type="date"
              id="endDate"
              className="mt-1 block w-full pl-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              onChange={e => handleDateChange('endDate', e.target.value)}
              value={endDate}
            />
          </div>

          <Button onClick={applyFilters}>
            <Filter className="h-6 w-6 mr-2" />
            Apply Filters
          </Button>
        </div>
      </div>

      <div className="mt-4">
        <Table>
          <TableHead>
            <TableRow>
              <TableHeader>Date</TableHeader>
              <TableHeader>MTO Name</TableHeader>
              <TableHeader>Transaction</TableHeader>
              <TableHeader>FX Rate</TableHeader>
              <TableHeader>Currency</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredTransactions.map(transaction => (
              <TableRow key={transaction.id}>
                <TableCell>{transaction.date}</TableCell>
                <TableCell>{transaction.mtoName}</TableCell>
                <TableCell>{transaction.transaction}</TableCell>
                <TableCell>{transaction.fxRate}</TableCell>
                <TableCell>{transaction.currency}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default TransactionsReport;
