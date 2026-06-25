import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Briefcase, ChevronLeft, Loader2, CheckCircle } from "lucide-react";

const BASE_URL = "https://hire-me-jobs.onrender.com/workplace-types";

const EditWorkplaceTypes = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", is_status: true });
  const [fetching, setFetching] = useState(true);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${BASE_URL}/${id}`);
        if (!res.ok) throw new Error("Failed to load");
        const json = await res.json();
        const d = json.data || json;
        setForm({
          name: d.name || "",
          is_status: d.is_status ?? true,
        });
      } catch (e) {
        setError("Failed to load record: " + e.message);
      } finally {
        setFetching(false);
      }
    };
    load();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${BASE_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          is_status: form.is_status,
        }),
      });
      if (!res.ok) throw new Error("Failed to update workplace type");
      setSuccess(true);
      setTimeout(() => navigate("/workplace-types"), 1200);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Breadcrumb */}
      <div className="mb-2 text-sm">
        <span className="text-gray-400">Dashboard / </span>
        <span
          className="text-gray-400 cursor-pointer hover:text-blue-600 transition-colors"
          onClick={() => navigate("/workplace-types")}
        >
          Workplace Types
        </span>
        <span className="text-gray-400"> / </span>
        <span className="text-gray-700 font-medium">Edit</span>
      </div>

      {/* Page Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate("/workplace-types")}
          className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
        >
          <ChevronLeft size={18} className="text-gray-500" />
        </button>
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 bg-blue-600 rounded-lg flex items-center justify-center">
            <Briefcase className="text-white" size={20} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              Edit Workplace Type
            </h1>
            <p className="text-sm text-gray-500">
              Update the workplace type details
            </p>
          </div>
        </div>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm max-w-lg">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-semibold text-gray-800">
            Workplace Type Information
          </h2>
          <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-md font-medium">
            ID: #{id}
          </span>
        </div>

        {fetching ? (
          <div className="flex items-center justify-center py-16 gap-2 text-gray-400">
            <Loader2 className="animate-spin" size={20} />
            <span className="text-sm">Loading...</span>
          </div>
        ) : (
          <>
            {success && (
              <div className="mx-6 mt-4 flex items-center gap-2 bg-green-50 text-green-700 border border-green-100 rounded-lg px-4 py-3 text-sm">
                <CheckCircle size={16} /> Updated successfully! Redirecting...
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
                  onChange={(e) =>
                    setForm((f) => ({ ...f, name: e.target.value }))
                  }
                  placeholder="e.g. Remote, Hybrid, On-site"
                  required
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Status
                </label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, is_status: true }))}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                      form.is_status
                        ? "bg-green-50 border-green-200 text-green-700"
                        : "border-gray-200 text-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${form.is_status ? "bg-green-500" : "bg-gray-300"}`}
                    />
                    Active
                  </button>
                  <button
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, is_status: false }))}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                      !form.is_status
                        ? "bg-yellow-50 border-yellow-200 text-yellow-700"
                        : "border-gray-200 text-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${!form.is_status ? "bg-yellow-500" : "bg-gray-300"}`}
                    />
                    Inactive
                  </button>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => navigate("/workplace-types")}
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
                    <>
                      <Loader2 size={14} className="animate-spin" /> Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default EditWorkplaceTypes;
