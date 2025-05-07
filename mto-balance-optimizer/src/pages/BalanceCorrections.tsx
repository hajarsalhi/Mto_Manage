
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
import { Textarea } from '@/components/ui/textarea';
import { ArrowDown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function BalanceCorrections() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [mto, setMto] = useState("");
  const [currentBalance, setCurrentBalance] = useState("326709.94");
  const [correctionAmount, setCorrectionAmount] = useState("-220000");
  const [newBalance, setNewBalance] = useState("106709.94");
  const [motif, setMotif] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { toast } = useToast();
  
  const handleMtoChange = (value: string) => {
    setMto(value);
    
    // Simulate fetching current balance based on selected MTO
    if (value === "remitly") {
      setCurrentBalance("326709.94");
      setNewBalance("106709.94");
    } else if (value === "westernunion") {
      setCurrentBalance("125780.45");
      setNewBalance("125780.45");
    } else if (value === "moneygram") {
      setCurrentBalance("87650.20");
      setNewBalance("87650.20");
    } else if (value === "ria") {
      // Display zero instead of negative value
      setCurrentBalance("0.00");
      setNewBalance("0.00");
    }
  };
  
  const handleCorrectionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCorrectionAmount(value);
    
    // Calculate new balance
    if (value && currentBalance) {
      const current = parseFloat(currentBalance.replace(/,/g, ''));
      const correction = parseFloat(value.replace(/,/g, ''));
      const newBalanceValue = current + correction;
      setNewBalance(newBalanceValue.toFixed(2));
    } else {
      setNewBalance(currentBalance);
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!mto) {
      toast({
        title: "Error",
        description: "Please select an MTO partner.",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }
    
    if (!correctionAmount) {
      toast({
        title: "Error",
        description: "Please enter a correction amount.",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      
      toast({
        title: "Balance corrected",
        description: `The balance for ${mto} has been adjusted successfully.`,
        duration: 3000,
      });
      
      // Reset form
      setMotif("");
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
            <h1 className="heading-xl">Balance Corrections</h1>
            <p className="text-muted-foreground mt-1">
              Adjust MTO balances and record corrections
            </p>
          </div>
          
          <Card>
            <form onSubmit={handleSubmit}>
              <CardHeader>
                <CardTitle>Correct MTO Balance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="form-group">
                    <Label htmlFor="mto">MTO Partner</Label>
                    <Select value={mto} onValueChange={handleMtoChange}>
                      <SelectTrigger id="mto" className="w-full mt-2">
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
                  
                  <div className="space-y-4 rounded-lg border border-border p-4">
                    <div className="form-group">
                      <Label htmlFor="currentBalance">Current Balance</Label>
                      <Input
                        id="currentBalance"
                        value={currentBalance}
                        readOnly
                        disabled
                        className="mt-2 bg-secondary/50"
                      />
                    </div>
                    
                    <div className="relative flex items-center justify-center py-2">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-px h-full bg-border"></div>
                      </div>
                      <div className="relative z-10 flex items-center justify-center w-8 h-8 rounded-full bg-secondary/50 border border-border">
                        <ArrowDown className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                    
                    <div className="form-group">
                      <Label htmlFor="correctionAmount">Correction Amount (in currency)</Label>
                      <Input
                        id="correctionAmount"
                        value={correctionAmount}
                        onChange={handleCorrectionChange}
                        className="mt-2"
                        placeholder="Enter amount (use - for deductions)"
                      />
                    </div>
                    
                    <div className="relative flex items-center justify-center py-2">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-px h-full bg-border"></div>
                      </div>
                      <div className="relative z-10 flex items-center justify-center w-8 h-8 rounded-full bg-secondary/50 border border-border">
                        <ArrowDown className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                    
                    <div className="form-group mb-0">
                      <Label htmlFor="newBalance">New Balance</Label>
                      <Input
                        id="newBalance"
                        value={newBalance}
                        readOnly
                        className="mt-2 bg-secondary/50 font-medium"
                      />
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <Label htmlFor="motif">Motif (Reason for correction)</Label>
                    <Textarea
                      id="motif"
                      value={motif}
                      onChange={(e) => setMotif(e.target.value)}
                      className="mt-2"
                      placeholder="Enter the reason for this balance correction"
                      rows={4}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="justify-end space-x-2">
                <Button variant="outline" type="button">
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={isSubmitting || !mto || !correctionAmount}
                  className="bg-primary/90 hover:bg-primary text-primary-foreground"
                >
                  {isSubmitting ? "Processing..." : "Apply Correction"}
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
