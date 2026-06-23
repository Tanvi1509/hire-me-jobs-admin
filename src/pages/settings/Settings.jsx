import { useState } from 'react';
import { User, Bell, Shield, Globe, Palette, Mail, Save } from 'lucide-react';
import { PageHeader, Card, Btn } from '../../components/ui/index';
import { useAuth } from '../../context/AuthContext';

const tabs = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'general', label: 'General', icon: Globe },
];

const Toggle = ({ checked, onChange }) => (
  <button
    onClick={() => onChange(!checked)}
    className={`relative w-10 h-5 rounded-full transition-colors ${checked ? 'bg-blue-600' : 'bg-slate-300'}`}
  >
    <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${checked ? 'translate-x-5' : 'translate-x-0.5'}`} />
  </button>
);

const Settings = () => {
  const { user } = useAuth();
  const [tab, setTab] = useState('profile');
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    role: user?.role || '',
    phone: '+1 (555) 000-0000',
    bio: 'Admin managing the job portal recruitment pipeline.',
    timezone: 'UTC-8 (Pacific)',
    language: 'English (US)',
  });
  const [notifSettings, setNotifSettings] = useState({
    newApplications: true,
    companiesVerification: true,
    hires: true,
    weeklyReport: false,
    systemAlerts: true,
    emailDigest: false,
  });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-5">
      <PageHeader title="Settings" subtitle="Manage your account and preferences" />

      <div className="flex flex-col lg:flex-row gap-5">
        {/* Sidebar tabs */}
        <div className="lg:w-52 shrink-0">
          <Card className="p-2">
            <nav className="space-y-0.5">
              {tabs.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setTab(id)}
                  className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${tab === id ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-50'}`}
                >
                  <Icon size={16} />
                  {label}
                </button>
              ))}
            </nav>
          </Card>
        </div>

        {/* Content */}
        <div className="flex-1">
          {tab === 'profile' && (
            <Card>
              <div className="p-6 border-b border-slate-100">
                <h2 className="font-semibold text-slate-800">Profile Information</h2>
                <p className="text-sm text-slate-500 mt-0.5">Update your personal details</p>
              </div>
              <div className="p-6 space-y-5">
                {/* Avatar */}
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center text-white text-xl font-bold">
                    {form.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <Btn size="sm" variant="outline">Change Photo</Btn>
                    <p className="text-xs text-slate-400 mt-1">JPG, PNG up to 2MB</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {[
                    { label: 'Full Name', key: 'name' },
                    { label: 'Email Address', key: 'email', type: 'email' },
                    { label: 'Phone Number', key: 'phone', type: 'tel' },
                    { label: 'Role', key: 'role' },
                  ].map(field => (
                    <div key={field.key}>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">{field.label}</label>
                      <input
                        type={field.type || 'text'}
                        value={form[field.key]}
                        onChange={e => setForm(f => ({ ...f, [field.key]: e.target.value }))}
                        className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400"
                      />
                    </div>
                  ))}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Bio</label>
                  <textarea
                    rows={3}
                    value={form.bio}
                    onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
                    className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 resize-none"
                  />
                </div>

                <div className="flex gap-3">
                  <Btn onClick={handleSave}>
                    <Save size={15} /> {saved ? 'Saved!' : 'Save Changes'}
                  </Btn>
                  <Btn variant="outline">Cancel</Btn>
                </div>
              </div>
            </Card>
          )}

          {tab === 'notifications' && (
            <Card>
              <div className="p-6 border-b border-slate-100">
                <h2 className="font-semibold text-slate-800">Notification Preferences</h2>
                <p className="text-sm text-slate-500 mt-0.5">Control which alerts you receive</p>
              </div>
              <div className="p-6 space-y-5">
                {[
                  { key: 'newApplications', label: 'New Applications', desc: 'When a candidate applies for a job' },
                  { key: 'companiesVerification', label: 'Company Verification Requests', desc: 'When a company submits verification documents' },
                  { key: 'hires', label: 'Hire Confirmations', desc: 'When a candidate is successfully hired' },
                  { key: 'weeklyReport', label: 'Weekly Summary Report', desc: 'Weekly digest of recruitment activity' },
                  { key: 'systemAlerts', label: 'System Alerts', desc: 'Security alerts and system notifications' },
                  { key: 'emailDigest', label: 'Email Digest', desc: 'Daily summary delivered to your email' },
                ].map(({ key, label, desc }) => (
                  <div key={key} className="flex items-center justify-between py-3 border-b border-slate-50 last:border-0">
                    <div>
                      <p className="text-sm font-medium text-slate-800">{label}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{desc}</p>
                    </div>
                    <Toggle
                      checked={notifSettings[key]}
                      onChange={val => setNotifSettings(s => ({ ...s, [key]: val }))}
                    />
                  </div>
                ))}
                <Btn onClick={handleSave}>
                  <Save size={15} /> {saved ? 'Saved!' : 'Save Preferences'}
                </Btn>
              </div>
            </Card>
          )}

          {tab === 'security' && (
            <Card>
              <div className="p-6 border-b border-slate-100">
                <h2 className="font-semibold text-slate-800">Security Settings</h2>
                <p className="text-sm text-slate-500 mt-0.5">Keep your account secure</p>
              </div>
              <div className="p-6 space-y-6">
                <div>
                  <h3 className="text-sm font-semibold text-slate-700 mb-4">Change Password</h3>
                  <div className="space-y-4 max-w-sm">
                    {['Current Password', 'New Password', 'Confirm New Password'].map(l => (
                      <div key={l}>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">{l}</label>
                        <input type="password" placeholder="••••••••" className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30" />
                      </div>
                    ))}
                    <Btn>Update Password</Btn>
                  </div>
                </div>
                <hr className="border-slate-100" />
                <div>
                  <h3 className="text-sm font-semibold text-slate-700 mb-4">Two-Factor Authentication</h3>
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                    <div>
                      <p className="text-sm font-medium text-slate-800">Authenticator App</p>
                      <p className="text-xs text-slate-500 mt-0.5">Use an app like Google Authenticator</p>
                    </div>
                    <Btn size="sm" variant="outline">Enable</Btn>
                  </div>
                </div>
                <hr className="border-slate-100" />
                <div>
                  <h3 className="text-sm font-semibold text-slate-700 mb-3">Active Sessions</h3>
                  {[
                    { device: 'Chrome on macOS', location: 'San Francisco, CA', time: 'Now (current)' },
                    { device: 'Safari on iPhone', location: 'San Francisco, CA', time: '2 days ago' },
                  ].map(session => (
                    <div key={session.device} className="flex items-center justify-between py-3 border-b border-slate-50 last:border-0">
                      <div>
                        <p className="text-sm font-medium text-slate-800">{session.device}</p>
                        <p className="text-xs text-slate-500">{session.location} · {session.time}</p>
                      </div>
                      {session.time !== 'Now (current)' && <Btn size="sm" variant="danger">Revoke</Btn>}
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          )}

          {tab === 'general' && (
            <Card>
              <div className="p-6 border-b border-slate-100">
                <h2 className="font-semibold text-slate-800">General Settings</h2>
                <p className="text-sm text-slate-500 mt-0.5">App-wide preferences</p>
              </div>
              <div className="p-6 space-y-5">
                {[
                  { label: 'Timezone', key: 'timezone', options: ['UTC-8 (Pacific)', 'UTC-5 (Eastern)', 'UTC+0 (GMT)', 'UTC+5:30 (IST)'] },
                  { label: 'Language', key: 'language', options: ['English (US)', 'English (UK)', 'Spanish', 'French', 'German'] },
                ].map(field => (
                  <div key={field.key}>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">{field.label}</label>
                    <select
                      value={form[field.key]}
                      onChange={e => setForm(f => ({ ...f, [field.key]: e.target.value }))}
                      className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                    >
                      {field.options.map(o => <option key={o}>{o}</option>)}
                    </select>
                  </div>
                ))}
                <hr className="border-slate-100" />
                <div className="space-y-4">
                  {[
                    { label: 'Dark Mode', desc: 'Use dark theme across the panel' },
                    { label: 'Compact View', desc: 'Show more content with tighter spacing' },
                    { label: 'Auto-approve verified companies', desc: 'Skip manual review for trusted companies' },
                  ].map(item => (
                    <div key={item.label} className="flex items-center justify-between py-2">
                      <div>
                        <p className="text-sm font-medium text-slate-800">{item.label}</p>
                        <p className="text-xs text-slate-500">{item.desc}</p>
                      </div>
                      <Toggle checked={false} onChange={() => {}} />
                    </div>
                  ))} 
                </div>
                <Btn onClick={handleSave}>
                  <Save size={15} /> {saved ? 'Saved!' : 'Save Settings'}
                </Btn>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
