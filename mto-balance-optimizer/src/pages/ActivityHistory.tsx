
import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui-custom/Card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Search, Download, Clock, Calendar, ArrowUpDown, AlertTriangle, File, Wallet, RefreshCw, User } from 'lucide-react';
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from '@/components/ui/pagination';
import { StatusIndicator } from '../components/ui-custom/StatusIndicator';

interface ActivityRecord {
  id: string;
  timestamp: string;
  description: string;
  user: string;
  type: 'balance' | 'risk' | 'compensation' | 'fx' | 'system';
  status: 'success' | 'warning' | 'error' | 'pending';
  details?: string;
}

export default function ActivityHistory() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activities, setActivities] = useState<ActivityRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeType, setActiveType] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  // Simulate data fetch
  useEffect(() => {
    // Mock data
    const mockData: ActivityRecord[] = [
      {
        id: "act1",
        timestamp: new Date(Date.now() - 15 * 60000).toISOString(),
        description: "Correction de solde MTO Remitly",
        user: "Admin",
        type: 'balance',
        status: 'success',
        details: "Correction de -220,000 EUR appliquée"
      },
      {
        id: "act2",
        timestamp: new Date(Date.now() - 30 * 60000).toISOString(),
        description: "Mise à jour du taux de change EUR/MAD",
        user: "System",
        type: 'fx',
        status: 'success',
        details: "Nouveau taux: 10.912, Décote: 1.8%, Taux effectif: 10.715"
      },
      {
        id: "act3",
        timestamp: new Date(Date.now() - 2 * 3600000).toISOString(),
        description: "Augmentation de la Risk Value Western Union",
        user: "Superviseur",
        type: 'risk',
        status: 'warning',
        details: "Risk Value augmentée de 35,000 EUR à 50,000 EUR"
      },
      {
        id: "act4",
        timestamp: new Date(Date.now() - 5 * 3600000).toISOString(),
        description: "Nouvelle compensation MoneyGram validée",
        user: "Validateur",
        type: 'compensation',
        status: 'success',
        details: "42,150.80 USD, 187 transactions"
      },
      {
        id: "act5",
        timestamp: new Date(Date.now() - 8 * 3600000).toISOString(),
        description: "Partenaire Ria Money Transfer bloqué",
        user: "System",
        type: 'system',
        status: 'error',
        details: "Risk Value insuffisante. Blocage automatique activé."
      },
      {
        id: "act6",
        timestamp: new Date(Date.now() - 12 * 3600000).toISOString(),
        description: "Import de fichier de compensation en attente",
        user: "Opérateur",
        type: 'compensation',
        status: 'pending',
        details: "Fichier RIA_compensation_20230612.txt en attente de validation"
      },
      {
        id: "act7",
        timestamp: new Date(Date.now() - 1 * 86400000).toISOString(),
        description: "Notification FX Rate envoyée",
        user: "System",
        type: 'fx',
        status: 'success',
        details: "Notifications envoyées à tous les partenaires MTO"
      },
      {
        id: "act8",
        timestamp: new Date(Date.now() - 1.2 * 86400000).toISOString(),
        description: "Modification du paramétrage des notifications",
        user: "Admin",
        type: 'system',
        status: 'success',
        details: "Heure de notification modifiée: 16:00"
      },
      {
        id: "act9",
        timestamp: new Date(Date.now() - 1.5 * 86400000).toISOString(),
        description: "Décote Western Union mise à jour",
        user: "Superviseur",
        type: 'fx',
        status: 'warning',
        details: "Décote modifiée de 1.5% à 1.8%"
      },
      {
        id: "act10",
        timestamp: new Date(Date.now() - 2 * 86400000).toISOString(),
        description: "Compensation MoneyGram rejetée",
        user: "Validateur",
        type: 'compensation',
        status: 'error',
        details: "Format de fichier incorrect"
      },
      {
        id: "act11",
        timestamp: new Date(Date.now() - 3 * 86400000).toISOString(),
        description: "Déblocage manuel Remitly",
        user: "Admin",
        type: 'risk',
        status: 'success',
        details: "Partenaire débloqué après ajustement de la Risk Value"
      },
      {
        id: "act12",
        timestamp: new Date(Date.now() - 4 * 86400000).toISOString(),
        description: "Connexion utilisateur",
        user: "Superviseur",
        type: 'system',
        status: 'success',
        details: "Connexion depuis 192.168.1.45"
      },
    ];
    
    setTimeout(() => {
      setActivities(mockData);
      setTotalPages(Math.ceil(mockData.length / 8));
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
  
  const getTypeIcon = (type: ActivityRecord['type']) => {
    switch (type) {
      case 'balance':
        return <Wallet className="h-4 w-4" />;
      case 'risk':
        return <AlertTriangle className="h-4 w-4" />;
      case 'compensation':
        return <File className="h-4 w-4" />;
      case 'fx':
        return <ArrowUpDown className="h-4 w-4" />;
      case 'system':
        return <RefreshCw className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };
  
  const getTypeBadge = (type: ActivityRecord['type']) => {
    switch (type) {
      case 'balance':
        return 'Solde';
      case 'risk':
        return 'Risk Value';
      case 'compensation':
        return 'Compensation';
      case 'fx':
        return 'Taux de change';
      case 'system':
        return 'Système';
      default:
        return type;
    }
  };
  
  const getStatusColor = (status: ActivityRecord['status']) => {
    switch (status) {
      case 'success':
        return 'positive';
      case 'warning':
        return 'warning';
      case 'error':
        return 'negative';
      case 'pending':
        return 'neutral';
      default:
        return 'neutral';
    }
  };
  
  const getStatusBadge = (status: ActivityRecord['status']) => {
    switch (status) {
      case 'success':
        return <Badge variant="outline" className="bg-finance-positive/20 text-finance-positive border-finance-positive/30">Succès</Badge>;
      case 'warning':
        return <Badge variant="outline" className="bg-finance-warning/20 text-finance-warning border-finance-warning/30">Avertissement</Badge>;
      case 'error':
        return <Badge variant="outline" className="bg-finance-negative/20 text-finance-negative border-finance-negative/30">Erreur</Badge>;
      case 'pending':
        return <Badge variant="outline" className="bg-muted">En attente</Badge>;
    }
  };
  
  const filteredActivities = activeType === 'all' 
    ? activities 
    : activities.filter(activity => activity.type === activeType);
    
  const searchedActivities = searchQuery === ''
    ? filteredActivities
    : filteredActivities.filter(activity => 
        activity.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        activity.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (activity.details && activity.details.toLowerCase().includes(searchQuery.toLowerCase()))
      );
  
  const paginatedActivities = searchedActivities.slice((currentPage - 1) * 8, currentPage * 8);
  
  useEffect(() => {
    setTotalPages(Math.ceil(searchedActivities.length / 8));
    setCurrentPage(1);
  }, [searchedActivities.length]);

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
            <h1 className="heading-xl">Historique des Activités</h1>
            <p className="text-muted-foreground mt-1">
              Traçabilité complète des modifications et événements du système
            </p>
          </div>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Journal d'Activité</CardTitle>
              <Button variant="outline" size="sm" className="gap-1">
                <Download className="h-4 w-4" />
                <span>Exporter</span>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
                <div className="relative flex-1 w-full">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input 
                    type="search" 
                    placeholder="Rechercher..." 
                    className="pl-8 w-full" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                <Tabs defaultValue="all" className="w-full sm:w-auto" onValueChange={setActiveType}>
                  <TabsList className="w-full grid grid-cols-3 sm:grid-cols-6">
                    <TabsTrigger value="all">Tout</TabsTrigger>
                    <TabsTrigger value="balance">Soldes</TabsTrigger>
                    <TabsTrigger value="risk">Risk Value</TabsTrigger>
                    <TabsTrigger value="compensation">Compensations</TabsTrigger>
                    <TabsTrigger value="fx">Taux</TabsTrigger>
                    <TabsTrigger value="system">Système</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
              
              {isLoading ? (
                <div className="animate-pulse space-y-3">
                  {Array(8).fill(0).map((_, i) => (
                    <div key={i} className="h-16 bg-secondary rounded-lg w-full"></div>
                  ))}
                </div>
              ) : paginatedActivities.length > 0 ? (
                <div className="relative overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date & Heure</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Utilisateur</TableHead>
                        <TableHead>Détails</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedActivities.map((activity) => (
                        <TableRow key={activity.id}>
                          <TableCell>
                            <div className="flex flex-col">
                              <span className="font-medium">{formatDate(activity.timestamp)}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-start gap-2">
                              <StatusIndicator 
                                status={getStatusColor(activity.status) as any} 
                                className="mt-1" 
                              />
                              <span>{activity.description}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary" className="flex items-center gap-1 h-6">
                              {getTypeIcon(activity.type)}
                              <span>{getTypeBadge(activity.type)}</span>
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {getStatusBadge(activity.status)}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1.5">
                              <User className="h-3.5 w-3.5 text-muted-foreground" />
                              <span>{activity.user}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="text-xs text-muted-foreground">
                              {activity.details || "-"}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center p-8 text-muted-foreground">
                  Aucune activité correspondant aux critères
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
