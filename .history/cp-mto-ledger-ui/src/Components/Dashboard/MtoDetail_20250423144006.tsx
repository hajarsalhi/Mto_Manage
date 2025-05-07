import React,  { use, useEffect } from "react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog.tsx";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs.tsx";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card.tsx";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table.tsx";
import { Badge } from "../ui/badge.tsx";
import { getHistoriesOfTransactionsAndCompensationsByProductId } from "../../services/balance.service.ts";


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
  status: "validated" | "pending" | "cancelled";
}

interface MtoDetailsProps {
  mtoId: number ;
  mtoName: string;
  open: boolean;
  onClose: () => void;
}

// Sample data for demonstration

export function MtoDetails({ mtoId, mtoName, open, onClose }: MtoDetailsProps) {
  const [activeTab, setActiveTab] = useState("transactions");

  // Get the relevant data based on the MTO ID
  useEffect(() => {
    const fetchTransacAndCompensations = async () => {
      try {
        const Data = await getHistoriesOfTransactionsAndCompensationsByProductId(mtoId);
        //setSampleTransactions(Data.transactions);
        //setSampleCompensations(Data.compensations);
        console.log("Data", Data);

      } catch (error) {
        console.error("Error fetching transactions and compensations:", error);
      }   
    }
    fetchTransacAndCompensations();
  }, []);
  


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
                              compensation.status === "validated" ? "outline" :
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


