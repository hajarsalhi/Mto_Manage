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
import { ArrowLeft, Download, FileText, Calendar, Search, Filter, FileSpreadsheet } from 'lucide-react';
import axios from 'axios';
import { format } from 'date-fns';
import { getValidatedTransactions } from '../../services/transaction.service.ts';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

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
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [downloading, setDownloading] = useState<boolean>(false);

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

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const year = e.target.value;
    setSelectedYear(year);
    
    // Reset date range when year is selected
    if (year) {
      setStartDate('');
      setEndDate('');
    }
  };

  const applyFilters = () => {
    const filtered = transactions.filter(transaction=> transaction.mtoName!==null).filter(transaction => {
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

  const handleClearFilters = () => {
    setSelectedMonth('');
    setStartDate('');
    setEndDate('');
    setSearchTerm('');
    setFilteredTransactions(transactions);
  };

  const convertToPDF = (data: TransactionData[]) => {
    try {
      const doc = new jsPDF();
      autoTable(doc, {
        startY: 25,
        head: [['Date', 'MTO Name', 'Transaction', 'FX Rate', 'Currency']],
        body: data.map(item => [
          item.date,
          item.mtoName,
          item.transaction.toString(),
          item.fxRate.toString(),
          item.currency
        ]),
        theme: 'grid',
        styles: { fontSize: 8 },
        headStyles: { fillColor: [66, 139, 202] }
      });

      // Add title (after getting table height)
      doc.setFontSize(14);
      doc.text('Transactions Report', 15, 15);

      return doc;
    } catch (error) {
      console.error('PDF Generation Error:', error);
      throw error;
    }
  };

  const handleDownloadPDF = () => {
    try {
      setDownloading(true);
      const doc = convertToPDF(filteredTransactions);
      doc.save(`transactions_report_${format(new Date(), 'yyyyMMdd')}.pdf`);
    } catch (err) {
      console.error('Error creating PDF:', err);
      setError('Failed to create PDF. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  const convertToCSV = (data: TransactionData[]) => {
    const headers = ['Date', 'MTO Name', 'Transaction', 'FX Rate', 'Currency'];
    const rows = data.map(item => [
      item.date,
      item.mtoName,
      item.transaction,
      item.fxRate,
      item.currency
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');
    
    return csvContent;
  };

  const handleDownloadCSV = () => {
    try {
      setDownloading(true);
      
      const csvContent = convertToCSV(filteredTransactions);
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `transactions_report_${format(new Date(), 'yyyyMMdd')}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error creating CSV:', err);
      setError('Failed to create CSV. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="flex flex-col p-4">
      <div className="flex items-center justify-between">
        <Button onClick={() => navigate(-1)}>
          <ArrowLeft className="h-6 w-6 mr-2" />
          Back
        </Button>
        </div>

        <div>

        <div className="mb-6">
            <div className="bg-white p-4 rounded-lg shadow-sm space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                Year
                </label>
                <select
                className="w-full p-2 border border-gray-300 rounded-md"
                value={selectedYear}
                onChange={handleYearChange}
                >
                <option value="">All Years</option>
                {years.map(year => (
                    <option key={year} value={year}>
                    {year}
                    </option>
                ))}
                </select>
            </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                  <input
                    type="date"
                    id="startDate"
                    className="w-full pl-10 p-2 border border-gray-300 rounded-md"
                    onChange={e => handleDateChange('startDate', e.target.value)}
                    value={startDate}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                  <input
                    type="date"
                    id="endDate"
                    className="w-full pl-10 p-2 border border-gray-300 rounded-md"
                    onChange={e => handleDateChange('endDate', e.target.value)}
                    value={endDate}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Search
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                  <input
                    type="text"
                    placeholder="Search transactions..."
                    className="w-full pl-10 p-2 border border-gray-300 rounded-md"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <Button 
                variant="outline" 
                onClick={handleClearFilters}
                className="flex items-center gap-2"
              >
                <Filter className="h-4 w-4" />
                Clear Filters
              </Button>

              <div className="flex justify-end gap-2 mt-4">
                <Button 
                    variant="outline" 
                    onClick={handleDownloadPDF}
                    disabled={downloading || filteredTransactions?.length === 0}
                    className="flex items-center gap-2"
                >
                    {downloading ? (
                    <div className="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full" />
                    ) : (
                    <FileText className="h-4 w-4" />
                    )}
                    Download PDF
                </Button>
                
                <Button 
                    variant="outline" 
                    onClick={handleDownloadCSV}
                    disabled={downloading || filteredTransactions?.length === 0}
                    className="flex items-center gap-2"
                >
                    {downloading ? (
                    <div className="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full" />
                    ) : (
                    <FileSpreadsheet className="h-4 w-4" />
                    )}
                    Download CSV
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>MTO Name</TableHead>
              <TableHead>Transaction</TableHead>
              <TableHead>FX Rate</TableHead>
              <TableHead>Currency</TableHead>
            </TableRow>
          </TableHeader>
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
