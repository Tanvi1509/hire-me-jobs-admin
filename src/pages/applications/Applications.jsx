import { useState } from 'react';
import { Search, Filter, FileText, Star } from 'lucide-react';
import { applicationsData } from '../../data/mockData';
import {
  Card, StatusBadge, Avatar, PageHeader, Table, Btn, Badge
} from '../../components/ui/index';

const statusOptions = ['All', 'Pending', 'Shortlisted', 'Interview', 'Hired', 'Rejected'];

const scoreColor = score => {
  if (score >= 90) return 'text-green-600 bg-green-50';
  if (score >= 75) return 'text-blue-600 bg-blue-50';
  if (score >= 60) return 'text-yellow-600 bg-yellow-50';
  return 'text-red-600 bg-red-50';
};

const Applications = () => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const filtered = applicationsData.filter(a =>
    (statusFilter === 'All' || a.status === statusFilter) &&
    (a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.job.toLowerCase().includes(search.toLowerCase()))
  );

  const counts = statusOptions.reduce((acc, s) => {
    acc[s] = s === 'All' ? applicationsData.length : applicationsData.filter(a => a.status === s).length;
    return acc;
  }, {});

  return (
    <div className="space-y-5">
      <PageHeader
        title="Applications"
        subtitle={`${applicationsData.length} total applications`}
        action={
          <div className="flex items-center gap-2 text-sm text-slate-500 bg-white border border-slate-200 rounded-xl px-3 py-2">
            <Filter size={14} /> Export
          </div>
        }
      />

      {/* Status tabs */}
      <div className="flex flex-wrap gap-2">
        {statusOptions.map(s => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all ${statusFilter === s ? 'bg-blue-600 text-white shadow-sm' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
          >
            {s}
            <span className={`text-xs px-1.5 py-0.5 rounded-md font-semibold ${statusFilter === s ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'}`}>
              {counts[s]}
            </span>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search candidates or jobs..."
          className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400"
        />
      </div>

      <Card>
        <Table headers={['Candidate', 'Applied For', 'Company', 'Applied Date', 'Match Score', 'Status', 'Actions']}>
          {filtered.map(app => (
            <tr key={app.id} className="hover:bg-slate-50/50 transition-colors">
              <td className="px-5 py-4">
                <div className="flex items-center gap-3">
                  <Avatar name={app.name} />
                  <div>
                    <p className="font-medium text-slate-800 text-sm">{app.name}</p>
                  </div>
                </div>
              </td>
              <td className="px-5 py-4 text-sm text-slate-600 max-w-[160px] truncate">{app.job}</td>
              <td className="px-5 py-4 text-sm text-slate-500">{app.company}</td>
              <td className="px-5 py-4 text-sm text-slate-500">{app.applied}</td>
              <td className="px-5 py-4">
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-lg ${scoreColor(app.score)}`}>
                    {app.score}
                  </span>
                  <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-blue-500"
                      style={{ width: `${app.score}%` }}
                    />
                  </div>
                </div>
              </td>
              <td className="px-5 py-4">
                <StatusBadge status={app.status} />
              </td>
              <td className="px-5 py-4">
                <div className="flex gap-2">
                  <Btn size="sm" variant="primary">Review</Btn>
                  <select
                    defaultValue={app.status}
                    className="text-xs border border-slate-200 rounded-lg px-2 py-1 text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  >
                    {statusOptions.slice(1).map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
              </td>
            </tr>
          ))}
        </Table>
        {filtered.length === 0 && (
          <div className="text-center py-16 text-slate-400">
            <FileText size={32} className="mx-auto mb-3 opacity-30" />
            <p>No applications match your filter</p>
          </div>
        )}
      </Card>

      {/* Pagination */}
      <div className="flex items-center justify-between text-sm text-slate-500">
        <span>Showing {filtered.length} of {applicationsData.length} applications</span>
        <div className="flex gap-1">
          {[1, 2, 3].map(p => (
            <button key={p} className={`w-8 h-8 rounded-lg ${p === 1 ? 'bg-blue-600 text-white' : 'bg-white border border-slate-200 hover:bg-slate-50'}`}>{p}</button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Applications;
