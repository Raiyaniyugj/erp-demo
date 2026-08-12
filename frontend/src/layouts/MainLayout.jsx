import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import { User, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function MainLayout({ children }) {
    const { user, logout } = useAuth();

    return (
        <div className="flex min-h-screen bg-slate-800 text-slate-100">
            <Sidebar />
            <div className="flex-1 flex flex-col h-screen overflow-hidden">
                {/* Header Section */}
                <header className="h-16 border-b border-slate-700 bg-slate-900 flex items-center justify-end px-8 shrink-0">
                    <div className="flex items-center gap-4">
                        <div className="text-right">
                            <p className="text-sm font-medium text-slate-200">{user?.name}</p>
                            <p className="text-xs text-slate-400">{user?.role}</p>
                        </div>
                        <div className="h-8 w-px bg-slate-700 mx-2"></div>
                        <Link 
                            to="/profile" 
                            className="p-2 bg-slate-800 rounded-full hover:bg-slate-700 transition-colors cursor-pointer text-slate-300 hover:text-white"
                            title="Profile"
                        >
                            <User size={20} />
                        </Link>
                    </div>
                </header>

                {/* Main Content Area */}
                <main className="flex-1 p-8 overflow-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
