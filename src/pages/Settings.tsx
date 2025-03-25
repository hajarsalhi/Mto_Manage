
import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

export default function Settings() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("general");

  const handleAddMTO = () => {
    navigate("/add-mto");
  };

  return (
    <Layout>
      <div className="container py-10 max-w-screen-xl mx-auto pt-20">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Paramètres</h1>
        </div>

        <Tabs 
          defaultValue="general" 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="w-full space-y-6"
        >
          <TabsList className="grid grid-cols-3 w-full max-w-md">
            <TabsTrigger value="general">Général</TabsTrigger>
            <TabsTrigger value="partenaires">Partenaires</TabsTrigger>
            <TabsTrigger value="security">Sécurité</TabsTrigger>
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

          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Sécurité</CardTitle>
                <CardDescription>
                  Configurez les paramètres de sécurité pour votre système.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Authentification</p>
                      <p className="text-sm text-muted-foreground">
                        Configurez les méthodes d'authentification et les autorisations d'accès.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={() => {
                    toast({
                      title: "Paramètres de sécurité sauvegardés",
                      description: "Vos paramètres de sécurité ont été mis à jour avec succès.",
                    });
                  }}
                >
                  Sauvegarder les modifications
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
