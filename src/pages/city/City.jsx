import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Search,
  RefreshCw,
  Eye,
  Pencil,
  Trash2,
  X,
  Building2,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  TrendingUp,
  CalendarDays,
  MapPin,
} from "lucide-react";

const API_URL = "https://hire-me-jobs.onrender.com/cities";

const AVATAR_COLORS = [
  "bg-blue-500",
  "bg-pink-500",
  "bg-emerald-500",
  "bg-orange-500",
  "bg-purple-500",
  "bg-cyan-500",
  "bg-rose-500",
  "bg-indigo-500",
];

const formatDate = (dateStr) => {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "-";
  return d.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export default function City() {
  const navigate = useNavigate();

  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // all | active | inactive
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const [viewCity, setViewCity] = useState(null);
  const [deleteCity, setDeleteCity] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast] = useState(null);

  const fetchCities = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error("Failed to fetch cities");
      const data = await res.json();
      const list = Array.isArray(data?.data)
        ? data.data
        : Array.isArray(data)
          ? data
          : [];
      setCities(list);
    } catch (err) {
      setError(err.message || "Something went wrong while fetching cities");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCities();
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  const filteredCities = useMemo(() => {
    return cities.filter((c) => {
      const matchesSearch =
        (c.name || "").toLowerCase().includes(search.toLowerCase()) ||
        (c.state_name || "").toLowerCase().includes(search.toLowerCase());
      const matchesStatus =
        statusFilter === "all"
          ? true
          : statusFilter === "active"
            ? !!c.is_status
            : !c.is_status;
      return matchesSearch && matchesStatus;
    });
  }, [cities, search, statusFilter]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredCities.length / itemsPerPage),
  );

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalPages]);

  const paginatedCities = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredCities.slice(start, start + itemsPerPage);
  }, [filteredCities, currentPage]);

  const handleDelete = async () => {
    if (!deleteCity) return;
    setDeleting(true);
    try {
      const res = await fetch(`${API_URL}/${deleteCity.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete city");
      setCities((prev) => prev.filter((c) => c.id !== deleteCity.id));
      setToast({
        type: "success",
        message: `"${deleteCity.name}" deleted successfully`,
      });
      setDeleteCity(null);
    } catch (err) {
      setToast({
        type: "error",
        message: err.message || "Failed to delete city",
      });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-5 right-5 z-50 px-4 py-3 rounded-lg shadow-lg text-sm font-medium text-white ${
            toast.type === "success" ? "bg-emerald-600" : "bg-red-600"
          }`}
        >
          {toast.message}
        </div>
      )}

      {/* Breadcrumb */}
      <div className="text-sm text-slate-400 mb-4">
        <span>Dashboard</span> <span className="mx-1">/</span>{" "}
        <span className="text-slate-600 font-medium">Cities</span>
      </div>

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-xl bg-blue-600 flex items-center justify-center shadow-sm">
            <Building2 className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800">Cities</h1>
            <p className="text-sm text-slate-400">Manage cities and towns</p>
          </div>
        </div>
        <button
          onClick={() => navigate("/city/add")}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2.5 rounded-lg shadow-sm transition"
        >
          <Plus className="h-4 w-4" />
          Add City
        </button>
      </div>

      {/* Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
        {/* Card header */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <h2 className="font-semibold text-slate-800">City List</h2>
            <span className="text-xs font-semibold bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">
              {filteredCities.length}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search city..."
                className="pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg w-48 sm:w-56 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400"
              />
            </div>

            <div className="flex items-center bg-slate-100 rounded-lg p-1 text-sm">
              {[
                { key: "all", label: "All" },
                { key: "active", label: "Active" },
                { key: "inactive", label: "Inactive" },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => {
                    setStatusFilter(tab.key);
                    setCurrentPage(1);
                  }}
                  className={`px-3 py-1.5 rounded-md font-medium transition ${
                    statusFilter === tab.key
                      ? "bg-white shadow-sm text-slate-800"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <button
              onClick={fetchCities}
              className="flex items-center gap-1.5 text-sm font-medium text-slate-600 border border-slate-200 px-3 py-2 rounded-lg hover:bg-slate-50 transition"
            >
              <RefreshCw
                className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`}
              />
              Refresh
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-slate-400 text-xs uppercase tracking-wider">
                <th className="text-left font-semibold px-5 py-3 w-12">#</th>
                <th className="text-left font-semibold px-5 py-3">City</th>
                <th className="text-left font-semibold px-5 py-3">State</th>
                <th className="text-left font-semibold px-5 py-3">Status</th>
                <th className="text-left font-semibold px-5 py-3">Created</th>
                <th className="text-left font-semibold px-5 py-3">
                  Last Updated
                </th>
                <th className="text-right font-semibold px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-5 py-10 text-center text-slate-400"
                  >
                    Loading cities...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-5 py-10 text-center text-red-500"
                  >
                    {error}
                  </td>
                </tr>
              ) : paginatedCities.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-5 py-10 text-center text-slate-400"
                  >
                    No cities found
                  </td>
                </tr>
              ) : (
                paginatedCities.map((c, idx) => (
                  <tr key={c.id} className="hover:bg-slate-50/60 transition">
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center justify-center h-7 w-7 rounded-md bg-slate-100 text-slate-500 text-xs font-semibold">
                        {(currentPage - 1) * itemsPerPage + idx + 1}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`h-9 w-9 rounded-full flex items-center justify-center text-white font-semibold text-sm ${
                            AVATAR_COLORS[c.id % AVATAR_COLORS.length]
                          }`}
                        >
                          {c.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800">
                            {c.name}
                          </p>
                          <p className="text-xs text-slate-400">ID: #{c.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center gap-1.5 text-slate-600">
                        <MapPin className="h-3.5 w-3.5 text-slate-400" />
                        {c.state_name || "-"}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      {c.is_status ? (
                        <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-600 text-xs font-semibold px-2.5 py-1 rounded-full">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-600 text-xs font-semibold px-2.5 py-1 rounded-full">
                          <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                          Inactive
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-slate-500">
                      {formatDate(c.created_at)}
                    </td>
                    <td className="px-5 py-4 text-slate-500">
                      {formatDate(c.updated_at)}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setViewCity(c)}
                          title="View"
                          className="h-8 w-8 flex items-center justify-center rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => navigate(`/city/edit/${c.id}`)}
                          title="Edit"
                          className="h-8 w-8 flex items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setDeleteCity(c)}
                          title="Delete"
                          className="h-8 w-8 flex items-center justify-center rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition"
                        >
                          <Trash2 className="h-4 w-4" />
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
        {!loading && filteredCities.length > 0 && (
          <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-t border-slate-100">
            <p className="text-xs text-slate-400">
              Showing {(currentPage - 1) * itemsPerPage + 1}-
              {Math.min(currentPage * itemsPerPage, filteredCities.length)} of{" "}
              {filteredCities.length} cities
            </p>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="h-8 w-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-500 disabled:opacity-40 hover:bg-slate-50 transition"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setCurrentPage(p)}
                  className={`h-8 w-8 flex items-center justify-center rounded-lg text-sm font-medium transition ${
                    p === currentPage
                      ? "bg-blue-600 text-white"
                      : "text-slate-500 hover:bg-slate-50 border border-slate-200"
                  }`}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
                className="h-8 w-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-500 disabled:opacity-40 hover:bg-slate-50 transition"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* View Modal */}
      {viewCity && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h3 className="font-semibold text-slate-800">City Details</h3>
              <button
                onClick={() => setViewCity(null)}
                className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-400"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div
                  className={`h-14 w-14 rounded-full flex items-center justify-center text-white font-bold text-lg ${
                    AVATAR_COLORS[viewCity.id % AVATAR_COLORS.length]
                  }`}
                >
                  {viewCity.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-lg font-bold text-slate-800">
                    {viewCity.name}
                  </p>
                  <p className="text-xs text-slate-400">ID: #{viewCity.id}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-slate-50 rounded-lg p-3 col-span-2">
                  <p className="text-xs text-slate-400 mb-1 flex items-center gap-1">
                    <MapPin className="h-3 w-3" /> State
                  </p>
                  <p className="font-medium text-slate-700">
                    {viewCity.state_name || "-"}
                  </p>
                </div>
                <div className="bg-slate-50 rounded-lg p-3">
                  <p className="text-xs text-slate-400 mb-1">Status</p>
                  {viewCity.is_status ? (
                    <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-600 text-xs font-semibold px-2.5 py-1 rounded-full">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />{" "}
                      Active
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-600 text-xs font-semibold px-2.5 py-1 rounded-full">
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />{" "}
                      Inactive
                    </span>
                  )}
                </div>
                <div className="bg-slate-50 rounded-lg p-3">
                  <p className="text-xs text-slate-400 mb-1 flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" /> Trending
                  </p>
                  <span
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                      viewCity.is_trending
                        ? "bg-violet-50 text-violet-600"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {viewCity.is_trending ? "Yes" : "No"}
                  </span>
                </div>
                <div className="bg-slate-50 rounded-lg p-3 col-span-2">
                  <p className="text-xs text-slate-400 mb-1 flex items-center gap-1">
                    <CalendarDays className="h-3 w-3" /> Created
                  </p>
                  <p className="font-medium text-slate-700">
                    {formatDate(viewCity.created_at)}
                  </p>
                </div>
                <div className="bg-slate-50 rounded-lg p-3 col-span-2">
                  <p className="text-xs text-slate-400 mb-1 flex items-center gap-1">
                    <CalendarDays className="h-3 w-3" /> Last Updated
                  </p>
                  <p className="font-medium text-slate-700">
                    {formatDate(viewCity.updated_at)}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 px-6 py-4 border-t border-slate-100">
              <button
                onClick={() => {
                  navigate(`/city/edit/${viewCity.id}`);
                  setViewCity(null);
                }}
                className="flex-1 flex items-center justify-center gap-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 font-medium text-sm py-2.5 rounded-lg transition"
              >
                <Pencil className="h-4 w-4" /> Edit
              </button>
              <button
                onClick={() => {
                  setDeleteCity(viewCity);
                  setViewCity(null);
                }}
                className="flex-1 flex items-center justify-center gap-2 bg-red-50 text-red-600 hover:bg-red-100 font-medium text-sm py-2.5 rounded-lg transition"
              >
                <Trash2 className="h-4 w-4" /> Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteCity && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden">
            <div className="p-6 text-center">
              <div className="h-14 w-14 rounded-full bg-red-50 text-red-500 flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="h-7 w-7" />
              </div>
              <h3 className="font-semibold text-slate-800 text-lg mb-1">
                Delete City?
              </h3>
              <p className="text-sm text-slate-500">
                Are you sure you want to delete{" "}
                <span className="font-semibold text-slate-700">
                  "{deleteCity.name}"
                </span>
                ? This action cannot be undone.
              </p>
            </div>
            <div className="flex items-center gap-2 px-6 py-4 border-t border-slate-100">
              <button
                onClick={() => setDeleteCity(null)}
                disabled={deleting}
                className="flex-1 bg-slate-100 text-slate-600 hover:bg-slate-200 font-medium text-sm py-2.5 rounded-lg transition disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 bg-red-600 text-white hover:bg-red-700 font-medium text-sm py-2.5 rounded-lg transition disabled:opacity-50"
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
