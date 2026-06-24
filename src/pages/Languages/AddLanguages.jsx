import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = "https://hire-me-jobs.onrender.com/language";

const AddLanguages = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    language_name: "",
    status: true,
    is_trending: false,
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.language_name.trim()) {
      newErrors.language_name = "Language name is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setSubmitting(true);
      setApiError("");
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          language_name: form.language_name.trim(),
          status: form.status,
          is_trending: form.is_trending,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        navigate("/languages");
      } else {
        setApiError(data?.message || "Failed to add language");
      }
    } catch (err) {
      setApiError("Something went wrong while adding language");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Breadcrumb */}
      <p className="text-sm text-gray-400 mb-4">
        Dashboard <span className="mx-1">/</span>
        <span
          className="hover:text-gray-600 cursor-pointer"
          onClick={() => navigate("/languages")}
        >
          Languages
        </span>{" "}
        <span className="mx-1">/</span>
        <span className="text-gray-700 font-medium">Add</span>
      </p>

      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Add Language</h1>
          <p className="text-sm text-gray-500 mt-0.5">Create a new language entry</p>
        </div>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 max-w-xl">
        <form onSubmit={handleSubmit} className="space-y-5">
          {apiError && (
            <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg">
              {apiError}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Language Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="language_name"
              value={form.language_name}
              onChange={handleChange}
              placeholder="e.g. English"
              className={`w-full px-3 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.language_name ? "border-red-400" : "border-gray-200"
              }`}
            />
            {errors.language_name && (
              <p className="text-xs text-red-500 mt-1">{errors.language_name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Status</label>
            <select
              name="status"
              value={form.status ? "true" : "false"}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, status: e.target.value === "true" }))
              }
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="is_trending"
              name="is_trending"
              checked={form.is_trending}
              onChange={handleChange}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="is_trending" className="text-sm font-medium text-gray-700">
              Mark as Trending
            </label>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => navigate("/languages")}
              className="px-4 py-2.5 text-sm font-medium rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2.5 text-sm font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {submitting ? "Saving..." : "Save Language"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddLanguages;
