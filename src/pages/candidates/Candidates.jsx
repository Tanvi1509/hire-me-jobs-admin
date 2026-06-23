import { useState } from 'react';
import { Search, Users, MapPin, Briefcase, Mail } from 'lucide-react';
import { candidatesData } from '../../data/mockData';
import {
  Card, StatusBadge, Avatar, PageHeader, Table, Btn, Badge
} from '../../components/ui/index';

const Candidates = () => {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [viewMode, setViewMode] = useState('grid');

  const filtered = candidatesData.filter(c =>
    (filter === 'All' || c.status === filter) &&
    (c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.title.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-5">
      <PageHeader
        title="Candidates"
        subtitle={`${candidatesData.length} registered candidates`}
      />

      <Card className="p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search candidates..."
              className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            />
          </div>
          <div className="flex gap-2">
            {['All', 'Active', 'Inactive'].map(s => (
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
          {filtered.map(candidate => (
            <Card key={candidate.id} className="p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-3 mb-4">
                <Avatar name={candidate.name} size={12} />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-slate-800">{candidate.name}</h3>
                  <p className="text-sm text-slate-500">{candidate.title}</p>
                </div>
                <StatusBadge status={candidate.status} />
              </div>
              <div className="space-y-2 text-sm text-slate-500 mb-4">
                <div className="flex items-center gap-2"><MapPin size={13} /> {candidate.location}</div>
                <div className="flex items-center gap-2"><Briefcase size={13} /> {candidate.experience}</div>
                <div className="flex items-center gap-2"><Mail size={13} /> {candidate.email}</div>
              </div>
              <div className="flex flex-wrap gap-1.5 mb-4">
                {candidate.skills.map(skill => (
                  <Badge key={skill} color="blue">{skill}</Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Btn size="sm" variant="primary" className="flex-1 justify-center">View Profile</Btn>
                <Btn size="sm" variant="outline">{candidate.applications} Apps</Btn>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <Table headers={['Candidate', 'Title', 'Location', 'Experience', 'Skills', 'Applications', 'Status', 'Actions']}>
            {filtered.map(c => (
              <tr key={c.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <Avatar name={c.name} />
                    <div>
                      <p className="font-medium text-slate-800 text-sm">{c.name}</p>
                      <p className="text-xs text-slate-400">{c.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3.5 text-sm text-slate-600">{c.title}</td>
                <td className="px-5 py-3.5 text-sm text-slate-500">{c.location}</td>
                <td className="px-5 py-3.5 text-sm text-slate-500">{c.experience}</td>
                <td className="px-5 py-3.5">
                  <div className="flex flex-wrap gap-1">
                    {c.skills.slice(0, 2).map(s => <Badge key={s} color="blue">{s}</Badge>)}
                    {c.skills.length > 2 && <Badge color="gray">+{c.skills.length - 2}</Badge>}
                  </div>
                </td>
                <td className="px-5 py-3.5 text-sm text-slate-600 font-medium">{c.applications}</td>
                <td className="px-5 py-3.5"><StatusBadge status={c.status} /></td>
                <td className="px-5 py-3.5">
                  <div className="flex gap-2">
                    <Btn size="sm" variant="primary">View</Btn>
                    <Btn size="sm" variant="ghost">Message</Btn>
                  </div>
                </td>
              </tr>
            ))}
          </Table>
        </Card>
      )}
    </div>
  );
};

export default Candidates;
