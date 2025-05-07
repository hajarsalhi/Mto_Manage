
import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui-custom/Card';
import { Button } from '@/components/ui/button';
import { StatusIndicator } from '../components/ui-custom/StatusIndicator';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle2, XCircle, ExternalLink, FileText, ArrowRight, Eye } from 'lucide-react';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { CompensationAlert } from '@/components/ui-custom/CompensationAlert';

interface CompensationFile {
  id: string;
  filename: string;
  mto: string;
  uploadDate: string;
  amount: number;
  currency: string;
  status: 'pending' | 'validated' | 'rejected';
  transactions: number;
  expiresAt?: Date;
}

export default function CompensationValidation() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [pendingFiles, setPendingFiles] = useState<CompensationFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState<CompensationFile | null>(null);
  const [activeTab, setActiveTab] = useState("pending");
  const [showAlert, setShowAlert] = useState(true);
  
  const { toast } = useToast();

  // Calculer le délai avant expiration pour chaque fichier
  const calculateTimeRemaining = (file: CompensationFile) => {
    if (!file.expiresAt) return null;
    
    const now = new Date();
    const expiresAt = new Date(file.expiresAt);
    const diff = expiresAt.getTime() - now.getTime();
    
    // Si déjà expiré
    if (diff <= 0) return "Expiré";
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}min`;
  };
  
  useEffect(() => {
    // Ajouter expiration time (18h00 aujourd'hui) pour chaque fichier en attente
    const today = new Date();
    const expirationDate = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
      18, 0, 0 // 18:00:00
    );
    
    const mockData: CompensationFile[] = [
      {
        id: "file1",
        filename: "WU_compensation_20230615.csv",
        mto: "Western Union",
        uploadDate: new Date(Date.now() - 2 * 3600000).toISOString(),
        amount: 45678.50,
        currency: "EUR",
        status: 'pending',
        transactions: 238,
        expiresAt: expirationDate
      },
      {
        id: "file2",
        filename: "MoneyGram_comp_202306_week3.xlsx",
        mto: "MoneyGram",
        uploadDate: new Date(Date.now() - 5 * 3600000).toISOString(),
        amount: 32450.75,
        currency: "USD",
        status: 'pending',
        transactions: 176,
        expiresAt: expirationDate
      },
      {
        id: "file3",
        filename: "Remitly_transactions_20230614.csv",
        mto: "Remitly",
        uploadDate: new Date(Date.now() - 12 * 3600000).toISOString(),
        amount: 64290.25,
        currency: "EUR",
        status: 'validated',
        transactions: 345
      },
      {
        id: "file4",
        filename: "RIA_compensation_20230612.txt",
        mto: "Ria Money Transfer",
        uploadDate: new Date(Date.now() - 24 * 3600000).toISOString(),
        amount: 18750.00,
        currency: "EUR",
        status: 'rejected',
        transactions: 97
      }
    ];
    
    setTimeout(() => {
      setPendingFiles(mockData);
      setIsLoading(false);
    }, 1500);
    
    // Vérification périodique de l'expiration
    const expirationCheckInterval = setInterval(() => {
      const now = new Date();
      
      setPendingFiles(files => 
        files.map(file => {
          if (file.status === 'pending' && file.expiresAt && new Date(file.expiresAt) <= now) {
            // Marquer comme rejeté si expiré
            toast({
              title: "Compensation expirée",
              description: `La compensation ${file.filename} a été automatiquement rejetée car non validée avant 18h00.`,
              variant: "destructive",
              duration: 5000,
            });
            return { ...file, status: 'rejected' };
          }
          return file;
        })
      );
    }, 60000); // Vérifier chaque minute
    
    return () => clearInterval(expirationCheckInterval);
  }, [toast]);

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
  
  const handleValidate = (file: CompensationFile) => {
    setTimeout(() => {
      setPendingFiles(prev => 
        prev.map(f => f.id === file.id ? {...f, status: 'validated'} : f)
      );
      
      toast({
        title: "Compensation validée",
        description: `La compensation de ${file.mto} a été validée avec succès.`,
        duration: 3000,
      });
    }, 1000);
  };
  
  const handleReject = (file: CompensationFile) => {
    setTimeout(() => {
      setPendingFiles(prev => 
        prev.map(f => f.id === file.id ? {...f, status: 'rejected'} : f)
      );
      
      toast({
        title: "Compensation rejetée",
        description: `La compensation de ${file.mto} a été rejetée.`,
        variant: "destructive",
        duration: 3000,
      });
    }, 1000);
  };
  
  const getStatusBadge = (status: CompensationFile['status']) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-muted">En attente</Badge>;
      case 'validated':
        return <Badge variant="outline" className="bg-finance-positive/20 text-finance-positive border-finance-positive/30">Validée</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-finance-negative/20 text-finance-negative border-finance-negative/30">Rejetée</Badge>;
    }
  };
  
  const filteredFiles = pendingFiles.filter(file => {
    if (activeTab === "pending") return file.status === "pending";
    if (activeTab === "validated") return file.status === "validated";
    if (activeTab === "rejected") return file.status === "rejected";
    return true;
  });

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
            <h1 className="heading-xl">Validation des Compensations</h1>
            <p className="text-muted-foreground mt-1">
              Vérifiez et validez les fichiers de compensation importés
            </p>
          </div>
          
          {showAlert && <CompensationAlert onClose={() => setShowAlert(false)} />}
          
          <Card>
            <CardHeader>
              <CardTitle>Fichiers de compensation</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="pending" className="mb-4" onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-3 w-[400px] mb-4">
                  <TabsTrigger value="pending">En attente</TabsTrigger>
                  <TabsTrigger value="validated">Validés</TabsTrigger>
                  <TabsTrigger value="rejected">Rejetés</TabsTrigger>
                </TabsList>
              </Tabs>
              
              {isLoading ? (
                <div className="animate-pulse space-y-3">
                  {Array(3).fill(0).map((_, i) => (
                    <div key={i} className="h-16 bg-secondary rounded-lg w-full"></div>
                  ))}
                </div>
              ) : filteredFiles.length > 0 ? (
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
                        {activeTab === "pending" && <TableHead>Expire dans</TableHead>}
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredFiles.map((file) => (
                        <TableRow key={file.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              <FileText className="h-4 w-4 text-muted-foreground" />
                              <span>{file.filename}</span>
                            </div>
                          </TableCell>
                          <TableCell>{file.mto}</TableCell>
                          <TableCell>{formatDate(file.uploadDate)}</TableCell>
                          <TableCell>{formatCurrency(file.amount, file.currency)}</TableCell>
                          <TableCell>{file.transactions}</TableCell>
                          <TableCell>{getStatusBadge(file.status)}</TableCell>
                          {activeTab === "pending" && (
                            <TableCell>
                              {file.expiresAt && (
                                <span className={`${
                                  new Date(file.expiresAt).getTime() - Date.now() < 3600000 
                                    ? 'text-finance-negative font-medium'
                                    : ''
                                }`}>
                                  {calculateTimeRemaining(file)}
                                </span>
                              )}
                            </TableCell>
                          )}
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button 
                                    variant="ghost" 
                                    size="icon"
                                    onClick={() => setSelectedFile(file)}
                                  >
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-3xl">
                                  <DialogHeader>
                                    <DialogTitle>Détails de la compensation</DialogTitle>
                                    <DialogDescription>
                                      {selectedFile?.filename} • {selectedFile?.mto}
                                    </DialogDescription>
                                  </DialogHeader>
                                  
                                  <div className="grid grid-cols-2 gap-4 py-4">
                                    <div>
                                      <p className="text-sm font-medium mb-1">Fichier</p>
                                      <p className="text-sm text-muted-foreground">{selectedFile?.filename}</p>
                                    </div>
                                    <div>
                                      <p className="text-sm font-medium mb-1">Partenaire MTO</p>
                                      <p className="text-sm text-muted-foreground">{selectedFile?.mto}</p>
                                    </div>
                                    <div>
                                      <p className="text-sm font-medium mb-1">Date d'import</p>
                                      <p className="text-sm text-muted-foreground">{selectedFile ? formatDate(selectedFile.uploadDate) : ''}</p>
                                    </div>
                                    <div>
                                      <p className="text-sm font-medium mb-1">Montant</p>
                                      <p className="text-sm text-muted-foreground">{selectedFile ? formatCurrency(selectedFile.amount, selectedFile.currency) : ''}</p>
                                    </div>
                                    <div>
                                      <p className="text-sm font-medium mb-1">Transactions</p>
                                      <p className="text-sm text-muted-foreground">{selectedFile?.transactions} transactions</p>
                                    </div>
                                    <div>
                                      <p className="text-sm font-medium mb-1">Statut</p>
                                      <div className="text-sm text-muted-foreground">
                                        {selectedFile && getStatusBadge(selectedFile.status)}
                                      </div>
                                    </div>
                                    {selectedFile?.status === 'pending' && selectedFile?.expiresAt && (
                                      <div>
                                        <p className="text-sm font-medium mb-1">Expire dans</p>
                                        <p className={`text-sm ${
                                          new Date(selectedFile.expiresAt).getTime() - Date.now() < 3600000 
                                            ? 'text-finance-negative font-medium'
                                            : 'text-muted-foreground'
                                        }`}>
                                          {calculateTimeRemaining(selectedFile)}
                                        </p>
                                      </div>
                                    )}
                                  </div>
                                  
                                  <DialogFooter>
                                    {selectedFile?.status === 'pending' && (
                                      <>
                                        <Button 
                                          variant="outline"
                                          onClick={() => handleReject(selectedFile)}
                                        >
                                          Rejeter
                                        </Button>
                                        <Button 
                                          onClick={() => handleValidate(selectedFile)}
                                        >
                                          Valider
                                        </Button>
                                      </>
                                    )}
                                    {selectedFile?.status !== 'pending' && (
                                      <Button variant="outline">
                                        Fermer
                                      </Button>
                                    )}
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
                              
                              {file.status === 'pending' && (
                                <>
                                  <Button 
                                    variant="ghost" 
                                    size="icon"
                                    className="text-finance-negative hover:text-finance-negative/80 hover:bg-finance-negative/10"
                                    onClick={() => handleReject(file)}
                                  >
                                    <XCircle className="h-4 w-4" />
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="icon"
                                    className="text-finance-positive hover:text-finance-positive/80 hover:bg-finance-positive/10"
                                    onClick={() => handleValidate(file)}
                                  >
                                    <CheckCircle2 className="h-4 w-4" />
                                  </Button>
                                </>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center p-8 text-muted-foreground">
                  Aucun fichier {activeTab === "pending" ? "en attente" : activeTab === "validated" ? "validé" : "rejeté"} à afficher
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      
      <div className="fixed top-0 right-0 w-1/3 h-1/3 bg-gradient-gold opacity-[0.03] blur-3xl rounded-full"></div>
      <div className="fixed bottom-0 left-0 w-1/4 h-1/4 bg-gradient-gold opacity-[0.03] blur-3xl rounded-full"></div>
    </div>
  );
}
