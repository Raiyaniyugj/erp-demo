import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Layout from '../layouts/MainLayout';
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import Customers from '../pages/Customers';
import Products from '../pages/Products';
import Quotations from '../pages/Quotations';
import Orders from '../pages/Orders';
import Invoices from '../pages/Invoices';
import Payments from '../pages/Payments';
import ActivityTimeline from '../pages/ActivityTimeline';
import Reports from '../pages/Reports';

import Profile from '../pages/Profile';

function ProtectedRoute({ children, allowedRoles }) {
    const { user, loading } = useAuth();
    if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">Loading...</div>;
    if (!user) return <Navigate to="/login" />;
    if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/dashboard" />;
    return children;
}

const Wrap = ({ children }) => (
    <ProtectedRoute><Layout>{children}</Layout></ProtectedRoute>
);

const routes = [
    { path: '/login', element: <Login /> },
    { path: '/dashboard', element: <Wrap><Dashboard /></Wrap> },
    { path: '/profile', element: <Wrap><Profile /></Wrap> },
    { path: '/customers', element: <Wrap><Customers /></Wrap> },
    { path: '/products', element: <Wrap><Products /></Wrap> },
    { path: '/quotations', element: <Wrap><Quotations /></Wrap> },
    { path: '/orders', element: <Wrap><Orders /></Wrap> },
    { path: '/invoices', element: <Wrap><Invoices /></Wrap> },
    { path: '/payments', element: <Wrap><Payments /></Wrap> },
    { path: '/activity', element: <Wrap><ActivityTimeline /></Wrap> },
    { path: '/reports', element: <Wrap><Reports /></Wrap> },
    { path: '*', element: <Navigate to="/login" /> },
];

export default routes;
