import React, { useState, useEffect } from 'react';
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
import { Switch } from '@/components/ui/switch';
import { Bell, Clock, Mail, FileText, Users, RefreshCw, X, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { mtoData } from '@/data/riskManagementData';
import { format } from 'date-fns';

export default function Notifications() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [sftpEnabled, setSftpEnabled] = useState(false);
  const [notificationTime, setNotificationTime] = useState("16:00");
  const [emailRecipients, setEmailRecipients] = useState("finance@mto.com, operations@mto.com");
  const [selectedMTOs, setSelectedMTOs] = useState<string[]>(["remitly"]);
  const [selectedMTO, setSelectedMTO] = useState<string | undefined>("remitly");
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [notificationEnableTime, setNotificationEnableTime] = useState<Date | null>(null);
  const [notificationEnableUser, setNotificationEnableUser] = useState("Admin User");
  const [isEnabling, setIsEnabling] = useState(false);
  const [currentRates, setCurrentRates] = useState([
    { currency: "USD", rate: 9.5871, updatedAt: new Date(), source: "Cash Plus" },
    { currency: "EUR", rate: 10.3792, updatedAt: new Date(Date.now() - 8000), source: "Cash Plus" },
  ]);
  
  const mtoOptions = Object.entries(mtoData).map(([id, data]) => ({
    id,
    name: data.name
  }));

  useEffect(() => {
    const now = new Date();
    setCurrentRates(prev => prev.map((rate, index) => ({
      ...rate,
      updatedAt: new Date(now.getTime() - (index * 8000))
    })));
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!emailEnabled && !sftpEnabled) {
      toast({
        title: "Error",
        description: "At least one notification method must be enabled.",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }
    
    if (selectedMTOs.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one MTO partner for notifications.",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }
    
    setIsSaving(true);
    
    setTimeout(() => {
      setIsSaving(false);
      
      toast({
        title: "Settings saved",
        description: "Notification settings have been updated successfully.",
        duration: 3000,
      });
    }, 1500);
  };

  const handleMTOSelect = (mtoId: string) => {
    setSelectedMTO(mtoId);
    
    if (!selectedMTOs.includes(mtoId)) {
      setSelectedMTOs(prev => [...prev, mtoId]);
    }
  };

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
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="font-medium">Currency</div>
                <div className="font-medium">Rate</div>
                <div className="font-medium">Source</div>
                
                {currentRates.map((rate) => (
                  <React.Fragment key={rate.currency}>
                    <div className="py-2">{rate.currency}</div>
                    <div className="py-2">{rate.rate.toFixed(4)}</div>
                    <div className="py-2 flex justify-between items-center">
                      <span>{rate.source}</span>
                      <span className="text-xs text-muted-foreground">
                        {format(rate.updatedAt, "HH:mm:ss")}
                      </span>
                    </div>
                  </React.Fragment>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <form onSubmit={handleSubmit}>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  <div className="space-y-6">
                    <div className="flex items-start space-x-4">
                      <Bell className="h-6 w-6 text-muted-foreground mt-1" />
                      <div className="flex-1">
                        <h3 className="text-base font-medium">Notification Configuration</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          Configure how and when MTO partners receive their notifications.
                        </p>
                      </div>
                    </div>
                    
                    <div className="rounded-lg border overflow-hidden">
                      <div className="bg-secondary/70 p-4 border-b border-border">
                        <h3 className="text-sm font-medium">MTO Partners</h3>
                      </div>
                      
                      <div className="p-4 space-y-4">
                        <div className="flex items-center gap-3">
                          <Users className="h-5 w-5 text-muted-foreground" />
                          <div className="flex-1">
                            <div className="form-group">
                              <Label htmlFor="mto-select">Select MTO Partner</Label>
                              <Select value={selectedMTO} onValueChange={handleMTOSelect}>
                                <SelectTrigger id="mto-select" className="w-full mt-2">
                                  <SelectValue placeholder="Sélectionner un partenaire MTO" />
                                </SelectTrigger>
                                <SelectContent>
                                  {mtoOptions.map(mto => (
                                    <SelectItem key={mto.id} value={mto.id}>
                                      {mto.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-lg border overflow-hidden">
                      <div className="bg-secondary/70 p-4 border-b border-border">
                        <h3 className="text-sm font-medium">Notification Methods</h3>
                      </div>
                      
                      <div className="p-4 space-y-4">
                        <div className="flex items-center justify-between py-2">
                          <div className="flex items-center gap-3">
                            <Mail className="h-5 w-5 text-muted-foreground" />
                            <div>
                              <span className="font-medium">Email Notifications</span>
                              <p className="text-sm text-muted-foreground mt-0.5">
                                Send notifications via email to MTO partners
                              </p>
                            </div>
                          </div>
                          <Switch
                            checked={emailEnabled}
                            onCheckedChange={setEmailEnabled}
                          />
                        </div>
                        
                        {emailEnabled && (
                          <div className="ml-8 mt-2 mb-1">
                            <div className="form-group">
                              <Label htmlFor="emailRecipients">Email Recipients</Label>
                              <Input
                                id="emailRecipients"
                                value={emailRecipients}
                                onChange={(e) => setEmailRecipients(e.target.value)}
                                className="mt-2"
                                placeholder="e.g. finance@mto.com, operations@mto.com"
                              />
                              <p className="text-xs text-muted-foreground mt-1.5">
                                Separate multiple email addresses with commas
                              </p>
                            </div>
                          </div>
                        )}
                        
                        <div className="border-t border-border pt-4">
                          <div className="flex items-center justify-between py-2">
                            <div className="flex items-center gap-3">
                              <FileText className="h-5 w-5 text-muted-foreground" />
                              <div>
                                <span className="font-medium">SFTP File Transfer</span>
                                <p className="text-sm text-muted-foreground mt-0.5">
                                  Upload notifications to MTO's SFTP server
                                </p>
                              </div>
                            </div>
                            <Switch
                              checked={sftpEnabled}
                              onCheckedChange={setSftpEnabled}
                            />
                          </div>
                          
                          {sftpEnabled && (
                            <div className="ml-8 mt-2 mb-1">
                              <div className="bg-secondary/40 rounded-md p-3 text-sm">
                                <p>SFTP configuration is managed by system administrators. Contact IT support to set up or modify SFTP connections.</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="rounded-lg border overflow-hidden">
                      <div className="bg-secondary/70 p-4 border-b border-border">
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-medium">Notification Timing</h3>
                          <Badge variant="outline" className="text-xs">Daily</Badge>
                        </div>
                      </div>
                      
                      <div className="p-4 space-y-4">
                        <div className="flex items-start gap-3">
                          <Clock className="h-5 w-5 text-muted-foreground mt-1" />
                          <div className="flex-1">
                            <div className="form-group">
                              <Label htmlFor="notificationTime">Notification Time</Label>
                              <Select value={notificationTime} onValueChange={setNotificationTime}>
                                <SelectTrigger id="notificationTime" className="w-full mt-2">
                                  <SelectValue placeholder="Select notification time" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="09:00">09:00</SelectItem>
                                  <SelectItem value="12:00">12:00</SelectItem>
                                  <SelectItem value="14:00">14:00</SelectItem>
                                  <SelectItem value="16:00">16:00</SelectItem>
                                  <SelectItem value="18:00">18:00</SelectItem>
                                </SelectContent>
                              </Select>
                              <p className="text-xs text-muted-foreground mt-1.5">
                                Notifications will be sent daily at this time
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-accent/50 rounded-lg p-4 border border-border">
                    <h3 className="text-sm font-medium mb-2">About Notifications</h3>
                    <p className="text-sm text-muted-foreground">
                      Partners will receive daily notifications for the FX rates that will be applied to all transactions the following day.
                      Only selected MTO partners will receive these notifications.
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="justify-end space-x-2 border-t pt-6">
                <Button variant="outline" type="button">
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={isSaving}
                  className="bg-primary/90 hover:bg-primary text-primary-foreground"
                >
                  {isSaving ? "Saving..." : "Save Settings"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      </main>
      
      <div className="fixed top-0 right-0 w-1/3 h-1/3 bg-gradient-gold opacity-[0.03] blur-3xl rounded-full"></div>
      <div className="fixed bottom-0 left-0 w-1/4 h-1/4 bg-gradient-gold opacity-[0.03] blur-3xl rounded-full"></div>
    </div>
  );
}

