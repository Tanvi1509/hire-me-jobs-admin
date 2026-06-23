import React, { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";

const API_BASE = "https://hire-me-jobs.onrender.com/departments";
const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/jpg"];
const MAX_FILE_SIZE_MB = 2;

const getImageUrl = (icon) => {
  if (!icon) return null;
  if (/^https?:\/\//i.test(icon)) return icon;
  if (icon.startsWith("/uploads/")) return `https://hire-me-jobs.onrender.com${icon}`;
  return `https://hire-me-jobs.onrender.com/uploads/${icon}`;
};

function Toggle({ checked, onChange, color = "indigo", label, subLabel }) {
  const bg = checked
    ? color === "amber" ? "bg-amber-500" : "bg-indigo-600"
    : "bg-gray-200";
  return (
    <div className="flex items-center justify-between border border-gray-200 rounded-xl p-4">
      <div>
        <p className="text-sm font-medium text-gray-700">{label}</p>
        <p className="text-xs text-gray-400 mt-0.5">{subLabel}</p>
      </div>
      <button
        type="button"
        onClick={onChange}
        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 ${bg} ${color === "amber" ? "focus:ring-amber-400" : "focus:ring-indigo-400"}`}
      >
        <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${checked ? "translate-x-4" : "translate-x-1"}`} />
      </button>
    </div>
  );
}

export default function EditDepartment() {
  const { id } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({ department_name: "", status: true, is_trending: false });
  const [existingIcon, setExistingIcon] = useState(null);
  const [iconFile, setIconFile] = useState(null);
  const [iconPreview, setIconPreview] = useState(null);
  const [iconErrored, setIconErrored] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3500);
  };

  /* ── Fetch department ── */
  const fetchDepartment = useCallback(async () => {
    setLoading(true);
    setLoadError("");
    try {
      // Try single-record endpoint first
      let dept = null;
      try {
        const res = await fetch(`${API_BASE}/${id}`);
        if (res.ok) {
          const json = await res.json();
          dept = json.data ?? json;
          // Reject if it looks like a list
          if (Array.isArray(dept)) dept = null;
        }
      } catch {
        /* ignore - fall through */
      }

      // Fallback: search in the list
      if (!dept) {
        const listRes = await fetch(API_BASE);
        if (!listRes.ok) throw new Error(`Server returned ${listRes.status}`);
        const listJson = await listRes.json();
        const list = Array.isArray(listJson.data) ? listJson.data : Array.isArray(listJson) ? listJson : [];
        dept = list.find((d) => String(d.id) === String(id));
      }

      if (!dept) throw new Error("Department not found.");

      setForm({
        department_name: dept.department_name || "",
        status: !!dept.status,
        is_trending: !!dept.is_trending,
      });
      setExistingIcon(dept.icon || null);
      setIconErrored(false);
    } catch (err) {
      console.error("Failed to load department:", err);
      setLoadError(err.message || "Could not load department.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchDepartment();
  }, [fetchDepartment]);

  /* ── Helpers ── */
  const setField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const validateFile = (file) => {
    if (!ALLOWED_TYPES.includes(file.type)) return "Only PNG or JPG images are allowed.";
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) return `Image must be smaller than ${MAX_FILE_SIZE_MB}MB.`;
    return "";
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const err = validateFile(file);
    if (err) {
      setErrors((prev) => ({ ...prev, icon: err }));
      showToast("error", err);
      e.target.value = "";
      return;
    }
    setIconFile(file);
    setIconPreview(URL.createObjectURL(file));
    setErrors((prev) => ({ ...prev, icon: undefined }));
  };

  const handleRemoveNewImage = () => {
    setIconFile(null);
    setIconPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const validate = () => {
    const next = {};
    const name = form.department_name.trim();
    if (!name) next.department_name = "Department name is required.";
    else if (name.length < 2) next.department_name = "Name must be at least 2 characters.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  /* ── Submit ── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      showToast("error", "Please fix the errors before saving.");
      return;
    }

    setSubmitting(true);
    try {
      const payload = new FormData();
      payload.append("department_name", form.department_name.trim());
      // Send booleans as strings "true"/"false" — most REST APIs accept this
      payload.append("status", String(form.status));
      payload.append("is_trending", String(form.is_trending));
      if (iconFile) payload.append("icon", iconFile);

      // Try PATCH first; if the server rejects it, fall back to PUT
      let res = await fetch(`${API_BASE}/${id}`, { method: "PATCH", body: payload });

      if (!res.ok && res.status === 405) {
        // Method Not Allowed → retry with PUT
        res = await fetch(`${API_BASE}/${id}`, { method: "PUT", body: payload });
      }

      if (!res.ok) {
        const errBody = await res.text();
        throw new Error(errBody || `Request failed with status ${res.status}`);
      }

      const updated = await res.json();
      // Reflect any server-side normalisation (e.g. updated icon path)
      if (updated?.data?.icon || updated?.icon) {
        setExistingIcon(updated.data?.icon ?? updated.icon);
        setIconFile(null);
        setIconPreview(null);
      }

      showToast("success", "Department updated successfully!");
      setTimeout(() => navigate("/department"), 1400);
    } catch (err) {
      console.error("Update department failed:", err);
      showToast("error", err.message || "Failed to update department. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const displayedImage = iconPreview || (!iconErrored ? getImageUrl(existingIcon) : null);

  /* ── Loading state ── */
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="flex items-center gap-2 text-gray-400">
          <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
          </svg>
          <span className="text-sm">Loading department...</span>
        </div>
      </div>
    );
  }

  /* ── Load error state ── */
  if (loadError) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center gap-4 px-4 text-center">
        <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full">
          <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
          </svg>
        </div>
        <p className="text-sm font-medium text-gray-700">{loadError}</p>
        <div className="flex gap-3">
          <button onClick={fetchDepartment} className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors">
            Retry
          </button>
          <button onClick={() => navigate("/department")} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
            Back to Departments
          </button>
        </div>
      </div>
    );
  }

  /* ── Main form ── */
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-5 right-5 z-50 flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg text-sm font-medium ${toast.type === "success" ? "bg-green-600 text-white" : "bg-red-600 text-white"}`}>
          {toast.type === "success"
            ? <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
            : <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>}
          {toast.message}
        </div>
      )}

      {/* Page Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate("/department")}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h1 className="text-xl font-semibold text-gray-800">Edit Department</h1>
            <p className="text-sm text-gray-500 mt-0.5">Update department name, icon and visibility settings</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="p-6">
        <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-6" noValidate>

            {/* Department Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Department Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.department_name}
                onChange={(e) => setField("department_name", e.target.value)}
                placeholder="e.g. Engineering"
                className={`w-full px-3.5 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                  errors.department_name
                    ? "border-red-300 focus:ring-red-100"
                    : "border-gray-200 focus:ring-indigo-100 focus:border-indigo-400"
                }`}
              />
              {errors.department_name && (
                <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.department_name}
                </p>
              )}
            </div>

            {/* Icon Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Department Icon</label>
              <div className="flex items-center gap-4 border border-gray-200 rounded-xl p-4">
                {/* Image Preview */}
                <div className="relative w-16 h-16 shrink-0 group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                  {displayedImage ? (
                    <img
                      src={displayedImage}
                      alt="Department icon"
                      onError={() => setIconErrored(true)}
                      className="w-16 h-16 rounded-lg object-cover border border-gray-200"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-400">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                  <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/0 group-hover:bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-all">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </div>
                </div>

                {/* File Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-700 truncate">
                    {iconFile ? iconFile.name : existingIcon ? existingIcon.split("/").pop() : "No icon uploaded"}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {iconFile
                      ? `${(iconFile.size / 1024).toFixed(0)} KB · not saved yet`
                      : `PNG or JPG, max ${MAX_FILE_SIZE_MB}MB`}
                  </p>
                  <button type="button" onClick={() => fileInputRef.current?.click()}
                    className="text-xs font-medium text-indigo-600 hover:text-indigo-700 mt-1.5">
                    {existingIcon ? "Change image" : "Upload image"}
                  </button>
                </div>

                {/* Remove new image */}
                {iconFile && (
                  <button type="button" onClick={handleRemoveNewImage} title="Discard new image"
                    className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors shrink-0">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/jpg"
                onChange={handleFileChange}
                className="hidden"
              />
              {errors.icon && (
                <p className="text-xs text-red-500 mt-1.5">{errors.icon}</p>
              )}
            </div>

            {/* Status + Trending Toggles */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Toggle
                checked={form.status}
                onChange={() => setField("status", !form.status)}
                color="indigo"
                label="Status"
                subLabel={form.status ? "Active — visible to users" : "Inactive — hidden from users"}
              />
              <Toggle
                checked={form.is_trending}
                onChange={() => setField("is_trending", !form.is_trending)}
                color="amber"
                label="Trending"
                subLabel={form.is_trending ? "Marked as trending" : "Not trending"}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => navigate("/department")} disabled={submitting}
                className="flex-1 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-60">
                Cancel
              </button>
              <button type="submit" disabled={submitting}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors disabled:opacity-60">
                {submitting && (
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                )}
                {submitting ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}