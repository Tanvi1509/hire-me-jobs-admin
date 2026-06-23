import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const API_BASE = "https://hire-me-jobs.onrender.com/departments";
const FILES_BASE = "https://hire-me-jobs.onrender.com/uploads";
const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/jpg"];
const MAX_FILE_SIZE_MB = 2;

// Backend only returns the filename (e.g. "engineering.png").
// If your server serves uploads from a different folder, change this line only.
const getImageUrl = (icon) => {
  if (!icon) return null;
  if (/^https?:\/\//i.test(icon)) return icon;
  return `${FILES_BASE}/${icon}`;
};

export default function EditDepartment() {
  const { id } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    department_name: "",
    status: true,
    is_trending: false,
  });
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
    setTimeout(() => setToast(null), 3000);
  };

  /* ------------------------------ fetch data ----------------------------- */
  useEffect(() => {
    const fetchDepartment = async () => {
      setLoading(true);
      setLoadError("");
      try {
        let dept = null;

        try {
          const res = await fetch(`${API_BASE}/${id}`);
          if (res.ok) {
            const json = await res.json();
            dept = json.data || json;
          }
        } catch {
          // ignore - fall through to list lookup below
        }

        if (!dept) {
          const listRes = await fetch(API_BASE);
          const listJson = await listRes.json();
          dept = (listJson.data || []).find((d) => String(d.id) === String(id));
        }

        if (!dept) throw new Error("Department not found.");

        setForm({
          department_name: dept.department_name || "",
          status: !!dept.status,
          is_trending: !!dept.is_trending,
        });
        setExistingIcon(dept.icon || null);
      } catch (err) {
        console.error("Failed to load department:", err);
        setLoadError(err.message || "Could not load department.");
      } finally {
        setLoading(false);
      }
    };

    fetchDepartment();
  }, [id]);

  /* -------------------------------- helpers ------------------------------- */
  const setField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const validateFile = (file) => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return "Only PNG or JPG images are allowed.";
    }
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      return `Image must be smaller than ${MAX_FILE_SIZE_MB}MB.`;
    }
    return "";
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileError = validateFile(file);
    if (fileError) {
      setErrors((prev) => ({ ...prev, icon: fileError }));
      showToast("error", fileError);
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
    if (!form.department_name.trim()) {
      next.department_name = "Department name is required.";
    } else if (form.department_name.trim().length < 2) {
      next.department_name = "Department name must be at least 2 characters.";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  /* --------------------------------- submit -------------------------------- */
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
      payload.append("status", form.status);
      payload.append("is_trending", form.is_trending);
      if (iconFile) payload.append("icon", iconFile);

      const res = await fetch(`${API_BASE}/${id}`, {
        method: "PATCH",
        body: payload,
      });
      if (!res.ok) throw new Error("Request failed");

      showToast("success", "Department updated successfully!");
      setTimeout(() => navigate("/department"), 1200);
    } catch (err) {
      console.error("Update department failed:", err);
      showToast("error", "Failed to update department. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const displayedImage =
    iconPreview || (!iconErrored ? getImageUrl(existingIcon) : null);

  /* --------------------------------------------------------------------- */
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="flex items-center gap-2 text-gray-400">
          <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
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
          <span className="text-sm">Loading department...</span>
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center gap-3 px-4 text-center">
        <p className="text-sm font-medium text-gray-700">{loadError}</p>
        <button
          onClick={() => navigate("/department")}
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
        >
          Back to Departments
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-5 right-5 z-50 flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg text-sm font-medium ${
            toast.type === "success"
              ? "bg-green-600 text-white"
              : "bg-red-600 text-white"
          }`}
        >
          {toast.type === "success" ? (
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
                d="M5 13l4 4L19 7"
              />
            </svg>
          ) : (
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          )}
          {toast.message}
        </div>
      )}

      {/* Page Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/department")}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <div>
            <h1 className="text-xl font-semibold text-gray-800">
              Edit Department
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Update department details, icon and visibility settings
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="p-6">
        <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
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
                className={`w-full px-3.5 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.department_name
                    ? "border-red-300 focus:ring-red-100"
                    : "border-gray-200 focus:ring-indigo-100 focus:border-indigo-400"
                }`}
              />
              {errors.department_name && (
                <p className="text-xs text-red-500 mt-1.5">
                  {errors.department_name}
                </p>
              )}
            </div>

            {/* Icon (edit) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Department Icon
              </label>

              <div className="flex items-center gap-4 border border-gray-200 rounded-xl p-4">
                <div className="relative w-16 h-16 shrink-0 group">
                  {displayedImage ? (
                    <img
                      src={displayedImage}
                      alt="Department icon"
                      onError={() => setIconErrored(true)}
                      className="w-16 h-16 rounded-lg object-cover border border-gray-200"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-400">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    title="Change image"
                    className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/0 group-hover:bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-colors"
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
                </div>

                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-700">
                    {iconFile
                      ? iconFile.name
                      : existingIcon || "No icon uploaded"}
                  </p>
                  <p className="text-xs text-gray-400">
                    {iconFile
                      ? `${(iconFile.size / 1024).toFixed(0)} KB · not saved yet`
                      : `PNG or JPG, max ${MAX_FILE_SIZE_MB}MB`}
                  </p>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-xs font-medium text-indigo-600 hover:text-indigo-700 mt-1.5"
                  >
                    {existingIcon ? "Change image" : "Upload image"}
                  </button>
                </div>

                {iconFile && (
                  <button
                    type="button"
                    onClick={handleRemoveNewImage}
                    title="Discard new image"
                    className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-gray-100 rounded-lg transition-colors"
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
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                )}
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/png, image/jpeg, image/jpg"
                onChange={handleFileChange}
                className="hidden"
              />
              {errors.icon && (
                <p className="text-xs text-red-500 mt-1.5">{errors.icon}</p>
              )}
            </div>

            {/* Status + Trending */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center justify-between border border-gray-200 rounded-xl p-4">
                <div>
                  <p className="text-sm font-medium text-gray-700">Status</p>
                  <p className="text-xs text-gray-400">
                    {form.status ? "Active" : "Inactive"}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setField("status", !form.status)}
                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none ${
                    form.status ? "bg-indigo-600" : "bg-gray-200"
                  }`}
                >
                  <span
                    className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${
                      form.status ? "translate-x-4" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between border border-gray-200 rounded-xl p-4">
                <div>
                  <p className="text-sm font-medium text-gray-700">Trending</p>
                  <p className="text-xs text-gray-400">
                    {form.is_trending ? "Marked as trending" : "Not trending"}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setField("is_trending", !form.is_trending)}
                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none ${
                    form.is_trending ? "bg-amber-500" : "bg-gray-200"
                  }`}
                >
                  <span
                    className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${
                      form.is_trending ? "translate-x-4" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => navigate("/department")}
                disabled={submitting}
                className="flex-1 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors disabled:opacity-60"
              >
                {submitting && (
                  <svg
                    className="animate-spin w-4 h-4"
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
                )}
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
