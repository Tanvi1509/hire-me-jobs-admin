import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const API_URL = "https://hire-me-jobs.onrender.com/skills";

const EditSkils = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [form, setForm] = useState({
    skill_name: "",
    status: true,
    is_trending: false,
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");

  useEffect(() => {
    const fetchSkill = async () => {
      try {
        setLoading(true);
        setApiError("");

        let item = null;

        // Try fetching the single record directly: GET /skills/:id
        try {
          const res = await fetch(`${API_URL}/${id}`);
          const data = await res.json();
          if (data?.data && !Array.isArray(data.data)) {
            item = data.data;
          } else if (Array.isArray(data?.data)) {
            item = data.data.find((skill) => String(skill.id) === String(id));
          }
        } catch (innerErr) {
          // ignore, fallback below
        }

        // Fallback: fetch full list and find the matching id
        if (!item) {
          const listRes = await fetch(API_URL);
          const listData = await listRes.json();
          item = (listData?.data || []).find(
            (skill) => String(skill.id) === String(id)
          );
        }

        if (item) {
          setForm({
            skill_name: item.skill_name || "",
            status: !!item.status,
            is_trending: !!item.is_trending,
          });
        } else {
          setApiError("Skill not found");
        }
      } catch (err) {
        setApiError("Something went wrong while fetching skill");
      } finally {
        setLoading(false);
      }
    };

    fetchSkill();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.skill_name.trim()) {
      newErrors.skill_name = "Skill name is required";
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
      const res = await fetch(`${API_URL}/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          skill_name: form.skill_name.trim(),
          status: form.status,
          is_trending: form.is_trending,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        navigate("/skills");
      } else {
        setApiError(data?.message || "Failed to update skill");
      }
    } catch (err) {
      setApiError("Something went wrong while updating skill");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <p className="text-gray-400 text-sm">Loading skill...</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Breadcrumb */}
      <p className="text-sm text-gray-400 mb-4">
        Dashboard <span className="mx-1">/</span>
        <span
          className="hover:text-gray-600 cursor-pointer"
          onClick={() => navigate("/skills")}
        >
          Skills
        </span>{" "}
        <span className="mx-1">/</span>
        <span className="text-gray-700 font-medium">Edit</span>
      </p>

      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" viewBox="0 0 20 20" fill="currentColor">
            <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
            <path
              fillRule="evenodd"
              d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit Skill</h1>
          <p className="text-sm text-gray-500 mt-0.5">Update skill details (ID: #{id})</p>
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
              Skill Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="skill_name"
              value={form.skill_name}
              onChange={handleChange}
              placeholder="e.g. React.js"
              className={`w-full px-3 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.skill_name ? "border-red-400" : "border-gray-200"
              }`}
            />
            {errors.skill_name && (
              <p className="text-xs text-red-500 mt-1">{errors.skill_name}</p>
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
              onClick={() => navigate("/skills")}
              className="px-4 py-2.5 text-sm font-medium rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2.5 text-sm font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {submitting ? "Updating..." : "Update Skill"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditSkils;