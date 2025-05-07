import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import NavBar from './components/NavBar.tsx';
import PrivateRoute from './components/PrivateRoute.tsx';
import Home from './pages/Home.tsx';
import Login from './pages/Auth/Login.tsx';
import Unauthorized from './pages/Auth/Unauthorized.tsx';
import BalanceMto from './pages/BalanceMTO/BalanceMto.tsx';
import EditBalance from './pages/BalanceMTO/EditBalance.tsx';
import Corrections from './pages/BalanceMTO/Corrections.tsx';
import AllCompensations from './pages/Compensations/AllCompensations.tsx';
import UploadCompensations from './pages/Compensations/UploadCompensations.tsx';
import GetProducts from './pages/ProductManagement/GetProducts.tsx';
import ModifyProduct from './pages/ProductManagement/ModifyProduct.tsx';
import AddNewProduct from './pages/ProductManagement/AddNewProduct.tsx';
import ReferenceRate from './pages/RateReference/ReferenceRate.tsx';
import UpdateRate from './pages/RateReference/UpdateRate.tsx';
import RiskValue from './pages/RiskValue/RiskValue.tsx';
import AddRiskValue from './pages/RiskValue/AddRiskValue.tsx';
import EnableFxRateNotification from './pages/FxRateNotif/EnableFxRateNotification.tsx';
import GetAllNotifications from './pages/FxRateNotif/GetAllNotifications.tsx';
import CompensationsReport from './pages/Reports/Compensations.tsx';
import ReportsLayout from './pages/Reports/ReportsLayout.tsx';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        
        {/* Protected routes */}
        <Route path="/" element={
          <PrivateRoute>
            <div className="flex h-screen">
              <NavBar />
              <main className="flex-1 overflow-auto p-4">
                <Navigate to="/home" replace />
              </main>
            </div>
          </PrivateRoute>
        } />
        
        <Route path="*" element={
          <PrivateRoute>
            <div className="flex h-screen">
              <NavBar />
              <main className="flex-1 overflow-auto p-4">
                <Routes>
                  <Route path="/home" element={<Home />}/>
                  <Route path="/balance" element={<BalanceMto />} />
                  <Route path="/balance/edit/:id" element={<EditBalance />} />
                  <Route path="/balance/corrections" element={<Corrections />} />
                  <Route path="/compensations" element={<AllCompensations />} />
                  <Route path="/compensations/upload" element={<UploadCompensations />} />
                  <Route path="/risk-value" element={<RiskValue />} />
                  <Route path="/risk-value/:id" element={<RiskValue />} />
                  <Route path="/risk-value/add/*" element={<AddRiskValue />} />
                  <Route path="/products" element={<GetProducts />} />
                  <Route path="/products/edit/:id" element={<ModifyProduct />} />
                  <Route path="/products/add" element={<AddNewProduct />} />
                  <Route path="/reference-rate" element={<ReferenceRate />} />
                  <Route path="/reference-rate/update" element={<UpdateRate />} />
                  <Route path="/notifications" element={<EnableFxRateNotification />} />
                  <Route path="/notifications/history" element={<GetAllNotifications />} />
                  <Route path="/reports/compensations" element={<CompensationsReport />} />
                  <Route path="/reports" element={<ReportsLayout />} />
                  <Route path="*" element={<Navigate to="/home" replace />} />
                </Routes>
              </main>
            </div>
          </PrivateRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;
