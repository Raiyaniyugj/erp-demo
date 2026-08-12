import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X } from 'lucide-react';
import API from '../services/api';

export default function Orders() {
    const [orders, setOrders] = useState([]);
    const [quotes, setQuotes] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState({ orderNumber: '', quotation: '', deliveryDate: '', shippingAddress: '' });

    const fetchOrders = () => API.get('/orders').then(r => setOrders(r.data)).catch(console.error);
    useEffect(() => {
        fetchOrders();
        API.get('/quotations').then(r => setQuotes(r.data.filter(q => q.status === 'Approved')));
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await API.post('/orders', form);
            setShowModal(false);
            setForm({ orderNumber: '', quotation: '', deliveryDate: '', shippingAddress: '' });
            fetchOrders();
        } catch (err) {
            alert(err.response?.data?.message || 'Error');
        }
    };

    const updateStatus = async (id, status) => {
        try {
            await API.put(`/orders/${id}`, { orderStatus: status });
            fetchOrders();
        } catch (err) {
            alert(err.response?.data?.message || 'Error');
        }
    };

    const statusColor = {
        Pending: 'bg-yellow-500/20 text-yellow-300',
        Processing: 'bg-blue-500/20 text-blue-300',
        Packed: 'bg-indigo-500/20 text-indigo-300',
        Dispatched: 'bg-purple-500/20 text-purple-300',
        Delivered: 'bg-green-500/20 text-green-300',
        Cancelled: 'bg-red-500/20 text-red-300',
    };

    const nextStatus = { Pending: 'Processing', Processing: 'Packed', Packed: 'Dispatched', Dispatched: 'Delivered' };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <motion.h1 initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="text-3xl font-bold text-white">Sales Orders</motion.h1>
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setShowModal(true)} className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white px-4 py-2 rounded-xl font-semibold shadow-lg">
                    <Plus size={18} /> New Order
                </motion.button>
            </div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-slate-800/80 backdrop-blur-sm rounded-2xl border border-slate-700/50 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-900/50">
                            <tr>
                                {['Order #', 'Customer', 'Total', 'Delivery', 'Payment', 'Status', 'Actions'].map(h => (
                                    <th key={h} className="px-4 py-3 text-slate-400 text-sm font-semibold">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            <AnimatePresence>
                                {orders.map((o, i) => (
                                    <motion.tr key={o._id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} className="border-t border-slate-700/50 hover:bg-slate-700/30 transition-colors">
                                        <td className="px-4 py-3 text-white font-medium">{o.orderNumber}</td>
                                        <td className="px-4 py-3 text-slate-300">{o.customer?.customerName}</td>
                                        <td className="px-4 py-3 text-white font-bold">₹{o.grandTotal?.toLocaleString()}</td>
                                        <td className="px-4 py-3 text-slate-300">{new Date(o.deliveryDate).toLocaleDateString()}</td>
                                        <td className="px-4 py-3"><span className={`px-2 py-1 rounded-full text-xs font-bold ${o.paymentStatus === 'Paid' ? 'bg-green-500/20 text-green-300' : 'bg-yellow-500/20 text-yellow-300'}`}>{o.paymentStatus}</span></td>
                                        <td className="px-4 py-3"><span className={`px-2 py-1 rounded-full text-xs font-bold ${statusColor[o.orderStatus] || ''}`}>{o.orderStatus}</span></td>
                                        <td className="px-4 py-3 flex gap-2">
                                            {nextStatus[o.orderStatus] && (
                                                <motion.button whileHover={{ scale: 1.05 }} onClick={() => updateStatus(o._id, nextStatus[o.orderStatus])} className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-lg text-xs font-semibold hover:bg-blue-500/30">
                                                    → {nextStatus[o.orderStatus]}
                                                </motion.button>
                                            )}
                                            {o.orderStatus !== 'Delivered' && o.orderStatus !== 'Cancelled' && (
                                                <motion.button whileHover={{ scale: 1.05 }} onClick={() => updateStatus(o._id, 'Cancelled')} className="px-3 py-1 bg-red-500/20 text-red-300 rounded-lg text-xs font-semibold hover:bg-red-500/30">
                                                    Cancel
                                                </motion.button>
                                            )}
                                        </td>
                                    </motion.tr>
                                ))}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>
                {orders.length === 0 && <p className="text-center text-slate-500 py-8">No orders found.</p>}
            </motion.div>

            <AnimatePresence>
                {showModal && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }} className="bg-slate-800 border border-slate-700 rounded-2xl p-6 w-full max-w-lg">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold text-white">Create Order from Quotation</h2>
                                <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white"><X size={20} /></button>
                            </div>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-slate-400 text-sm mb-1">Order Number *</label>
                                    <input value={form.orderNumber} onChange={e => setForm({ ...form, orderNumber: e.target.value })} required className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500" />
                                </div>
                                <div>
                                    <label className="block text-slate-400 text-sm mb-1">Approved Quotation *</label>
                                    <select value={form.quotation} onChange={e => setForm({ ...form, quotation: e.target.value })} required className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500">
                                        <option value="">Select Quotation</option>
                                        {quotes.map(q => <option key={q._id} value={q._id}>{q.quotationNumber} - ₹{q.grandTotal?.toLocaleString()}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-slate-400 text-sm mb-1">Delivery Date *</label>
                                    <input type="date" value={form.deliveryDate} onChange={e => setForm({ ...form, deliveryDate: e.target.value })} required className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500" />
                                </div>
                                <div>
                                    <label className="block text-slate-400 text-sm mb-1">Shipping Address</label>
                                    <input value={form.shippingAddress} onChange={e => setForm({ ...form, shippingAddress: e.target.value })} className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500" />
                                </div>
                                <div className="flex justify-end gap-3 mt-4">
                                    <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors">Cancel</button>
                                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} type="submit" className="px-6 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-bold rounded-lg shadow-lg">Create Order</motion.button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
