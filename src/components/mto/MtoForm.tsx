
import { useState, useEffect } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { format } from "date-fns";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarClock, Info } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Le nom du partenaire doit contenir au moins 2 caractères.",
  }),
  description: z.string().optional(),
  commission: z.coerce.number().min(0).max(100),
  currency: z.string().min(1, {
    message: "Veuillez sélectionner une devise.",
  }),
  decote: z.coerce.number().min(0).max(100),
  sendMethod: z.string(),
  sendTime: z.string().optional(),
  isFxRateEnabled: z.boolean().default(false),
  fxRateEmails: z.string().optional(),
  isReconciliationEnabled: z.boolean().default(false),
  reconciliationEmails: z.string().optional(),
});

type MtoFormValues = z.infer<typeof formSchema>;

interface MtoFormProps {
  isSubmitting?: boolean;
  onSubmit: (values: MtoFormValues) => void;
}

export function MtoForm({ isSubmitting = false, onSubmit }: MtoFormProps) {
  const [showFxRateEmails, setShowFxRateEmails] = useState(false);
  const [showReconciliationEmails, setShowReconciliationEmails] = useState(false);
  
  const form = useForm<MtoFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      commission: 0,
      currency: "",
      decote: 0,
      sendMethod: "none",
      sendTime: "",
      isFxRateEnabled: false,
      fxRateEmails: "",
      isReconciliationEnabled: false,
      reconciliationEmails: "",
    },
  });

  const watchSendMethod = form.watch("sendMethod");
  const watchIsFxRateEnabled = form.watch("isFxRateEnabled");
  const watchIsReconciliationEnabled = form.watch("isReconciliationEnabled");
  
  // Update email visibility when checkbox values change
  useEffect(() => {
    setShowFxRateEmails(watchIsFxRateEnabled);
  }, [watchIsFxRateEnabled]);
  
  useEffect(() => {
    setShowReconciliationEmails(watchIsReconciliationEnabled);
  }, [watchIsReconciliationEnabled]);

  const handleFormSubmit = (values: MtoFormValues) => {
    onSubmit(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="p-6 space-y-8">
        <div className="space-y-6">
          <h3 className="text-lg font-medium">Informations générales</h3>
          
          <div className="grid gap-6 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom du partenaire</FormLabel>
                  <FormControl>
                    <Input placeholder="ex: Remitly" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="currency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Devise</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner une devise" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="EUR">EUR</SelectItem>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="GBP">GBP</SelectItem>
                      <SelectItem value="MAD">MAD</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Informations complémentaires sur le partenaire..."
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="space-y-6">
          <h3 className="text-lg font-medium">Paramètres financiers</h3>
          
          <div className="grid gap-6 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="commission"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Commission (%)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min="0" 
                      max="100" 
                      step="0.01"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Pourcentage de commission à appliquer
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="decote"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Décote (%)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min="0" 
                      max="100" 
                      step="0.01"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Pourcentage de décote à appliquer
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        
        <div className="space-y-6">
          <h3 className="text-lg font-medium">Méthode d'envoi</h3>
          
          <FormField
            control={form.control}
            name="sendMethod"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Méthode d'envoi</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner une méthode d'envoi" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="none">Aucune</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="sftp">SFTP</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {watchSendMethod !== "none" && (
            <FormField
              control={form.control}
              name="sendTime"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Heure d'envoi</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={`w-full pl-3 text-left font-normal ${
                            !field.value ? "text-muted-foreground" : ""
                          }`}
                        >
                          {field.value || "Sélectionner l'heure d'envoi"}
                          <CalendarClock className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectContent position="popper">
                          {Array.from({ length: 24 }, (_, i) => i).map((hour) => (
                            <SelectItem key={hour} value={`${hour}:00`}>
                              {hour < 10 ? `0${hour}:00` : `${hour}:00`}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    Heure à laquelle les données seront envoyées chaque jour
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>
        
        <div className="space-y-6">
          <h3 className="text-lg font-medium">Notifications</h3>
          
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="isFxRateEnabled"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Notifications FX Rate</FormLabel>
                    <FormDescription>
                      Activer les notifications de taux de change
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
            
            {watchIsFxRateEnabled && (
              <FormField
                control={form.control}
                name="fxRateEmails"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Emails pour FX Rate</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="exemple@domain.com, exemple2@domain.com"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Séparez les adresses email par des virgules
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            
            <FormField
              control={form.control}
              name="isReconciliationEnabled"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Notifications de réconciliation</FormLabel>
                    <FormDescription>
                      Activer les notifications de réconciliation
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
            
            {watchIsReconciliationEnabled && (
              <FormField
                control={form.control}
                name="reconciliationEmails"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Emails pour réconciliation</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="exemple@domain.com, exemple2@domain.com"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Séparez les adresses email par des virgules
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>
        </div>
        
        <div className="pt-6 flex justify-end space-x-4 border-t">
          <Button variant="outline" type="button" onClick={() => window.history.back()}>
            Annuler
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Création en cours..." : "Créer le partenaire"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
