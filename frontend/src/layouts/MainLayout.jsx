import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import { User, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function MainLayout({ children }) {
    const { user, logout } = useAuth();

    return (
        <div className="flex min-h-screen bg-elite-bg text-elite-text">
            <Sidebar />
            <div className="flex-1 flex flex-col h-screen overflow-hidden">
                {/* Header Section */}
                <header className="h-16 border-b border-elite-border bg-white flex items-center justify-end px-8 shrink-0 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="text-right">
                            <p className="text-sm font-semibold text-gray-800">{user?.name}</p>
                            <p className="text-xs text-gray-500">{user?.role}</p>
                        </div>
                        <div className="h-8 w-px bg-gray-300 mx-2"></div>
                        <Link 
                            to="/profile" 
                            className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors cursor-pointer text-gray-600 hover:text-elite-info"
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
