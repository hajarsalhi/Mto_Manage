import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { MtoForm } from "@/components/mto/MtoForm";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { useParams } from "react-router-dom";

export default function EditMTO() {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { id } = useParams<{ id: string }>();

    const handleSubmit = (data: any) => {
        setIsSubmitting(true);
        
        // Simulate API call
        setTimeout(() => {
          setIsSubmitting(false);
          
          toast({
            title: "MTO modifié avec succès",
            description: `Le MTO ${data.name} a été modifié avec succès`,
            duration: 5000,
          });
          if(id){
            navigate(`/settings/${id}`);
          }
          else{
            navigate('/settings');
          }
        }, 1500);
      };
    return (
            <div className="container">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold">Modifier le MTO {id}</h1>
                </div>
                <div className="bg-card border rounded-lg shadow-sm">
                    <MtoForm 
                        isSubmitting={isSubmitting}
                        onSubmit={handleSubmit}
                        id={id}
                      />
                </div>
            </div>
    );
}
