import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { Users, Package, FileText, ShoppingCart, Receipt, CreditCard, TrendingUp, AlertTriangle } from 'lucide-react';
import API from '../services/api';

const COLORS = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#6366f1'];
const months = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const StatCard = ({ icon, label, value, color, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: "easeOut", delay }}
        whileHover={{ scale: 1.04, boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
        className="bg-white p-6 rounded-lg border border-elite-border relative overflow-hidden shadow-sm"
    >
        <div className={`absolute top-0 right-0 w-24 h-24 rounded-full blur-3xl opacity-10 ${color}`} />
        <div className="flex items-center gap-3 mb-3">
            <div className={`p-2 rounded-lg ${color} bg-opacity-10`}>{icon}</div>
            <p className="text-gray-500 text-sm font-medium">{label}</p>
        </div>
        <p className="text-3xl font-bold text-gray-800">{value}</p>
    </motion.div>
);

export default function Dashboard() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        API.get('/dashboard').then(res => {
            setStats(res.data);
            setLoading(false);
        }).catch(() => setLoading(false));
    }, []);

    if (loading) return (
        <div className="flex items-center justify-center h-96">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }} className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full" />
        </div>
    );

    const monthlyData = (stats?.monthlyRevenue || []).map(m => ({ name: months[m._id], revenue: m.revenue }));
    const orderData = (stats?.orderStatusChart || []).map(o => ({ name: o._id, value: o.count }));

    return (
        <div>
            <motion.h1 initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="text-3xl font-bold text-gray-800 mb-8">
                Dashboard Overview
            </motion.h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard icon={<Users size={20} className="text-purple-400" />} label="Total Customers" value={stats?.totalCustomers || 0} color="bg-purple-500" delay={0} />
                <StatCard icon={<Package size={20} className="text-blue-400" />} label="Total Products" value={stats?.totalProducts || 0} color="bg-blue-500" delay={0.1} />
                <StatCard icon={<ShoppingCart size={20} className="text-emerald-400" />} label="Total Orders" value={stats?.totalOrders || 0} color="bg-emerald-500" delay={0.2} />
                <StatCard icon={<TrendingUp size={20} className="text-amber-400" />} label="Total Revenue" value={`₹${(stats?.totalRevenue || 0).toLocaleString()}`} color="bg-amber-500" delay={0.3} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard icon={<FileText size={20} className="text-indigo-400" />} label="Quotations" value={stats?.totalQuotations || 0} color="bg-indigo-500" delay={0.4} />
                <StatCard icon={<Receipt size={20} className="text-cyan-400" />} label="Invoices" value={stats?.totalInvoices || 0} color="bg-cyan-500" delay={0.5} />
                <StatCard icon={<CreditCard size={20} className="text-teal-400" />} label="Payments" value={stats?.totalPayments || 0} color="bg-teal-500" delay={0.6} />
                <StatCard icon={<ShoppingCart size={20} className="text-green-400" />} label="Delivered Orders" value={stats?.deliveredOrders || 0} color="bg-green-500" delay={0.7} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, ease: "easeOut", delay: 0.8 }} className="bg-white p-6 rounded-lg border border-elite-border shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Monthly Revenue</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={monthlyData}>
                            <XAxis dataKey="name" stroke="#6b7280" />
                            <YAxis stroke="#6b7280" />
                            <Tooltip contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: 8, color: '#1f2937' }} />
                            <Bar dataKey="revenue" fill="url(#colorGradient)" radius={[8, 8, 0, 0]} />
                            <defs>
                                <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#8b5cf6" />
                                    <stop offset="100%" stopColor="#3b82f6" />
                                </linearGradient>
                            </defs>
                        </BarChart>
                    </ResponsiveContainer>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, ease: "easeOut", delay: 1.0 }} className="bg-white p-6 rounded-lg border border-elite-border shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Order Status</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie data={orderData} cx="50%" cy="50%" outerRadius={100} innerRadius={60} paddingAngle={5} dataKey="value" label>
                                {orderData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                            </Pie>
                            <Tooltip contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: 8, color: '#1f2937' }} />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </motion.div>
            </div>

            {stats?.lowStockProducts?.length > 0 && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, ease: "easeOut", delay: 1.2 }} className="bg-red-50 p-6 rounded-lg border border-red-200">
                    <div className="flex items-center gap-2 mb-4">
                        <AlertTriangle className="text-red-500" size={20} />
                        <h3 className="text-lg font-semibold text-red-700">Low Stock Alerts</h3>
                    </div>
                    <div className="space-y-2">
                        {stats.lowStockProducts.map(p => (
                            <div key={p._id} className="flex justify-between items-center bg-white p-3 rounded border border-red-100 shadow-sm">
                                <span className="text-gray-800 font-medium">{p.productName} <span className="text-gray-500 text-sm">({p.sku})</span></span>
                                <span className="text-red-600 font-bold">{p.currentStock} / {p.minimumStock} min</span>
                            </div>
                        ))}
                    </div>
                </motion.div>
            )}
        </div>
    );
}
