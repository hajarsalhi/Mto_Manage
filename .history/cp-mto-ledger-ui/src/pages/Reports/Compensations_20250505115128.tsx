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
import { getValidatedCompensations } from '../../services/compensation.service.ts';
import jsPDF from 'jspdf';  
import autoTable from 'jspdf-autotable';

interface CompensationData {
  id: number;
  date: string;
  mtoName: string;
  compensation: number;
  fxRate: number;
  currency: 'USD' | 'EUR';
}

const CompensationsReport: React.FC = () => {
  const [compensations, setCompensations] = useState<CompensationData[]>([]);
  const [filteredCompensations, setFilteredCompensations] = useState<CompensationData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [downloading, setDownloading] = useState<boolean>(false);
  const [selectedYear, setSelectedYear] = useState<string>('');
  const [selectedMonth, setSelectedMonth] = useState<string>('');

  // Generate array of years (current year and 5 years back)
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
    const fetchCompensations = async () => {
      try {
        setLoading(true);
        const response = await getValidatedCompensations() ;
        setCompensations(response);
        setFilteredCompensations(response);
        setError(null);
      } catch (err) {
        console.error('Error fetching compensations data:', err);
        setError('Failed to load compensations data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchCompensations();
  }, []);

  useEffect(() => {
    // Filter compensations based on search term, date range, year and month
    let filtered = compensations;
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(comp => 
        comp.mtoName.toLowerCase().includes(term)
      );
    }
    
    if (startDate) {
      filtered = filtered.filter(comp => comp.date >= startDate);
    }
    
    if (endDate) {
      filtered = filtered.filter(comp => comp.date <= endDate);
    }
    
    if (selectedYear) {
      filtered = filtered.filter(comp => comp.date.startsWith(selectedYear));
    }
    
    if (selectedMonth && selectedYear) {
      const yearMonth = `${selectedYear}-${selectedMonth}`;
      filtered = filtered.filter(comp => comp.date.startsWith(yearMonth));
    }
    
    setFilteredCompensations(filtered);
  }, [compensations, searchTerm, startDate, endDate, selectedYear, selectedMonth]);

  // Reset month when year changes
  useEffect(() => {
    if (!selectedYear) {
      setSelectedMonth('');
    }
  }, [selectedYear]);

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const year = e.target.value;
    setSelectedYear(year);
    
    // Reset date range when year is selected
    if (year) {
      setStartDate('');
      setEndDate('');
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

  const handleClearFilters = () => {
    setSearchTerm('');
    setStartDate('');
    setEndDate('');
    setSelectedYear('');
    setSelectedMonth('');
  };


  const convertToPDF = (data: CompensationData[]) => {
    try {
      const doc = new jsPDF();
      
      // Basic table data
      autoTable(doc, {
        startY: 25,
        head: [['Date', 'MTO Name', 'Compensation', 'FX Rate', 'Currency']],
        body: data.map(item => [
          item.date,
          item.mtoName,
          item.compensation.toString(),
          item.fxRate.toString(),
          item.currency
        ]),
        theme: 'grid',
        styles: { fontSize: 8 },
        headStyles: { fillColor: [66, 139, 202] }
      });

      // Add title (after getting table height)
      doc.setFontSize(14);
      doc.text('Compensations Report', 15, 15);

      return doc;
    } catch (error) {
      console.error('PDF Generation Error:', error);
      throw error;
    }
  };

  const handleDownloadPDF = () => {
    try {
      setDownloading(true);
      const doc = convertToPDF(filteredCompensations);
      doc.save(`compensations_report_${format(new Date(), 'yyyyMMdd')}.pdf`);
    } catch (err) {
      console.error('Error creating PDF:', err);
      setError('Failed to create PDF. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  const convertToCSV = (data: CompensationData[]) => {
    const headers = ['Date', 'MTO Name', 'Compensation', 'FX Rate', 'Currency'];
    const rows = data.map(item => [
      item.date,
      item.mtoName,
      item.compensation,
      item.fxRate,
      item.currency
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');
    
    return csvContent;
  };

  const handleDownloadCSV = async () => {
    try {
      setDownloading(true);
      
      const csvContent = convertToCSV(filteredCompensations);
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `compensations_report_${format(new Date(), 'yyyyMMdd')}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error('Error downloading CSV:', err);
      setError('Failed to download CSV. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-MA', {
      style: 'currency',
      currency: 'MAD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd/MM/yyyy');
  };

  return (
    <div className="container mx-auto py-6">
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}
      
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
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
                className="w-full pl-10 p-2 border border-gray-300 rounded-md"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                disabled={selectedYear !== ''}
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
                className="w-full pl-10 p-2 border border-gray-300 rounded-md"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                disabled={selectedYear !== ''}
              />
            </div>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search MTO
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                placeholder="Search by MTO name..."
                className="w-full pl-10 p-2 border border-gray-300 rounded-md"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex items-end">
            <Button 
              variant="outline" 
              onClick={handleClearFilters}
              className="flex items-center gap-2 h-10"
            >
              <Filter className="h-4 w-4" />
              Clear Filters
            </Button>
          </div>
        </div>
        
        <div className="flex justify-end gap-2 mt-4">
          <Button 
            variant="outline" 
            onClick={handleDownloadPDF}
            disabled={downloading || filteredCompensations?.length === 0}
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
            disabled={downloading || filteredCompensations?.length === 0}
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
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : filteredCompensations?.length === 0 ? (
        <div className="bg-white shadow-md rounded-lg p-6 text-center">
          <p className="text-gray-500">No compensations found matching your criteria</p>
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="p-4 border-b bg-gray-50">
            <p className="text-sm text-gray-500">
              Showing {filteredCompensations?.length} {filteredCompensations?.length === 1 ? 'result' : 'results'}
            </p>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>MTO's Name</TableHead>
                <TableHead className="text-right">Compensation</TableHead>
                <TableHead className="text-right">FX Rate</TableHead>
                <TableHead>Currency</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCompensations?.map((compensation) => (
                <TableRow key={compensation.id}>
                  <TableCell>{formatDate(compensation.date)}</TableCell>
                  <TableCell className="font-medium">{compensation.mtoName}</TableCell>
                  <TableCell className="text-right">{formatCurrency(compensation.compensation)}</TableCell>
                  <TableCell className="text-right">{compensation.fxRate.toFixed(4)}</TableCell>
                  <TableCell>{compensation.currency}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default CompensationsReport;
