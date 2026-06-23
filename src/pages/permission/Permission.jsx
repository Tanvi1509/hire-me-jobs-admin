// import React, { useState, useEffect } from "react";

// function Permission() {
//   // Dropdown options
//   const [roles, setRoles] = useState([]);
//   const [modules, setModules] = useState([]);

//   // Selected role
//   const [selectedRoleId, setSelectedRoleId] = useState("");

//   // Permissions for the selected role
//   const [permissions, setPermissions] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [updateMessage, setUpdateMessage] = useState("");

//   // 1. Fetch all roles and modules on mount
//   useEffect(() => {
//     const fetchRoles = async () => {
//       try {
//         const res = await fetch("https://hire-me-jobs.onrender.com/role");
//         const data = await res.json();
//         if (data.success) setRoles(data.data);
//       } catch (err) {
//         console.error("Failed to fetch roles:", err);
//       }
//     };
//     const fetchModules = async () => {
//       try {
//         const res = await fetch("https://hire-me-jobs.onrender.com/module");
//         const data = await res.json();
//         if (data.success) setModules(data.data);
//       } catch (err) {
//         console.error("Failed to fetch modules:", err);
//       }
//     };
//     fetchRoles();
//     fetchModules();
//   }, []);

//   // 2. Fetch permissions when a role is selected
//   useEffect(() => {
//     if (!selectedRoleId) {
//       setPermissions([]);
//       return;
//     }

//     const fetchPermissions = async () => {
//       setLoading(true);
//       setError("");
//       setUpdateMessage("");
//       try {
//         const url = `https://hire-me-jobs.onrender.com/permission/?role_id=${selectedRoleId}`;
//         const res = await fetch(url);
//         const data = await res.json();
//         if (data.success) {
//           setPermissions(data.data);
//         } else {
//           setPermissions([]);
//           setError("Failed to load permissions.");
//         }
//       } catch (err) {
//         setError("Network error. Please try again.");
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchPermissions();
//   }, [selectedRoleId]);

//   // 3. Handle switch toggle for a specific permission
//   const handleToggle = async (permissionId, field) => {
//     // Find the permission in current state
//     const permissionIndex = permissions.findIndex((p) => p.id === permissionId);
//     if (permissionIndex === -1) return;

//     const currentPermission = permissions[permissionIndex];
//     const updatedPermission = {
//       ...currentPermission,
//       [field]: !currentPermission[field],
//     };

//     // Optimistic update
//     const newPermissions = [...permissions];
//     newPermissions[permissionIndex] = updatedPermission;
//     setPermissions(newPermissions);
//     setUpdateMessage("");

//     try {
//       const res = await fetch(
//         `https://hire-me-jobs.onrender.com/permission/${permissionId}`,
//         {
//           method: "PATCH",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify(updatedPermission),
//         }
//       );
//       const data = await res.json();
//       if (!data.success) {
//         // Revert on failure
//         setPermissions(permissions);
//         setUpdateMessage("Update failed. Please try again.");
//       } else {
//         setUpdateMessage("Permission updated successfully!");
//         // Keep the optimistic update (it matches the server)
//       }
//     } catch (err) {
//       // Revert on network error
//       setPermissions(permissions);
//       setUpdateMessage("Network error. Please try again.");
//       console.error(err);
//     }
//   };

//   // Helper: get module name by id
//   const getModuleName = (moduleId) => {
//     const mod = modules.find((m) => m.id === moduleId);
//     return mod ? mod.name : `Module ${moduleId}`;
//   };

//   // Render a single switch (reusable)
//   const SwitchButton = ({ value, onChange }) => (
//     <button
//       onClick={onChange}
//       className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
//         value ? "bg-blue-600" : "bg-gray-300"
//       }`}
//     >
//       <span
//         className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
//           value ? "translate-x-6" : "translate-x-1"
//         }`}
//       />
//     </button>
//   );

