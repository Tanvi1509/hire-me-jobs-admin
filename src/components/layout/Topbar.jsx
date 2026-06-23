import { useState } from 'react';
import { Menu, Search, Bell, ChevronDown, Sun } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Topbar = ({ onMenuClick }) => {
  const { user } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const initials = user?.name?.split(' ').map(n => n[0]).join('') || 'A';

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center gap-4 px-4 lg:px-6 sticky top-0 z-10 shrink-0">
      {/* Mobile hamburger */}
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
      >
        <Menu size={20} />
      </button>

      {/* Search */}
      <div className="flex-1 max-w-md relative hidden sm:block">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search jobs, candidates, companies..."
          className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 placeholder:text-slate-400 transition-all"
        />
      </div>

      <div className="flex items-center gap-2 ml-auto">
        {/* Notification bell */}
        <button className="relative p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
        </button>

        {/* User */}
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
              {initials}
            </div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-medium text-slate-800 leading-tight">{user?.name}</p>
              <p className="text-xs text-slate-500">{user?.role}</p>
            </div>
            <ChevronDown size={14} className="text-slate-400 hidden md:block" />
          </button>
          {showDropdown && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowDropdown(false)} />
              <div className="absolute right-0 top-12 bg-white border border-slate-200 rounded-xl shadow-xl z-20 py-1.5 w-48">
                <a href="/settings" className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">Profile Settings</a>
                <hr className="my-1 border-slate-100" />
                <button className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">Sign Out</button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Topbar;
