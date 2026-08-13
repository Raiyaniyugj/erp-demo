import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Home, Users, Package, FileText, ShoppingCart, Receipt, CreditCard, LogOut, Activity, BarChart2, User } from 'lucide-react';

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
        <div className="w-64 bg-white/5 backdrop-blur-lg border-r border-white/20 min-h-screen flex flex-col p-4 text-white shadow-2xl relative z-20">
            <h1 className="text-2xl font-bold text-white mb-8 mt-4 text-center tracking-wider">
                <span className="text-purple-400">ELITE</span> ERP
            </h1>
            <nav className="flex-1 space-y-1">
                {menuItems.map((item) => (
                    <Link key={item.name} to={item.path}>
                        <motion.div 
                            whileHover={{ scale: 1.02, backgroundColor: 'rgba(255,255,255,0.1)' }}
                            whileTap={{ scale: 0.98 }}
                            className="flex items-center gap-3 p-3 rounded-md transition-colors cursor-pointer text-slate-300 hover:text-white hover:border-l-4 border-purple-500"
                        >
                            {item.icon}
                            <span className="font-medium text-sm">{item.name}</span>
                        </motion.div>
                    </Link>
                ))}
            </nav>
            <motion.button
                onClick={logout}
                whileHover={{ backgroundColor: 'rgba(239, 68, 68, 0.8)' }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center justify-center gap-2 w-full p-3 bg-white/10 rounded-md mt-auto transition-colors text-sm hover:text-white text-slate-300 border border-white/10"
            >
                <LogOut size={18} />
                <span className="font-semibold">Logout</span>
            </motion.button>
        </div>
    );
}