//   return (
//     <div className="min-h-screen bg-gray-50 py-8 px-4">
//       <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-md overflow-hidden p-6">
//         <h1 className="text-2xl font-bold text-gray-800 mb-6">
//           Permission Manager
//         </h1>

//         {/* Role Selector */}
//         <div className="mb-6">
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             Select a Role
//           </label>
//           <select
//             value={selectedRoleId}
//             onChange={(e) => setSelectedRoleId(Number(e.target.value))}
//             className="w-full sm:w-64 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//           >
//             <option value="">-- Choose a role --</option>
//             {roles.map((role) => (
//               <option key={role.id} value={role.id}>
//                 {role.role_name} (ID: {role.id})
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* Loading & Messages */}
//         {loading && (
//           <div className="text-center py-4 text-gray-500">Loading permissions...</div>
//         )}
//         {error && (
//           <div className="bg-red-50 text-red-700 p-3 rounded-md mb-4">{error}</div>
//         )}
//         {updateMessage && (
//           <div
//             className={`p-3 rounded-md mb-4 ${
//               updateMessage.includes("successfully")
//                 ? "bg-green-50 text-green-700"
//                 : "bg-red-50 text-red-700"
//             }`}
//           >
//             {updateMessage}
//           </div>
//         )}

//         {/* Permission Table */}
//         {!loading && selectedRoleId && (
//           <>
//             {permissions.length === 0 ? (
//               <div className="text-center py-8 text-gray-400">
//                 No modules found for this role.
//               </div>
//             ) : (
//               <div className="overflow-x-auto">
//                 <table className="min-w-full divide-y divide-gray-200">
//                   <thead className="bg-gray-50">
//                     <tr>
//                       <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Module
//                       </th>
//                       <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Read
//                       </th>
//                       <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Create
//                       </th>
//                       <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Update
//                       </th>
//                       <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Delete
//                       </th>
//                     </tr>
//                   </thead>
//                   <tbody className="bg-white divide-y divide-gray-200">
//                     {permissions.map((perm) => (
//                       <tr key={perm.id}>
//                         <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
//                           {getModuleName(perm.module_id)}
//                         </td>
//                         <td className="px-4 py-3 whitespace-nowrap text-center">
//                           <SwitchButton
//                             value={perm.can_read}
//                             onChange={() => handleToggle(perm.id, "can_read")}
//                           />
//                         </td>
//                         <td className="px-4 py-3 whitespace-nowrap text-center">
//                           <SwitchButton
//                             value={perm.can_create}
//                             onChange={() => handleToggle(perm.id, "can_create")}
//                           />
//                         </td>
//                         <td className="px-4 py-3 whitespace-nowrap text-center">
//                           <SwitchButton
//                             value={perm.can_update}
//                             onChange={() => handleToggle(perm.id, "can_update")}
//                           />
//                         </td>
//                         <td className="px-4 py-3 whitespace-nowrap text-center">
//                           <SwitchButton
//                             value={perm.can_delete}
//                             onChange={() => handleToggle(perm.id, "can_delete")}
//                           />
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             )}
//           </>
//         )}

//         {!selectedRoleId && !loading && (
//           <div className="text-center py-8 text-gray-400">
//             Please select a role to view permissions.
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default Permission;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// ── Inline SVG Icons ──────────────────────────────────────────────────────────
const ShieldIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);
const ChevronDownIcon = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
);
const RefreshIcon = ({ spinning }) => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{
      animation: spinning ? "perm-spin 1s linear infinite" : "none",
      display: "block",
    }}
  >
    <polyline points="23 4 23 10 17 10" />
    <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
  </svg>
);
const CheckIcon = () => (
  <svg
    width="10"
    height="10"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
const XMarkIcon = () => (
  <svg
    width="10"
    height="10"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);
const AlertCircleIcon = () => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);
const CheckCircleIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);
const XCircleIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="15" y1="9" x2="9" y2="15" />
    <line x1="9" y1="9" x2="15" y2="15" />
  </svg>
);

