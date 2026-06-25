import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, MapPin, Save, X, Loader2 } from "lucide-react";

const API_URL = "https://hire-me-jobs.onrender.com/states";

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

export default function AddState() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [isStatus, setIsStatus] = useState(true);
  const [isTrending, setIsTrending] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [fieldError, setFieldError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setFieldError("");

    if (!name.trim()) {
      setFieldError("State name is required");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          is_status: isStatus,
          is_trending: isTrending,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData?.message || "Failed to create state");
      }

      navigate("/state");
    } catch (err) {
      setError(err.message || "Something went wrong while creating the state");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      {/* Breadcrumb */}
      <div className="text-sm text-slate-400 mb-4">
        <Link to="/state" className="hover:text-slate-600">
          Dashboard
        </Link>{" "}
        <span className="mx-1">/</span>{" "}
        <Link to="/state" className="hover:text-slate-600">
          States
        </Link>{" "}
        <span className="mx-1">/</span>{" "}
        <span className="text-slate-600 font-medium">Add</span>
      </div>

      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate("/state")}
          className="h-10 w-10 flex items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 transition"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div className="h-11 w-11 rounded-xl bg-blue-600 flex items-center justify-center shadow-sm">
          <MapPin className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-800">Add State</h1>
          <p className="text-sm text-slate-400">Create a new state record</p>
        </div>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm max-w-2xl">
        <div className="px-6 py-4 border-b border-slate-100">
          <h2 className="font-semibold text-slate-800">State Information</h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              State Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setFieldError("");
              }}
              placeholder="e.g. Gujarat"
              className={`w-full px-3.5 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30 ${
                fieldError
                  ? "border-red-300 focus:border-red-400"
                  : "border-slate-200 focus:border-blue-400"
              }`}
            />
            {fieldError && (
              <p className="text-xs text-red-500 mt-1">{fieldError}</p>
            )}
          </div>

          {/* Status */}
          <div className="flex items-center justify-between bg-slate-50 rounded-lg p-4">
            <div>
              <p className="text-sm font-medium text-slate-700">Status</p>
              <p className="text-xs text-slate-400">
                {isStatus ? "State will be Active" : "State will be Inactive"}
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
                {isTrending
                  ? "Marked as trending state"
                  : "Not marked as trending"}
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
              {submitting ? "Saving..." : "Save State"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/state")}
              disabled={submitting}
              className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm font-medium px-5 py-2.5 rounded-lg transition"
            >
              <X className="h-4 w-4" />
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
