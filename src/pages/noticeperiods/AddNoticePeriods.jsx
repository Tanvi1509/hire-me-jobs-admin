import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Clock, ChevronLeft, Loader2, CheckCircle } from "lucide-react";

const BASE_URL = "https://hire-me-jobs.onrender.com/notice-periods";

const AddNoticePeriods = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", days: "", status: true });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(BASE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          days: parseInt(form.days, 10),
          status: form.status,
        }),
      });
      if (!res.ok) throw new Error("Failed to create notice period");
      setSuccess(true);
      setTimeout(() => navigate("/noticeperiods"), 1200);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Breadcrumb */}
      <div className="mb-2 text-sm text-gray-500">
        <span className="text-gray-400">Dashboard / </span>
        <span
          className="text-gray-400 cursor-pointer hover:text-blue-600 transition-colors"
          onClick={() => navigate("/noticeperiods")}
        >
          Notice Periods
        </span>
        <span className="text-gray-400"> / </span>
        <span className="text-gray-700 font-medium">Add</span>
      </div>

      {/* Page Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate("/noticeperiods")}
          className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
        >
          <ChevronLeft size={18} className="text-gray-500" />
        </button>
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 bg-blue-600 rounded-lg flex items-center justify-center">
            <Clock className="text-white" size={20} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Add Notice Period</h1>
            <p className="text-sm text-gray-500">Create a new notice period for the platform</p>
          </div>
        </div>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm max-w-lg">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-800">Notice Period Information</h2>
        </div>

        {success && (
          <div className="mx-6 mt-4 flex items-center gap-2 bg-green-50 text-green-700 border border-green-100 rounded-lg px-4 py-3 text-sm">
            <CheckCircle size={16} /> Notice period added successfully! Redirecting...
          </div>
        )}
        {error && (
          <div className="mx-6 mt-4 bg-red-50 text-red-600 border border-red-100 rounded-lg px-4 py-3 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="e.g. 30 Days"
              required
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>

          {/* Days */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Days <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={form.days}
              onChange={(e) => setForm((f) => ({ ...f, days: e.target.value }))}
              placeholder="e.g. 30"
              required
              min={0}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Status</label>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setForm((f) => ({ ...f, status: true }))}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                  form.status
                    ? "bg-green-50 border-green-200 text-green-700"
                    : "border-gray-200 text-gray-500 hover:bg-gray-50"
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${form.status ? "bg-green-500" : "bg-gray-300"}`} />
                Active
              </button>
              <button
                type="button"
                onClick={() => setForm((f) => ({ ...f, status: false }))}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                  !form.status
                    ? "bg-red-50 border-red-200 text-red-600"
                    : "border-gray-200 text-gray-500 hover:bg-gray-50"
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${!form.status ? "bg-red-500" : "bg-gray-300"}`} />
                Inactive
              </button>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => navigate("/noticeperiods")}
              className="flex-1 border border-gray-200 hover:bg-gray-50 text-gray-600 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || success}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <><Loader2 size={14} className="animate-spin" /> Saving...</>
              ) : (
                "Add Notice Period"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddNoticePeriods;
