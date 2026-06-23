import { useState } from 'react';
import { Bell, CheckCheck, FileText, Building2, Users, Briefcase, AlertCircle, CheckCircle, Info } from 'lucide-react';
import { PageHeader, Card, Btn } from '../../components/ui/index';

const allNotifications = [
  { id: 1, type: 'application', title: 'New application received', message: 'Jordan Lee applied for Senior React Developer at TechNova Inc.', time: '5 min ago', read: false, icon: FileText, color: 'blue' },
  { id: 2, type: 'hired', title: 'Candidate hired', message: 'Lena Kovacs was successfully hired at Insightful as UX Researcher.', time: '18 min ago', read: false, icon: CheckCircle, color: 'green' },
  { id: 3, type: 'company', title: 'Company verification request', message: 'GrowthLab has submitted documents for company verification. Review required.', time: '45 min ago', read: false, icon: Building2, color: 'yellow' },
  { id: 4, type: 'job', title: 'New job posted', message: 'AppWorks posted a new job: iOS Developer. It is pending approval.', time: '1h ago', read: true, icon: Briefcase, color: 'purple' },
  { id: 5, type: 'alert', title: 'Suspicious activity detected', message: 'Multiple failed login attempts detected from IP 192.168.1.1.', time: '2h ago', read: true, icon: AlertCircle, color: 'red' },
  { id: 6, type: 'info', title: 'Monthly report ready', message: 'Your June 2024 recruitment report is ready to download.', time: '3h ago', read: true, icon: Info, color: 'cyan' },
  { id: 7, type: 'application', title: 'Application status updated', message: 'Sarah O\'Brien\'s application at GrowthLab has moved to Interview stage.', time: '5h ago', read: true, icon: FileText, color: 'blue' },
  { id: 8, type: 'company', title: 'Company profile updated', message: 'TechNova Inc. updated their company profile and added 3 new job listings.', time: '1d ago', read: true, icon: Building2, color: 'yellow' },
];

const iconColors = {
  blue: 'bg-blue-100 text-blue-600',
  green: 'bg-green-100 text-green-600',
  yellow: 'bg-yellow-100 text-yellow-600',
  purple: 'bg-purple-100 text-purple-600',
  red: 'bg-red-100 text-red-600',
  cyan: 'bg-cyan-100 text-cyan-600',
};

const Notifications = () => {
  const [notifications, setNotifications] = useState(allNotifications);
  const [filter, setFilter] = useState('All');

  const unreadCount = notifications.filter(n => !n.read).length;
  const filtered = filter === 'All' ? notifications :
    filter === 'Unread' ? notifications.filter(n => !n.read) :
    notifications.filter(n => n.type === filter.toLowerCase());

  const markAllRead = () => setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  const markRead = (id) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));

  return (
    <div className="space-y-5">
      <PageHeader
        title="Notifications"
        subtitle={`${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}`}
        action={
          unreadCount > 0 && (
            <Btn variant="outline" onClick={markAllRead}>
              <CheckCheck size={15} /> Mark all read
            </Btn>
          )
        }
      />

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {['All', 'Unread', 'Application', 'Company', 'Job', 'Alert'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-all ${filter === f ? 'bg-blue-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
          >
            {f}
          </button>
        ))}
      </div>

      <Card>
        <div className="divide-y divide-slate-50">
          {filtered.length === 0 ? (
            <div className="text-center py-16 text-slate-400">
              <Bell size={32} className="mx-auto mb-3 opacity-30" />
              <p>No notifications</p>
            </div>
          ) : filtered.map(n => {
            const Icon = n.icon;
            return (
              <div
                key={n.id}
                onClick={() => markRead(n.id)}
                className={`flex gap-4 px-5 py-4 cursor-pointer transition-colors hover:bg-slate-50/50 ${!n.read ? 'bg-blue-50/30' : ''}`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${iconColors[n.color]}`}>
                  <Icon size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className={`text-sm font-medium ${!n.read ? 'text-slate-900' : 'text-slate-700'}`}>{n.title}</p>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs text-slate-400">{n.time}</span>
                      {!n.read && <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />}
                    </div>
                  </div>
                  <p className="text-sm text-slate-500 mt-0.5 leading-relaxed">{n.message}</p>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};

export default Notifications;
