import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = "https://hire-me-jobs.onrender.com/language";
const PAGE_SIZE = 5;

// Avatar background colors, cycled per row (matches the varied colored
// initials seen on the Roles page: orange, pink, green, etc.)
const AVATAR_COLORS = [
  "bg-orange-500",
  "bg-pink-600",
  "bg-emerald-600",
  "bg-indigo-600",
  "bg-sky-600",
  "bg-purple-600",
];

const formatDate = (value) => {
  if (!value) return "-";
  return new Date(value).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const Languages = () => {
  const navigate = useNavigate();

  const [languages, setLanguages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("all"); // all | active | inactive
  const [viewItem, setViewItem] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchLanguages = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await fetch(API_URL);
      const data = await res.json();
      if (data?.success) {
        setLanguages(data.data || []);
      } else {
        setError(data?.message || "Failed to fetch languages");
      }
    } catch (err) {
      setError("Something went wrong while fetching languages");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLanguages();
  }, []);

  const handleDelete = async (id) => {
    try {
      setDeleting(true);
      const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setLanguages((prev) => prev.filter((item) => item.id !== id));
        setDeleteId(null);
      } else {
        alert(data?.message || "Failed to delete language");
      }
    } catch (err) {
      alert("Something went wrong while deleting language");
    } finally {
      setDeleting(false);
    }
  };

  const filteredLanguages = useMemo(() => {
    return languages
      .filter((item) => {
        if (activeTab === "active") return item.status === true;
        if (activeTab === "inactive") return item.status === false;
        return true;
      })
      .filter((item) =>
        (item.language_name || "").toLowerCase().includes(search.toLowerCase())
      );
  }, [languages, activeTab, search]);

  // Reset to page 1 whenever the filtered result set changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search, activeTab]);

  const totalPages = Math.max(1, Math.ceil(filteredLanguages.length / PAGE_SIZE));
  const paginatedLanguages = filteredLanguages.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const tabs = [
    { key: "all", label: "All" },
    { key: "active", label: "Active" },
    { key: "inactive", label: "Inactive" },
  ];

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Breadcrumb */}
      <p className="text-sm text-gray-400 mb-4">
        Dashboard <span className="mx-1">/</span>
        <span className="text-gray-700 font-medium">Languages</span>
      </p>

      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" viewBox="0 0 20 20" fill="currentColor">
              <path d="M7 2a1 1 0 011 1v1h3a1 1 0 110 2H9.578a8.987 8.987 0 01-1.144 3.59c.354.354.74.689 1.156.997a1 1 0 11-1.2 1.6 9.025 9.025 0 01-1.156-1.06c-.92 1.03-2.005 1.866-3.176 2.46a1 1 0 11-.92-1.78c1.067-.546 1.987-1.305 2.704-2.207A8.97 8.97 0 014.5 7H5a1 1 0 010-2h1V3a1 1 0 011-1z" />
              <path d="M11.4 13.6a1 1 0 011.2-1.6 9.072 9.072 0 011.342 1.243 9.013 9.013 0 011.282-3.243 1 1 0 111.752.96A7.012 7.012 0 0115.7 14.1c.27.354.51.733.715 1.133a1 1 0 11-1.79.894 5.5 5.5 0 00-.394-.661 9.04 9.04 0 01-1.624 1.412 1 1 0 11-1.12-1.654A7.05 7.05 0 0013 14.106a7.07 7.07 0 00-1.6-.506z" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Languages</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Manage all the languages used across the platform
            </p>
          </div>
        </div>
        <button
          onClick={() => navigate("/languages/add")}
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2.5 rounded-lg shadow-sm transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Add Language
        </button>
      </div>

      {/* Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4">
          {/* Title + count */}
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-gray-900">Language List</h2>
            <span className="inline-flex items-center justify-center min-w-[1.6rem] h-6 px-2 rounded-full bg-blue-50 text-blue-600 text-xs font-semibold">
              {filteredLanguages.length}
            </span>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {/* Search */}
            <div className="relative w-full sm:w-56">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
                  clipRule="evenodd"
                />
              </svg>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search language..."
                className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Tabs: All / Active / Inactive */}
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
                    activeTab === tab.key
                      ? "bg-white text-gray-900 font-semibold shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Refresh */}
            <button
              onClick={fetchLanguages}
              className="inline-flex items-center gap-2 border border-gray-200 text-gray-600 text-sm font-medium px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M15.312 11.424a5.5 5.5 0 01-9.201 2.466l-.312-.311h2.433a.75.75 0 000-1.5H3.989a.75.75 0 00-.75.75v4.242a.75.75 0 001.5 0v-2.43l.31.31a7 7 0 0011.712-3.138.75.75 0 00-1.449-.39zm1.23-3.723a.75.75 0 00.219-.53V2.929a.75.75 0 00-1.5 0V5.36l-.31-.31A7 7 0 003.239 8.188a.75.75 0 101.448.389A5.5 5.5 0 0113.89 6.11l.311.31h-2.432a.75.75 0 000 1.5h4.243a.75.75 0 00.53-.219z"
                  clipRule="evenodd"
                />
              </svg>
              Refresh
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left bg-gray-50/80 border-y border-gray-100">
                <th className="px-5 py-3 font-semibold text-gray-400 text-xs uppercase tracking-wide">#</th>
                <th className="px-5 py-3 font-semibold text-gray-400 text-xs uppercase tracking-wide">Language</th>
                <th className="px-5 py-3 font-semibold text-gray-400 text-xs uppercase tracking-wide">Status</th>
                <th className="px-5 py-3 font-semibold text-gray-400 text-xs uppercase tracking-wide">Created</th>
                <th className="px-5 py-3 font-semibold text-gray-400 text-xs uppercase tracking-wide">Last Updated</th>
                <th className="px-5 py-3 font-semibold text-gray-400 text-xs uppercase tracking-wide text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-5 py-10 text-center text-gray-400">
                    Loading languages...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="6" className="px-5 py-10 text-center text-red-500">
                    {error}
                  </td>
                </tr>
              ) : filteredLanguages.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-5 py-10 text-center text-gray-400">
                    No languages found
                  </td>
                </tr>
              ) : (
                paginatedLanguages.map((item, index) => (
                  <tr
                    key={item.id}
                    className="border-b border-gray-50 hover:bg-gray-50/60 transition-colors"
                  >
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center justify-center w-7 h-7 rounded-md bg-gray-100 text-gray-500 text-xs font-semibold">
                        {(currentPage - 1) * PAGE_SIZE + index + 1}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-lg flex items-center justify-center text-white text-sm font-semibold shrink-0 ${
                            AVATAR_COLORS[item.id % AVATAR_COLORS.length]
                          }`}
                        >
                          {(item.language_name || "?").charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-gray-900 font-semibold leading-tight">
                            {item.language_name}
                          </p>
                          <p className="text-xs text-gray-400 leading-tight">ID: #{item.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
                          item.status
                            ? "bg-green-50 text-green-600"
                            : "bg-amber-50 text-amber-600"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            item.status ? "bg-green-500" : "bg-amber-500"
                          }`}
                        />
                        {item.status ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-gray-500">{formatDate(item.created_at)}</td>
                    <td className="px-5 py-4 text-gray-500">{formatDate(item.updated_at)}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2">
                        {/* View */}
                        <button
                          onClick={() => setViewItem(item)}
                          title="View"
                          className="w-8 h-8 inline-flex items-center justify-center rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                            <path
                              fillRule="evenodd"
                              d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                        {/* Edit */}
                        <button
                          onClick={() => navigate(`/languages/edit/${item.id}`)}
                          title="Edit"
                          className="w-8 h-8 inline-flex items-center justify-center rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition-colors"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                            <path
                              fillRule="evenodd"
                              d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                        {/* Delete */}
                        <button
                          onClick={() => setDeleteId(item.id)}
                          title="Delete"
                          className="w-8 h-8 inline-flex items-center justify-center rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path
                              fillRule="evenodd"
                              d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 112 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 112 0v6a1 1 0 11-2 0V8z"
                              clipRule="evenodd"
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

        {/* Pagination */}
        {!loading && !error && filteredLanguages.length > 0 && (
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-5 py-4 border-t border-gray-100">
            <p className="text-xs text-gray-400">
              Showing{" "}
              <span className="font-medium text-gray-600">
                {(currentPage - 1) * PAGE_SIZE + 1}
              </span>{" "}
              to{" "}
              <span className="font-medium text-gray-600">
                {Math.min(currentPage * PAGE_SIZE, filteredLanguages.length)}
              </span>{" "}
              of <span className="font-medium text-gray-600">{filteredLanguages.length}</span> languages
            </p>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="w-8 h-8 inline-flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => goToPage(page)}
                  className={`w-8 h-8 inline-flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                    page === currentPage
                      ? "bg-blue-600 text-white"
                      : "border border-gray-200 text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="w-8 h-8 inline-flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* View Modal */}
      {viewItem && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 relative">
            <button
              onClick={() => setViewItem(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div
                className={`w-11 h-11 rounded-lg flex items-center justify-center text-white text-base font-semibold ${
                  AVATAR_COLORS[viewItem.id % AVATAR_COLORS.length]
                }`}
              >
                {(viewItem.language_name || "?").charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900 leading-tight">
                  {viewItem.language_name}
                </h2>
                <p className="text-xs text-gray-400">ID: #{viewItem.id}</p>
              </div>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Trending</span>
                <span className="text-gray-800 font-medium">
                  {viewItem.is_trending ? "Yes" : "No"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Status</span>
                <span
                  className={`font-medium ${
                    viewItem.status ? "text-green-600" : "text-amber-600"
                  }`}
                >
                  {viewItem.status ? "Active" : "Inactive"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Created</span>
                <span className="text-gray-800 font-medium">{formatDate(viewItem.created_at)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Last Updated</span>
                <span className="text-gray-800 font-medium">{formatDate(viewItem.updated_at)}</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 mt-6">
              <button
                onClick={() => {
                  setViewItem(null);
                  navigate(`/languages/edit/${viewItem.id}`);
                }}
                className="px-4 py-2 text-sm font-medium rounded-lg bg-green-50 text-green-600 hover:bg-green-100"
              >
                Edit
              </button>
              <button
                onClick={() => {
                  setDeleteId(viewItem.id);
                  setViewItem(null);
                }}
                className="px-4 py-2 text-sm font-medium rounded-lg bg-red-50 text-red-600 hover:bg-red-100"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-sm p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">Delete Language</h2>
            <p className="text-sm text-gray-500 mb-6">
              Are you sure you want to delete this language? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 text-sm font-medium rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteId)}
                disabled={deleting}
                className="px-4 py-2 text-sm font-medium rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Languages;