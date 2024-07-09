import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import LoginPage from '../features/auth/LoginPage';
import DashboardPage from '../features/dashboard/DashboardPage';
import SuppliersPage from '../features/suppliers/SuppliersPage';
import PrivateRoute from './PrivateRoute';
import ProductsPage from '../features/products/ProductsPage';
import PurchaseRequestsPage from '../features/purchase-requests/PurchaseRequestsPage';

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={<PrivateRoute><Layout><DashboardPage /></Layout></PrivateRoute>} />
        <Route path="/suppliers" element={<PrivateRoute><Layout><SuppliersPage /></Layout></PrivateRoute>} />
        <Route path="/products" element={<PrivateRoute><Layout><ProductsPage /></Layout></PrivateRoute>} />
        <Route path="/requests" element={<PrivateRoute><Layout><PurchaseRequestsPage /></Layout></PrivateRoute>} />
      </Routes>
    </Router>
  );
};

export default AppRouter;