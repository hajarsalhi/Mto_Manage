
import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui-custom/Card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from '@/hooks/use-toast';
import { Upload, FileText, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useIsMobile } from '@/hooks/use-mobile';

export default function CompensationUpload() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [mto, setMto] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [filePreview, setFilePreview] = useState<string | null>(null);
  
  const { toast } = useToast();
  const isMobile = useIsMobile();
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelectedFile(file);
    setUploadStatus('idle');
    
    if (file) {
      // For CSV or txt files, read the first few lines for preview
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
  
  const handleMtoChange = (value: string) => {
    setMto(value);
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
    
    if (!mto) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un partenaire MTO.",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }
    
    setIsUploading(true);
    
    // Simulate upload
    setTimeout(() => {
      setIsUploading(false);
      
      // Randomly succeed or fail for demo purposes
      const success = Math.random() > 0.3;
      
      if (success) {
        setUploadStatus('success');
        toast({
          title: "Fichier importé avec succès",
          description: `Le fichier de compensation pour ${mto} a été importé et est prêt pour validation.`,
          duration: 3000,
        });
      } else {
        setUploadStatus('error');
        toast({
          title: "Erreur d'importation",
          description: "Le format du fichier est incorrect. Veuillez vérifier le fichier et réessayer.",
          variant: "destructive",
          duration: 3000,
        });
      }
    }, 2000);
  };
  
  const resetForm = () => {
    setSelectedFile(null);
    setFilePreview(null);
    setUploadStatus('idle');
  };

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
          
          <Card>
            <CardHeader>
              <CardTitle>Importer un fichier de compensation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 md:space-y-6">
                <div className="form-group">
                  <Label htmlFor="mto">Partenaire MTO</Label>
                  <Select value={mto} onValueChange={handleMtoChange}>
                    <SelectTrigger id="mto" className="w-full mt-2">
                      <SelectValue placeholder="Sélectionner un partenaire MTO" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="remitly">Remitly</SelectItem>
                      <SelectItem value="westernunion">Western Union</SelectItem>
                      <SelectItem value="moneygram">MoneyGram</SelectItem>
                      <SelectItem value="ria">Ria Money Transfer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
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
                disabled={isUploading || !selectedFile || !mto}
                className="bg-primary/90 hover:bg-primary text-primary-foreground w-full sm:w-auto"
                onClick={handleUpload}
              >
                {isUploading ? "Importation en cours..." : "Importer"}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </main>
      
      <div className="fixed top-0 right-0 w-1/3 h-1/3 bg-gradient-gold opacity-[0.03] blur-3xl rounded-full"></div>
      <div className="fixed bottom-0 left-0 w-1/4 h-1/4 bg-gradient-gold opacity-[0.03] blur-3xl rounded-full"></div>
    </div>
  );
}
