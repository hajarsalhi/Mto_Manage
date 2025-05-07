import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/ui/tabs.tsx';
import CompensationsReport from './Compensations.tsx';
import TransactionsReport from './Transactions.tsx';

const ReportsLayout: React.FC = () => {
  const [activeTab, setActiveTab] = useState('compensations');

  return (
    <div className="container mx-auto py-6">
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-gray-100 p-1 rounded-lg">
          <TabsTrigger 
            value="compensations" 
            className="data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm"
          >
            Compensations reports
          </TabsTrigger>
          <TabsTrigger 
            value="transactions"
            className="data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm"
          >
            Transactions reports
          </TabsTrigger>
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
