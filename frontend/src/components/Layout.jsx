import Sidebar from './Sidebar';
import Strands from './Strands/Strands';

export default function Layout({ children }) {
    return (
        <div className="flex min-h-screen bg-slate-900 text-slate-100 relative overflow-hidden">
            <div className="absolute inset-0 z-0 opacity-50 pointer-events-none">
                <Strands 
                    colors={["#FF4242", "#7C3AED", "#06B6D4", "#EAB308"]}
                    count={5}
                    speed={0.4}
                    amplitude={1.2}
                    waviness={1.5}
                    thickness={0.8}
                    glow={2.8}
                    intensity={0.7}
                    glass={false}
                />
            </div>
            <Sidebar />
            <main className="flex-1 p-8 overflow-auto max-h-screen relative z-10">
                {children}
            </main>
        </div>
    );
}
