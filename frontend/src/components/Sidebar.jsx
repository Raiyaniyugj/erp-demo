import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Home, Users, Package, FileText, ShoppingCart, Receipt, CreditCard, LogOut, Activity, BarChart2 } from 'lucide-react';

export default function Sidebar() {
    const { logout } = useAuth();

    const menuItems = [
        { name: 'Dashboard', path: '/dashboard', icon: <Home size={20} /> },
        { name: 'Customers', path: '/customers', icon: <Users size={20} /> },
        { name: 'Products', path: '/products', icon: <Package size={20} /> },
        { name: 'Quotations', path: '/quotations', icon: <FileText size={20} /> },
        { name: 'Orders', path: '/orders', icon: <ShoppingCart size={20} /> },
        { name: 'Invoices', path: '/invoices', icon: <Receipt size={20} /> },
        { name: 'Payments', path: '/payments', icon: <CreditCard size={20} /> },
        { name: 'Activity', path: '/activity', icon: <Activity size={20} /> },
        { name: 'Reports', path: '/reports', icon: <BarChart2 size={20} /> },
    ];

    return (
        <div className="w-64 bg-slate-900 border-r border-slate-700 min-h-screen flex flex-col p-4 text-white">
            <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 mb-8 mt-4 text-center">
                ERP
            </h1>
            <nav className="flex-1 space-y-2">
                {menuItems.map((item) => (
                    <Link key={item.name} to={item.path}>
                        <motion.div 
                            whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.1)' }}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center gap-3 p-3 rounded-xl transition-colors cursor-pointer"
                        >
                            {item.icon}
                            <span className="font-medium">{item.name}</span>
                        </motion.div>
                    </Link>
                ))}
            </nav>
            <motion.button
                onClick={logout}
                whileHover={{ scale: 1.05, backgroundColor: '#ef4444' }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center justify-center gap-2 w-full p-3 bg-slate-800 rounded-xl mt-auto transition-colors"
            >
                <LogOut size={20} />
                <span className="font-bold">Logout</span>
            </motion.button>
        </div>
    );
}
