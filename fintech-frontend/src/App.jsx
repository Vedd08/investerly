import { BrowserRouter, Routes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import "./styles/buttons.css";
import "./styles/home.css";
import "./styles/service-detail.css";
import "./styles/tools.css";

import Navbar from "./components/navbar/Navbar";

import Home from "./pages/Home";
import Contact from "./pages/Contact";
import Partner from "./pages/Partner";
import ServiceDetail from "./pages/ServiceDetail";
import Tools from "./pages/Tools";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProposalGenerator from "./pages/ProposalGenerator";
import ProposalViewer from "./pages/ProposalViewer";
import Dashboard from "./pages/Dashboard";
import Welcome from "./pages/Welcome";

import { AuthProvider } from "./context/AuthContext";

import PrivacyPolicy from "./pages/PrivacyPolicy";
import Terms from "./pages/Terms";
import Disclaimer from "./pages/Disclaimer";

// Investment Calculators
import SIPCalculator from "./components/tools/SIPCalculator";
import LumpsumCalculator from "./components/tools/LumpsumCalculator";
import RetirementCalculator from "./components/tools/RetirementCalculator";

// Loan Calculators
import EMICalculator from "./components/tools/EMICalculator";
import HomeLoanCalculator from "./components/tools/HomeLoanCalculator";
import CarLoanCalculator from "./components/tools/CarLoanCalculator";

// Insurance Calculators
import LifeInsuranceCalculator from "./components/tools/LifeInsuranceCalculator";

// Goal Planning Calculators
import MarriagePlanningCalculator from "./components/tools/MarriagePlanningCalculator";
import EducationPlanningCalculator from "./components/tools/EducationPlanningCalculator";

// Tax Calculators
import TaxCalculator from "./components/tools/TaxCalculator";

// Performance Calculators
import SIPPerformanceCalculator from "./components/tools/SIPPerformanceCalculator";
import FundPerformanceCalculator from "./components/tools/FundPerformanceCalculator";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
        {/* Routes WITH Navbar */}
        <Route path="/" element={
          <>
            <Navbar />
            <Home />
          </>
        } />
        <Route path="/contact" element={
          <>
            <Navbar />
            <Contact />
          </>
        } />
        <Route path="/partner" element={
          <>
            <Navbar />
            <Partner />
          </>
        } />
        <Route path="/services/:slug" element={
          <>
            <Navbar />
            <ServiceDetail />
          </>
        } />
        <Route path="/tools" element={
          <>
            <Navbar />
            <Tools />
          </>
        } />
        <Route path="/privacy-policy" element={
          <>
            <Navbar />
            <PrivacyPolicy />
          </>
        } />
        <Route path="/terms" element={
          <>
            <Navbar />
            <Terms />
          </>
        } />
        <Route path="/disclaimer" element={
          <>
            <Navbar />
            <Disclaimer />
          </>
        } />

        {/* Calculator Routes WITH Navbar */}
        <Route path="/tools/sip-calculator" element={
          <>
            <Navbar />
            <SIPCalculator />
          </>
        } />
        <Route path="/tools/lumpsum-calculator" element={
          <>
            <Navbar />
            <LumpsumCalculator />
          </>
        } />
        <Route path="/tools/retirement-calculator" element={
          <>
            <Navbar />
            <RetirementCalculator />
          </>
        } />
        <Route path="/tools/emi-calculator" element={
          <>
            <Navbar />
            <EMICalculator />
          </>
        } />
        <Route path="/tools/home-loan-calculator" element={
          <>
            <Navbar />
            <HomeLoanCalculator />
          </>
        } />
        <Route path="/tools/car-loan-calculator" element={
          <>
            <Navbar />
            <CarLoanCalculator />
          </>
        } />
        <Route path="/tools/life-insurance-calculator" element={
          <>
            <Navbar />
            <LifeInsuranceCalculator />
          </>
        } />
        <Route path="/tools/marriage-calculator" element={
          <>
            <Navbar />
            <MarriagePlanningCalculator />
          </>
        } />
        <Route path="/tools/education-calculator" element={
          <>
            <Navbar />
            <EducationPlanningCalculator />
          </>
        } />
        <Route path="/tools/tax-calculator" element={
          <>
            <Navbar />
            <TaxCalculator />
          </>
        } />
        <Route path="/tools/sip-performance" element={
          <>
            <Navbar />
            <SIPPerformanceCalculator />
          </>
        } />
        <Route path="/tools/fund-performance" element={
          <>
            <Navbar />
            <FundPerformanceCalculator />
          </>
        } />

        {/* New Pages WITH Navbar */}
        <Route path="/welcome" element={
          <>
            <Navbar />
            <Welcome />
          </>
        } />
        <Route path="/proposal-generator" element={
          <>
            <Navbar />
            <ProposalGenerator />
          </>
        } />
        <Route path="/proposal-viewer" element={
          <>
            <Navbar />
            <ProposalViewer />
          </>
        } />
        <Route path="/dashboard" element={
          <>
            <Navbar />
            <Dashboard />
          </>
        } />

        {/* Auth Pages WITHOUT Navbar (Standalone) */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
    </AuthProvider>
  );
}

export default App;