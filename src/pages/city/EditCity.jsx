import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { ArrowLeft, Building2, Save, X, Loader2 } from "lucide-react";

const API_URL = "https://hire-me-jobs.onrender.com/cities";
const STATES_API_URL = "https://hire-me-jobs.onrender.com/states";

function Toggle({ checked, onChange, activeLabel, inactiveLabel }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors duration-200 ${
        checked ? "bg-emerald-500" : "bg-slate-300"
      }`}
    >
      <span
        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform duration-200 ${
          checked ? "translate-x-8" : "translate-x-1"
        }`}
      />
      <span className="sr-only">{checked ? activeLabel : inactiveLabel}</span>
    </button>
  );
}

export default function EditCity() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [name, setName] = useState("");
  const [stateId, setStateId] = useState("");
  const [isStatus, setIsStatus] = useState(true);
  const [isTrending, setIsTrending] = useState(false);

  const [states, setStates] = useState([]);
  const [statesLoading, setStatesLoading] = useState(true);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const loadStates = async () => {
      setStatesLoading(true);
      try {
        const res = await fetch(STATES_API_URL);
        if (!res.ok) throw new Error("Failed to load states");
        const data = await res.json();
        const list = Array.isArray(data?.data)
          ? data.data
          : Array.isArray(data)
          ? data
          : [];
        setStates(list);
      } catch {
        setStates([]);
      } finally {
        setStatesLoading(false);
      }
    };
    loadStates();
  }, []);

  useEffect(() => {
    const loadCity = async () => {
      setLoading(true);
      setError("");
      setNotFound(false);
      try {
        // Try a direct single-record endpoint first.
        let record = null;
        try {
          const res = await fetch(`${API_URL}/${id}`);
          if (res.ok) {
            const data = await res.json();
            record = data?.data ?? data;
            if (Array.isArray(record)) record = record[0] ?? null;
          }
        } catch {
          /* fall back to list lookup below */
        }

        // Fallback: fetch the full list and find the matching record by id.
        if (!record || !record.id) {
          const listRes = await fetch(API_URL);
          if (!listRes.ok) throw new Error("Failed to load city details");
          const listData = await listRes.json();
          const list = Array.isArray(listData?.data)
            ? listData.data
            : Array.isArray(listData)
            ? listData
            : [];
          record = list.find((c) => String(c.id) === String(id));
        }

        if (!record) {
          setNotFound(true);
          return;
        }

        setName(record.name || "");
        setStateId(record.state_id ? String(record.state_id) : "");
        setIsStatus(!!record.is_status);
        setIsTrending(!!record.is_trending);
      } catch (err) {
        setError(err.message || "Something went wrong while loading the city");
      } finally {
        setLoading(false);
      }
    };

    loadCity();
  }, [id]);

  const validate = () => {
    const errs = {};
    if (!name.trim()) errs.name = "City name is required";
    if (!stateId) errs.stateId = "Please select a state";
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validate()) return;

    setSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          state_id: Number(stateId),
          is_status: isStatus,
          is_trending: isTrending,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData?.message || "Failed to update city");
      }

      navigate("/city");
    } catch (err) {
      setError(err.message || "Something went wrong while updating the city");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      {/* Breadcrumb */}
      <div className="text-sm text-slate-400 mb-4">
        <Link to="/city" className="hover:text-slate-600">
          Dashboard
        </Link>{" "}
        <span className="mx-1">/</span>{" "}
        <Link to="/city" className="hover:text-slate-600">
          Cities
        </Link>{" "}
        <span className="mx-1">/</span>{" "}
        <span className="text-slate-600 font-medium">Edit</span>
      </div>

      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate("/city")}
          className="h-10 w-10 flex items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 transition"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div className="h-11 w-11 rounded-xl bg-blue-600 flex items-center justify-center shadow-sm">
          <Building2 className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-800">Edit City</h1>
          <p className="text-sm text-slate-400">ID: #{id}</p>
        </div>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm max-w-2xl">
        <div className="px-6 py-4 border-b border-slate-100">
          <h2 className="font-semibold text-slate-800">City Information</h2>
        </div>

        {loading ? (
          <div className="p-10 text-center text-slate-400 text-sm">Loading city details...</div>
        ) : notFound ? (
          <div className="p-10 text-center">
            <p className="text-slate-500 text-sm mb-4">City not found.</p>
            <button
              onClick={() => navigate("/city")}
              className="text-sm font-medium text-blue-600 hover:underline"
            >
              Back to Cities
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                City Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setFieldErrors((prev) => ({ ...prev, name: "" }));
                }}
                placeholder="e.g. Ahmedabad"
                className={`w-full px-3.5 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30 ${
                  fieldErrors.name
                    ? "border-red-300 focus:border-red-400"
                    : "border-slate-200 focus:border-blue-400"
                }`}
              />
              {fieldErrors.name && (
                <p className="text-xs text-red-500 mt-1">{fieldErrors.name}</p>
              )}
            </div>

            {/* State */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                State <span className="text-red-500">*</span>
              </label>
              <select
                value={stateId}
                onChange={(e) => {
                  setStateId(e.target.value);
                  setFieldErrors((prev) => ({ ...prev, stateId: "" }));
                }}
                disabled={statesLoading}
                className={`w-full px-3.5 py-2.5 text-sm border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 ${
                  fieldErrors.stateId
                    ? "border-red-300 focus:border-red-400"
                    : "border-slate-200 focus:border-blue-400"
                }`}
              >
                <option value="">
                  {statesLoading ? "Loading states..." : "Select a state"}
                </option>
                {states.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
              {fieldErrors.stateId && (
                <p className="text-xs text-red-500 mt-1">{fieldErrors.stateId}</p>
              )}
            </div>

            {/* Status */}
            <div className="flex items-center justify-between bg-slate-50 rounded-lg p-4">
              <div>
                <p className="text-sm font-medium text-slate-700">Status</p>
                <p className="text-xs text-slate-400">
                  {isStatus ? "City will be Active" : "City will be Inactive"}
                </p>
              </div>
              <Toggle
                checked={isStatus}
                onChange={setIsStatus}
                activeLabel="Active"
                inactiveLabel="Inactive"
              />
            </div>

            {/* Trending */}
            <div className="flex items-center justify-between bg-slate-50 rounded-lg p-4">
              <div>
                <p className="text-sm font-medium text-slate-700">Trending</p>
                <p className="text-xs text-slate-400">
                  {isTrending ? "Marked as trending city" : "Not marked as trending"}
                </p>
              </div>
              <Toggle
                checked={isTrending}
                onChange={setIsTrending}
                activeLabel="Trending"
                inactiveLabel="Not trending"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-5 py-2.5 rounded-lg shadow-sm transition disabled:opacity-60"
              >
                {submitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                {submitting ? "Updating..." : "Update City"}
              </button>
              <button
                type="button"
                onClick={() => navigate("/city")}
                disabled={submitting}
                className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm font-medium px-5 py-2.5 rounded-lg transition"
              >
                <X className="h-4 w-4" />
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