// ── Styles ────────────────────────────────────────────────────────────────────
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

  @keyframes perm-spin    { to { transform: rotate(360deg); } }
  @keyframes perm-fadeUp  { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
  @keyframes perm-rowIn   { from { opacity:0; transform:translateX(-6px); } to { opacity:1; transform:translateX(0); } }
  @keyframes perm-toast   { from { opacity:0; transform:translateY(10px) scale(.97); } to { opacity:1; transform:translateY(0) scale(1); } }
  @keyframes perm-shimmer { 0% { background-position:-600px 0; } 100% { background-position:600px 0; } }

  .perm * { box-sizing:border-box; font-family:'Inter',system-ui,sans-serif; margin:0; padding:0; }

  .perm {
    min-height: 100vh;
    background: #f1f5f9;
    padding: 32px 24px;
    color: #1e293b;
  }

  /* Page header */
  .perm-hdr {
    display: flex; align-items: flex-start; justify-content: space-between;
    flex-wrap: wrap; gap: 16px; margin-bottom: 28px;
  }
  .perm-hdr-left { display:flex; align-items:center; gap:14px; }
  .perm-icon-box {
    width:46px; height:46px; border-radius:13px; flex-shrink:0;
    background: linear-gradient(135deg,#6366f1 0%,#8b5cf6 100%);
    box-shadow: 0 4px 14px rgba(99,102,241,.30);
    display:flex; align-items:center; justify-content:center; color:#fff;
  }
  .perm-page-title  { font-size:20px; font-weight:700; color:#0f172a; letter-spacing:-.3px; }
  .perm-page-sub    { font-size:13px; color:#64748b; margin-top:3px; }
  .perm-role-pill {
    display:inline-flex; align-items:center; gap:6px;
    background:#ede9fe; color:#6d28d9; border:1px solid #ddd6fe;
    border-radius:20px; padding:4px 12px; font-size:12px; font-weight:600;
  }
  .perm-role-dot { width:6px; height:6px; border-radius:50%; background:#7c3aed; }

  /* Card */
  .perm-card {
    background:#fff;
    border:1px solid #e2e8f0;
    border-radius:16px;
    overflow:hidden;
    box-shadow: 0 1px 4px rgba(0,0,0,.05), 0 4px 16px rgba(0,0,0,.04);
  }
  .perm-card-hdr {
    padding:18px 24px;
    border-bottom:1px solid #f1f5f9;
    display:flex; align-items:center; justify-content:space-between;
    flex-wrap:wrap; gap:14px;
    background:#fff;
  }
  .perm-card-title {
    font-size:15px; font-weight:600; color:#0f172a;
    display:flex; align-items:center; gap:8px;
  }
  .perm-badge {
    background:#f1f5f9; color:#64748b; border:1px solid #e2e8f0;
    border-radius:20px; font-size:11px; font-weight:600; padding:2px 9px;
  }

  /* Controls */
  .perm-controls { display:flex; align-items:center; gap:10px; flex-wrap:wrap; }
  .perm-sel-label { font-size:13px; color:#64748b; white-space:nowrap; }
  .perm-sel-wrap  { position:relative; }
  .perm-select {
    appearance:none;
    background:#f8fafc; border:1px solid #e2e8f0; border-radius:10px;
    padding:9px 36px 9px 13px; font-size:13px; font-weight:500; color:#1e293b;
    cursor:pointer; min-width:200px; outline:none;
    transition:border-color .2s, box-shadow .2s;
  }
  .perm-select:hover { border-color:#a5b4fc; }
  .perm-select:focus { border-color:#6366f1; box-shadow:0 0 0 3px rgba(99,102,241,.15); }
  .perm-sel-arrow {
    position:absolute; right:11px; top:50%; transform:translateY(-50%);
    pointer-events:none; color:#94a3b8;
  }
  .perm-refresh {
    display:flex; align-items:center; gap:6px;
    background:#f8fafc; border:1px solid #e2e8f0; border-radius:10px;
    padding:9px 14px; font-size:12px; font-weight:500; color:#64748b;
    cursor:pointer; transition:all .2s; white-space:nowrap;
  }
  .perm-refresh:hover { background:#f1f5f9; border-color:#a5b4fc; color:#4f46e5; }
  .perm-refresh:disabled { opacity:.6; cursor:not-allowed; }

  /* Empty states */
  .perm-empty {
    display:flex; flex-direction:column; align-items:center; justify-content:center;
    padding:72px 24px; gap:14px; text-align:center;
    animation:perm-fadeUp .3s ease;
  }
  .perm-empty-icon {
    width:60px; height:60px; border-radius:16px;
    display:flex; align-items:center; justify-content:center;
  }
  .perm-empty-icon.purple { background:#f5f3ff; color:#8b5cf6; }
  .perm-empty-icon.amber  { background:#fffbeb; color:#d97706; }
  .perm-empty-title { font-size:15px; font-weight:600; color:#374151; }
  .perm-empty-sub   { font-size:13px; color:#94a3b8; max-width:280px; line-height:1.5; }

  /* Skeleton */
  .perm-skel-row {
    display:grid;
    grid-template-columns: 1fr 90px 90px 90px 90px;
    gap:0; padding:18px 24px;
    border-bottom:1px solid #f1f5f9; align-items:center;
  }
  .perm-skel-bar {
    height:13px; border-radius:6px;
    background:linear-gradient(90deg,#f1f5f9 25%,#e8edf5 50%,#f1f5f9 75%);
    background-size:600px 100%;
    animation:perm-shimmer 1.5s infinite;
  }
  .perm-skel-circle {
    width:38px; height:38px; border-radius:10px; flex-shrink:0;
    background:linear-gradient(90deg,#f1f5f9 25%,#e8edf5 50%,#f1f5f9 75%);
    background-size:600px 100%;
    animation:perm-shimmer 1.5s infinite;
  }
  .perm-skel-pill {
    width:44px; height:24px; border-radius:12px; margin:0 auto;
    background:linear-gradient(90deg,#f1f5f9 25%,#e8edf5 50%,#f1f5f9 75%);
    background-size:600px 100%;
    animation:perm-shimmer 1.5s infinite;
  }

  /* Table */
  .perm-tbl-wrap { overflow-x:auto; }
  .perm-tbl { width:100%; border-collapse:collapse; }
  .perm-tbl thead tr { background:#fafbfc; }
  .perm-tbl thead th {
    padding:12px 24px; font-size:11px; font-weight:600;
    text-transform:uppercase; letter-spacing:.7px; color:#94a3b8;
    text-align:left; white-space:nowrap;
    border-bottom:1px solid #f1f5f9;
  }
  .perm-tbl thead th.c { text-align:center; }
  .perm-tbl tbody tr {
    border-bottom:1px solid #f8fafc;
    transition:background .15s;
    animation:perm-rowIn .22s ease both;
  }
  .perm-tbl tbody tr:hover { background:#fafbff; }
  .perm-tbl tbody tr:last-child { border-bottom:none; }
  .perm-tbl td { padding:15px 24px; vertical-align:middle; }

  /* Module cell */
  .perm-mod-cell  { display:flex; align-items:center; gap:12px; }
  .perm-mod-avatar {
    width:38px; height:38px; border-radius:10px; flex-shrink:0;
    background:linear-gradient(135deg,#ede9fe 0%,#ddd6fe 100%);
    border:1px solid #c4b5fd;
    display:flex; align-items:center; justify-content:center;
    font-size:14px; font-weight:700; color:#7c3aed;
  }
  .perm-mod-name { font-size:13px; font-weight:600; color:#1e293b; }
  .perm-mod-id   { font-size:11px; color:#94a3b8; margin-top:2px; }

  /* Toggle */
  .perm-sw-wrap { display:flex; justify-content:center; }
  .perm-sw {
    position:relative; width:46px; height:26px;
    border-radius:100px; border:none; cursor:pointer; outline:none;
    transition:background .25s, box-shadow .25s; flex-shrink:0;
  }
  .perm-sw.on  { background:linear-gradient(135deg,#6366f1,#7c3aed); box-shadow:0 2px 8px rgba(99,102,241,.35); }
  .perm-sw.off { background:#e2e8f0; }
  .perm-sw:hover.on  { box-shadow:0 2px 12px rgba(99,102,241,.5); }
  .perm-sw:hover.off { background:#cbd5e1; }
  .perm-sw-knob {
    position:absolute; top:4px;
    width:18px; height:18px; border-radius:50%; background:#fff;
    box-shadow:0 1px 3px rgba(0,0,0,.15);
    transition:left .22s cubic-bezier(.4,0,.2,1);
    display:flex; align-items:center; justify-content:center;
  }
  .perm-sw.on  .perm-sw-knob { left:24px; color:#6366f1; }
  .perm-sw.off .perm-sw-knob { left:4px;  color:#cbd5e1; }

  /* Footer */
  .perm-footer {
    display:flex; align-items:center; flex-wrap:wrap; gap:16px;
    padding:13px 24px; border-top:1px solid #f1f5f9;
    background:#fafbfc; font-size:12px; color:#64748b;
  }
  .perm-stat { display:flex; align-items:center; gap:6px; }
  .perm-stat-dot { width:7px; height:7px; border-radius:50%; }
  .perm-stat-dot.on  { background:#6366f1; }
  .perm-stat-dot.off { background:#cbd5e1; }
  .perm-footer-right { margin-left:auto; color:#94a3b8; }

  

  /* Toasts */
  .perm-toasts {
    position:fixed; bottom:24px; right:24px; z-index:9999;
    display:flex; flex-direction:column; gap:8px;
  }
  .perm-toast {
    display:flex; align-items:center; gap:10px;
    padding:12px 16px; border-radius:12px;
    font-size:13px; font-weight:500;
    box-shadow:0 4px 16px rgba(0,0,0,.12);
    animation:perm-toast .3s ease;
    border:1px solid transparent; min-width:240px;
  }
  .perm-toast.success { background:#f0fdf4; color:#166534; border-color:#bbf7d0; }
  .perm-toast.error   { background:#fef2f2; color:#991b1b; border-color:#fecaca; }
  .perm-toast-icon { flex-shrink:0; }

  /* Column header pills */
  .perm-col-pill {
    display:inline-flex; align-items:center; gap:5px;
    padding:3px 10px; border-radius:20px; font-size:10.5px; font-weight:600;
    letter-spacing:.5px; text-transform:uppercase; border:1px solid;
  }

.perm-add-btn {
  background: linear-gradient(135deg,#6366f1,#8b5cf6);
  color: white;
  border: none;
  border-radius: 10px;
  padding: 10px 16px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all .2s;
}

.perm-add-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(99,102,241,.35);
}

  .perm-col-read   { background:#eff6ff; color:#1d4ed8; border-color:#bfdbfe; }
  .perm-col-create { background:#f0fdf4; color:#15803d; border-color:#bbf7d0; }
  .perm-col-update { background:#fffbeb; color:#b45309; border-color:#fde68a; }
  .perm-col-delete { background:#fef2f2; color:#b91c1c; border-color:#fecaca; }
`;

// ── Sub-components ────────────────────────────────────────────────────────────
const SkeletonRows = () => (
  <>
    {[...Array(4)].map((_, i) => (
      <div className="perm-skel-row" key={i}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div className="perm-skel-circle" />
          <div>
            <div
              className="perm-skel-bar"
              style={{ width: 130, marginBottom: 7 }}
            />
            <div className="perm-skel-bar" style={{ width: 65, height: 10 }} />
          </div>
        </div>
        {[...Array(4)].map((_, j) => (
          <div className="perm-skel-pill" key={j} />
        ))}
      </div>
    ))}
  </>
);

const Toggle = ({ value, onChange }) => (
  <div className="perm-sw-wrap">
    <button className={`perm-sw ${value ? "on" : "off"}`} onClick={onChange}>
      <span className="perm-sw-knob">
        {value ? <CheckIcon /> : <XMarkIcon />}
      </span>
    </button>
  </div>
);

const Toast = ({ msg, type }) => (
  <div className={`perm-toast ${type}`}>
    <span className="perm-toast-icon">
      {type === "success" ? <CheckCircleIcon /> : <XCircleIcon />}
    </span>
    {msg}
  </div>
);

const ColPill = ({ label, cls }) => (
  <span className={`perm-col-pill ${cls}`}>{label}</span>
);

// ── Main Component ────────────────────────────────────────────────────────────
export default function Permission() {
  const navigate = useNavigate();
  const [roles, setRoles] = useState([]);
  const [modules, setModules] = useState([]);
  const [selectedRoleId, setSelectedRoleId] = useState("");
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [toasts, setToasts] = useState([]);

  const pushToast = (msg, type = "success") => {
    const id = Date.now();
    setToasts((t) => [...t, { id, msg, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200);
  };

  useEffect(() => {
    const load = async (url, setter) => {
      try {
        const r = await fetch(url);
        const d = await r.json();
        if (d.success) setter(d.data);
      } catch {}
    };
    load("https://hire-me-jobs.onrender.com/role", setRoles);
    load("https://hire-me-jobs.onrender.com/module", setModules);
  }, []);

  const fetchPermissions = async (roleId, silent = false) => {
    if (!roleId) {
      setPermissions([]);
      return;
    }
    silent ? setRefreshing(true) : setLoading(true);
    try {
      const r = await fetch(
        `https://hire-me-jobs.onrender.com/permission/?role_id=${roleId}`,
      );
      const d = await r.json();
      setPermissions(d.success ? d.data : []);
      if (silent && d.success) pushToast("Permissions refreshed.", "success");
    } catch {
      if (!silent) pushToast("Failed to load permissions.", "error");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPermissions(selectedRoleId);
  }, [selectedRoleId]);

  const handleToggle = async (permId, field) => {
    const idx = permissions.findIndex((p) => p.id === permId);
    if (idx === -1) return;
    const snapshot = [...permissions];
    const updated = { ...permissions[idx], [field]: !permissions[idx][field] };
    const next = [...permissions];
    next[idx] = updated;
    setPermissions(next);

    try {
      const r = await fetch(
        `https://hire-me-jobs.onrender.com/permission/${permId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updated),
        },
      );
      const d = await r.json();
      if (!d.success) {
        setPermissions(snapshot);
        pushToast("Update failed. Changes reverted.", "error");
      } else {
        const label = field.replace("can_", "").replace("_", " ");
        pushToast(
          `${label.charAt(0).toUpperCase() + label.slice(1)} permission updated.`,
          "success",
        );
      }
    } catch {
      setPermissions(snapshot);
      pushToast("Network error. Changes reverted.", "error");
    }
  };

  const modName = (id) => {
    const m = modules.find((x) => x.id === id);
    return m ? m.name : `Module ${id}`;
  };
  const modInitial = (id) => modName(id).charAt(0).toUpperCase();

  const selectedRole = roles.find((r) => r.id === selectedRoleId);
  const enabledCount = permissions.reduce(
    (a, p) =>
      a +
      [p.can_read, p.can_create, p.can_update, p.can_delete].filter(Boolean)
        .length,
    0,
  );
  const totalSlots = permissions.length * 4;
  const progressPct =
    totalSlots > 0 ? Math.round((enabledCount / totalSlots) * 100) : 0;

  return (
    <>
      <style>{CSS}</style>

      <div className="perm">
        {/* Page Header */}
        <div className="perm-hdr">
          <div className="perm-hdr-left">
            <div className="perm-icon-box">
              <ShieldIcon />
            </div>
            <div>
              <div className="perm-page-title">Permission Manager</div>
            </div>
          </div>
          {selectedRole && (
            <div className="perm-role-pill">
              <span className="perm-role-dot" />
              {selectedRole.role_name}
            </div>
          )}
        </div>

        {/* Card */}
        <div className="perm-card">
          {/* Card Header */}
          <div className="perm-card-hdr">
            <div className="perm-card-title">
              Module Permissions
              {permissions.length > 0 && (
                <span className="perm-badge">{permissions.length} modules</span>
              )}
            </div>

            <div className="perm-controls">
              <button
                className="perm-add-btn"
                onClick={() => navigate("/add-permission")}
              >
                + Add Permission
              </button>

              <span className="perm-sel-label">Role</span>

              <div className="perm-sel-wrap">
                <select
                  className="perm-select"
                  value={selectedRoleId}
                  onChange={(e) => setSelectedRoleId(Number(e.target.value))}
                >
                  <option value="">Select a role…</option>
                  {roles.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.role_name}
                    </option>
                  ))}
                </select>

                <span className="perm-sel-arrow">
                  <ChevronDownIcon />
                </span>
              </div>
            </div>
          </div>

          {/* No role selected */}
          {!selectedRoleId && !loading && (
            <div className="perm-empty">
              <div className="perm-empty-icon purple">
                <ShieldIcon />
              </div>
              <div className="perm-empty-title">No role selected</div>
              <div className="perm-empty-sub">
                Choose a role from the dropdown above to view and manage its
                module permissions.
              </div>
            </div>
          )}

          {/* Loading skeleton */}
          {loading && <SkeletonRows />}

          {/* No permissions */}
          {!loading && selectedRoleId && permissions.length === 0 && (
            <div className="perm-empty">
              <div className="perm-empty-icon amber">
                <AlertCircleIcon />
              </div>
              <div className="perm-empty-title">No modules assigned</div>
              <div className="perm-empty-sub">
                This role has no module permissions configured yet.
              </div>
            </div>
          )}

          {/* Table */}
          {!loading && permissions.length > 0 && (
            <>
              <div className="perm-tbl-wrap">
                <table className="perm-tbl">
                  <thead>
                    <tr>
                      <th>Module</th>
                      <th className="c">
                        <ColPill label="Read" cls="perm-col-read" />
                      </th>
                      <th className="c">
                        <ColPill label="Create" cls="perm-col-create" />
                      </th>
                      <th className="c">
                        <ColPill label="Update" cls="perm-col-update" />
                      </th>
                      <th className="c">
                        <ColPill label="Delete" cls="perm-col-delete" />
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {permissions.map((perm, i) => (
                      <tr
                        key={perm.id}
                        style={{ animationDelay: `${i * 0.04}s` }}
                      >
                        <td>
                          <div className="perm-mod-cell">
                            <div className="perm-mod-avatar">
                              {modInitial(perm.module_id)}
                            </div>
                            <div>
                              <div className="perm-mod-name">
                                {modName(perm.module_id)}
                              </div>
                              <div className="perm-mod-id">
                                ID: #{perm.module_id}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <Toggle
                            value={perm.can_read}
                            onChange={() => handleToggle(perm.id, "can_read")}
                          />
                        </td>
                        <td>
                          <Toggle
                            value={perm.can_create}
                            onChange={() => handleToggle(perm.id, "can_create")}
                          />
                        </td>
                        <td>
                          <Toggle
                            value={perm.can_update}
                            onChange={() => handleToggle(perm.id, "can_update")}
                          />
                        </td>
                        <td>
                          <Toggle
                            value={perm.can_delete}
                            onChange={() => handleToggle(perm.id, "can_delete")}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Footer */}
              <div className="perm-footer">
                <div className="perm-stat">
                  <span className="perm-stat-dot on" />
                  {enabledCount} enabled
                </div>
                <div className="perm-stat">
                  <span className="perm-stat-dot off" />
                  {totalSlots - enabledCount} disabled
                </div>

                <div className="perm-footer-right">
                  Showing {permissions.length} of {permissions.length} modules
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Toast stack */}
      <div className="perm-toasts">
        {toasts.map((t) => (
          <Toast key={t.id} msg={t.msg} type={t.type} />
        ))}
      </div>
    </>
  );
}
