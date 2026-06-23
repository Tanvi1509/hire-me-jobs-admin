import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = "https://hire-me-jobs.onrender.com/role";

/* ================================================================
   ICONS
================================================================ */
const Icon = {
  Search: () => (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  ),
  Plus: () => (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
    >
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  ),
  Eye: () => (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
  Edit: () => (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  ),
  Trash: () => (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="  none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
      <path d="M9 6V4h6v2" />
    </svg>
  ),
  Close: () => (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
  Bell: () => (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  ),
  ChevronDown: () => (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  ),
  Shield: () => (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
  Refresh: () => (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="23 4 23 10 17 10" />
      <polyline points="1 20 1 14 7 14" />
      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
    </svg>
  ),
  CheckCircle: () => (
    <svg
      width="17"
      height="17"
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
  ),
  AlertTriangle: () => (
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
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  ),
  XCircle: () => (
    <svg
      width="15"
      height="15"
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
  ),
  Users: () => (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
};

/* ================================================================
   HELPERS
================================================================ */
function formatDate(iso) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getInitialColor(name) {
  const colors = [
    "from-blue-500 to-blue-700",
    "from-violet-500 to-violet-700",
    "from-emerald-500 to-emerald-700",
    "from-rose-500 to-rose-700",
    "from-amber-500 to-amber-700",
    "from-cyan-500 to-cyan-700",
    "from-pink-500 to-pink-700",
    "from-indigo-500 to-indigo-700",
  ];
  const idx = name.charCodeAt(0) % colors.length;
  return colors[idx];
}

/* ================================================================
   TOAST
================================================================ */
function Toast({ message, type, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div
      className={`fixed bottom-6 right-6 z-[300] flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl border text-[13px] font-semibold max-w-sm
        ${
          type === "success"
            ? "bg-white border-emerald-200 text-emerald-800 shadow-emerald-100/60"
            : "bg-white border-red-200 text-red-700 shadow-red-100/60"
        }`}
    >
      <span
        className={`flex-shrink-0 ${type === "success" ? "text-emerald-500" : "text-red-500"}`}
      >
        {type === "success" ? <Icon.CheckCircle /> : <Icon.XCircle />}
      </span>
      <span className="flex-1">{message}</span>
      <button
        onClick={onClose}
        className="text-gray-400 hover:text-gray-600 transition-colors ml-1"
      >
        <Icon.Close />
      </button>
    </div>
  );
}

/* ================================================================
   TOPBAR  (shared)
================================================================ */

/* ================================================================
   MODAL — View
================================================================ */
function ViewModal({ role, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-[420px] shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="text-[15px] font-bold text-gray-900">Role Details</h3>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-all"
          >
            <Icon.Close />
          </button>
        </div>
        {/* Avatar Hero */}
        <div className="bg-gradient-to-br from-slate-50 to-blue-50 px-6 py-5 flex items-center gap-4 border-b border-gray-100">
          <div
            className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${getInitialColor(role.role_name)} text-white text-xl font-bold flex items-center justify-center shadow-lg flex-shrink-0`}
          >
            {role.role_name.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-[16px] font-bold text-gray-900">
              {role.role_name}
            </p>
            <span
              className={`inline-flex items-center gap-1.5 mt-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold
              ${role.status === "active" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${role.status === "active" ? "bg-emerald-500" : "bg-amber-500"}`}
              />
              {role.status.charAt(0).toUpperCase() + role.status.slice(1)}
            </span>
          </div>
        </div>
        {/* Fields */}
        <div className="px-6 py-2 divide-y divide-gray-50">
          {[
            { label: "Role ID", value: `#${role.id}` },
            { label: "Created At", value: formatDate(role.createdAt) },
            { label: "Last Updated", value: formatDate(role.updatedAt) },
          ].map(({ label, value }) => (
            <div
              key={label}
              className="flex items-center justify-between py-3.5"
            >
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                {label}
              </span>
              <span className="text-[13px] font-semibold text-gray-700">
                {value}
              </span>
            </div>
          ))}
        </div>
        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-[13px] font-semibold text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-100 transition-all shadow-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

/* ================================================================
   MODAL — Edit
================================================================ */
function EditModal({ role, onClose, onSaved }) {
  const [roleName, setRoleName] = useState(role.role_name);
  const [status, setStatus] = useState(role.status);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSave() {
    if (!roleName.trim()) {
      setError("Role name is required.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_URL}/${role.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role_name: roleName.trim(), status }),
      });
      if (!res.ok) throw new Error();
      onSaved("Role updated successfully!");
    } catch {
      setError("Failed to update. Please try again.");
    } finally {
      setLoading(false);
    }
  }
}

/* ================================================================
   MODAL — Delete
================================================================ */
function DeleteModal({ role, onClose, onDeleted }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleDelete() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_URL}/${role.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      onDeleted("Role deleted successfully!");
    } catch {
      setError("Failed to delete. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-[400px] shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="text-[15px] font-bold text-gray-900">Delete Role</h3>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-all"
          >
            <Icon.Close />
          </button>
        </div>
        <div className="px-6 py-6 flex flex-col items-center text-center gap-3">
          <div className="w-14 h-14 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center text-red-500">
            <Icon.AlertTriangle />
          </div>
          <div>
            <p className="text-[14px] font-bold text-gray-800">
              Delete &ldquo;{role.role_name}&rdquo;?
            </p>
            <p className="text-[12.5px] text-gray-500 mt-1.5 leading-relaxed">
              This action is permanent and cannot be undone. All users assigned
              this role may be affected.
            </p>
          </div>
          {error && (
            <p className="text-[12px] font-medium text-red-500 bg-red-50 border border-red-200 rounded-lg px-4 py-2 w-full text-left">
              {error}
            </p>
          )}
        </div>
        <div className="flex gap-2.5 px-6 py-4 bg-gray-50 border-t border-gray-100">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 py-2.5 text-[13px] font-semibold text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all shadow-sm disabled:opacity-50"
          >
            Keep Role
          </button>
          <button
            onClick={handleDelete}
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 text-[13px] font-semibold text-white bg-red-500 rounded-xl hover:bg-red-600 active:scale-95 transition-all disabled:opacity-60"
          >
            {loading ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Deleting…
              </>
            ) : (
              <>
                <Icon.Trash />
                Delete
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ================================================================
   MAIN — Role.jsx
================================================================ */
export default function Role() {
  const navigate = useNavigate();

  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [modal, setModal] = useState(null); // { type, role }
  const [toast, setToast] = useState(null);

  /* ── Fetch ── */
  async function fetchRoles() {
    setLoading(true);
    setFetchError("");
    try {
      const res = await fetch(API_URL);
      const json = await res.json();
      setRoles(json.data || []);
    } catch {
      setFetchError(
        "Unable to load roles. Check your connection and try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchRoles();
  }, []);

  /* ── Filtered list ── */
  const filtered = roles.filter((r) => {
    const matchSearch = r.role_name
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || r.status === statusFilter;
    return matchSearch && matchStatus;
  });

  function closeModal() {
    setModal(null);
  }
  function afterAction(msg) {
    closeModal();
    fetchRoles();
    setToast({ message: msg, type: "success" });
  }

  const activeCount = roles.filter((r) => r.status === "active").length;
  const inactiveCount = roles.filter((r) => r.status !== "active").length;

  /* ── Stat cards config ── */
  // const STATS = [
  //   {
  //     label: "Total Roles",
  //     value: roles.length,
  //     icon: <Icon.Shield />,
  //     iconBg: "bg-blue-100",
  //     iconColor: "text-blue-600",
  //     valueCls: "text-blue-600",
  //     border: "border-blue-100",
  //   },
  //   {
  //     label: "Active",
  //     value: activeCount,
  //     icon: <Icon.CheckCircle />,
  //     iconBg: "bg-emerald-100",
  //     iconColor: "text-emerald-600",
  //     valueCls: "text-emerald-600",
  //     border: "border-emerald-100",
  //   },
  //   {
  //     label: "Inactive",
  //     value: inactiveCount,
  //     icon: <Icon.Users />,
  //     iconBg: "bg-amber-100",
  //     iconColor: "text-amber-600",
  //     valueCls: "text-amber-600",
  //     border: "border-amber-100",
  //   },
  // ];

  /* ── Table header config ── */
  const TH = ["#", "Role", "Status", "Created", "Last Updated", "Actions"];

  return (
    <div className="flex flex-col min-h-screen bg-[#F4F6FB] font-sans">
      {/* ── Main ── */}
      <main className="flex-1 px-7 py-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-[12px] font-medium text-gray-400 mb-5">
          <span>Dashboard</span>
          <span className="text-gray-300">/</span>
          <span className="text-gray-700 font-semibold">Roles</span>
        </nav>

        {/* Page Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-200">
              <Icon.Shield />
            </div>
            <div>
              <h1 className="text-[20px] font-bold text-gray-900 leading-tight">
                Roles
              </h1>
              <p className="text-[12.5px] text-gray-400 font-medium mt-0.5">
                Manage system roles and access permissions
              </p>
            </div>
          </div>

          {/* ★ ADD ROLE — navigates to /add-role ★ */}
          <button
            onClick={() => navigate("/add-role")}
            className="flex items-center gap-2 px-5 py-2.5 text-[13px] font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 active:scale-95 transition-all shadow-md shadow-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
          >
            <Icon.Plus />
            Add Role
          </button>
        </div>

        {/* Stat Cards */}
        {/* <div className="grid grid-cols-3 gap-4 mb-6">
          {STATS.map(s => (
            <div key={s.label} className={`bg-white rounded-2xl border ${s.border} shadow-sm px-5 py-4 flex items-center gap-4 hover:shadow-md transition-shadow`}>
              <div className={`w-11 h-11 rounded-xl ${s.iconBg} ${s.iconColor} flex items-center justify-center flex-shrink-0`}>
                {s.icon}
              </div>
              <div>
                <p className={`text-2xl font-bold ${s.valueCls} leading-none`}>{s.value}</p>
                <p className="text-[12px] text-gray-400 font-semibold mt-1">{s.label}</p>
              </div>
            </div>
          ))}
        </div> */}

        {/* Table Card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {/* Toolbar */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <p className="text-[14px] font-bold text-gray-800">Role List</p>
              <span className="px-2.5 py-0.5 text-[11px] font-bold text-blue-700 bg-blue-50 border border-blue-100 rounded-full">
                {filtered.length}
              </span>
            </div>

            <div className="flex items-center gap-2.5">
              {/* Filter pills */}
              <div className="flex items-center bg-gray-100 rounded-xl p-1 gap-0.5">
                {["all", "active", "inactive"].map((f) => (
                  <button
                    key={f}
                    onClick={() => setStatusFilter(f)}
                    className={`px-3.5 py-1.5 text-[12px] font-semibold rounded-lg transition-all capitalize
                      ${statusFilter === f ? "bg-white text-gray-800 shadow-sm" : "text-gray-400 hover:text-gray-700"}`}
                  >
                    {f === "all"
                      ? "All"
                      : f.charAt(0).toUpperCase() + f.slice(1)}
                  </button>
                ))}
              </div>

              {/* Refresh */}
              <button
                onClick={fetchRoles}
                className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-semibold text-gray-500 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all shadow-sm"
              >
                <Icon.Refresh /> Refresh
              </button>
            </div>
          </div>

          {/* ── Loading ── */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <div className="w-10 h-10 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin" />
              <p className="text-[13px] text-gray-400 font-medium">
                Loading roles…
              </p>
            </div>
          )}

          {/* ── Fetch Error ── */}
          {!loading && fetchError && (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <div className="w-16 h-16 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center text-red-400">
                <Icon.AlertTriangle />
              </div>
              <div className="text-center">
                <p className="text-[13px] font-semibold text-gray-700">
                  {fetchError}
                </p>
                <p className="text-[12px] text-gray-400 mt-1">
                  Check your connection and try again.
                </p>
              </div>
              <button
                onClick={fetchRoles}
                className="flex items-center gap-2 px-5 py-2 text-[13px] font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-all"
              >
                <Icon.Refresh /> Try Again
              </button>
            </div>
          )}

          {/* ── Empty ── */}
          {!loading && !fetchError && filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-300">
                <Icon.Shield />
              </div>
              <div className="text-center">
                <p className="text-[13px] font-semibold text-gray-600">
                  {search || statusFilter !== "all"
                    ? "No matching roles found"
                    : "No roles created yet"}
                </p>
                <p className="text-[12px] text-gray-400 mt-1">
                  {search || statusFilter !== "all"
                    ? "Try adjusting your search or filter."
                    : "Click 'Add Role' to get started."}
                </p>
              </div>
              {!search && statusFilter === "all" && (
                <button
                  onClick={() => navigate("/add-role")}
                  className="flex items-center gap-2 px-5 py-2 text-[13px] font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-all"
                >
                  <Icon.Plus /> Add Role
                </button>
              )}
            </div>
          )}

          {/* ── Table ── */}
          {!loading && !fetchError && filtered.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    {TH.map((h) => (
                      <th
                        key={h}
                        className={`px-5 py-3.5 text-[11px] font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap
                          ${h === "#" ? "w-14 text-center" : h === "Actions" ? "text-center" : "text-left"}`}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((role, idx) => (
                    <tr
                      key={role.id}
                      className="border-b border-gray-50 last:border-0 hover:bg-blue-50/30 transition-colors"
                    >
                      {/* # */}
                      <td className="px-5 py-4 text-center">
                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-gray-100 text-[12px] font-bold text-gray-500">
                          {idx + 1}
                        </span>
                      </td>

                      {/* Role Name */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-9 h-9 rounded-xl bg-gradient-to-br ${getInitialColor(role.role_name)} text-white text-[13px] font-bold flex items-center justify-center flex-shrink-0 shadow-sm`}
                          >
                            {role.role_name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-[13px] font-bold text-gray-800 leading-tight">
                              {role.role_name}
                            </p>
                            <p className="text-[11px] text-gray-400 mt-0.5">
                              ID: #{role.id}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-semibold border
                          ${
                            role.status === "active"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : "bg-amber-50 text-amber-700 border-amber-200"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full flex-shrink-0
                            ${role.status === "active" ? "bg-emerald-500" : "bg-amber-500"}`}
                          />
                          {role.status.charAt(0).toUpperCase() +
                            role.status.slice(1)}
                        </span>
                      </td>

                      {/* Created */}
                      <td className="px-5 py-4">
                        <span className="text-[13px] text-gray-500 font-medium">
                          {formatDate(role.createdAt)}
                        </span>
                      </td>

                      {/* Updated */}
                      <td className="px-5 py-4">
                        <span className="text-[13px] text-gray-500 font-medium">
                          {formatDate(role.updatedAt)}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => setModal({ type: "view", role })}
                            title="View"
                            className="w-8 h-8 flex items-center justify-center rounded-lg bg-blue-50 text-blue-500 hover:bg-blue-100 hover:text-blue-700 border border-transparent hover:border-blue-200 transition-all"
                          >
                            <Icon.Eye />
                          </button>
                          <button
                            onClick={() => navigate(`/edit-role/${role.id}`)}
                            title="Edit"
                            className="w-8 h-8 flex items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 hover:text-emerald-800 border border-transparent hover:border-emerald-200 transition-all"
                          >
                            <Icon.Edit />
                          </button>
                          <button
                            onClick={() => setModal({ type: "delete", role })}
                            title="Delete"
                            className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-50 text-red-500 hover:bg-red-100 hover:text-red-700 border border-transparent hover:border-red-200 transition-all"
                          >
                            <Icon.Trash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Table Footer */}
              <div className="flex items-center justify-between px-6 py-3.5 bg-gray-50/70 border-t border-gray-100">
                <p className="text-[12px] text-gray-400 font-medium">
                  Showing{" "}
                  <span className="text-gray-700 font-bold">
                    {filtered.length}
                  </span>{" "}
                  of{" "}
                  <span className="text-gray-700 font-bold">
                    {roles.length}
                  </span>{" "}
                  roles
                </p>
                <p className="text-[11px] text-gray-400 font-medium">
                  Last refreshed:{" "}
                  {new Date().toLocaleTimeString("en-IN", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* ── Modals ── */}
      {modal?.type === "view" && (
        <ViewModal role={modal.role} onClose={closeModal} />
      )}
      {modal?.type === "edit" && (
        <EditModal
          role={modal.role}
          onClose={closeModal}
          onSaved={afterAction}
        />
      )}
      {modal?.type === "delete" && (
        <DeleteModal
          role={modal.role}
          onClose={closeModal}
          onDeleted={afterAction}
        />
      )}

      {/* ── Toast ── */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
