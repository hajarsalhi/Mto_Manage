import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui-custom/Card';
import { Button } from '@/components/ui/button';
import { StatusIndicator, ValueChange } from '@/components/ui-custom/StatusIndicator';
import { ArrowLeft, LineChart, RefreshCw, Edit, Calendar, DollarSign } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { useToast } from '@/hooks/use-toast';

export default function MTODetails() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [mtos, setMtos] = useState([]);
  const [mto, setMto] = useState(null);  
  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2
    }).format(amount);
  };
  
  const handleEdit = () => {
    navigate(`/settings/${id}`);
  };

  return (
    <div className="min-h-screen bg-background text-foreground relative">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      <Header toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      
      <main 
        className="pt-16 transition-all duration-300"
        style={{ marginLeft: '280px' }}
      >
        <div className="p-6 md:p-10 max-w-7xl animate-scale-in">
          <div className="flex items-center gap-3 mb-8">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigate('/')}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="heading-xl flex items-center gap-3">
                Western Union
                <StatusIndicator status="positive" label="Actif" />
              </h1>
              <p className="text-muted-foreground mt-1">
                Détails du partenaire MTO et transactions
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card variant="glass">
              <CardHeader>
                <CardTitle className="text-muted-foreground tracking-wide text-sm uppercase font-medium">
                  Balance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <h3 className="text-2xl font-bold tracking-tight">
                  {formatCurrency(125780.45, 'USD')}
                </h3>
                <ValueChange 
                  value={2.4} 
                  percentageChange 
                  size="sm"
                  className="mt-1"
                />
              </CardContent>
            </Card>
            
            <Card variant="glass">
              <CardHeader>
                <CardTitle className="text-muted-foreground tracking-wide text-sm uppercase font-medium">
                  Risk Value
                </CardTitle>
              </CardHeader>
              <CardContent>
                <h3 className="text-2xl font-bold tracking-tight">
                  {formatCurrency(50000, 'USD')}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Dernière modification le 15/04/2023
                </p>
              </CardContent>
            </Card>
            
            <Card variant="glass">
              <CardHeader>
                <CardTitle className="text-muted-foreground tracking-wide text-sm uppercase font-medium">
                  Décote
                </CardTitle>
              </CardHeader>
              <CardContent>
                <h3 className="text-2xl font-bold tracking-tight">
                  1.5%
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Appliquée à toutes les transactions
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="mb-6">
            <Card variant="glass">
              <CardHeader>
                <CardTitle className="text-muted-foreground tracking-wide text-sm uppercase font-medium">
                  Résumé de la dernière compensation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-full bg-primary/10">
                      <Calendar className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Dernière compensation reçue</p>
                      <p className="text-lg font-semibold">12 avril 2023</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-full bg-primary/10">
                      <DollarSign className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Montant restant</p>
                      <p className="text-lg font-semibold">{formatCurrency(45230.78, 'USD')}</p>
                      <p className="text-xs text-muted-foreground">Du total: {formatCurrency(75000, 'USD')}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Tabs defaultValue="transactions">
            <TabsList className="mb-6">
              <TabsTrigger value="transactions">Transactions</TabsTrigger>
              <TabsTrigger value="compensations">Compensations</TabsTrigger>
              <TabsTrigger value="settings">Paramètres</TabsTrigger>
            </TabsList>
            
            <TabsContent value="transactions" className="animate-fade-in">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Transactions récentes</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      Dernières transactions pour ce MTO
                    </p>
                  </div>
                  <Button variant="outline" size="sm" className="gap-2">
                    <RefreshCw className="h-4 w-4" />
                    <span>Actualiser</span>
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border">
                    <div className="grid grid-cols-4 p-4 text-sm font-medium border-b">
                      <div>Date</div>
                      <div>Réf</div>
                      <div className="text-right">Montant</div>
                      <div className="text-right">Taux de change</div>
                    </div>
                    
                    {Array(5).fill(0).map((_, i) => (
                      <div key={i} className="grid grid-cols-4 p-4 text-sm border-b last:border-b-0">
                        <div className="text-muted-foreground">15/04/2023</div>
                        <div>WU{100000 + i}</div>
                        <div className={`text-right ${i % 2 === 0 ? 'text-finance-negative' : 'text-finance-positive'}`}>
                          {i % 2 === 0 ? '-' : '+'}{formatCurrency(1000 + i * 500, 'USD')}
                        </div>
                        <div className="text-right text-muted-foreground">10.701</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="justify-center">
                  <Button variant="outline" size="sm" className="gap-2">
                    <LineChart className="h-4 w-4" />
                    <span>Voir toutes les transactions</span>
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="compensations" className="animate-fade-in">
              <Card>
                <CardHeader>
                  <CardTitle>Historique des compensations</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    Opérations de compensation récentes
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border">
                    <div className="grid grid-cols-6 p-4 text-sm font-medium border-b">
                      <div>Date</div>
                      <div>Réf</div>
                      <div className="text-right">Montant</div>
                      <div className="text-right">Balance avant</div>
                      <div className="text-right">Balance après</div>
                      <div className="text-right">Restant</div>
                    </div>
                    
                    {Array(5).fill(0).map((_, i) => (
                      <div key={i} className="grid grid-cols-6 p-4 text-sm border-b last:border-b-0">
                        <div className="text-muted-foreground">{i === 0 ? '12/04/2023' : `${10 - i}/04/2023`}</div>
                        <div>COMP{100000 + i}</div>
                        <div className="text-right text-finance-positive">
                          +{formatCurrency(10000 + i * 5000, 'USD')}
                        </div>
                        <div className="text-right">
                          {formatCurrency(100000 - (i * 10000), 'USD')}
                        </div>
                        <div className="text-right">
                          {formatCurrency(110000 - (i * 5000), 'USD')}
                        </div>
                        <div className="text-right text-muted-foreground">
                          {i === 0 ? 
                            formatCurrency(45230.78, 'USD') : 
                            formatCurrency(0, 'USD')}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="settings" className="animate-fade-in">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Paramètres du MTO</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      Configuration et paramètres
                    </p>
                  </div>
                  <Button variant="outline" size="sm" className="gap-2" onClick={handleEdit}>
                    <Edit className="h-4 w-4" />
                    <span>Modifier</span>
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-sm font-medium mb-1">Informations MTO</h3>
                          <div className="rounded-md border p-4 space-y-3">
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Nom</span>
                              <span>Western Union</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Devise</span>
                              <span>USD</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Créé le</span>
                              <span>01/01/2022</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Statut</span>
                              <StatusIndicator status="positive" label="Actif" />
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <h3 className="text-sm font-medium mb-1">Paramètres financiers</h3>
                          <div className="rounded-md border p-4 space-y-3">
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Balance initial</span>
                              <span>{formatCurrency(100000, 'USD')}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Risk Value actuelle</span>
                              <span>{formatCurrency(50000, 'USD')}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Décote</span>
                              <span>1.5%</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-sm font-medium mb-1">Paramètres de notification</h3>
                          <div className="rounded-md border p-4 space-y-3">
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Notifications des taux de change</span>
                              <Badge>Email</Badge>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Heure de notification</span>
                              <span>16:00</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Destinataires</span>
                              <span>finance@westernunion.com</span>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <h3 className="text-sm font-medium mb-1">Paramètres de sécurité</h3>
                          <div className="rounded-md border p-4 space-y-3">
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Dernière modification</span>
                              <span>15/03/2023</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Modifié par</span>
                              <span>admin@cashplus.ma</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Accès API</span>
                              <Badge>Activé</Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <div className="fixed top-0 right-0 w-1/3 h-1/3 bg-gradient-gold opacity-[0.03] blur-3xl rounded-full"></div>
      <div className="fixed bottom-0 left-0 w-1/4 h-1/4 bg-gradient-gold opacity-[0.03] blur-3xl rounded-full"></div>
    </div>
  );
}
