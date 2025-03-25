
import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { RiskMTOCard } from '@/components/risk-management/RiskMTOCard';
import { RiskValueForm } from '@/components/risk-management/RiskValueForm';
import { RiskHistoryTable } from '@/components/risk-management/RiskHistoryTable';
import { useRiskManagement } from '@/hooks/useRiskManagement';
import { mtoData, riskHistoryData } from '@/data/riskManagementData';

export default function RiskManagement() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  const {
    selectedMto,
    riskValue,
    isBlocked,
    isAdjusting,
    startDate,
    endDate,
    handleMtoChange,
    handleRiskValueChange,
    handleSubmit,
    setStartDate,
    setEndDate,
    formatCurrency,
    calculatePercentage,
    getStatusColor,
    shouldBlockMto,
    calculateMaxRiskValue
  } = useRiskManagement(mtoData, riskHistoryData);

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
              <RiskMTOCard
                key={key}
                mtoId={key}
                mto={mto}
                isSelected={selectedMto === key}
                onSelect={handleMtoChange}
                formatCurrency={formatCurrency}
              />
            ))}
          </div>
          
          <RiskValueForm
            mtoData={mtoData}
            selectedMto={selectedMto}
            riskValue={riskValue}
            isBlocked={isBlocked}
            isAdjusting={isAdjusting}
            startDate={startDate}
            endDate={endDate}
            onMtoChange={handleMtoChange}
            onRiskValueChange={handleRiskValueChange}
            onStartDateChange={setStartDate}
            onEndDateChange={setEndDate}
            onSubmit={handleSubmit}
            formatCurrency={formatCurrency}
            calculatePercentage={calculatePercentage}
            getStatusColor={getStatusColor}
            calculateMaxRiskValue={calculateMaxRiskValue}
          />
          
          <RiskHistoryTable
            riskHistoryData={riskHistoryData}
            selectedMto={selectedMto}
            mtoName={selectedMto ? mtoData[selectedMto].name : undefined}
            formatCurrency={formatCurrency}
          />
        </div>
      </main>
      
      <div className="fixed top-0 right-0 w-1/3 h-1/3 bg-gradient-gold opacity-[0.03] blur-3xl rounded-full"></div>
      <div className="fixed bottom-0 left-0 w-1/4 h-1/4 bg-gradient-gold opacity-[0.03] blur-3xl rounded-full"></div>
    </div>
  );
}
