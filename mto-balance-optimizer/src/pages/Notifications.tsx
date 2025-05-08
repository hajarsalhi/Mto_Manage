import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui-custom/Card';
import { Button } from '@/components/ui/button';
import { RefreshCw, X, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';

export default function Notifications() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  const { toast } = useToast();
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [notificationEnableTime, setNotificationEnableTime] = useState<Date | null>(null);
  const [notificationEnableUser, setNotificationEnableUser] = useState("Admin User");
  const [isEnabling, setIsEnabling] = useState(false);
  const [currentRates, setCurrentRates] = useState([
    { currency: "USD", rate: 9.5871, updatedAt: new Date(), source: "Cash Plus" },
    { currency: "EUR", rate: 10.3792, updatedAt: new Date(Date.now() - 8000), source: "Cash Plus" },
  ]);
  
  
  useEffect(() => {
    const now = new Date();
    setCurrentRates(prev => prev.map((rate, index) => ({
      ...rate,
      updatedAt: new Date(now.getTime() - (index * 8000))
    })));
  }, []);

  

  const toggleNotifications = () => {
    setIsEnabling(true);
    
    setTimeout(() => {
      const newState = !notificationsEnabled;
      setNotificationsEnabled(newState);
      setNotificationEnableTime(new Date());
      setIsEnabling(false);
      
      toast({
        title: newState ? "Notifications Enabled" : "Notifications Disabled",
        description: newState 
          ? `Notifications have been enabled by ${notificationEnableUser}`
          : `Notifications have been disabled by ${notificationEnableUser}`,
        duration: 3000,
      });
    }, 1000);
  };

  const formatDateTime = (date: Date | null) => {
    if (!date) return "";
    return format(date, "dd-MM-yyyy HH:mm:ss");
  };

  const formatDate = (date: Date | null) => {
    if (!date) return "";
    return format(date, "dd-MM-yyyy");
  };

  return (
    <div className="min-h-screen bg-background text-foreground relative">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      <Header toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      
      <main 
        className="pt-16 transition-all duration-300"
        style={{ marginLeft: '280px' }}
      >
        <div className="p-6 md:p-10 max-w-4xl mx-auto animate-scale-in">
          <div className="mb-8">
            <div className="flex items-center mb-1">
              <h1 className="heading-xl">Notifications</h1>
              <Badge 
                className="ml-3 font-normal bg-secondary text-secondary-foreground"
                variant="secondary"
              >
                Administration
              </Badge>
            </div>
            <p className="text-muted-foreground">
              Configure and manage notifications for MTO partners
            </p>
          </div>
          
          {notificationsEnabled && notificationEnableTime && (
            <div className="bg-muted/30 border border-muted rounded-lg p-4 mb-6 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                <span className="text-sm">
                  {notificationEnableUser} has enabled notifications {formatDateTime(notificationEnableTime)}
                </span>
              </div>
              <Button 
                size="sm" 
                variant="ghost"
                className="h-8 w-8 p-0 rounded-full"
                onClick={() => {}}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
          
          <Card className="mb-8">
            <CardHeader className="pb-4">
              <CardTitle>Activate notifications</CardTitle>
            </CardHeader>
            <CardContent className="pb-4">
              <p className="text-sm text-muted-foreground mb-6">
                Enable or disable notifications for all MTO partners. When enabled, partners will receive FX rate notifications based on the schedule below.
              </p>

              <Button 
                className={`${notificationsEnabled ? 'bg-destructive hover:bg-destructive/90' : 'bg-primary hover:bg-primary/90'} min-w-40`}
                disabled={isEnabling}
                onClick={toggleNotifications}
              >
                {isEnabling ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    {notificationsEnabled ? 'Disabling...' : 'Enabling...'}
                  </>
                ) : (
                  <>
                    {notificationsEnabled ? 'Turn off notifications' : 'Turn on notifications'} {formatDate(new Date())}
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
          
          <Card className="mb-8">
            <CardHeader className="pb-4">
              <CardTitle>Current day</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Currency</TableHead>
                      <TableHead>Rate</TableHead>
                      <TableHead>Source</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentRates.map((rate) => (
                      <TableRow key={rate.currency}>
                        <TableCell>{rate.currency}</TableCell>
                        <TableCell>{rate.rate.toFixed(4)}</TableCell>
                        <TableCell className="flex justify-between items-center">
                          <span>{rate.source}</span>
                          <span className="text-xs text-muted-foreground">
                            {format(rate.updatedAt, "HH:mm:ss")}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
          
          
        </div>
      </main>
      
      <div className="fixed top-0 right-0 w-1/3 h-1/3 bg-gradient-gold opacity-[0.03] blur-3xl rounded-full"></div>
      <div className="fixed bottom-0 left-0 w-1/4 h-1/4 bg-gradient-gold opacity-[0.03] blur-3xl rounded-full"></div>
    </div>
  );
}

