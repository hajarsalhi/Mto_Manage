
import { useState } from 'react';
import { format } from 'date-fns';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui-custom/Card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from '@/components/ui/progress';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { StatusIndicator } from '@/components/ui-custom/StatusIndicator';
import { AlertTriangle, CalendarIcon, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MTOData {
  name: string;
  currency: string;
  balance: number;
  currentRisk: number;
  maxRisk: number;
  threshold: number;
  isBlocked: boolean;
}

interface RiskValueFormProps {
  mtoData: Record<string, MTOData>;
  selectedMto: string;
  riskValue: number;
  isBlocked: boolean;
  isAdjusting: boolean;
  startDate: Date | undefined;
  endDate: Date | undefined;
  onMtoChange: (value: string) => void;
  onRiskValueChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onStartDateChange: (date: Date | undefined) => void;
  onEndDateChange: (date: Date | undefined) => void;
  onSubmit: (e: React.FormEvent) => void;
  formatCurrency: (amount: number, currency: string) => string;
  calculatePercentage: () => number;
  getStatusColor: () => string;
}

export function RiskValueForm({
  mtoData,
  selectedMto,
  riskValue,
  isBlocked,
  isAdjusting,
  startDate,
  endDate,
  onMtoChange,
  onRiskValueChange,
  onStartDateChange,
  onEndDateChange,
  onSubmit,
  formatCurrency,
  calculatePercentage,
  getStatusColor
}: RiskValueFormProps) {
  return (
    <Card className="mb-8">
      <form onSubmit={onSubmit}>
        <CardHeader>
          <CardTitle>Adjust Risk Value</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="form-group">
                <Label htmlFor="mto">Select MTO Partner</Label>
                <Select value={selectedMto} onValueChange={onMtoChange}>
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
                    onChange={onRiskValueChange}
                    className="pr-12"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-muted-foreground">
                    {selectedMto && mtoData[selectedMto].currency}
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
                        onSelect={onStartDateChange}
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
                        onSelect={onEndDateChange}
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
                  <span>Critical: {selectedMto && formatCurrency(mtoData[selectedMto].threshold, mtoData[selectedMto].currency)}</span>
                  <span>{calculatePercentage().toFixed(0)}%</span>
                  <span>Max: {selectedMto && formatCurrency(mtoData[selectedMto].maxRisk, mtoData[selectedMto].currency)}</span>
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
  );
}
