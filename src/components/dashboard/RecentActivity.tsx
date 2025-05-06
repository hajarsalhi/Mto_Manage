
import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui-custom/Card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { StatusIndicator } from '../ui-custom/StatusIndicator';
import { useNavigate } from 'react-router-dom';
import { Clock, ArrowUpDown, AlertTriangle, File, Wallet, RefreshCw } from 'lucide-react';

interface ActivityItem {
  id: string;
  timestamp: string;
  description: string;
  user: string;
  type: 'balance' | 'risk' | 'compensation' | 'fx' | 'system';
  status: 'success' | 'warning' | 'error' | 'pending';
}

export function RecentActivity() {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("tout");
  const navigate = useNavigate();

  // Simulate data fetch
  useEffect(() => {
    setIsLoading(true);
    
    // Mock data
    const mockData: ActivityItem[] = [
      {
        id: "act1",
        timestamp: new Date(Date.now() - 15 * 60000).toISOString(),
        description: "Correction de solde MTO Remitly",
        user: "Admin",
        type: 'balance',
        status: 'success'
      },
      {
        id: "act2",
        timestamp: new Date(Date.now() - 30 * 60000).toISOString(),
        description: "Mise à jour du taux de change EUR/MAD",
        user: "System",
        type: 'fx',
        status: 'success'
      },
      {
        id: "act3",
        timestamp: new Date(Date.now() - 2 * 3600000).toISOString(),
        description: "Augmentation de la Risk Value Western Union",
        user: "Superviseur",
        type: 'risk',
        status: 'warning'
      },
      {
        id: "act4",
        timestamp: new Date(Date.now() - 5 * 3600000).toISOString(),
        description: "Nouvelle compensation MoneyGram validée",
        user: "Validateur",
        type: 'compensation',
        status: 'success'
      },
      {
        id: "act5",
        timestamp: new Date(Date.now() - 8 * 3600000).toISOString(),
        description: "Partenaire Ria Money Transfer bloqué",
        user: "System",
        type: 'system',
        status: 'error'
      },
      {
        id: "act6",
        timestamp: new Date(Date.now() - 12 * 3600000).toISOString(),
        description: "Import de fichier de compensation en attente",
        user: "Opérateur",
        type: 'compensation',
        status: 'pending'
      },
    ];
    
    const timer = setTimeout(() => {
      setActivities(mockData);
      setIsLoading(false);
    }, 1200);
    
    return () => clearTimeout(timer);
  }, []);

  const formatTime = (timestamp: string) => {
    return new Intl.DateTimeFormat('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: '2-digit',
    }).format(new Date(timestamp));
  };
  
  const getTypeIcon = (type: ActivityItem['type']) => {
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

  const getStatusColor = (status: ActivityItem['status']) => {
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
  
  const getTypeBadge = (type: ActivityItem['type']) => {
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

  const filteredActivities = activeTab === "tout" 
    ? activities 
    : activities.filter(activity => activity.type === activeTab);

  return (
    <Card variant="glass" className="h-full">
      <CardHeader className="flex justify-between items-center">
        <CardTitle className="text-muted-foreground tracking-wide text-sm uppercase font-medium">
          Activité Récente
        </CardTitle>
        <Badge 
          variant="outline" 
          className="cursor-pointer"
          onClick={() => navigate('/activity-history')}
        >
          Voir tout
        </Badge>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="tout" className="mb-4" onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-6 mb-4">
            <TabsTrigger value="tout">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Clock className="h-4 w-4 size-5" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Tout</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </TabsTrigger>
            <TabsTrigger value="balance">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Wallet className="h-4 w-4 size-5" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Balance</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </TabsTrigger>
            <TabsTrigger value="risk">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <AlertTriangle className="h-4 w-4 size-5" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Risk</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </TabsTrigger>
            <TabsTrigger value="compensation">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <File className="h-4 w-4 size-5" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Compensation</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </TabsTrigger>
            <TabsTrigger value="fx">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <ArrowUpDown className="h-4 w-4 size-5" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>FX rate</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </TabsTrigger>
            <TabsTrigger value="system">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <RefreshCw className="h-4 w-4 size-5" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>System</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="space-y-3">
          {isLoading ? (
            Array(5).fill(0).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-16 bg-secondary rounded-lg w-full"></div>
              </div>
            ))
          ) : filteredActivities.length > 0 ? (
            filteredActivities.map((activity) => (
              <div 
                key={activity.id} 
                className="p-3 rounded-lg border border-border bg-card/50 hover:bg-card/80 transition-colors group"
              >
                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    <StatusIndicator status={getStatusColor(activity.status) as any} />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h3 className="font-medium text-sm">{activity.description}</h3>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3.5 w-3.5" />
                        <span>{formatTime(activity.timestamp)}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary" className="text-[10px] h-5 px-1.5 flex items-center gap-1">
                        {getTypeIcon(activity.type)}
                        <span>{getTypeBadge(activity.type)}</span>
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        par {activity.user}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center p-6 text-muted-foreground">
              Aucune activité à afficher
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
