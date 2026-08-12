import { motion } from 'framer-motion';
import { Download, FileText, Users, DollarSign, Package } from 'lucide-react';
import API from '../services/api';

export default function Reports() {
    const downloadCSV = async (endpoint, filename) => {
        try {
            const res = await API.get(endpoint, { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error('Error downloading report:', error);
            alert('Failed to generate report');
        }
    };

    const reports = [
        { title: 'Sales Report', icon: <FileText size={24} className="text-blue-400" />, desc: 'Comprehensive sales and revenue data', endpoint: '/orders/export', file: 'sales_report.csv' },
        { title: 'Customer Report', icon: <Users size={24} className="text-purple-400" />, desc: 'Customer details and demographics', endpoint: '/customers/export', file: 'customers_report.csv' },
        { title: 'Outstanding Report', icon: <DollarSign size={24} className="text-red-400" />, desc: 'Customers with pending payments', endpoint: '/customers/export?outstanding=true', file: 'outstanding_report.csv' },
        { title: 'Inventory Report', icon: <Package size={24} className="text-green-400" />, desc: 'Current stock levels and valuation', endpoint: '/products/export', file: 'inventory_report.csv' },
    ];

    return (
        <div className="max-w-6xl mx-auto">
            <motion.h1 initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="text-3xl font-bold text-white mb-8">
                Reports Generation
            </motion.h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {reports.map((report, idx) => (
                    <motion.div 
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="bg-slate-800 border border-slate-700 rounded-2xl p-6 flex flex-col justify-between"
                    >
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 bg-slate-900 rounded-xl">
                                {report.icon}
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white">{report.title}</h3>
                                <p className="text-slate-400 text-sm">{report.desc}</p>
                            </div>
                        </div>
                        <motion.button 
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => downloadCSV(report.endpoint, report.file)}
                            className="w-full flex items-center justify-center gap-2 bg-slate-700 hover:bg-slate-600 text-white font-semibold py-3 rounded-xl transition-colors"
                        >
                            <Download size={18} />
                            Generate CSV Report
                        </motion.button>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
