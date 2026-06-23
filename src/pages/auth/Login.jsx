// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Briefcase, Eye, EyeOff, AlertCircle, Mail, Lock } from 'lucide-react';
// import { useAuth } from '../../context/AuthContext';

// const Login = () => {
//   const [email, setEmail] = useState('admin@jobportal.com');
//   const [password, setPassword] = useState('admin123');
//   const [showPass, setShowPass] = useState(false);
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);
//   const { login } = useAuth();
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');
//     setLoading(true);
//     await new Promise(r => setTimeout(r, 600));
//     const result = login(email, password);
//     if (result.success) {
//       navigate('/dashboard');
//     } else {
//       setError(result.error);
//     }
//     setLoading(false);
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex">
//       {/* Left panel - branding */}
//       <div className="hidden lg:flex w-1/2 flex-col justify-between p-12 relative overflow-hidden">
//         {/* Grid background */}
//         <div className="absolute inset-0 opacity-5"
//           style={{
//             backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
//             backgroundSize: '40px 40px'
//           }}
//         />
//         <div className="relative z-10">
//           <div className="flex items-center gap-3 mb-16">
//             <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center">
//               <Briefcase size={20} className="text-white" />
//             </div>
//             <span className="text-white font-bold text-lg">JobPortal Admin</span>
//           </div>
//           <h1 className="text-5xl font-bold text-white leading-tight mb-6">
//             Manage your<br />
//             <span className="text-blue-400">talent pipeline</span><br />
//             with confidence
//           </h1>
//           <p className="text-slate-400 text-lg leading-relaxed max-w-md">
//             A powerful admin panel for recruiting teams. Track jobs, candidates, and companies.
//           </p>
//         </div>
       
//       </div>

//       {/* Right panel - login form */}
//       <div className="flex-1 flex items-center justify-center p-6 relative">
//         <div className="w-full max-w-md">
//           {/* Mobile logo */}
//           <div className="flex items-center gap-3 mb-8 lg:hidden justify-center">
//             <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center">
//               <Briefcase size={20} className="text-white" />
//             </div>
//             <span className="text-white font-bold text-lg">JobPortal Admin</span>
//           </div>

//           <div className="bg-white rounded-3xl shadow-2xl p-8 lg:p-10">
//             <div className="mb-8">
//               <h2 className="text-2xl font-bold text-slate-800">Welcome back</h2>
//               <p className="text-slate-500 mt-1">Sign in to your admin account</p>
//             </div>

//             {/* Demo credentials hint */}
//             <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 mb-6 text-sm text-blue-700">
//               <strong>Demo:</strong> admin@jobportal.com / admin123
//             </div>

//             {error && (
//               <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-5 text-sm text-red-700">
//                 <AlertCircle size={16} />
//                 {error}
//               </div>
//             )}

//             <form onSubmit={handleSubmit} className="space-y-5">
//               <div>
//                 <label className="block text-sm font-medium text-slate-700 mb-1.5">Email address</label>
//                 <div className="relative">
//                   <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
//                   <input
//                     type="email"
//                     value={email}
//                     onChange={e => setEmail(e.target.value)}
//                     required
//                     placeholder="admin@company.com"
//                     className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all"
//                   />
//                 </div>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
//                 <div className="relative">
//                   <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
//                   <input
//                     type={showPass ? 'text' : 'password'}
//                     value={password}
//                     onChange={e => setPassword(e.target.value)}
//                     required
//                     placeholder="••••••••"
//                     className="w-full pl-10 pr-11 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all"
//                   />
//                   <button
//                     type="button"
//                     onClick={() => setShowPass(!showPass)}
//                     className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
//                   >
//                     {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
//                   </button>
//                 </div>
//               </div>

//               <div className="flex items-center justify-between text-sm">
//                 <label className="flex items-center gap-2 text-slate-600 cursor-pointer">
//                   <input type="checkbox" className="rounded border-slate-300 accent-blue-600" />
//                   Remember me
//                 </label>
//                 <button type="button" className="text-blue-600 hover:underline font-medium">Forgot password?</button>
//               </div>

//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-70 text-white font-semibold py-3 rounded-xl transition-all duration-150 flex items-center justify-center gap-2 shadow-lg shadow-blue-600/25"
//               >
//                 {loading ? (
//                   <>
//                     <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
//                     Signing in...
//                   </>
//                 ) : 'Sign In'}
//               </button>
//             </form>

//             <p className="text-center text-sm text-slate-400 mt-6">
//               Having trouble? <button className="text-blue-600 hover:underline font-medium">Contact support</button>
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, Eye, EyeOff, AlertCircle, Mail, Lock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, user } = useAuth(); // user will contain the data after login
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!email || !password) {
      setError('Please fill in both email and password.');
      setLoading(false);
      return;
    }

    const result = await login(email, password);
    setLoading(false);

    if (result.success) {
      // Optional: show a toast or log the user data including role
      console.log('✅ Logged in user:', user);
      navigate('/dashboard', { replace: true });
    } else {
      setError(result.error || 'Invalid email or password.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex">
      {/* Left panel - branding */}
      <div className="hidden lg:flex w-1/2 flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }}
        />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-16">
            <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center">
              <Briefcase size={20} className="text-white" />
            </div>
            <span className="text-white font-bold text-lg">JobPortal Admin</span>
          </div>
          <h1 className="text-5xl font-bold text-white leading-tight mb-6">
            Manage your<br />
            <span className="text-blue-400">talent pipeline</span><br />
            with confidence
          </h1>
          <p className="text-slate-400 text-lg leading-relaxed max-w-md">
            A powerful admin panel for recruiting teams. Track jobs, candidates, and companies.
          </p>
        </div>
      </div>

      {/* Right panel - login form */}
      <div className="flex-1 flex items-center justify-center p-6 relative">
        <div className="w-full max-w-md">
          <div className="flex items-center gap-3 mb-8 lg:hidden justify-center">
            <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center">
              <Briefcase size={20} className="text-white" />
            </div>
            <span className="text-white font-bold text-lg">JobPortal Admin</span>
          </div>

          <div className="bg-white rounded-3xl shadow-2xl p-8 lg:p-10">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-slate-800">Welcome back</h2>
              <p className="text-slate-500 mt-1">Sign in to your admin account</p>
            </div>

            {error && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-5 text-sm text-red-700">
                <AlertCircle size={16} />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Email address</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    placeholder="admin@company.com"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="w-full pl-10 pr-11 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 text-slate-600 cursor-pointer">
                  <input type="checkbox" className="rounded border-slate-300 accent-blue-600" />
                  Remember me
                </label>
                <button type="button" className="text-blue-600 hover:underline font-medium">Forgot password?</button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-70 text-white font-semibold py-3 rounded-xl transition-all duration-150 flex items-center justify-center gap-2 shadow-lg shadow-blue-600/25"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Signing in...
                  </>
                ) : 'Sign In'}
              </button>
            </form>

            <p className="text-center text-sm text-slate-400 mt-6">
              Having trouble? <button className="text-blue-600 hover:underline font-medium">Contact support</button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;