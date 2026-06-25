import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BarChart2, Plus, RefreshCw, Eye, Pencil, Trash2, Search, X, AlertTriangle,
} from "lucide-react";

const BASE_URL = "https://hire-me-jobs.onrender.com/experience-levels";
const ITEMS_PER_PAGE = 5;

const fmt = (d) =>
  new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });

// ─── View Modal ───────────────────────────────────────────────────────────────
const ViewModal = ({ item, onClose, onEdit, onDelete }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
    <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md z-10">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <BarChart2 className="text-white" size={15} />
          </div>
          <h2 className="text-base font-semibold text-gray-900">Experience Level Details</h2>
        </div>
        <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 transition-colors">
          <X size={16} />
        </button>
      </div>
      {/* Body */}
      <div className="px-6 py-5 space-y-4">
        <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-xl">
          <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
            {item.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-lg font-bold text-gray-900">{item.name}</p>
            <p className="text-sm text-gray-500">ID: #{item.id}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs text-gray-400 uppercase font-medium mb-1">Min Experience</p>
            <p className="text-sm font-semibold text-gray-800">{item.min_year} yr{item.min_year !== 1 ? "s" : ""}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs text-gray-400 uppercase font-medium mb-1">Max Experience</p>
            <p className="text-sm font-semibold text-gray-800">{item.max_year} yr{item.max_year !== 1 ? "s" : ""}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs text-gray-400 uppercase font-medium mb-1">Status</p>
            <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${item.is_status ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${item.is_status ? "bg-green-500" : "bg-red-500"}`} />
              {item.is_status ? "Active" : "Inactive"}
            </span>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs text-gray-400 uppercase font-medium mb-1">Created At</p>
            <p className="text-sm font-medium text-gray-700">{fmt(item.created_at)}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3 col-span-2">
            <p className="text-xs text-gray-400 uppercase font-medium mb-1">Last Updated</p>
            <p className="text-sm font-medium text-gray-700">{fmt(item.updated_at)}</p>
          </div>
        </div>
      </div>
      {/* Footer */}
      <div className="flex items-center gap-2 px-6 py-4 border-t border-gray-100 bg-gray-50/50 rounded-b-2xl">
        <button onClick={onEdit} className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors">
          <Pencil size={14} /> Edit
        </button>
        <button onClick={onDelete} className="flex-1 flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors">
          <Trash2 size={14} /> Delete
        </button>
        <button onClick={onClose} className="flex-1 border border-gray-200 hover:bg-gray-100 text-gray-600 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors">
          Close
        </button>
      </div>
    </div>
  </div>
);

// ─── Delete Modal ─────────────────────────────────────────────────────────────
const DeleteModal = ({ item, onClose, onConfirm }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
    <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm z-10">
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <h2 className="text-base font-semibold text-gray-900">Confirm Delete</h2>
        <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 transition-colors">
          <X size={16} />
        </button>
      </div>
      <div className="px-6 py-6 flex flex-col items-center text-center gap-4">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
          <AlertTriangle className="text-red-500" size={28} />
        </div>
        <div>
          <p className="text-gray-800 font-semibold text-base mb-1">Delete "{item.name}"?</p>
          <p className="text-sm text-gray-500">This action cannot be undone. The experience level will be permanently removed from the platform.</p>
        </div>
      </div>
      <div className="flex gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50/50 rounded-b-2xl">
        <button onClick={onClose} className="flex-1 border border-gray-200 hover:bg-gray-100 text-gray-600 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors">
          Cancel
        </button>
        <button onClick={onConfirm} className="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors">
          Yes, Delete
        </button>
      </div>
    </div>
  </div>
);

// ─── Main List Page ───────────────────────────────────────────────────────────
const ExperienceLevels = () => {
  const navigate = useNavigate();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("All");
  const [page, setPage] = useState(1);
  const [viewItem, setViewItem] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(BASE_URL);
      if (!res.ok) throw new Error("Failed to fetch");
      const json = await res.json();
      setRecords(json.data || []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const filtered = records.filter((r) => {
    const matchSearch = r.name.toLowerCase().includes(search.toLowerCase());
    const matchTab =
      tab === "All" ? true : tab === "Active" ? r.is_status === true : r.is_status === false;
    return matchSearch && matchTab;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${BASE_URL}/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      setDeleteItem(null);
      loadData();
    } catch (e) {
      alert("Delete failed: " + e.message);
    }
  };

  const handleTabChange = (t) => { setTab(t); setPage(1); };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Breadcrumb */}
      <div className="mb-2 text-sm">
        <span className="text-gray-400">Dashboard / </span>
        <span className="text-gray-700 font-medium">Experience Levels</span>
      </div>

      {/* Page Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 bg-blue-600 rounded-lg flex items-center justify-center">
            <BarChart2 className="text-white" size={20} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Experience Levels</h1>
            <p className="text-sm text-gray-500">Manage all the experience levels used across the platform</p>
          </div>
        </div>
        <button
          onClick={() => navigate("/experience-levels/add")}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          <Plus size={16} /> Add Experience Level
        </button>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        {/* Card Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-800">Experience Level List</span>
            <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-0.5 rounded-full">
              {filtered.length}
            </span>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
              <input
                type="text"
                placeholder="Search experience level..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-56"
              />
            </div>
            {/* Tabs */}
            <div className="flex items-center bg-gray-100 rounded-lg p-1 gap-1">
              {["All", "Active", "Inactive"].map((t) => (
                <button
                  key={t}
                  onClick={() => handleTabChange(t)}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    tab === t ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
            {/* Refresh */}
            <button
              onClick={loadData}
              className="flex items-center gap-1.5 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
            >
              <RefreshCw size={14} /> Refresh
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider w-12">#</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Experience Level</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Min Years</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Max Years</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Created</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Last Updated</th>
                <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan={8} className="text-center py-16 text-gray-400">
                    <div className="flex flex-col items-center gap-2">
                      <RefreshCw className="animate-spin" size={20} />
                      <span>Loading...</span>
                    </div>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={8} className="text-center py-16 text-red-500">{error}</td>
                </tr>
              ) : paginated.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-16 text-gray-400">No records found</td>
                </tr>
              ) : (
                paginated.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="text-gray-500 bg-gray-100 px-2 py-1 rounded text-xs font-medium">
                        {(page - 1) * ITEMS_PER_PAGE + idx + 1}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                          {item.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{item.name}</div>
                          <div className="text-xs text-gray-400">ID: #{item.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{item.min_year} yr{item.min_year !== 1 ? "s" : ""}</td>
                    <td className="px-6 py-4 text-gray-600">{item.max_year} yr{item.max_year !== 1 ? "s" : ""}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                        item.is_status ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${item.is_status ? "bg-green-500" : "bg-red-500"}`} />
                        {item.is_status ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500">{fmt(item.created_at)}</td>
                    <td className="px-6 py-4 text-gray-500">{fmt(item.updated_at)}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setViewItem(item)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                          title="View"
                        >
                          <Eye size={15} />
                        </button>
                        <button
                          onClick={() => navigate(`/experience-levels/edit/${item.id}`)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition-colors"
                          title="Edit"
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          onClick={() => setDeleteItem(item)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!loading && !error && filtered.length > 0 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
            <p className="text-sm text-gray-500">
              Showing{" "}
              <span className="font-medium text-gray-700">{(page - 1) * ITEMS_PER_PAGE + 1}</span> to{" "}
              <span className="font-medium text-gray-700">{Math.min(page * ITEMS_PER_PAGE, filtered.length)}</span> of{" "}
              <span className="font-medium text-gray-700">{filtered.length}</span> results
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                    page === p ? "bg-blue-600 text-white" : "border border-gray-200 text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {viewItem && (
        <ViewModal
          item={viewItem}
          onClose={() => setViewItem(null)}
          onEdit={() => { setViewItem(null); navigate(`/experience-levels/edit/${viewItem.id}`); }}
          onDelete={() => { setViewItem(null); setDeleteItem(viewItem); }}
        />
      )}
      {deleteItem && (
        <DeleteModal
          item={deleteItem}
          onClose={() => setDeleteItem(null)}
          onConfirm={() => handleDelete(deleteItem.id)}
        />
      )}
    </div>
  );
};

export default ExperienceLevels;
