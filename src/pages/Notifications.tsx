
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
import { Switch } from '@/components/ui/switch';
import { Bell, Clock, Mail, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export default function Notifications() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [sftpEnabled, setSftpEnabled] = useState(false);
  const [notificationTime, setNotificationTime] = useState("16:00");
  const [emailRecipients, setEmailRecipients] = useState("finance@mto.com, operations@mto.com");
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  
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
    
    setIsSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      
      toast({
        title: "Settings saved",
        description: "Notification settings have been updated successfully.",
        duration: 3000,
      });
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background text-foreground relative">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      <Header toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      
      <main 
        className="pt-16 transition-all duration-300"
        style={{ marginLeft: '280px' }}
      >
        <div className="p-6 md:p-10 max-w-3xl mx-auto animate-scale-in">
          <div className="mb-8">
            <h1 className="heading-xl">Notifications</h1>
            <p className="text-muted-foreground mt-1">
              Configure FX rate notification settings for MTO partners
            </p>
          </div>
          
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
                        <h3 className="text-base font-medium">FX Rate Notifications</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          Configure how and when MTO partners receive their FX rate notifications for the next day.
                        </p>
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
                                Send FX rates via email to MTO partners
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
                                  Upload FX rates to MTO's SFTP server
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
                                FX rate notifications will be sent daily at this time
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-accent/50 rounded-lg p-4 border border-border">
                    <h3 className="text-sm font-medium mb-2">About FX Rate Notifications</h3>
                    <p className="text-sm text-muted-foreground">
                      Each day, MTO partners are notified of the FX rate that will be applied to all transactions the following day. This rate is calculated as:
                      <span className="block my-2 px-4 py-2 bg-secondary/70 border border-border rounded font-mono text-xs">
                        FX Rate = Cours de virement × (1 - décote)
                      </span>
                      where <span className="font-medium">décote</span> is the discount rate applied to the official exchange rate.
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
      
      {/* Decorative background elements */}
      <div className="fixed top-0 right-0 w-1/3 h-1/3 bg-gradient-gold opacity-[0.03] blur-3xl rounded-full"></div>
      <div className="fixed bottom-0 left-0 w-1/4 h-1/4 bg-gradient-gold opacity-[0.03] blur-3xl rounded-full"></div>
    </div>
  );
}
