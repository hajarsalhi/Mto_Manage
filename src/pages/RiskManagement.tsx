
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
import { Progress } from '@/components/ui/progress';
import { StatusIndicator } from '@/components/ui-custom/StatusIndicator';
import { AlertTriangle, ArrowRight, CalendarIcon, TrendingUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export default function RiskManagement() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedMto, setSelectedMto] = useState("remitly");
  const [riskValue, setRiskValue] = useState(50000);
  const [isBlocked, setIsBlocked] = useState(false);
  const [isAdjusting, setIsAdjusting] = useState(false);
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const { toast } = useToast();

  const mtoData = {
    remitly: {
      name: "Remitly",
      currency: "EUR",
      balance: 326709.94,
      currentRisk: 50000,
      maxRisk: 100000,
      threshold: 25000,
      isBlocked: false
    },
    westernunion: {
      name: "Western Union",
      currency: "USD",
      balance: 125780.45,
      currentRisk: 50000,
      maxRisk: 100000,
      threshold: 25000,
      isBlocked: false
    },
    moneygram: {
      name: "MoneyGram",
      currency: "EUR",
      balance: 87650.20,
      currentRisk: 35000,
      maxRisk: 80000,
      threshold: 20000,
      isBlocked: false
    },
    ria: {
      name: "Ria Money Transfer",
      currency: "EUR",
      balance: -1240.75,
      currentRisk: 20000,
      maxRisk: 50000,
      threshold: 10000,
      isBlocked: true
    }
  };

  const handleMtoChange = (value: string) => {
    setSelectedMto(value);
    
    // Set risk value and blocked status based on selected MTO
    if (value in mtoData) {
      const mto = mtoData[value as keyof typeof mtoData];
      setRiskValue(mto.currentRisk);
      setIsBlocked(mto.isBlocked);
    }
  };
  
  const handleRiskValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value)) {
      setRiskValue(value);
    } else {
      setRiskValue(0);
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedMto) {
      toast({
        title: "Error",
        description: "Please select an MTO partner.",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    if (!startDate) {
      toast({
        title: "Error",
        description: "Please select a start date for the risk value period.",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }
    
    setIsAdjusting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsAdjusting(false);
      
      const mto = mtoData[selectedMto as keyof typeof mtoData];
      
      toast({
        title: "Risk value updated",
        description: `Risk value for ${mto.name} has been updated to ${riskValue} ${mto.currency} from ${startDate ? format(startDate, 'PPP') : 'N/A'} to ${endDate ? format(endDate, 'PPP') : 'indefinitely'}.`,
        duration: 3000,
      });
      
      // If the MTO was blocked and risk value is increased, unblock it
      if (isBlocked && riskValue > mto.currentRisk) {
        setIsBlocked(false);
        
        toast({
          title: "MTO unblocked",
          description: `${mto.name} has been unblocked and operations can resume.`,
          duration: 4000,
        });
      }
    }, 1500);
  };
  
  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0
    }).format(amount);
  };
  
  const calculatePercentage = () => {
    if (!selectedMto) return 0;
    
    const mto = mtoData[selectedMto as keyof typeof mtoData];
    return (riskValue / mto.maxRisk) * 100;
  };
  
  const getStatusColor = () => {
    const percentage = calculatePercentage();
    if (percentage < 30) return "bg-finance-negative";
    if (percentage < 60) return "bg-finance-warning";
    return "bg-finance-positive";
  };

  return (
    <div className="min-h-screen bg-background text-foreground relative">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      <Header toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      
      <main 
        className="pt-16 transition-all duration-300"
        style={{ marginLeft: '280px' }}
      >
        <div className="p-6 md:p-10 max-w-7xl mx-auto animate-scale-in">
          <div className="mb-8">
            <h1 className="heading-xl">Risk Management</h1>
            <p className="text-muted-foreground mt-1">
              Manage risk values and monitor MTO operations status
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {Object.entries(mtoData).map(([key, mto]) => (
              <Card 
                key={key} 
                variant="interactive"
                className={cn(
                  mto.isBlocked && "border-finance-negative/30"
                )}
                onClick={() => {
                  setSelectedMto(key);
                  setRiskValue(mto.currentRisk);
                  setIsBlocked(mto.isBlocked);
                }}
              >
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-base">{mto.name}</CardTitle>
                    <StatusIndicator 
                      status={mto.isBlocked ? "negative" : "positive"} 
                      label={mto.isBlocked ? "Blocked" : "Active"}
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Risk Value</span>
                      <span className="font-medium">{formatCurrency(mto.currentRisk, mto.currency)}</span>
                    </div>
                    
                    <div className="space-y-1">
                      <Progress
                        value={(mto.currentRisk / mto.maxRisk) * 100}
                        className="h-1.5"
                        indicatorClassName={
                          mto.currentRisk < mto.threshold 
                            ? "bg-finance-negative" 
                            : mto.currentRisk < mto.maxRisk * 0.6 
                              ? "bg-finance-warning" 
                              : "bg-finance-positive"
                        }
                      />
                    </div>
                    
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Min: {formatCurrency(mto.threshold, mto.currency)}</span>
                      <span>Max: {formatCurrency(mto.maxRisk, mto.currency)}</span>
                    </div>
                    
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-sm text-muted-foreground">Balance</span>
                      <span className={cn(
                        "font-medium",
                        mto.balance < 0 ? "text-finance-negative" : "text-finance-positive"
                      )}>
                        {formatCurrency(mto.balance, mto.currency)}
                      </span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="pt-2 justify-end">
                  <Button variant="ghost" size="sm" className="h-7 text-xs gap-1 text-primary/80 hover:text-primary">
                    <span>Details</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          
          <Card>
            <form onSubmit={handleSubmit}>
              <CardHeader>
                <CardTitle>Adjust Risk Value</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="form-group">
                      <Label htmlFor="mto">Select MTO Partner</Label>
                      <Select value={selectedMto} onValueChange={handleMtoChange}>
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
                    
                    <div className="form-group">
                      <Label htmlFor="riskValue">Risk Value</Label>
                      <div className="relative mt-2">
                        <Input
                          id="riskValue"
                          type="number"
                          value={riskValue}
                          onChange={handleRiskValueChange}
                          className="pr-12"
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-muted-foreground">
                          {selectedMto && mtoData[selectedMto as keyof typeof mtoData].currency}
                        </div>
                      </div>
                    </div>

                    <div className="form-group">
                      <Label htmlFor="startDate">Start Date</Label>
                      <div className="mt-2">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              id="startDate"
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !startDate && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {startDate ? format(startDate, "PPP") : <span>Select start date</span>}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={startDate}
                              onSelect={setStartDate}
                              initialFocus
                              className="pointer-events-auto"
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>

                    <div className="form-group">
                      <Label htmlFor="endDate">End Date (Optional)</Label>
                      <div className="mt-2">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              id="endDate"
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !endDate && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {endDate ? format(endDate, "PPP") : <span>Select end date</span>}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={endDate}
                              onSelect={setEndDate}
                              disabled={(date) => date < (startDate || new Date())}
                              initialFocus
                              className="pointer-events-auto"
                            />
                          </PopoverContent>
                        </Popover>
                        <p className="text-xs text-muted-foreground mt-1">
                          Leave blank for indefinite risk value application
                        </p>
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <Label className="text-sm">Risk Value Range</Label>
                      <Progress
                        value={calculatePercentage()}
                        className="h-2 mt-2"
                        indicatorClassName={getStatusColor()}
                      />
                      <div className="flex justify-between items-center text-xs text-muted-foreground mt-1">
                        <span>Critical: {selectedMto && formatCurrency(mtoData[selectedMto as keyof typeof mtoData].threshold, mtoData[selectedMto as keyof typeof mtoData].currency)}</span>
                        <span>{calculatePercentage().toFixed(0)}%</span>
                        <span>Max: {selectedMto && formatCurrency(mtoData[selectedMto as keyof typeof mtoData].maxRisk, mtoData[selectedMto as keyof typeof mtoData].currency)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="rounded-lg overflow-hidden">
                      <div className="bg-secondary/70 p-4 border-b border-border">
                        <h3 className="text-sm font-medium">MTO Status</h3>
                      </div>
                      <div className="p-5 border border-t-0 rounded-b-lg">
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-sm font-medium">Current Status:</span>
                          <StatusIndicator 
                            status={isBlocked ? "negative" : "positive"} 
                            pulsate={isBlocked}
                            label={isBlocked ? "Blocked" : "Active"}
                          />
                        </div>
                        
                        <div className={cn(
                          "p-4 rounded-lg border text-sm flex items-start gap-3",
                          isBlocked ? 
                            "bg-finance-negative/10 border-finance-negative/20 text-finance-negative" : 
                            "bg-finance-positive/10 border-finance-positive/20 text-finance-positive"
                        )}>
                          {isBlocked ? (
                            <AlertTriangle className="h-5 w-5 flex-shrink-0" />
                          ) : (
                            <TrendingUp className="h-5 w-5 flex-shrink-0" />
                          )}
                          <div>
                            {isBlocked ? (
                              <p>MTO operations are currently blocked. Increase the Risk Value to unblock operations.</p>
                            ) : (
                              <p>Risk value is within acceptable limits. MTO operations are running normally.</p>
                            )}
                          </div>
                        </div>
                        
                        <div className="mt-6 text-sm text-muted-foreground">
                          {isBlocked ? (
                            <p>The MTO is blocked because the risk value is too low compared to the current balance. Increasing the risk value will allow operations to resume.</p>
                          ) : (
                            <p>Maintain adequate risk value to prevent operations from being blocked. The system will automatically block operations if risk value + balance is negative.</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="justify-end space-x-2 border-t pt-6">
                <Button variant="outline" type="button">
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={isAdjusting || !selectedMto || !startDate}
                  className={cn(
                    "bg-primary/90 hover:bg-primary text-primary-foreground",
                    isBlocked && "bg-finance-positive hover:bg-finance-positive/90"
                  )}
                >
                  {isAdjusting 
                    ? "Processing..." 
                    : isBlocked 
                      ? "Unblock & Update Risk Value" 
                      : "Update Risk Value"
                  }
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
