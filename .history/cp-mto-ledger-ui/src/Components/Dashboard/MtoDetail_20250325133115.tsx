
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Badge } from "@/components/ui/badge";

// Sample data structures for transactions and compensations
interface Transaction {
  id: string;
  date: string;
  amount: number;
  type: "credit" | "debit";
  description: string;
  status: "completed" | "pending" | "failed";
}

interface Compensation {
  id: string;
  date: string;
  amount: number;
  rate: number;
  volume: number;
  status: "paid" | "pending" | "cancelled";
}

interface MtoDetailsProps {
  mtoId: string | null;
  mtoName: string;
  open: boolean;
  onClose: () => void;
}

// Sample data for demonstration
const sampleTransactions: Record<string, Transaction[]> = {
  "1": [
    { id: "t1", date: "2023-10-15", amount: 2500, type: "credit", description: "Monthly settlement", status: "completed" },
    { id: "t2", date: "2023-10-10", amount: 1200, type: "credit", description: "Fee payment", status: "completed" },
    { id: "t3", date: "2023-10-05", amount: 800, type: "debit", description: "Service charge", status: "completed" },
    { id: "t4", date: "2023-09-28", amount: 1500, type: "credit", description: "Additional funding", status: "completed" },
    { id: "t5", date: "2023-09-20", amount: 350, type: "debit", description: "Administrative fee", status: "completed" },
  ],
  "2": [
    { id: "t6", date: "2023-10-12", amount: 1800, type: "credit", description: "Monthly settlement", status: "completed" },
    { id: "t7", date: "2023-10-08", amount: 600, type: "debit", description: "Service charge", status: "completed" },
    { id: "t8", date: "2023-09-30", amount: 950, type: "credit", description: "Fee payment", status: "completed" },
  ],
  "3": [
    { id: "t9", date: "2023-10-14", amount: 1200, type: "credit", description: "Monthly settlement", status: "completed" },
    { id: "t10", date: "2023-10-02", amount: 450, type: "debit", description: "Service charge", status: "completed" },
  ],
  "4": [
    { id: "t11", date: "2023-10-10", amount: 850, type: "credit", description: "Monthly settlement", status: "pending" },
    { id: "t12", date: "2023-09-25", amount: 300, type: "debit", description: "Service charge", status: "completed" },
  ],
  "5": [
    { id: "t13", date: "2023-09-15", amount: 1100, type: "credit", description: "Monthly settlement", status: "completed" },
    { id: "t14", date: "2023-09-05", amount: 400, type: "debit", description: "Service charge", status: "completed" },
  ],
  "6": [
    { id: "t15", date: "2023-10-08", amount: 1650, type: "credit", description: "Monthly settlement", status: "completed" },
    { id: "t16", date: "2023-09-28", amount: 550, type: "debit", description: "Service charge", status: "completed" },
  ],
};

const sampleCompensations: Record<string, Compensation[]> = {
  "1": [
    { id: "c1", date: "2023-10-15", amount: 1250, rate: 0.5, volume: 25000, status: "paid" },
    { id: "c2", date: "2023-09-15", amount: 1150, rate: 0.5, volume: 23000, status: "paid" },
    { id: "c3", date: "2023-08-15", amount: 1050, rate: 0.5, volume: 21000, status: "paid" },
  ],
  "2": [
    { id: "c4", date: "2023-10-15", amount: 750, rate: 0.3, volume: 25000, status: "paid" },
    { id: "c5", date: "2023-09-15", amount: 720, rate: 0.3, volume: 24000, status: "paid" },
  ],
  "3": [
    { id: "c6", date: "2023-10-15", amount: 500, rate: 0.2, volume: 25000, status: "paid" },
    { id: "c7", date: "2023-09-15", amount: 480, rate: 0.2, volume: 24000, status: "paid" },
  ],
  "4": [
    { id: "c8", date: "2023-10-15", amount: 375, rate: 0.15, volume: 25000, status: "pending" },
    { id: "c9", date: "2023-09-15", amount: 360, rate: 0.15, volume: 24000, status: "paid" },
  ],
  "5": [
    { id: "c10", date: "2023-09-15", amount: 600, rate: 0.25, volume: 24000, status: "paid" },
    { id: "c11", date: "2023-08-15", amount: 575, rate: 0.25, volume: 23000, status: "paid" },
  ],
  "6": [
    { id: "c12", date: "2023-10-15", amount: 875, rate: 0.35, volume: 25000, status: "paid" },
    { id: "c13", date: "2023-09-15", amount: 840, rate: 0.35, volume: 24000, status: "paid" },
  ],
};

export function MtoDetails({ mtoId, mtoName, open, onClose }: MtoDetailsProps) {
  const [activeTab, setActiveTab] = useState("transactions");
  
  // Get the relevant data based on the MTO ID
  const transactions = mtoId ? sampleTransactions[mtoId] || [] : [];
  const compensations = mtoId ? sampleCompensations[mtoId] || [] : [];

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>{mtoName} - Details</DialogTitle>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="compensations">Compensations</TabsTrigger>
          </TabsList>
          
          <TabsContent value="transactions" className="mt-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">Transaction History</CardTitle>
              </CardHeader>
              <CardContent>
                {transactions.length === 0 ? (
                  <p className="text-center text-muted-foreground py-4">No transactions found</p>
                ) : (
                  <Table>
                    <TableHeader className="bg-muted/30">
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {transactions.map((transaction) => (
                        <TableRow key={transaction.id}>
                          <TableCell>{transaction.date}</TableCell>
                          <TableCell>
                            <Badge variant={transaction.type === "credit" ? "default" : "secondary"}>
                              {transaction.type}
                            </Badge>
                          </TableCell>
                          <TableCell className={transaction.type === "credit" ? "text-green-600" : "text-red-600"}>
                            {transaction.type === "credit" ? "+" : "-"}
                            {transaction.amount.toLocaleString('en-US', {
                              style: 'currency',
                              currency: 'USD'
                            })}
                          </TableCell>
                          <TableCell>{transaction.description}</TableCell>
                          <TableCell>
                            <Badge variant={
                              transaction.status === "completed" ? "outline" :
                              transaction.status === "pending" ? "secondary" : "destructive"
                            }>
                              {transaction.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="compensations" className="mt-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">Compensation History</CardTitle>
              </CardHeader>
              <CardContent>
                {compensations.length === 0 ? (
                  <p className="text-center text-muted-foreground py-4">No compensations found</p>
                ) : (
                  <Table>
                    <TableHeader className="bg-muted/30">
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Rate</TableHead>
                        <TableHead>Volume</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {compensations.map((compensation) => (
                        <TableRow key={compensation.id}>
                          <TableCell>{compensation.date}</TableCell>
                          <TableCell>
                            {compensation.amount.toLocaleString('en-US', {
                              style: 'currency',
                              currency: 'USD'
                            })}
                          </TableCell>
                          <TableCell>{(compensation.rate * 100).toFixed(2)}%</TableCell>
                          <TableCell>
                            {compensation.volume.toLocaleString('en-US', {
                              style: 'currency',
                              currency: 'USD'
                            })}
                          </TableCell>
                          <TableCell>
                            <Badge variant={
                              compensation.status === "paid" ? "outline" :
                              compensation.status === "pending" ? "secondary" : "destructive"
                            }>
                              {compensation.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
