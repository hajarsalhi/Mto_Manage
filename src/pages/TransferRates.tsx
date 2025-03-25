
import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const formSchema = z.object({
  eurRate: z.string().refine(val => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
    message: "Le taux EUR doit être un nombre positif",
  }),
  usdRate: z.string().refine(val => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
    message: "Le taux USD doit être un nombre positif",
  }),
  date: z.string().refine(val => !isNaN(Date.parse(val)), {
    message: "Veuillez entrer une date valide",
  }),
});

type FormValues = z.infer<typeof formSchema>;

export default function TransferRates() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      eurRate: '',
      usdRate: '',
      date: new Date().toISOString().split('T')[0],
    },
  });

  const onSubmit = (data: FormValues) => {
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      
      toast({
        title: "Cours de virement ajoutés",
        description: `Les taux EUR (${data.eurRate}) et USD (${data.usdRate}) ont été ajoutés pour le ${new Date(data.date).toLocaleDateString('fr-FR')}.`,
        duration: 3000,
      });
      
      form.reset({
        eurRate: '',
        usdRate: '',
        date: new Date().toISOString().split('T')[0],
      });
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background text-foreground relative">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      <Header toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      
      <main 
        className="pt-16 transition-all duration-300"
        style={{ marginLeft: isSidebarOpen ? '280px' : '80px' }}
      >
        <div className="p-6 md:p-10 max-w-7xl animate-scale-in">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="heading-xl">Ajouter cours de virement</h1>
              <p className="text-muted-foreground mt-1">
                Spécifiez les taux de virement du jour
              </p>
            </div>
            <div>
              <Button 
                variant="outline" 
                size="sm"
                className="gap-2"
                asChild
              >
                <Link to="/">
                  <ArrowLeft className="h-4 w-4" />
                  <span>Retour au tableau de bord</span>
                </Link>
              </Button>
            </div>
          </div>
          
          <div className="md:max-w-md">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date d'application</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormDescription>
                        Date d'application des taux de virement
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="eurRate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Taux EUR/MAD</FormLabel>
                      <FormControl>
                        <Input placeholder="ex: 10.75" {...field} />
                      </FormControl>
                      <FormDescription>
                        Taux de virement Euro vers MAD
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="usdRate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Taux USD/MAD</FormLabel>
                      <FormControl>
                        <Input placeholder="ex: 9.85" {...field} />
                      </FormControl>
                      <FormDescription>
                        Taux de virement Dollar vers MAD
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  className="w-full gap-2"
                  disabled={isSubmitting}
                >
                  {isSubmitting && <span className="animate-spin">◌</span>}
                  <Save className="h-4 w-4" />
                  <span>Enregistrer les taux</span>
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </main>
      
      {/* Decorative background elements */}
      <div className="fixed top-0 right-0 w-1/3 h-1/3 bg-gradient-gold opacity-[0.03] blur-3xl rounded-full"></div>
      <div className="fixed bottom-0 left-0 w-1/4 h-1/4 bg-gradient-gold opacity-[0.03] blur-3xl rounded-full"></div>
    </div>
  );
}
