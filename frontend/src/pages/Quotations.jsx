import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Trash2 } from 'lucide-react';
import API from '../services/api';

export default function Quotations() {
    const [quotes, setQuotes] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [products, setProducts] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState({ quotationNumber: '', customer: '', validTill: '', discount: 0, remarks: '', items: [{ product: '', quantity: 1, unitPrice: 0 }] });

    const fetchQuotes = () => API.get('/quotations').then(r => setQuotes(r.data)).catch(console.error);
    useEffect(() => {
        fetchQuotes();
        API.get('/customers').then(r => setCustomers(r.data));
        API.get('/products').then(r => setProducts(r.data));
    }, []);

    const addItem = () => setForm({ ...form, items: [...form.items, { product: '', quantity: 1, unitPrice: 0 }] });
    const removeItem = (i) => setForm({ ...form, items: form.items.filter((_, idx) => idx !== i) });
    const updateItem = (i, field, val) => {
        const items = [...form.items];
        items[i][field] = val;
        if (field === 'product') {
            const p = products.find(pr => pr._id === val);
            if (p) items[i].unitPrice = p.sellingPrice;
        }
        setForm({ ...form, items });
    };

    const calcTotal = () => {
        const sub = form.items.reduce((s, it) => s + it.quantity * it.unitPrice, 0);
        return sub - (form.discount || 0);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await API.post('/quotations', {
                quotationNumber: form.quotationNumber,
                customer: form.customer,
                validTill: form.validTill,
                discount: Number(form.discount),
                remarks: form.remarks,
                products: form.items.map(it => ({ product: it.product, quantity: Number(it.quantity), unitPrice: Number(it.unitPrice) }))
            });
            setShowModal(false);
            setForm({ quotationNumber: '', customer: '', validTill: '', discount: 0, remarks: '', items: [{ product: '', quantity: 1, unitPrice: 0 }] });
            fetchQuotes();
        } catch (err) {
            alert(err.response?.data?.message || 'Error');
        }
    };

    const approveQuote = async (id) => {
        try {
            await API.post(`/quotations/${id}/approve`);
            fetchQuotes();
        } catch (err) {
            alert(err.response?.data?.message || 'Error');
        }
    };

    const statusColor = { Draft: 'bg-gray-500/20 text-gray-300', Sent: 'bg-blue-500/20 text-blue-300', Approved: 'bg-green-500/20 text-green-300', Rejected: 'bg-red-500/20 text-red-300', Expired: 'bg-yellow-500/20 text-yellow-300' };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <motion.h1 initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="text-3xl font-bold text-white">Quotations</motion.h1>
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setShowModal(true)} className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white px-4 py-2 rounded-xl font-semibold shadow-lg">
                    <Plus size={18} /> New Quotation
                </motion.button>
            </div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-slate-800/80 backdrop-blur-sm rounded-2xl border border-slate-700/50 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-900/50">
                            <tr>
                                {['Quote #', 'Customer', 'Grand Total', 'Valid Till', 'Status', 'Actions'].map(h => (
                                    <th key={h} className="px-4 py-3 text-slate-400 text-sm font-semibold">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            <AnimatePresence>
                                {quotes.map((q, i) => (
                                    <motion.tr key={q._id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} className="border-t border-slate-700/50 hover:bg-slate-700/30 transition-colors">
                                        <td className="px-4 py-3 text-white font-medium">{q.quotationNumber}</td>
                                        <td className="px-4 py-3 text-slate-300">{q.customer?.customerName}</td>
                                        <td className="px-4 py-3 text-white font-bold">₹{q.grandTotal?.toLocaleString()}</td>
                                        <td className="px-4 py-3 text-slate-300">{new Date(q.validTill).toLocaleDateString()}</td>
                                        <td className="px-4 py-3"><span className={`px-2 py-1 rounded-full text-xs font-bold ${statusColor[q.status] || ''}`}>{q.status}</span></td>
                                        <td className="px-4 py-3">
                                            {q.status === 'Draft' && (
                                                <motion.button whileHover={{ scale: 1.05 }} onClick={() => approveQuote(q._id)} className="px-3 py-1 bg-green-500/20 text-green-300 rounded-lg text-sm font-semibold hover:bg-green-500/30 transition-colors">Approve</motion.button>
                                            )}
                                        </td>
                                    </motion.tr>
                                ))}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>
                {quotes.length === 0 && <p className="text-center text-slate-500 py-8">No quotations found.</p>}
            </motion.div>

            <AnimatePresence>
                {showModal && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }} className="bg-slate-800 border border-slate-700 rounded-2xl p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold text-white">New Quotation</h2>
                                <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white"><X size={20} /></button>
                            </div>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-slate-400 text-sm mb-1">Quotation # *</label>
                                        <input value={form.quotationNumber} onChange={e => setForm({ ...form, quotationNumber: e.target.value })} required className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500" />
                                    </div>
                                    <div>
                                        <label className="block text-slate-400 text-sm mb-1">Customer *</label>
                                        <select value={form.customer} onChange={e => setForm({ ...form, customer: e.target.value })} required className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500">
                                            <option value="">Select Customer</option>
                                            {customers.map(c => <option key={c._id} value={c._id}>{c.customerName}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-slate-400 text-sm mb-1">Valid Till *</label>
                                        <input type="date" value={form.validTill} onChange={e => setForm({ ...form, validTill: e.target.value })} required className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500" />
                                    </div>
                                </div>

                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <label className="text-slate-300 font-semibold">Items</label>
                                        <button type="button" onClick={addItem} className="text-sm text-purple-400 hover:text-purple-300">+ Add Item</button>
                                    </div>
                                    {form.items.map((item, i) => (
                                        <div key={i} className="grid grid-cols-12 gap-2 mb-2">
                                            <select value={item.product} onChange={e => updateItem(i, 'product', e.target.value)} className="col-span-5 px-2 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm">
                                                <option value="">Select Product</option>
                                                {products.map(p => <option key={p._id} value={p._id}>{p.productName}</option>)}
                                            </select>
                                            <input type="number" placeholder="Qty" value={item.quantity} onChange={e => updateItem(i, 'quantity', e.target.value)} className="col-span-2 px-2 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm" />
                                            <input type="number" placeholder="Price" value={item.unitPrice} onChange={e => updateItem(i, 'unitPrice', e.target.value)} className="col-span-3 px-2 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm" />
                                            <div className="col-span-1 flex items-center justify-center text-white font-bold text-sm">₹{(item.quantity * item.unitPrice).toLocaleString()}</div>
                                            <button type="button" onClick={() => removeItem(i)} className="col-span-1 text-red-400 hover:text-red-300 flex items-center justify-center"><Trash2 size={14} /></button>
                                        </div>
                                    ))}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-slate-400 text-sm mb-1">Discount</label>
                                        <input type="number" value={form.discount} onChange={e => setForm({ ...form, discount: e.target.value })} className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500" />
                                    </div>
                                    <div>
                                        <label className="block text-slate-400 text-sm mb-1">Remarks</label>
                                        <input value={form.remarks} onChange={e => setForm({ ...form, remarks: e.target.value })} className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500" />
                                    </div>
                                    <div className="flex items-end">
                                        <div className="bg-slate-700 p-3 rounded-lg w-full text-center">
                                            <p className="text-slate-400 text-xs">Estimated Total</p>
                                            <p className="text-white text-xl font-bold">₹{calcTotal().toLocaleString()}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-end gap-3 mt-4">
                                    <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors">Cancel</button>
                                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} type="submit" className="px-6 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-bold rounded-lg shadow-lg">Create Quotation</motion.button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
