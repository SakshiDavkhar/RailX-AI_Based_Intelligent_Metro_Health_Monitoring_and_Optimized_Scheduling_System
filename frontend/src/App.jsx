
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import Dashboard from './Dashboard';
import Scheduler from './Scheduler';
import { LayoutDashboard, CalendarClock, Zap } from 'lucide-react';

const NavLink = ({ to, icon: Icon, children }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={`relative flex items-center gap-3 px-5 py-3 rounded-full transition-all duration-300 font-medium ${isActive
          ? 'text-white'
          : 'text-zinc-500 hover:text-white hover:bg-white/5'
        }`}
    >
      {isActive && (
        <span className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-600/20 rounded-full blur-md" />
      )}
      {isActive && (
        <span className="absolute inset-0 border border-white/10 rounded-full" />
      )}
      <div className="relative z-10 flex items-center gap-2">
        <Icon size={18} className={isActive ? "text-cyan-400" : ""} />
        <span>{children}</span>
      </div>
    </Link>
  );
};

function App() {
  return (
    <Router>
      <div className="bg-grid" />
      <div className="min-h-screen font-sans selection:bg-cyan-500/30 relative">
        <nav className="fixed w-full top-6 z-50 px-6">
          <div className="max-w-6xl mx-auto h-16 glass-panel rounded-full flex items-center justify-between px-2 pl-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-lg shadow-[0_0_15px_rgba(6,182,212,0.4)]">
                <Zap className="text-white h-5 w-5 fill-current" />
              </div>
              <div className="hidden md:block">
                <h1 className="text-xl font-bold bg-white bg-clip-text text-transparent tracking-tight">
                  RailX
                </h1>
              </div>
            </div>

            <NavContent />

            <div className="w-10 h-10 rounded-full bg-gradient-to-b from-zinc-800 to-zinc-900 border border-white/5 flex items-center justify-center">
              <span className="w-2 h-2 bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.8)] animate-pulse" />
            </div>
          </div>
        </nav>

        <main className="pt-32 pb-12 px-6 max-w-7xl mx-auto relative z-10">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/scheduler" element={<Scheduler />} />
          </Routes>
        </main>

        <footer className="fixed bottom-6 left-6 text-xs text-zinc-700 font-mono">
          SYSTEM_STATUS: ONLINE<br />
          V.2.0.4 [BUILD_STABLE]
        </footer>
      </div>
    </Router>
  );
}

const NavContent = () => (
  <div className="flex bg-black/20 rounded-full p-1 border border-white/5">
    <NavLink to="/" icon={LayoutDashboard}>Dashboard</NavLink>
    <NavLink to="/scheduler" icon={CalendarClock}>Logistics</NavLink>
  </div>
);

export default App;
