import Sidebar from '../components/Sidebar';

export default function MainLayout({ children }) {
    return (
        <div className="flex min-h-screen bg-slate-800 text-slate-100">
            <Sidebar />
            <main className="flex-1 p-8 overflow-auto max-h-screen">
                {children}
            </main>
        </div>
    );
}
