import { useEffect, useState, useRef } from 'react';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Edit, Trash2, X, AlertTriangle } from 'lucide-react';
import API from '../services/api';
import { formatCurrency } from '../utils/helpers';

const defaultValues = { productName: '', sku: '', category: '', hsnCode: '', purchasePrice: 0, sellingPrice: 0, gstPercentage: 18, unit: 'Pcs', currentStock: 0, minimumStock: 0, productImage: '' };

export default function Products() {
    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState(null);
    const { register, handleSubmit, reset, formState: { errors } } = useForm({ defaultValues });

    const fetchProducts = () => {
        API.get(`/products?search=${search}`).then(res => setProducts(res.data)).catch(console.error);
    };

    useEffect(() => { fetchProducts(); }, [search]);

    const onSubmit = async (data) => {
        try {
            if (editing) {
                await API.put(`/products/${editing}`, data);
            } else {
                await API.post('/products', data);
            }
            setShowModal(false);
            setEditing(null);
            reset(defaultValues);
            fetchProducts();
            toast.success('Product saved!');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Error');
        }
    };

    const handleEdit = (p) => {
        setEditing(p._id);
        reset({ productName: p.productName, sku: p.sku, category: p.category || '', hsnCode: p.hsnCode || '', purchasePrice: p.purchasePrice, sellingPrice: p.sellingPrice, gstPercentage: p.gstPercentage, unit: p.unit || 'Pcs', currentStock: p.currentStock, minimumStock: p.minimumStock, productImage: p.productImage || '' });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure?')) return;
        try {
            await API.delete(`/products/${id}`);
            fetchProducts();
            toast.success('Product deleted');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Cannot delete');
        }
    };

    const openAdd = () => { setEditing(null); reset(defaultValues); setShowModal(true); };

    const fileInputRef = useRef(null);

    const handleExport = () => {
        window.open(`${import.meta.env.VITE_API_URL || 'http://localhost:5001/api'}/products/export`, '_blank');
    };

    const handleImport = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const formData = new FormData();
        formData.append('file', file);
        try {
            await API.post('/products/import', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
            toast.success('Products imported successfully!');
            fetchProducts();
        } catch (err) {
            toast.error('Error importing products');
        }
        e.target.value = null;
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <motion.h1 initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="text-3xl font-bold text-white">Products</motion.h1>
                <div className="flex gap-3">
                    <input type="file" accept=".csv" ref={fileInputRef} onChange={handleImport} className="hidden" />
                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2 bg-slate-700 text-white px-4 py-2 rounded-xl font-semibold hover:bg-slate-600 transition">
                        Import CSV
                    </motion.button>
                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleExport} className="flex items-center gap-2 bg-slate-700 text-white px-4 py-2 rounded-xl font-semibold hover:bg-slate-600 transition">
                        Export CSV
                    </motion.button>
                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={openAdd} className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white px-4 py-2 rounded-xl font-semibold shadow-lg">
                        <Plus size={18} /> Add Product
                    </motion.button>
                </div>
            </div>

            <div className="relative mb-6">
                <Search className="absolute left-3 top-3 text-slate-400" size={18} />
                <input type="text" placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-3 bg-slate-800/80 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all" />
            </div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-slate-800/80 backdrop-blur-sm rounded-2xl border border-slate-700/50 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-900/50">
                            <tr>
                                {['Product', 'SKU', 'Category', 'Purchase ₹', 'Selling ₹', 'GST%', 'Stock', 'Actions'].map(h => (
                                    <th key={h} className="px-4 py-3 text-slate-400 text-sm font-semibold">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            <AnimatePresence>
                                {products.map((p, i) => (
                                    <motion.tr key={p._id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} transition={{ delay: i * 0.05 }} className="border-t border-slate-700/50 hover:bg-slate-700/30 transition-colors">
                                        <td className="px-4 py-3 text-white font-medium">{p.productName}</td>
                                        <td className="px-4 py-3 text-slate-300">{p.sku}</td>
                                        <td className="px-4 py-3 text-slate-300">{p.category}</td>
                                        <td className="px-4 py-3 text-slate-300">{formatCurrency(p.purchasePrice)}</td>
                                        <td className="px-4 py-3 text-slate-300">{formatCurrency(p.sellingPrice)}</td>
                                        <td className="px-4 py-3 text-slate-300">{p.gstPercentage}%</td>
                                        <td className="px-4 py-3">
                                            <span className={`flex items-center gap-1 font-bold ${p.currentStock <= p.minimumStock ? 'text-red-400' : 'text-green-400'}`}>
                                                {p.currentStock <= p.minimumStock && <AlertTriangle size={14} />}
                                                {p.currentStock}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 flex gap-2">
                                            <motion.button whileHover={{ scale: 1.2 }} onClick={() => handleEdit(p)} className="text-blue-400 hover:text-blue-300"><Edit size={16} /></motion.button>
                                            <motion.button whileHover={{ scale: 1.2 }} onClick={() => handleDelete(p._id)} className="text-red-400 hover:text-red-300"><Trash2 size={16} /></motion.button>
                                        </td>
                                    </motion.tr>
                                ))}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>
                {products.length === 0 && <p className="text-center text-slate-500 py-8">No products found.</p>}
            </motion.div>

            <AnimatePresence>
                {showModal && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }} className="bg-slate-800 border border-slate-700 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold text-white">{editing ? 'Edit' : 'Add'} Product</h2>
                                <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white"><X size={20} /></button>
                            </div>
                            <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-slate-400 text-sm mb-1">Product Name *</label>
                                    <input {...register('productName', { required: 'Product name is required' })} className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500" />
                                    {errors.productName && <p className="text-red-400 text-xs mt-1">{errors.productName.message}</p>}
                                </div>
                                <div>
                                    <label className="block text-slate-400 text-sm mb-1">SKU *</label>
                                    <input {...register('sku', { required: 'SKU is required' })} className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500" />
                                    {errors.sku && <p className="text-red-400 text-xs mt-1">{errors.sku.message}</p>}
                                </div>
                                <div>
                                    <label className="block text-slate-400 text-sm mb-1">Category</label>
                                    <input {...register('category')} className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500" />
                                </div>
                                <div>
                                    <label className="block text-slate-400 text-sm mb-1">HSN Code</label>
                                    <input {...register('hsnCode')} className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500" />
                                </div>
                                <div>
                                    <label className="block text-slate-400 text-sm mb-1">Purchase Price *</label>
                                    <input type="number" {...register('purchasePrice', { required: true, valueAsNumber: true })} className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500" />
                                </div>
                                <div>
                                    <label className="block text-slate-400 text-sm mb-1">Selling Price *</label>
                                    <input type="number" {...register('sellingPrice', { required: true, valueAsNumber: true })} className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500" />
                                </div>
                                <div>
                                    <label className="block text-slate-400 text-sm mb-1">GST % *</label>
                                    <input type="number" {...register('gstPercentage', { required: true, valueAsNumber: true })} className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500" />
                                </div>
                                <div>
                                    <label className="block text-slate-400 text-sm mb-1">Unit</label>
                                    <input {...register('unit')} className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500" />
                                </div>
                                <div>
                                    <label className="block text-slate-400 text-sm mb-1">Current Stock</label>
                                    <input type="number" {...register('currentStock', { valueAsNumber: true })} className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500" />
                                </div>
                                <div>
                                    <label className="block text-slate-400 text-sm mb-1">Minimum Stock</label>
                                    <input type="number" {...register('minimumStock', { valueAsNumber: true })} className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500" />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-slate-400 text-sm mb-1">Image URL</label>
                                    <input {...register('productImage')} className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500" />
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
