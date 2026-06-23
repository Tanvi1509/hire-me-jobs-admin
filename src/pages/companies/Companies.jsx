import { useState } from 'react';
import { Search, Plus, Building2, MapPin, Users, Briefcase } from 'lucide-react';
import { companiesData } from '../../data/mockData';
import {
  Card, StatusBadge, Avatar, PageHeader, Table, Btn, Badge
} from '../../components/ui/index';

const Companies = () => {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [viewMode, setViewMode] = useState('grid');

  const statuses = ['All', 'Verified', 'Pending', 'Suspended'];
  const filtered = companiesData.filter(c =>
    (filter === 'All' || c.status === filter) &&
    c.name.toLowerCase().includes(search.toLowerCase())
  ); 

  return (
    <div className="space-y-5">
      <PageHeader
        title="Companies"
        subtitle={`${companiesData.length} registered companies`}
        action={<Btn><Plus size={16} /> Add Company</Btn>}
      />

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search companies..."
              className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400"
            />
          </div>
          <div className="flex gap-2">
            {statuses.map(s => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-all ${filter === s ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
              >
                {s}
              </button>
            ))}
          </div>
          <div className="flex rounded-xl border border-slate-200 overflow-hidden ml-auto">
            {['grid', 'table'].map(m => (
              <button
                key={m}
                onClick={() => setViewMode(m)}
                className={`px-3 py-2 text-xs font-medium capitalize transition-colors ${viewMode === m ? 'bg-blue-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'}`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(company => (
            <Card key={company.id} className="p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-bold text-lg shrink-0">
                  {company.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-slate-800 truncate">{company.name}</h3>
                  <p className="text-sm text-slate-500">{company.industry}</p>
                </div>
                <StatusBadge status={company.status} />
              </div>
              <div className="space-y-2 text-sm text-slate-500 mb-4">
                <div className="flex items-center gap-2"><MapPin size={13} /> {company.location}</div>
                <div className="flex items-center gap-2"><Users size={13} /> {company.employees} employees</div>
                <div className="flex items-center gap-2"><Briefcase size={13} /> {company.activeJobs} active jobs · {company.totalHires} hires</div>
              </div>
              <div className="flex gap-2">
                <Btn size="sm" variant="primary" className="flex-1 justify-center">View Profile</Btn>
                <Btn size="sm" variant="outline">Edit</Btn>
                {company.status === 'Pending' && <Btn size="sm" variant="secondary">Verify</Btn>}
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <Table headers={['Company', 'Industry', 'Location', 'Employees', 'Active Jobs', 'Total Hires', 'Status', 'Joined', 'Actions']}>
            {filtered.map(company => (
              <tr key={company.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-xs font-bold shrink-0">
                      {company.name[0]}
                    </div>
                    <span className="font-medium text-slate-800 text-sm">{company.name}</span>
                  </div>
                </td>
                <td className="px-5 py-3.5 text-sm text-slate-500">{company.industry}</td>
                <td className="px-5 py-3.5 text-sm text-slate-500">{company.location}</td>
                <td className="px-5 py-3.5 text-sm text-slate-500">{company.employees}</td>
                <td className="px-5 py-3.5 text-sm text-slate-700 font-medium">{company.activeJobs}</td>
                <td className="px-5 py-3.5 text-sm text-slate-700 font-medium">{company.totalHires}</td>
                <td className="px-5 py-3.5"><StatusBadge status={company.status} /></td>
                <td className="px-5 py-3.5 text-sm text-slate-500">{company.joined}</td>
                <td className="px-5 py-3.5">
                  <div className="flex gap-2">
                    <Btn size="sm" variant="outline">View</Btn>
                    {company.status === 'Pending' && <Btn size="sm">Verify</Btn>}
                    {company.status === 'Suspended' && <Btn size="sm" variant="danger">Review</Btn>}
                  </div>
                </td>
              </tr>
            ))}
          </Table>
        </Card>
      )}

      {filtered.length === 0 && (
        <div className="text-center py-16 text-slate-400 bg-white rounded-2xl border border-slate-200">
          <Building2 size={32} className="mx-auto mb-3 opacity-30" />
          <p>No companies found</p>
        </div>
      )}
    </div>
  );
};

export default Companies;
