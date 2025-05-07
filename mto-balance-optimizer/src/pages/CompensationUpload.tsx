
import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui-custom/Card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from '@/hooks/use-toast';
import { Upload, FileText, AlertCircle, CheckCircle2, Trash2, Check } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useIsMobile } from '@/hooks/use-mobile';
import { useNavigate } from 'react-router-dom';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

interface CompensationFile {
  id: string;
  filename: string;
  mto: string;
  uploadDate: string;
  amount: number;
  currency: string;
  status: 'pending' | 'validated' | 'rejected';
  transactions: number;
}

export default function CompensationUpload() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [showValidationButtons, setShowValidationButtons] = useState(false);
  const [compensations, setCompensations] = useState<CompensationFile[]>([]);
  const [selectedCompensation, setSelectedCompensation] = useState<CompensationFile | null>(null);
  const [showValidatedFiles, setShowValidatedFiles] = useState(false);
  
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelectedFile(file);
    setUploadStatus('idle');
    
    if (file) {
      if (file.type === 'text/csv' || file.type === 'text/plain' || file.name.endsWith('.csv')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const content = event.target?.result as string;
          const lines = content.split('\n').slice(0, 5).join('\n');
          setFilePreview(lines);
        };
        reader.readAsText(file);
      } else {
        setFilePreview(null);
      }
    } else {
      setFilePreview(null);
    }
  };
  
  const handleUpload = () => {
    if (!selectedFile) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un fichier à importer.",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }
    
    setIsUploading(true);
    
    setTimeout(() => {
      setIsUploading(false);
      
      setUploadStatus('success');
      setShowValidationButtons(true);
      
      const defaultMto = "Remitly";
      
      const newCompensation: CompensationFile = {
        id: `file-${Date.now()}`,
        filename: selectedFile.name,
        mto: defaultMto,
        uploadDate: new Date().toISOString(),
        amount: Math.floor(Math.random() * 50000) + 10000,
        currency: "EUR",
        status: 'pending',
        transactions: Math.floor(Math.random() * 200) + 50,
      };
      
      setSelectedCompensation(newCompensation);
      setCompensations(prev => [...prev, newCompensation]);
      
      toast({
        title: "Fichier importé avec succès",
        description: `Le fichier de compensation a été importé et est prêt pour validation.`,
        duration: 3000,
      });
    }, 2000);
  };
  
  const handleValidate = () => {
    if (!selectedCompensation) return;
    
    // Update the compensation status to 'validated'
    setCompensations(prev => 
      prev.map(f => f.id === selectedCompensation.id ? {...f, status: 'validated'} : f)
    );
    
    toast({
      title: "Compensation validée",
      description: `La compensation pour ${selectedCompensation.mto} a été validée avec succès.`,
      duration: 3000,
    });
    
    // Show the validated files section
    setShowValidatedFiles(true);
    
    // Reset upload form
    setSelectedFile(null);
    setFilePreview(null);
    setUploadStatus('idle');
    setShowValidationButtons(false);
    setSelectedCompensation(null);
  };
  
  const handleDelete = () => {
    if (!selectedCompensation) return;
    
    setCompensations(prev => prev.filter(f => f.id !== selectedCompensation.id));
    
    toast({
      title: "Compensation supprimée",
      description: "Le fichier de compensation a été supprimé.",
      variant: "destructive",
      duration: 3000,
    });
    
    setSelectedCompensation(null);
    setSelectedFile(null);
    setFilePreview(null);
    setUploadStatus('idle');
    setShowValidationButtons(false);
  };
  
  const resetForm = () => {
    setSelectedFile(null);
    setFilePreview(null);
    setUploadStatus('idle');
    setShowValidationButtons(false);
  };

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

  const hasValidatedFiles = compensations.some(file => file.status === 'validated');

  return (
    <div className="min-h-screen bg-background text-foreground relative">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      <Header toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      
      <main 
        className="pt-16 transition-all duration-300"
        style={{ marginLeft: isMobile ? '0px' : (isSidebarOpen ? '280px' : '80px') }}
      >
        <div className="p-4 md:p-6 lg:p-10 max-w-3xl mx-auto animate-scale-in">
          <div className="mb-6 md:mb-8">
            <h1 className="text-2xl md:text-3xl font-semibold">Import de Compensation</h1>
            <p className="text-muted-foreground mt-1">
              Téléchargez les fichiers de compensation des partenaires MTO
            </p>
          </div>
          
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Importer un fichier de compensation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 md:space-y-6">
                <div className="space-y-3 md:space-y-4">
                  <Label htmlFor="file">Fichier de compensation</Label>
                  <div 
                    className={`border-2 border-dashed rounded-lg p-4 md:p-6 text-center hover:bg-secondary/50 transition-colors cursor-pointer ${
                      uploadStatus === 'error' ? 'border-finance-negative bg-finance-negative/10' : 
                      uploadStatus === 'success' ? 'border-finance-positive bg-finance-positive/10' : 
                      'border-border'
                    }`}
                    onClick={() => document.getElementById('file')?.click()}
                  >
                    <Input
                      id="file"
                      type="file"
                      accept=".csv,.txt,.xlsx"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                    
                    {!selectedFile ? (
                      <div className="py-2 md:py-4">
                        <Upload className="mx-auto h-8 w-8 md:h-10 md:w-10 text-muted-foreground mb-2" />
                        <p className="font-medium">Cliquez pour sélectionner un fichier</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          CSV, TXT, ou XLSX. 10 MB maximum.
                        </p>
                      </div>
                    ) : (
                      <div className="py-2">
                        <FileText className={`mx-auto h-6 w-6 md:h-8 md:w-8 mb-2 ${
                          uploadStatus === 'error' ? 'text-finance-negative' : 
                          uploadStatus === 'success' ? 'text-finance-positive' : 
                          'text-muted-foreground'
                        }`} />
                        <p className="font-medium text-sm md:text-base">{selectedFile.name}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {(selectedFile.size / 1024).toFixed(2)} KB • Cliquez pour changer de fichier
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                
                {filePreview && (
                  <div className="border rounded-lg p-2 md:p-3 bg-secondary/30">
                    <p className="text-xs font-medium mb-2">Aperçu du fichier:</p>
                    <pre className="text-xs overflow-x-auto whitespace-pre-wrap bg-background p-2 rounded max-h-36 overflow-y-auto">
                      {filePreview}
                    </pre>
                  </div>
                )}
                
                {uploadStatus === 'success' && (
                  <Alert className="bg-finance-positive/10 border-finance-positive text-finance-positive">
                    <CheckCircle2 className="h-4 w-4" />
                    <AlertDescription>
                      Le fichier a été importé avec succès et est prêt pour validation.
                    </AlertDescription>
                  </Alert>
                )}
                
                {uploadStatus === 'error' && (
                  <Alert className="bg-finance-negative/10 border-finance-negative text-finance-negative">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Une erreur s'est produite lors de l'importation. Veuillez vérifier le format du fichier.
                    </AlertDescription>
                  </Alert>
                )}
                
                {showValidationButtons && (
                  <div className="bg-muted/50 p-4 rounded-lg border border-dashed mt-4">
                    <h3 className="font-medium mb-2">Confirmer l'action</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Veuillez valider ou supprimer ce fichier de compensation.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            className="flex-1 border-finance-negative text-finance-negative hover:bg-finance-negative/10"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Supprimer
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Êtes-vous sûr?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Cette action supprimera définitivement le fichier de compensation et ne peut pas être annulée.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Annuler</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => handleDelete()}
                              className="bg-finance-negative text-white hover:bg-finance-negative/90"
                            >
                              Supprimer
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                      
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button 
                            className="flex-1 bg-finance-positive hover:bg-finance-positive/90 text-white"
                          >
                            <Check className="mr-2 h-4 w-4" />
                            Valider
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Confirmer la validation</AlertDialogTitle>
                            <AlertDialogDescription>
                              Vous êtes sur le point de valider ce fichier de compensation. Cette action appliquera les transactions à la balance du partenaire.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Annuler</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => handleValidate()}
                              className="bg-finance-positive text-white hover:bg-finance-positive/90"
                            >
                              Valider
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex-col sm:flex-row sm:justify-end gap-2">
              <Button 
                variant="outline" 
                type="button"
                onClick={resetForm}
                className="w-full sm:w-auto"
              >
                Réinitialiser
              </Button>
              <Button 
                type="button" 
                disabled={isUploading || !selectedFile || showValidationButtons}
                className="bg-primary/90 hover:bg-primary text-primary-foreground w-full sm:w-auto"
                onClick={handleUpload}
              >
                {isUploading ? "Importation en cours..." : "Importer"}
              </Button>
            </CardFooter>
          </Card>
          
          {(hasValidatedFiles && showValidatedFiles) && (
            <Card>
              <CardHeader>
                <CardTitle>Compensations validées</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Fichier</TableHead>
                        <TableHead>MTO</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Montant</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {compensations.filter(file => file.status === 'validated').map((file) => (
                        <TableRow key={file.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              <FileText className="h-4 w-4 text-muted-foreground" />
                              <span className="truncate max-w-[180px]">{file.filename}</span>
                            </div>
                          </TableCell>
                          <TableCell>{file.mto}</TableCell>
                          <TableCell>{formatDate(file.uploadDate)}</TableCell>
                          <TableCell>{formatCurrency(file.amount, file.currency)}</TableCell>
                          <TableCell>{getStatusBadge(file.status)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
      
      <div className="fixed top-0 right-0 w-1/3 h-1/3 bg-gradient-gold opacity-[0.03] blur-3xl rounded-full"></div>
      <div className="fixed bottom-0 left-0 w-1/4 h-1/4 bg-gradient-gold opacity-[0.03] blur-3xl rounded-full"></div>
    </div>
  );
}
