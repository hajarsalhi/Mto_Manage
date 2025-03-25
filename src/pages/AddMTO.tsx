
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Layout } from '@/components/layout/Layout';
import { MtoForm } from '@/components/mto/MtoForm';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function AddMTO() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (data: any) => {
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      
      toast({
        title: "Partenaire ajouté avec succès",
        description: `Le partenaire ${data.name} a été ajouté avec succès`,
        duration: 5000,
      });
      
      navigate('/');
    }, 1500);
  };

  return (
    <Layout>
      <div className="container max-w-4xl py-8">
        <Button 
          variant="ghost" 
          size="sm" 
          className="mb-6" 
          onClick={() => navigate('/')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour au dashboard
        </Button>
        
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Ajouter un partenaire MTO</h1>
        </div>
        
        <div className="bg-card border rounded-lg shadow-sm">
          <MtoForm 
            isSubmitting={isSubmitting}
            onSubmit={handleSubmit}
          />
        </div>
      </div>
    </Layout>
  );
}
