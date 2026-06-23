export const Badge = ({ children, color = 'blue' }) => {
  const colors = {
    blue: 'bg-blue-100 text-blue-700',
    green: 'bg-green-100 text-green-700',
    red: 'bg-red-100 text-red-700',
    yellow: 'bg-yellow-100 text-yellow-700',
    purple: 'bg-purple-100 text-purple-700',
    cyan: 'bg-cyan-100 text-cyan-700',
    gray: 'bg-slate-100 text-slate-600',
    orange: 'bg-orange-100 text-orange-700',
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[color] || colors.gray}`}>
      {children}
    </span>
  );
};

export const StatusBadge = ({ status }) => {
  const map = {
    Active: 'green',
    Closed: 'gray',
    Draft: 'yellow',
    Pending: 'yellow',
    Shortlisted: 'blue',
    Interview: 'purple',
    Hired: 'green',
    Rejected: 'red',
    Verified: 'green',
    Suspended: 'red',
    Inactive: 'gray',
  };
  return <Badge color={map[status] || 'gray'}>{status}</Badge>;
};

export const StatCard = ({ label, value, icon: Icon, color = 'blue', trend }) => {
  const colorMap = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
    yellow: 'bg-yellow-50 text-yellow-600',
    cyan: 'bg-cyan-50 text-cyan-600',
    red: 'bg-red-50 text-red-600',
  };
  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${colorMap[color]}`}>
          <Icon size={20} />
        </div>
        {trend && (
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${trend > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {trend > 0 ? '+' : ''}{trend}%
          </span>
        )}
      </div>
      <p className="text-2xl font-bold text-slate-800">{value.toLocaleString()}</p>
      <p className="text-sm text-slate-500 mt-0.5">{label}</p>
    </div>
  );
};

export const Card = ({ children, className = '' }) => (
  <div className={`bg-white rounded-2xl border border-slate-200 ${className}`}>
    {children}
  </div>
);

export const CardHeader = ({ title, subtitle, action }) => (
  <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
    <div>
      <h3 className="font-semibold text-slate-800">{title}</h3>
      {subtitle && <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>}
    </div>
    {action && <div>{action}</div>}
  </div>
);

export const Avatar = ({ name, size = 8 }) => {
  const initials = name?.split(' ').map(n => n[0]).join('').slice(0, 2) || '?';
  const colors = ['bg-blue-500', 'bg-purple-500', 'bg-green-500', 'bg-yellow-500', 'bg-rose-500', 'bg-cyan-500'];
  const color = colors[name?.charCodeAt(0) % colors.length] || 'bg-slate-400';
  return (
    <div className={`w-${size} h-${size} rounded-full ${color} flex items-center justify-center text-white text-xs font-semibold shrink-0`}>
      {initials}
    </div>
  );
};

export const PageHeader = ({ title, subtitle, action }) => (
  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
    <div>
      <h1 className="text-xl font-bold text-slate-800">{title}</h1>
      {subtitle && <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>}
    </div>
    {action && <div>{action}</div>}
  </div>
);

export const Table = ({ headers, children }) => (
  <div className="overflow-x-auto">
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b border-slate-100">
          {headers.map((h, i) => (
            <th key={i} className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-5 py-3">
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-50">
        {children}
      </tbody>
    </table>
  </div>
);

export const Btn = ({ children, variant = 'primary', size = 'md', onClick, className = '', type = 'button' }) => {
  const variants = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm',
    secondary: 'bg-slate-100 hover:bg-slate-200 text-slate-700',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
    ghost: 'text-slate-600 hover:bg-slate-100',
    outline: 'border border-slate-200 hover:bg-slate-50 text-slate-700',
  };
  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-5 py-2.5 text-sm',
  };
  return (
    <button
      type={type}
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-xl font-medium transition-all duration-150 ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </button>
  );
};
