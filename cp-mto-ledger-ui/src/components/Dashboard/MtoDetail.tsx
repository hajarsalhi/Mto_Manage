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
  date: string;
  number: number;
  amount: number;
  reference: string;
  status: "completed";
}

interface Compensation {
  date: string;
  number: number;
  amount: number;
  reference: string;
  status: "validated";
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
  const [sampleTransactions, setSampleTransactions] = useState<Transaction[]>([]);
  const [sampleCompensations, setSampleCompensations] = useState<Compensation[]>([]);

  // Get the relevant data based on the MTO ID
  useEffect(() => {
    const fetchTransacAndCompensations = async () => {
      try {
        const Data = await getHistoriesOfTransactionsAndCompensationsByProductId(mtoId);
        setSampleTransactions(Data["transactions"]);
        setSampleCompensations(Data["compensations"]);
        console.log("Data", sampleCompensations);

      } catch (error) {
        console.error("Error fetching transactions and compensations:", error);
      }   
    }
    fetchTransacAndCompensations();
  }, []);
  

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
                <CardTitle className="text-base font-medium"> Latest Transaction History</CardTitle>
              </CardHeader>
              <CardContent>
                {sampleTransactions?.length === 0 ? (
                  <p className="text-center text-muted-foreground py-4">No transactions found</p>
                ) : (
                  <Table>
                    <TableHeader className="bg-muted/30">
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Reference</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sampleTransactions?.map((transaction) => (
                        <TableRow key={transaction.number}>
                          <TableCell>{transaction.date}</TableCell>
                          <TableCell>{transaction.reference}</TableCell>
                          <TableCell className={transaction.status === "completed" ? "text-red-600" : "text-green-600"}>
                            {transaction.status === "completed" ? "-" : "+"}
                            {transaction.amount.toLocaleString('en-US', {
                              style: 'currency',
                              currency: 'USD'
                            })}
                          </TableCell>
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
                <CardTitle className="text-base font-medium">Latest Compensation History</CardTitle>
              </CardHeader>
              <CardContent>
                {sampleCompensations?.length === 0 ? (
                  <p className="text-center text-muted-foreground py-4">No compensations found</p>
                ) : (
                  <Table>
                    <TableHeader className="bg-muted/30">
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Reference</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sampleCompensations?.map((compensation) => (
                        <TableRow key={compensation.number}>
                          <TableCell>{compensation.date}</TableCell>
                          <TableCell>{compensation.reference}</TableCell>
                          <TableCell className={compensation.status === "validated" ? "text-green-600" : "text-red-600"}>
                          {compensation.status === "validated" ? "+" : "-"}
                            {compensation.amount.toLocaleString('en-US', {
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
