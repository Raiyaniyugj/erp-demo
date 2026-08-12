import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import api from '../services/api';
import { motion } from 'framer-motion';

export default function Profile() {
    const { user, setUser } = useAuth();
    
    const [name, setName] = useState(user?.name || '');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password && password !== confirmPassword) {
            return toast.error('Passwords do not match');
        }

        setLoading(true);
        try {
            const res = await api.put('/auth/profile', {
                name,
                password: password || undefined
            });
            
            // Optionally update token if your backend sends it
            if (res.data.token) {
                localStorage.setItem('token', res.data.token);
            }

            setUser(res.data);
            toast.success('Profile updated successfully');
            setPassword('');
            setConfirmPassword('');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error updating profile');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-slate-800 rounded-2xl p-8 border border-slate-700 shadow-xl"
            >
                <h1 className="text-3xl font-bold text-white mb-8">Edit Profile</h1>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-slate-300 mb-2 font-medium">Username</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                        />
                    </div>

                    <div>
                        <label className="block text-slate-300 mb-2 font-medium">Email <span className="text-sm text-slate-500">(Cannot be changed)</span></label>
                        <input
                            type="email"
                            value={user?.email || ''}
                            disabled
                            className="w-full bg-slate-900/50 border border-slate-700 rounded-xl p-3 text-slate-500 cursor-not-allowed"
                        />
                    </div>

                    <div>
                        <label className="block text-slate-300 mb-2 font-medium">New Password <span className="text-sm text-slate-500">(Leave blank to keep current)</span></label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                        />
                    </div>

                    <div>
                        <label className="block text-slate-300 mb-2 font-medium">Confirm New Password</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold py-3 px-4 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 mt-4"
                    >
                        {loading ? 'Updating...' : 'Update Profile'}
                    </button>
                </form>
            </motion.div>
        </div>
    );
}
