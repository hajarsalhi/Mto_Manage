
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import MTODetails from "./pages/MTODetails";
import BalanceCorrections from "./pages/BalanceCorrections";
import RiskManagement from "./pages/RiskManagement";
import Notifications from "./pages/Notifications";
import NotFound from "./pages/NotFound";
import CompensationUpload from "./pages/CompensationUpload";
import CompensationValidation from "./pages/CompensationValidation";
import CompensationHistory from "./pages/CompensationHistory";
import ActivityHistory from "./pages/ActivityHistory";
import TransferRates from "./pages/TransferRates";
import AddMTO from "./pages/AddMTO";
import Settings from "./pages/Settings";
import Account from "./pages/Account";
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/mto-details" element={<MTODetails />} />
          <Route path="/balance-corrections" element={<BalanceCorrections />} />
          <Route path="/risk-management" element={<RiskManagement />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/compensation-upload" element={<CompensationUpload />} />
          <Route path="/compensation-validation" element={<CompensationValidation />} />
          <Route path="/compensation-history" element={<CompensationHistory />} />
          <Route path="/activity-history" element={<ActivityHistory />} />
          <Route path="/transfer-rates" element={<TransferRates />} />
          <Route path="/add-mto" element={<AddMTO />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/account" element={<Account />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
