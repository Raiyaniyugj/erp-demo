import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X } from 'lucide-react';
import API from '../services/api';

export default function Invoices() {
    const [invoices, setInvoices] = useState([]);
    const [orders, setOrders] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState({ invoiceNumber: '', order: '', dueDate: '' });

    const fetchInvoices = () => API.get('/invoices').then(r => setInvoices(r.data)).catch(console.error);
    useEffect(() => {
        fetchInvoices();
        API.get('/orders').then(r => setOrders(r.data));
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await API.post('/invoices', form);
            setShowModal(false);
            setForm({ invoiceNumber: '', order: '', dueDate: '' });
            fetchInvoices();
        } catch (err) {
            alert(err.response?.data?.message || 'Error');
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <motion.h1 initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="text-3xl font-bold text-white">Invoices</motion.h1>
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setShowModal(true)} className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white px-4 py-2 rounded-xl font-semibold shadow-lg">
                    <Plus size={18} /> Generate Invoice
                </motion.button>
            </div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-slate-800/80 backdrop-blur-sm rounded-2xl border border-slate-700/50 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-900/50">
                            <tr>
                                {['Invoice #', 'Customer', 'Grand Total', 'Invoice Date', 'Due Date', 'Actions'].map(h => (
                                    <th key={h} className="px-4 py-3 text-slate-400 text-sm font-semibold">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            <AnimatePresence>
                                {invoices.map((inv, i) => (
                                    <motion.tr key={inv._id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} className="border-t border-slate-700/50 hover:bg-slate-700/30 transition-colors">
                                        <td className="px-4 py-3 text-white font-medium">{inv.invoiceNumber}</td>
                                        <td className="px-4 py-3 text-slate-300">{inv.customer?.customerName}</td>
                                        <td className="px-4 py-3 text-white font-bold">₹{inv.grandTotal?.toLocaleString()}</td>
                                        <td className="px-4 py-3 text-slate-300">{new Date(inv.invoiceDate).toLocaleDateString()}</td>
                                        <td className="px-4 py-3 text-slate-300">{new Date(inv.dueDate).toLocaleDateString()}</td>
                                        <td className="px-4 py-3 flex gap-2">
                                            <a href={`${import.meta.env.VITE_API_URL || 'http://localhost:5001/api'}/invoices/${inv._id}/pdf`} target="_blank" rel="noreferrer" className="text-xs bg-purple-500/20 text-purple-400 px-2 py-1 rounded hover:bg-purple-500/30 transition">Download PDF</a>
                                            <button onClick={async () => {
                                                try {
                                                    await API.post(`/invoices/${inv._id}/email`);
                                                    alert('Invoice emailed successfully!');
                                                } catch (err) {
                                                    alert('Failed to email invoice');
                                                }
                                            }} className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded hover:bg-blue-500/30 transition">Email</button>
                                        </td>
                                    </motion.tr>
                                ))}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>
                {invoices.length === 0 && <p className="text-center text-slate-500 py-8">No invoices found.</p>}
            </motion.div>

            <AnimatePresence>
                {showModal && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }} className="bg-slate-800 border border-slate-700 rounded-2xl p-6 w-full max-w-lg">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold text-white">Generate Invoice</h2>
                                <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white"><X size={20} /></button>
                            </div>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-slate-400 text-sm mb-1">Invoice Number *</label>
                                    <input value={form.invoiceNumber} onChange={e => setForm({ ...form, invoiceNumber: e.target.value })} required className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500" />
                                </div>
                                <div>
                                    <label className="block text-slate-400 text-sm mb-1">Order *</label>
                                    <select value={form.order} onChange={e => setForm({ ...form, order: e.target.value })} required className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500">
                                        <option value="">Select Order</option>
                                        {orders.map(o => <option key={o._id} value={o._id}>{o.orderNumber} - ₹{o.grandTotal?.toLocaleString()}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-slate-400 text-sm mb-1">Due Date *</label>
                                    <input type="date" value={form.dueDate} onChange={e => setForm({ ...form, dueDate: e.target.value })} required className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500" />
                                </div>
                                <div className="flex justify-end gap-3 mt-4">
                                    <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors">Cancel</button>
                                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} type="submit" className="px-6 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-bold rounded-lg shadow-lg">Generate</motion.button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
