import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE = "https://hire-me-jobs.onrender.com/departments";
const FILES_BASE = "https://hire-me-jobs.onrender.com/uploads";

// FIXED: Handle both full paths (/uploads/...) and filenames
const getImageUrl = (icon) => {
  if (!icon) return null;
  if (/^https?:\/\//i.test(icon)) return icon;
  // If icon already starts with /uploads/, use it as-is
  if (icon.startsWith('/uploads/')) {
    return `https://hire-me-jobs.onrender.com${icon}`;
  }
  // Otherwise, assume it's just a filename
  return `${FILES_BASE}/${icon}`;
};

/* Small inline icon image with graceful fallback if the file fails to load */
function DeptIcon({ icon, name }) {
  const [errored, setErrored] = useState(false);
  const src = getImageUrl(icon);

  if (!src || errored) {
    return (
      <div className="w-9 h-9 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-400">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={name}
      onError={() => setErrored(true)}
      className="w-9 h-9 rounded-lg object-cover border border-gray-200 bg-gray-50"
    />
  );
}

export default function Department() {
  const navigate = useNavigate();
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState({ open: false, id: null });
  const [deleting, setDeleting] = useState(false);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("all"); // all | active | inactive
  const [viewModal, setViewModal] = useState({ open: false, data: null });

  const fetchDepartments = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_BASE);
      const data = await res.json();
      setDepartments(data.data || []);
    } catch (err) {
      console.error("Failed to fetch departments:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await fetch(`${API_BASE}/${deleteModal.id}`, { method: "DELETE" });
      setDeleteModal({ open: false, id: null });
      fetchDepartments();
    } catch (err) {
      console.error("Delete failed:", err);
    } finally {
      setDeleting(false);
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    setDepartments((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status: !currentStatus } : d))
    );
    try {
      await fetch(`${API_BASE}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: !currentStatus }),
      });
    } catch (err) {
      console.error("Status toggle failed:", err);
      setDepartments((prev) =>
        prev.map((d) => (d.id === id ? { ...d, status: currentStatus } : d))
      );
    }
  };

  const handleToggleTrending = async (id, currentTrending) => {
    setDepartments((prev) =>
      prev.map((d) => (d.id === id ? { ...d, is_trending: !currentTrending } : d))
    );
    try {
      await fetch(`${API_BASE}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_trending: !currentTrending }),
      });
    } catch (err) {
      console.error("Trending toggle failed:", err);
      setDepartments((prev) =>
        prev.map((d) => (d.id === id ? { ...d, is_trending: currentTrending } : d))
      );
    }
  };

  const counts = useMemo(
    () => ({
      all: departments.length,
      active: departments.filter((d) => d.status).length,
      inactive: departments.filter((d) => !d.status).length,
    }),
    [departments]
  );

  const filtered = useMemo(() => {
    let list = departments;
    if (activeTab === "active") list = list.filter((d) => d.status);
    if (activeTab === "inactive") list = list.filter((d) => !d.status);
    if (search.trim()) {
      list = list.filter((d) =>
        d.department_name?.toLowerCase().includes(search.toLowerCase())
      );
    }
    return list;
  }, [departments, activeTab, search]);

  const tabs = [
    { key: "all", label: "All" },
    { key: "active", label: "Active" },
    { key: "inactive", label: "Inactive" },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Page Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-800">Departments</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Manage all department listings
            </p>
          </div>
          <button
            onClick={() => navigate("/department/add")}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4v16m8-8H4"
              />
            </svg>
            Add Department
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          {/* Table Toolbar */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 gap-4 flex-wrap">
            <div className="flex items-center gap-3 flex-wrap">
              {/* Search */}
              <div className="relative">
                <svg
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
                  />
                </svg>
                <input
                  type="text"
                  placeholder="Search departments..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent w-64"
                />
              </div>

              {/* Tabs - right side of search input */}
              <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg">
                {tabs.map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                      activeTab === tab.key
                        ? "bg-white text-indigo-600 shadow-sm"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {tab.label}
                    <span
                      className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full ${
                        activeTab === tab.key
                          ? "bg-indigo-50 text-indigo-600"
                          : "bg-gray-200 text-gray-500"
                      }`}
                    >
                      {counts[tab.key]}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <span className="text-sm text-gray-500">
              {filtered.length} record{filtered.length !== 1 ? "s" : ""}
            </span>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-5 py-3 font-medium text-gray-500 uppercase tracking-wide text-xs">
                    #
                  </th>
                  <th className="text-left px-5 py-3 font-medium text-gray-500 uppercase tracking-wide text-xs">
                    Icon
                  </th>
                  <th className="text-left px-5 py-3 font-medium text-gray-500 uppercase tracking-wide text-xs">
                    Department Name
                  </th>
                  <th className="text-left px-5 py-3 font-medium text-gray-500 uppercase tracking-wide text-xs">
                    Trending
                  </th>
                  <th className="text-left px-5 py-3 font-medium text-gray-500 uppercase tracking-wide text-xs">
                    Status
                  </th>
                  <th className="text-left px-5 py-3 font-medium text-gray-500 uppercase tracking-wide text-xs">
                    Created At
                  </th>
                  <th className="text-right px-5 py-3 font-medium text-gray-500 uppercase tracking-wide text-xs">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="text-center py-16">
                      <div className="flex flex-col items-center gap-3">
                        <svg
                          className="animate-spin w-6 h-6 text-indigo-500"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v8z"
                          />
                        </svg>
                        <span className="text-gray-400 text-sm">
                          Loading departments...
                        </span>
                      </div>
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-16">
                      <div className="flex flex-col items-center gap-2">
                        <svg
                          className="w-10 h-10 text-gray-300"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={1.5}
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M20 13V7a2 2 0 00-2-2H6a2 2 0 00-2 2v6m16 0v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4m16 0H4"
                          />
                        </svg>
                        <p className="text-gray-400 text-sm">
                          No departments found
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filtered.map((dept, index) => (
                    <tr
                      key={dept.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-5 py-3.5 text-gray-500">
                        {index + 1}
                      </td>
                      <td className="px-5 py-3.5">
                        <DeptIcon icon={dept.icon} name={dept.department_name} />
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="font-medium text-gray-800">
                          {dept.department_name}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <button
                          onClick={() =>
                            handleToggleTrending(dept.id, dept.is_trending)
                          }
                          className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none ${
                            dept.is_trending ? "bg-amber-500" : "bg-gray-200"
                          }`}
                          title={dept.is_trending ? "Trending" : "Not trending"}
                        >
                          <span
                            className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${
                              dept.is_trending ? "translate-x-4" : "translate-x-1"
                            }`}
                          />
                        </button>
                      </td>
                      <td className="px-5 py-3.5">
                        <button
                          onClick={() =>
                            handleToggleStatus(dept.id, dept.status)
                          }
                          className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none ${
                            dept.status ? "bg-indigo-600" : "bg-gray-200"
                          }`}
                          title={dept.status ? "Active" : "Inactive"}
                        >
                          <span
                            className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${
                              dept.status ? "translate-x-4" : "translate-x-1"
                            }`}
                          />
                        </button>
                      </td>
                      <td className="px-5 py-3.5 text-gray-500">
                        {dept.created_at
                          ? new Date(dept.created_at).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })
                          : "—"}
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => setViewModal({ open: true, data: dept })}
                            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="View"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth={2}
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                            </svg>
                          </button>
                          <button
                            onClick={() =>
                              navigate(`/department/edit/${dept.id}`)
                            }
                            className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth={2}
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                              />
                            </svg>
                          </button>
                          <button
                            onClick={() =>
                              setDeleteModal({ open: true, id: dept.id })
                            }
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth={2}
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          {!loading && filtered.length > 0 && (
            <div className="px-5 py-3 border-t border-gray-100 text-xs text-gray-400">
              Showing {filtered.length} of {departments.length} department
              {departments.length !== 1 ? "s" : ""}
            </div>
          )}
        </div>
      </div>

      {/* View Modal */}
      {viewModal.open && viewModal.data && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
          onClick={() => setViewModal({ open: false, data: null })}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-gray-800">
                Department Details
              </h3>
              <button
                onClick={() => setViewModal({ open: false, data: null })}
                className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex flex-col items-center text-center">
              <DeptIcon icon={viewModal.data.icon} name={viewModal.data.department_name} />
              <h4 className="mt-3 text-sm font-semibold text-gray-800">
                {viewModal.data.department_name}
              </h4>

              <div className="flex items-center gap-2 mt-3">
                <span
                  className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
                    viewModal.data.status
                      ? "bg-green-50 text-green-700"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      viewModal.data.status ? "bg-green-500" : "bg-gray-400"
                    }`}
                  />
                  {viewModal.data.status ? "Active" : "Inactive"}
                </span>

                {viewModal.data.is_trending && (
                  <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 text-xs font-medium px-2 py-1 rounded-full">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Trending
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 bg-gray-50 rounded-xl p-4 mt-5 text-sm">
              <div>
                <p className="text-xs text-gray-400">Department ID</p>
                <p className="font-medium text-gray-700">{viewModal.data.id}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Created At</p>
                <p className="font-medium text-gray-700">
                  {viewModal.data.created_at
                    ? new Date(viewModal.data.created_at).toLocaleDateString()
                    : "—"}
                </p>
              </div>
              <div className="col-span-2">
                <p className="text-xs text-gray-400">Updated At</p>
                <p className="font-medium text-gray-700">
                  {viewModal.data.updated_at
                    ? new Date(viewModal.data.updated_at).toLocaleDateString()
                    : "—"}
                </p>
              </div>
            </div>

            <button
              onClick={() => setViewModal({ open: false, data: null })}
              className="w-full mt-5 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModal.open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
            <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mx-auto mb-4">
              <svg
                className="w-6 h-6 text-red-600"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
                />
              </svg>
            </div>
            <h3 className="text-center text-base font-semibold text-gray-800 mb-1">
              Delete Department
            </h3>
            <p className="text-center text-sm text-gray-500 mb-6">
              Are you sure you want to delete this department? This action
              cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteModal({ open: false, id: null })}
                className="flex-1 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors disabled:opacity-60"
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}