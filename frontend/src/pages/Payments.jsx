import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X } from 'lucide-react';
import API from '../services/api';

export default function Payments() {
    const [payments, setPayments] = useState([]);
    const [invoices, setInvoices] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState({ invoice: '', amount: 0, paymentMode: 'Cash', transactionReference: '', remarks: '' });

    const fetchPayments = () => API.get('/payments').then(r => setPayments(r.data)).catch(console.error);
    useEffect(() => {
        fetchPayments();
        API.get('/invoices').then(r => setInvoices(r.data));
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await API.post('/payments', { ...form, amount: Number(form.amount) });
            setShowModal(false);
            setForm({ invoice: '', amount: 0, paymentMode: 'Cash', transactionReference: '', remarks: '' });
            fetchPayments();
        } catch (err) {
            alert(err.response?.data?.message || 'Error');
        }
    };

    const modeColor = { Cash: 'bg-green-500/20 text-green-300', UPI: 'bg-purple-500/20 text-purple-300', 'Bank Transfer': 'bg-blue-500/20 text-blue-300', Cheque: 'bg-amber-500/20 text-amber-300' };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <motion.h1 initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="text-3xl font-bold text-white">Payments</motion.h1>
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setShowModal(true)} className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white px-4 py-2 rounded-xl font-semibold shadow-lg">
                    <Plus size={18} /> Record Payment
                </motion.button>
            </div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-slate-800/80 backdrop-blur-sm rounded-2xl border border-slate-700/50 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-900/50">
                            <tr>
                                {['Customer', 'Invoice', 'Amount', 'Mode', 'Date', 'Reference'].map(h => (
                                    <th key={h} className="px-4 py-3 text-slate-400 text-sm font-semibold">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            <AnimatePresence>
                                {payments.map((p, i) => (
                                    <motion.tr key={p._id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} className="border-t border-slate-700/50 hover:bg-slate-700/30 transition-colors">
                                        <td className="px-4 py-3 text-white font-medium">{p.customer?.customerName}</td>
                                        <td className="px-4 py-3 text-slate-300">{p.invoice?.invoiceNumber}</td>
                                        <td className="px-4 py-3 text-green-400 font-bold">₹{p.amount?.toLocaleString()}</td>
                                        <td className="px-4 py-3"><span className={`px-2 py-1 rounded-full text-xs font-bold ${modeColor[p.paymentMode] || ''}`}>{p.paymentMode}</span></td>
                                        <td className="px-4 py-3 text-slate-300">{new Date(p.paymentDate).toLocaleDateString()}</td>
                                        <td className="px-4 py-3 text-slate-400">{p.transactionReference || '-'}</td>
                                    </motion.tr>
                                ))}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>
                {payments.length === 0 && <p className="text-center text-slate-500 py-8">No payments found.</p>}
            </motion.div>

            <AnimatePresence>
                {showModal && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }} className="bg-slate-800 border border-slate-700 rounded-2xl p-6 w-full max-w-lg">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold text-white">Record Payment</h2>
                                <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white"><X size={20} /></button>
                            </div>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-slate-400 text-sm mb-1">Invoice *</label>
                                    <select value={form.invoice} onChange={e => setForm({ ...form, invoice: e.target.value })} required className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500">
                                        <option value="">Select Invoice</option>
                                        {invoices.map(inv => <option key={inv._id} value={inv._id}>{inv.invoiceNumber} - ₹{inv.grandTotal?.toLocaleString()}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-slate-400 text-sm mb-1">Amount *</label>
                                    <input type="number" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} required className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500" />
                                </div>
                                <div>
                                    <label className="block text-slate-400 text-sm mb-1">Payment Mode *</label>
                                    <select value={form.paymentMode} onChange={e => setForm({ ...form, paymentMode: e.target.value })} className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500">
                                        <option value="Cash">Cash</option>
                                        <option value="UPI">UPI</option>
                                        <option value="Bank Transfer">Bank Transfer</option>
                                        <option value="Cheque">Cheque</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-slate-400 text-sm mb-1">Transaction Reference</label>
                                    <input value={form.transactionReference} onChange={e => setForm({ ...form, transactionReference: e.target.value })} className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500" />
                                </div>
                                <div>
                                    <label className="block text-slate-400 text-sm mb-1">Remarks</label>
                                    <input value={form.remarks} onChange={e => setForm({ ...form, remarks: e.target.value })} className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500" />
                                </div>
                                <div className="flex justify-end gap-3 mt-4">
                                    <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors">Cancel</button>
                                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} type="submit" className="px-6 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-bold rounded-lg shadow-lg">Record Payment</motion.button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
