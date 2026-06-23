import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell, PieChart, Pie
} from 'recharts';
import { TrendingUp, Users, Briefcase, CheckCircle } from 'lucide-react';
import { chartApplicationsData, jobCategoryData, statsData } from '../../data/mockData';
import { Card, CardHeader, PageHeader, StatCard } from '../../components/ui/index';

const conversionData = [
  { stage: 'Applied', value: 1240, color: '#3b82f6' },
  { stage: 'Screened', value: 820, color: '#8b5cf6' },
  { stage: 'Shortlisted', value: 430, color: '#f59e0b' },
  { stage: 'Interview', value: 210, color: '#06b6d4' },
  { stage: 'Offered', value: 150, color: '#10b981' },
  { stage: 'Hired', value: 128, color: '#22c55e' },
];

const weeklyData = [
  { day: 'Mon', apps: 180, hires: 18 },
  { day: 'Tue', apps: 220, hires: 25 },
  { day: 'Wed', apps: 195, hires: 20 },
  { day: 'Thu', apps: 260, hires: 30 },
  { day: 'Fri', apps: 310, hires: 35 },
  { day: 'Sat', apps: 140, hires: 12 },
  { day: 'Sun', apps: 90, hires: 8 },
];

const Analytics = () => {
  return (
    <div className="space-y-6">
      <PageHeader title="Analytics" subtitle="Insights into your recruitment pipeline" />

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Jobs" value={statsData.totalJobs} icon={Briefcase} color="blue" trend={12} />
        <StatCard label="Applications" value={statsData.totalApplications} icon={TrendingUp} color="purple" trend={8} />
        <StatCard label="Candidates" value={statsData.totalCandidates} icon={Users} color="green" trend={5} />
        <StatCard label="Hired This Month" value={statsData.hiredThisMonth} icon={CheckCircle} color="cyan" trend={15} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Monthly trend */}
        <Card>
          <CardHeader title="Monthly Applications vs Hires" subtitle="Jan – Jun 2024" />
          <div className="p-5">
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={chartApplicationsData}>
                <defs>
                  <linearGradient id="aGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="hGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0' }} />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Area type="monotone" dataKey="applications" stroke="#3b82f6" strokeWidth={2} fill="url(#aGrad)" name="Applications" />
                <Area type="monotone" dataKey="hired" stroke="#10b981" strokeWidth={2} fill="url(#hGrad)" name="Hired" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Weekly bar */}
        <Card>
          <CardHeader title="Weekly Activity" subtitle="This week" />
          <div className="p-5">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={weeklyData} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0' }} />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Bar dataKey="apps" name="Applications" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="hires" name="Hired" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Funnel */}
        <Card className="lg:col-span-2">
          <CardHeader title="Recruitment Funnel" subtitle="Conversion through pipeline stages" />
          <div className="p-5 space-y-3">
            {conversionData.map((stage, i) => (
              <div key={stage.stage} className="flex items-center gap-3">
                <span className="text-sm text-slate-500 w-20 shrink-0">{stage.stage}</span>
                <div className="flex-1 bg-slate-100 rounded-full h-6 overflow-hidden">
                  <div
                    className="h-full rounded-full flex items-center px-3 transition-all duration-500"
                    style={{
                      width: `${(stage.value / conversionData[0].value) * 100}%`,
                      background: stage.color,
                    }}
                  >
                    <span className="text-white text-xs font-semibold">{stage.value}</span>
                  </div>
                </div>
                <span className="text-xs font-medium text-slate-500 w-12 text-right">
                  {Math.round((stage.value / conversionData[0].value) * 100)}%
                </span>
              </div>
            ))}
          </div>
        </Card>

        {/* Category breakdown */}
        <Card>
          <CardHeader title="Jobs by Category" />
          <div className="p-5">
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie data={jobCategoryData} dataKey="value" cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={3}>
                  {jobCategoryData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={v => `${v}%`} contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 mt-3">
              {jobCategoryData.map(cat => (
                <div key={cat.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: cat.color }} />
                    <span className="text-slate-600">{cat.name}</span>
                  </div>
                  <span className="font-medium text-slate-800">{cat.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;
