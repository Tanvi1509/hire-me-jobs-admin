import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import {
  Briefcase, FileText, Users, Building2,
  TrendingUp, Clock, CheckCircle, Calendar
} from 'lucide-react';
import {
  statsData, chartApplicationsData, jobCategoryData, recentActivities, applicationsData
} from '../../data/mockData';
import {
  StatCard, Card, CardHeader, Badge, Avatar, PageHeader
} from '../../components/ui/index';

const activityColor = {
  blue: 'bg-blue-500',
  green: 'bg-green-500',
  yellow: 'bg-yellow-500',
  purple: 'bg-purple-500',
  cyan: 'bg-cyan-500',
  red: 'bg-red-500',
};

const statusColor = {
  Pending: 'yellow',
  Shortlisted: 'blue',
  Interview: 'purple',
  Hired: 'green',
  Rejected: 'red',
};

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        subtitle="Welcome back! Here's what's happening today."
        action={
          <div className="flex items-center gap-2 text-sm text-slate-500 bg-white border border-slate-200 rounded-xl px-3 py-2">
            <Calendar size={14} />
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </div>
        }
      />

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Jobs" value={statsData.totalJobs} icon={Briefcase} color="blue" trend={12} />
        <StatCard label="Applications" value={statsData.totalApplications} icon={FileText} color="purple" trend={8} />
        <StatCard label="Candidates" value={statsData.totalCandidates} icon={Users} color="green" trend={5} />
        <StatCard label="Companies" value={statsData.totalCompanies} icon={Building2} color="yellow" trend={3} />
      </div>

      {/* Secondary stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Active Jobs', value: statsData.activeJobs, icon: TrendingUp, color: 'cyan' },
          { label: 'Pending Review', value: statsData.pendingReview, icon: Clock, color: 'yellow' },
          { label: 'Hired This Month', value: statsData.hiredThisMonth, icon: CheckCircle, color: 'green' },
          { label: 'Interviews Today', value: statsData.interviewsToday, icon: Calendar, color: 'purple' },
        ].map(s => <StatCard key={s.label} {...s} />)}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Applications trend */}
        <Card className="lg:col-span-2">
          <CardHeader title="Applications & Hires Trend" subtitle="Monthly overview for 2024" />
          <div className="p-5">
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={chartApplicationsData}>
                <defs>
                  <linearGradient id="appGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="hireGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}
                />
                <Area type="monotone" dataKey="applications" stroke="#3b82f6" strokeWidth={2} fill="url(#appGrad)" name="Applications" />
                <Area type="monotone" dataKey="hired" stroke="#10b981" strokeWidth={2} fill="url(#hireGrad)" name="Hired" />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Category pie */}
        <Card>
          <CardHeader title="Jobs by Category" />
          <div className="p-5">
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie data={jobCategoryData} dataKey="value" cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3}>
                  {jobCategoryData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => `${v}%`} contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-3 space-y-2">
              {jobCategoryData.map(cat => (
                <div key={cat.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ background: cat.color }} />
                    <span className="text-slate-600">{cat.name}</span>
                  </div>
                  <span className="font-medium text-slate-800">{cat.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Recent applications */}
        <Card className="lg:col-span-3">
          <CardHeader
            title="Recent Applications"
            subtitle="Latest candidates"
            action={<a href="/applications" className="text-sm text-blue-600 hover:underline font-medium">View all</a>}
          />
          <div className="divide-y divide-slate-50">
            {applicationsData.slice(0, 6).map(app => (
              <div key={app.id} className="flex items-center gap-3 px-5 py-3.5">
                <Avatar name={app.name} size={9} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800 truncate">{app.name}</p>
                  <p className="text-xs text-slate-500 truncate">{app.job}</p>
                </div>
                <Badge color={statusColor[app.status] || 'gray'}>{app.status}</Badge>
              </div>
            ))}
          </div>
        </Card>

        {/* Activity feed */}
        <Card className="lg:col-span-2">
          <CardHeader title="Recent Activity" />
          <div className="px-5 py-3 space-y-4">
            {recentActivities.map(act => (
              <div key={act.id} className="flex gap-3">
                <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${activityColor[act.color]}`} />
                <div>
                  <p className="text-sm text-slate-700 leading-snug">{act.message}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{act.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
