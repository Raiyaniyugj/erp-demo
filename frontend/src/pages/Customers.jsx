import { useEffect, useState, useRef } from 'react';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Edit, Trash2, X } from 'lucide-react';
import API from '../services/api';
import { formatCurrency, getStatusColor } from '../utils/helpers';

const defaultValues = { customerName: '', companyName: '', gstNumber: '', phoneNumber: '', email: '', address: '', city: '', state: '', pincode: '', customerType: 'B2B', creditLimit: 0, status: 'Active' };

export default function Customers() {
    const [customers, setCustomers] = useState([]);
    const [search, setSearch] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState(null);
    const { register, handleSubmit, reset, formState: { errors } } = useForm({ defaultValues });

    const fetchCustomers = () => {
        API.get(`/customers?search=${search}`).then(res => setCustomers(res.data)).catch(console.error);
    };

    useEffect(() => { fetchCustomers(); }, [search]);

    const onSubmit = async (data) => {
        try {
            if (editing) {
                await API.put(`/customers/${editing}`, data);
            } else {
                await API.post('/customers', data);
            }
            setShowModal(false);
            setEditing(null);
            reset(defaultValues);
            fetchCustomers();
            toast.success('Customer saved!');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Error');
        }
    };

    const handleEdit = (c) => {
        setEditing(c._id);
        reset({ customerName: c.customerName, companyName: c.companyName || '', gstNumber: c.gstNumber || '', phoneNumber: c.phoneNumber, email: c.email || '', address: c.address || '', city: c.city || '', state: c.state || '', pincode: c.pincode || '', customerType: c.customerType, creditLimit: c.creditLimit, status: c.status });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure?')) return;
        try {
            await API.delete(`/customers/${id}`);
            fetchCustomers();
            toast.success('Customer deleted');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Cannot delete');
        }
    };

    const openAdd = () => { setEditing(null); reset(defaultValues); setShowModal(true); };

    const fileInputRef = useRef(null);

    const handleExport = () => {
        window.open('http://localhost:5001/api/customers/export', '_blank');
    };

    const handleImport = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const formData = new FormData();
        formData.append('file', file);
        try {
            await API.post('/customers/import', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
            toast.success('Customers imported successfully!');
            fetchCustomers();
        } catch (err) {
            toast.error('Error importing customers');
        }
        e.target.value = null; // reset
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <motion.h1 initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="text-3xl font-bold text-white">Customers</motion.h1>
                <div className="flex gap-3">
                    <input type="file" accept=".csv" ref={fileInputRef} onChange={handleImport} className="hidden" />
                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2 bg-slate-700 text-white px-4 py-2 rounded-xl font-semibold hover:bg-slate-600 transition">
                        Import CSV
                    </motion.button>
                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleExport} className="flex items-center gap-2 bg-slate-700 text-white px-4 py-2 rounded-xl font-semibold hover:bg-slate-600 transition">
                        Export CSV
                    </motion.button>
                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={openAdd} className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white px-4 py-2 rounded-xl font-semibold shadow-lg">
                        <Plus size={18} /> Add Customer
                    </motion.button>
                </div>
            </div>

            <div className="relative mb-6">
                <Search className="absolute left-3 top-3 text-slate-400" size={18} />
                <input type="text" placeholder="Search customers..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-3 bg-slate-800/80 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all" />
            </div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-slate-800/80 backdrop-blur-sm rounded-2xl border border-slate-700/50 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-900/50">
                            <tr>
                                {['Name', 'Company', 'Phone', 'Type', 'Credit Limit', 'Outstanding', 'Status', 'Actions'].map(h => (
                                    <th key={h} className="px-4 py-3 text-slate-400 text-sm font-semibold">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            <AnimatePresence>
                                {customers.map((c, i) => (
                                    <motion.tr key={c._id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} transition={{ delay: i * 0.05 }} className="border-t border-slate-700/50 hover:bg-slate-700/30 transition-colors">
                                        <td className="px-4 py-3 text-white font-medium">{c.customerName}</td>
                                        <td className="px-4 py-3 text-slate-300">{c.companyName}</td>
                                        <td className="px-4 py-3 text-slate-300">{c.phoneNumber}</td>
                                        <td className="px-4 py-3"><span className={`px-2 py-1 rounded-full text-xs font-bold ${c.customerType === 'B2B' ? 'bg-blue-500/20 text-blue-300' : 'bg-green-500/20 text-green-300'}`}>{c.customerType}</span></td>
                                        <td className="px-4 py-3 text-slate-300">{formatCurrency(c.creditLimit)}</td>
                                        <td className="px-4 py-3"><span className={c.outstandingAmount > 0 ? 'text-red-400 font-bold' : 'text-green-400'}>{formatCurrency(c.outstandingAmount)}</span></td>
                                        <td className="px-4 py-3"><span className={`px-2 py-1 rounded-full text-xs font-bold ${getStatusColor(c.status)}`}>{c.status}</span></td>
                                        <td className="px-4 py-3 flex gap-2">
                                            <motion.button whileHover={{ scale: 1.2 }} onClick={() => handleEdit(c)} className="text-blue-400 hover:text-blue-300"><Edit size={16} /></motion.button>
                                            <motion.button whileHover={{ scale: 1.2 }} onClick={() => handleDelete(c._id)} className="text-red-400 hover:text-red-300"><Trash2 size={16} /></motion.button>
                                        </td>
                                    </motion.tr>
                                ))}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>
                {customers.length === 0 && <p className="text-center text-slate-500 py-8">No customers found.</p>}
            </motion.div>

            <AnimatePresence>
                {showModal && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }} className="bg-slate-800 border border-slate-700 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold text-white">{editing ? 'Edit' : 'Add'} Customer</h2>
                                <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white"><X size={20} /></button>
                            </div>
                            <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-slate-400 text-sm mb-1">Customer Name *</label>
                                    <input {...register('customerName', { required: 'Name is required' })} className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500" />
                                    {errors.customerName && <p className="text-red-400 text-xs mt-1">{errors.customerName.message}</p>}
                                </div>
                                <div>
                                    <label className="block text-slate-400 text-sm mb-1">Company Name</label>
                                    <input {...register('companyName')} className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500" />
                                </div>
                                <div>
                                    <label className="block text-slate-400 text-sm mb-1">GST Number</label>
                                    <input {...register('gstNumber')} className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500" />
                                </div>
                                <div>
                                    <label className="block text-slate-400 text-sm mb-1">Phone *</label>
                                    <input {...register('phoneNumber', { required: 'Phone is required' })} className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500" />
                                    {errors.phoneNumber && <p className="text-red-400 text-xs mt-1">{errors.phoneNumber.message}</p>}
                                </div>
                                <div>
                                    <label className="block text-slate-400 text-sm mb-1">Email</label>
                                    <input type="email" {...register('email')} className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500" />
                                </div>
                                <div>
                                    <label className="block text-slate-400 text-sm mb-1">Address</label>
                                    <input {...register('address')} className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500" />
                                </div>
                                <div>
                                    <label className="block text-slate-400 text-sm mb-1">City</label>
                                    <input {...register('city')} className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500" />
                                </div>
                                <div>
                                    <label className="block text-slate-400 text-sm mb-1">State</label>
                                    <input {...register('state')} className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500" />
                                </div>
                                <div>
                                    <label className="block text-slate-400 text-sm mb-1">Pincode</label>
                                    <input {...register('pincode')} className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500" />
                                </div>
                                <div>
                                    <label className="block text-slate-400 text-sm mb-1">Credit Limit</label>
                                    <input type="number" {...register('creditLimit', { valueAsNumber: true })} className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500" />
                                </div>
                                <div>
                                    <label className="block text-slate-400 text-sm mb-1">Type</label>
                                    <select {...register('customerType')} className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500">
                                        <option value="B2B">B2B</option>
                                        <option value="B2C">B2C</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-slate-400 text-sm mb-1">Status</label>
                                    <select {...register('status')} className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500">
                                        <option value="Active">Active</option>
                                        <option value="Inactive">Inactive</option>
                                    </select>
                                </div>
                                <div className="md:col-span-2 flex justify-end gap-3 mt-4">
                                    <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors">Cancel</button>
                                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} type="submit" className="px-6 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-bold rounded-lg shadow-lg">{editing ? 'Update' : 'Create'}</motion.button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
