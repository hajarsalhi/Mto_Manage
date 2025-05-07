
import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui-custom/Card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Search, Download, FileText, Filter, SlidersHorizontal } from 'lucide-react';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from '@/components/ui/pagination';

interface CompensationRecord {
  id: string;
  filename: string;
  mto: string;
  uploadDate: string;
  amount: number;
  currency: string;
  status: 'validated' | 'rejected';
  transactions: number;
  validatedBy?: string;
  validationDate?: string;
}

export default function CompensationHistory() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [records, setRecords] = useState<CompensationRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMto, setFilterMto] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  // Simulate data fetch
  useEffect(() => {
    // Mock data
    const mockData: CompensationRecord[] = [
      {
        id: "comp1",
        filename: "WU_compensation_20230610.csv",
        mto: "Western Union",
        uploadDate: "2023-06-10T09:23:44Z",
        amount: 56789.25,
        currency: "EUR",
        status: 'validated',
        transactions: 312,
        validatedBy: "Admnistrateur",
        validationDate: "2023-06-10T10:45:12Z"
      },
      {
        id: "comp2",
        filename: "MoneyGram_comp_202306_week1.xlsx",
        mto: "MoneyGram",
        uploadDate: "2023-06-07T14:18:22Z",
        amount: 42150.80,
        currency: "USD",
        status: 'validated',
        transactions: 187,
        validatedBy: "Superviseur",
        validationDate: "2023-06-07T16:30:05Z"
      },
      {
        id: "comp3",
        filename: "Remitly_transactions_20230603.csv",
        mto: "Remitly",
        uploadDate: "2023-06-03T11:42:37Z",
        amount: 78430.15,
        currency: "EUR",
        status: 'validated',
        transactions: 423,
        validatedBy: "Administrateur",
        validationDate: "2023-06-03T12:20:18Z"
      },
      {
        id: "comp4",
        filename: "RIA_compensation_20230601.txt",
        mto: "Ria Money Transfer",
        uploadDate: "2023-06-01T08:55:11Z",
        amount: 23480.50,
        currency: "EUR",
        status: 'rejected',
        transactions: 128
      },
      {
        id: "comp5",
        filename: "WU_compensation_20230528.csv",
        mto: "Western Union",
        uploadDate: "2023-05-28T15:37:42Z",
        amount: 63210.45,
        currency: "EUR",
        status: 'validated',
        transactions: 345,
        validatedBy: "Opérateur",
        validationDate: "2023-05-28T17:12:30Z"
      },
      {
        id: "comp6",
        filename: "MoneyGram_comp_202305_week4.xlsx",
        mto: "MoneyGram",
        uploadDate: "2023-05-25T10:28:17Z",
        amount: 38750.60,
        currency: "USD",
        status: 'validated',
        transactions: 165,
        validatedBy: "Administrateur",
        validationDate: "2023-05-25T11:45:52Z"
      },
      {
        id: "comp7",
        filename: "Remitly_transactions_20230520.csv",
        mto: "Remitly",
        uploadDate: "2023-05-20T13:14:29Z",
        amount: 82340.75,
        currency: "EUR",
        status: 'validated',
        transactions: 456,
        validatedBy: "Superviseur",
        validationDate: "2023-05-20T14:50:08Z"
      },
      {
        id: "comp8",
        filename: "RIA_compensation_20230518.txt",
        mto: "Ria Money Transfer",
        uploadDate: "2023-05-18T09:05:33Z",
        amount: 19860.30,
        currency: "EUR",
        status: 'rejected',
        transactions: 110
      }
    ];
    
    setTimeout(() => {
      setRecords(mockData);
      setTotalPages(Math.ceil(mockData.length / 5));
      setIsLoading(false);
    }, 1500);
  }, []);

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(dateString));
  };
  
  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2
    }).format(amount);
  };
  
  const getStatusBadge = (status: CompensationRecord['status']) => {
    switch (status) {
      case 'validated':
        return <Badge variant="outline" className="bg-finance-positive/20 text-finance-positive border-finance-positive/30">Validée</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-finance-negative/20 text-finance-negative border-finance-negative/30">Rejetée</Badge>;
    }
  };
  
  const filteredRecords = records.filter(record => {
    const matchesSearch = searchQuery === '' || 
      record.filename.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.mto.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesMto = filterMto === '' || record.mto === filterMto;
    const matchesStatus = filterStatus === '' || record.status === filterStatus;
    
    return matchesSearch && matchesMto && matchesStatus;
  });
  
  const paginatedRecords = filteredRecords.slice((currentPage - 1) * 5, currentPage * 5);
  
  const resetFilters = () => {
    setSearchQuery('');
    setFilterMto('');
    setFilterStatus('');
    setCurrentPage(1);
  };
  
  useEffect(() => {
    setTotalPages(Math.ceil(filteredRecords.length / 5));
    setCurrentPage(1);
  }, [filteredRecords.length]);

  return (
    <div className="min-h-screen bg-background text-foreground relative">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      <Header toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      
      <main 
        className="pt-16 transition-all duration-300"
        style={{ marginLeft: isSidebarOpen ? '280px' : '80px' }}
      >
        <div className="p-6 md:p-10 max-w-6xl mx-auto animate-scale-in">
          <div className="mb-8">
            <h1 className="heading-xl">Historique des Compensations</h1>
            <p className="text-muted-foreground mt-1">
              Consultez l'historique des fichiers de compensation traités
            </p>
          </div>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Historique</CardTitle>
              <Button variant="outline" size="sm" className="gap-1">
                <Download className="h-4 w-4" />
                <span>Exporter</span>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input 
                    type="search" 
                    placeholder="Rechercher..." 
                    className="pl-8" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="icon" className="h-9 w-9">
                      <SlidersHorizontal className="h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-72">
                    <div className="space-y-4">
                      <h4 className="font-medium">Filtres</h4>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Partenaire MTO</label>
                        <Select value={filterMto} onValueChange={setFilterMto}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Tous" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="">Tous</SelectItem>
                            <SelectItem value="Western Union">Western Union</SelectItem>
                            <SelectItem value="MoneyGram">MoneyGram</SelectItem>
                            <SelectItem value="Remitly">Remitly</SelectItem>
                            <SelectItem value="Ria Money Transfer">Ria Money Transfer</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Statut</label>
                        <Select value={filterStatus} onValueChange={setFilterStatus}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Tous" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="">Tous</SelectItem>
                            <SelectItem value="validated">Validée</SelectItem>
                            <SelectItem value="rejected">Rejetée</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full"
                        onClick={resetFilters}
                      >
                        Réinitialiser les filtres
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
              
              {isLoading ? (
                <div className="animate-pulse space-y-3">
                  {Array(5).fill(0).map((_, i) => (
                    <div key={i} className="h-16 bg-secondary rounded-lg w-full"></div>
                  ))}
                </div>
              ) : paginatedRecords.length > 0 ? (
                <div className="relative overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Fichier</TableHead>
                        <TableHead>MTO</TableHead>
                        <TableHead>Date d'import</TableHead>
                        <TableHead>Montant</TableHead>
                        <TableHead>Transactions</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead>Validé par</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedRecords.map((record) => (
                        <TableRow key={record.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              <FileText className="h-4 w-4 text-muted-foreground" />
                              <span>{record.filename}</span>
                            </div>
                          </TableCell>
                          <TableCell>{record.mto}</TableCell>
                          <TableCell>{formatDate(record.uploadDate)}</TableCell>
                          <TableCell>{formatCurrency(record.amount, record.currency)}</TableCell>
                          <TableCell>{record.transactions}</TableCell>
                          <TableCell>{getStatusBadge(record.status)}</TableCell>
                          <TableCell>
                            {record.status === 'validated' ? (
                              <div className="text-xs">
                                <div>{record.validatedBy}</div>
                                <div className="text-muted-foreground">
                                  {record.validationDate ? formatDate(record.validationDate) : ''}
                                </div>
                              </div>
                            ) : (
                              <span className="text-muted-foreground text-xs">-</span>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center p-8 text-muted-foreground">
                  Aucune compensation correspondant aux critères
                </div>
              )}
              
              {totalPages > 1 && (
                <div className="mt-6">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious 
                          onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                          className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                        />
                      </PaginationItem>
                      
                      {Array.from({length: totalPages}, (_, i) => i + 1).map(page => (
                        <PaginationItem key={page}>
                          <PaginationLink 
                            isActive={page === currentPage}
                            onClick={() => setCurrentPage(page)}
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      ))}
                      
                      <PaginationItem>
                        <PaginationNext 
                          onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                          className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      
      {/* Decorative background elements */}
      <div className="fixed top-0 right-0 w-1/3 h-1/3 bg-gradient-gold opacity-[0.03] blur-3xl rounded-full"></div>
      <div className="fixed bottom-0 left-0 w-1/4 h-1/4 bg-gradient-gold opacity-[0.03] blur-3xl rounded-full"></div>
    </div>
  );
}
