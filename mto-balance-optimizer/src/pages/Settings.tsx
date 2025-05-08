
import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Bell, Clock, FileText, Mail, Plus, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { mtoData } from '@/data/riskManagementData';

export default function Settings() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("partenaires");
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [sftpEnabled, setSftpEnabled] = useState(false);
  const [notificationTime, setNotificationTime] = useState("16:00");
  const [emailRecipients, setEmailRecipients] = useState("finance@mto.com, operations@mto.com");
  const [selectedMTOs, setSelectedMTOs] = useState<string[]>(["remitly"]);
  const [selectedMTO, setSelectedMTO] = useState<string | undefined>();
  const [isSaving, setIsSaving] = useState(false);

  const mtoOptions = Object.entries(mtoData).map(([id, data]) => ({
      id,
      name: data.name
    }));
  

  const handleAddMTO = () => {
    navigate("/add-mto");
  };

  const handleSubmitNotifForm = (e: React.FormEvent) => {
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

  return (
    <Layout>
      <div className="container py-10 max-w-screen-xl mx-auto pt-10">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Paramètres</h1>
        </div>

        <Tabs 
          defaultValue="general" 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="w-full space-y-6"
        >
          <TabsList className="grid grid-cols-2 w-full max-w-md">
            {/* <TabsTrigger value="general">Général</TabsTrigger> */}
            <TabsTrigger value="partenaires">Partenaires MTOs</TabsTrigger>
            <TabsTrigger value="fx-rate-notifications">Fx Rate Notifications </TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Paramètres généraux</CardTitle>
                <CardDescription>
                  Configurez les paramètres généraux de votre système de balance.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Options d'affichage</p>
                      <p className="text-sm text-muted-foreground">
                        Configurez comment les informations sont affichées dans le tableau de bord.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={() => {
                    toast({
                      title: "Paramètres sauvegardés",
                      description: "Vos paramètres ont été mis à jour avec succès.",
                    });
                  }}
                >
                  Sauvegarder les modifications
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="partenaires" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Gestion des partenaires</CardTitle>
                <CardDescription>
                  Ajoutez et gérez vos partenaires MTO.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <h3 className="text-lg font-medium">Partenaires MTO</h3>
                      <p className="text-sm text-muted-foreground">
                        Gérez les partenaires MTO connectés à votre système.
                      </p>
                    </div>
                    <Button onClick={handleAddMTO} className="gap-2">
                      <Plus className="h-4 w-4" />
                      Ajouter un partenaire MTO
                    </Button>
                  </div>
                  <Separator />
                  
                  <div className="rounded-lg border border-dashed h-40 flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-muted-foreground">Aucun partenaire MTO ajouté</p>
                      <Button 
                        variant="outline" 
                        className="mt-4"
                        onClick={handleAddMTO}
                      >
                        Ajouter votre premier partenaire
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="fx-rate-notifications" className="space-y-6">
          <Card>
            <form onSubmit={handleSubmitNotifForm}>
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
                      <div className="p-4 space-y-6">
                        <div className="flex items-center gap-4">
                          <Users className="h-5 w-5 text-muted-foreground mb-4" />
                          <div className="flex-1">
                            <div className="form-group">
                              <Select value={selectedMTO} onValueChange={handleMTOSelect}>
                                <SelectTrigger className="w-full mt-2">
                                  <SelectValue placeholder="Select an MTO partner" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="remitly">Remitly</SelectItem>
                                  <SelectItem value="westernunion">Western Union</SelectItem>
                                  <SelectItem value="moneygram">MoneyGram</SelectItem>
                                  <SelectItem value="ria">Ria Money Transfer</SelectItem>
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
                              <input
                                type="time"
                                className="w-full p-2 border border-gray-300 rounded-md"
                                value={notificationTime}
                                onChange={(e) => setNotificationTime(e.target.value)}
                                required
                              />
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
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
