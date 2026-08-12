import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, User, PlusCircle, RefreshCw, Trash2, Edit } from 'lucide-react';
import API from '../services/api';

export default function ActivityTimeline() {
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        API.get('/activities')
            .then(res => {
                setActivities(res.data);
                setLoading(false);
            })
            .catch(console.error);
    }, []);

    const getIcon = (action) => {
        switch (action) {
            case 'CREATE': return <PlusCircle size={20} className="text-green-400" />;
            case 'UPDATE': return <Edit size={20} className="text-blue-400" />;
            case 'DELETE': return <Trash2 size={20} className="text-red-400" />;
            default: return <Activity size={20} className="text-purple-400" />;
        }
    };

    if (loading) return <div className="text-white text-center mt-20">Loading Timeline...</div>;

    return (
        <div className="max-w-4xl mx-auto">
            <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-3xl font-bold text-white mb-8">
                Audit Trail & Activity
            </motion.h1>

            <div className="relative border-l-2 border-slate-700 ml-4 md:ml-6 pb-4">
                <AnimatePresence>
                    {activities.map((act, i) => (
                        <motion.div 
                            key={act._id}
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="mb-8 ml-6"
                        >
                            <span className="absolute flex items-center justify-center w-8 h-8 bg-slate-800 rounded-full -left-4 ring-4 ring-slate-900 shadow-xl">
                                {getIcon(act.action)}
                            </span>
                            <div className="bg-slate-800/80 backdrop-blur-sm border border-slate-700 rounded-2xl p-5 shadow-lg">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center gap-2">
                                        <User size={16} className="text-slate-400" />
                                        <span className="text-white font-medium">{act.user?.name || 'Unknown User'}</span>
                                        <span className="text-slate-500 text-sm">({act.user?.email})</span>
                                    </div>
                                    <time className="text-xs font-mono text-slate-400 bg-slate-900 px-2 py-1 rounded">
                                        {new Date(act.createdAt).toLocaleString()}
                                    </time>
                                </div>
                                <h3 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 mb-1">
                                    {act.action} {act.entity}
                                </h3>
                                <p className="text-slate-300 text-sm">
                                    {act.details}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
                
                {activities.length === 0 && (
                    <div className="ml-6 text-slate-500 italic py-8">
                        No activity recorded yet.
                    </div>
                )}
            </div>
        </div>
    );
}
