import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/ui/tabs.tsx';
import CompensationsReport from './Compensations.tsx';
import TransactionsReport from './Transactions.tsx';

const ReportsLayout: React.FC = () => {
  const [activeTab, setActiveTab] = useState('compensations');

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Reports</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="compensations">Compensations</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
        </TabsList>
        
        <TabsContent value="compensations">
          <CompensationsReport />
        </TabsContent>
        
        <TabsContent value="transactions">
          <TransactionsReport />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReportsLayout;
