import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import EMICalculator from './pages/EMICalculator';
import EligibilityChecker from './pages/EligibilityChecker';
import LoanProducts from './pages/LoanProducts';
import AboutUs from './pages/AboutUs';
import ContactUs from './pages/ContactUs';
import Login from './pages/Login';
import Register from './pages/Register';
import { PrivacyPolicy, TermsOfService, RiskDisclosure } from './pages/LegalPages';

// Dashboard Imports
import DashboardLayout from './components/DashboardLayout';
import Overview from './pages/dashboard/Overview';
import ApplyLoan from './pages/dashboard/ApplyLoan';
import ApplicationStatus from './pages/dashboard/ApplicationStatus';
import MyLoans from './pages/dashboard/MyLoans';
import Documents from './pages/dashboard/Documents';
import Support from './pages/dashboard/Support';

// Admin Imports
import AdminLayout from './components/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import ApplicationReview from './pages/admin/ApplicationReview';
import UserManagement from './pages/admin/UserManagement';
import ProductManagement from './pages/admin/ProductManagement';
import RepaymentTracking from './pages/admin/RepaymentTracking';
import Reports from './pages/admin/Reports';
import Inquiries from './pages/admin/Inquiries';

const PrivateRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" />;
  if (adminOnly && user.role !== 'admin') return <Navigate to="/dashboard" />;
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Routes>
            {/* Public Routes with Navbar/Footer */}
            <Route path="/" element={<><Navbar /><main className="flex-grow"><Home /></main><Footer /></>} />
            <Route path="/about" element={<><Navbar /><main className="flex-grow"><AboutUs /></main><Footer /></>} />
            <Route path="/products" element={<><Navbar /><main className="flex-grow"><LoanProducts /></main><Footer /></>} />
            <Route path="/calculator" element={<><Navbar /><main className="flex-grow"><EMICalculator /></main><Footer /></>} />
            <Route path="/eligibility" element={<><Navbar /><main className="flex-grow"><EligibilityChecker /></main><Footer /></>} />
            <Route path="/contact" element={<><Navbar /><main className="flex-grow"><ContactUs /></main><Footer /></>} />
            <Route path="/login" element={<><Navbar /><main className="flex-grow"><Login /></main><Footer /></>} />
            <Route path="/register" element={<><Navbar /><main className="flex-grow"><Register /></main><Footer /></>} />
            <Route path="/privacy" element={<><Navbar /><main className="flex-grow"><PrivacyPolicy /></main><Footer /></>} />
            <Route path="/terms" element={<><Navbar /><main className="flex-grow"><TermsOfService /></main><Footer /></>} />
            <Route path="/risk-disclosure" element={<><Navbar /><main className="flex-grow"><RiskDisclosure /></main><Footer /></>} />

            {/* Dashboard Routes (Protected) */}
            <Route path="/dashboard" element={
              <PrivateRoute>
                <DashboardLayout />
              </PrivateRoute>
            }>
              <Route index element={<Overview />} />
              <Route path="apply" element={<ApplyLoan />} />
              <Route path="status" element={<ApplicationStatus />} />
              <Route path="my-loans" element={<MyLoans />} />
              <Route path="documents" element={<Documents />} />
              <Route path="support" element={<Support />} />
            </Route>

            {/* Admin Routes (Protected + Admin Only) */}
            <Route path="/admin" element={
              <PrivateRoute adminOnly>
                <AdminLayout />
              </PrivateRoute>
            }>
              <Route index element={<AdminDashboard />} />
              <Route path="review" element={<ApplicationReview />} />
              <Route path="users" element={<UserManagement />} />
              <Route path="products" element={<ProductManagement />} />
              <Route path="repayments" element={<RepaymentTracking />} />
              <Route path="reports" element={<Reports />} />
              <Route path="inquiries" element={<Inquiries />} />
            </Route>
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
