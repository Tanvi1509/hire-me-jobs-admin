import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Briefcase,
  FileText,
  Building2,
  Users,
  Settings,
  LogOut,
  ChevronLeft,
  X,
  BarChart3,
  Bell,
  ShieldCheck,
  UserCog,
  Layers3,
  Languages,
  Brain,
  CalendarClock,
  TrendingUp,
  MapPin,
  Building,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const navItems = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/permissions", icon: ShieldCheck, label: "Permissions" },
  { to: "/roles", icon: UserCog, label: "Roles" },
  { to: "/modules", icon: Layers3, label: "Modules" },
  { to: "/department", icon: Building2, label: "Department" },
  { to: "/languages", icon: Languages, label: "Languages" },
  { to: "/skills", icon: Brain, label: "Skills" },
  { to: "/noticeperiods", icon: CalendarClock, label: "Notice Period" },
  { to: "/experience-levels", icon: TrendingUp, label: "Experience Levels" },
  { to: "/workplace-types", icon: Building2, label: "Workplace Types" },
  { to: "/state", icon: MapPin, label: "State" },
  { to: "/city", icon: Building, label: "City" },

  // { to: '/jobs', icon: Briefcase, label: 'Job Listings' },
  // { to: '/applications', icon: FileText, label: 'Applications' },
  // { to: '/companies', icon: Building2, label: 'Companies' },
  // { to: '/candidates', icon: Users, label: 'Candidates' },
  // { to: '/analytics', icon: BarChart3, label: 'Analytics' },
  // { to: '/notifications', icon: Bell, label: 'Notifications' },
  // { to: '/settings', icon: Settings, label: 'Settings' },
];

const Sidebar = ({ isOpen, onClose, isCollapsed, onToggleCollapse }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const initials =
    user?.name
      ?.split(" ")
      .map((n) => n[0])
      .join("") || "A";

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full z-30 flex flex-col
          bg-gradient-to-b from-slate-900 to-slate-800
          transition-all duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          ${isCollapsed ? "lg:w-[72px]" : "lg:w-64"}
          w-64
          sidebar-scrollbar overflow-y-auto
        `}
      >
        {/* Logo / Header */}
        <div
          className={`flex items-center gap-3 px-4 py-5 border-b border-white/10 shrink-0 ${isCollapsed ? "lg:justify-center lg:px-2" : ""}`}
        >
          <div className="w-9 h-9 rounded-xl bg-blue-500 flex items-center justify-center shrink-0">
            <Briefcase size={18} className="text-white" />
          </div>
          <div
            className={`transition-all duration-200 ${isCollapsed ? "lg:hidden" : ""}`}
          >
            <span className="text-white font-bold text-base leading-tight block">
              JobPortal
            </span>
            <span className="text-slate-400 text-xs">Admin Panel</span>
          </div>
          {/* Mobile close */}
          <button
            onClick={onClose}
            className="ml-auto text-slate-400 hover:text-white lg:hidden"
          >
            <X size={20} />
          </button>
          {/* Desktop collapse */}
          <button
            onClick={onToggleCollapse}
            className={`hidden lg:flex ml-auto text-slate-400 hover:text-white transition-transform duration-300 ${isCollapsed ? "rotate-180" : ""}`}
          >
            <ChevronLeft size={18} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 px-2 space-y-0.5">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => window.innerWidth < 1024 && onClose()}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group relative
                ${isCollapsed ? "lg:justify-center lg:px-0" : ""}
                ${
                  isActive
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-900/40"
                    : "text-slate-400 hover:text-white hover:bg-white/8"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon size={18} className="shrink-0" />
                  <span
                    className={`transition-all duration-200 ${isCollapsed ? "lg:hidden" : ""}`}
                  >
                    {label}
                  </span>
                  {/* Tooltip for collapsed */}
                  {isCollapsed && (
                    <div className="hidden lg:block absolute left-full ml-3 bg-slate-700 text-white text-xs px-2 py-1.5 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
                      {label}
                    </div>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* User profile + logout */}

        <div
          className={`px-2 pb-4 border-t border-white/10 pt-3 shrink-0 ${isCollapsed ? "" : ""}`}
        >
          <div
            className={`flex items-center gap-3 px-3 py-2 mb-1 ${isCollapsed ? "lg:justify-center" : ""}`}
          >
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
              {initials}
            </div>
            <div className={`flex-1 min-w-0 ${isCollapsed ? "lg:hidden" : ""}`}>
              <p className="text-white text-sm font-medium truncate">
                {user?.name}
              </p>
              <p className="text-slate-400 text-xs truncate">{user?.role}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm text-slate-400 hover:text-red-400 hover:bg-red-900/20 transition-all duration-150 ${isCollapsed ? "lg:justify-center" : ""}`}
          >
            <LogOut size={18} className="shrink-0" />
            <span className={`${isCollapsed ? "lg:hidden" : ""}`}>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
