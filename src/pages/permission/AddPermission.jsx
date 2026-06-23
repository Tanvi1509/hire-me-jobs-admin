import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddPermission = () => {
  const navigate = useNavigate();

  const [roles, setRoles] = useState([]);
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    role_id: "",
    module_id: "",
    can_read: false,
    can_create: false,
    can_update: false,
    can_delete: false,
  });

  useEffect(() => {
    fetchRoles();
    fetchModules();
  }, []);

  const fetchRoles = async () => {
    try {
      const res = await axios.get("https://hire-me-jobs.onrender.com/role");

      if (res.data.success) {
        setRoles(res.data.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchModules = async () => {
    try {
      const res = await axios.get("https://hire-me-jobs.onrender.com/module");

      if (res.data.success) {
        setModules(res.data.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const payload = {
        role_id: Number(formData.role_id),
        module_id: Number(formData.module_id),
        can_read: formData.can_read,
        can_create: formData.can_create,
        can_update: formData.can_update,
        can_delete: formData.can_delete,
      };

      const res = await axios.post(
        "https://hire-me-jobs.onrender.com/permission",
        payload,
      );

      if (res.data.success) {
        alert("Permission created successfully!");

        navigate("/permission");
      } else {
        alert(res.data.message);
      }
    } catch (error) {
      console.error(error);
      alert(error?.response?.data?.message || "Failed to create permission");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-md p-8">
        <h1 className="text-2xl font-bold mb-6">Add Permission</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Role */}
          <div>
            <label className="block mb-2 font-medium">Select Role</label>

            <select
              name="role_id"
              value={formData.role_id}
              onChange={handleChange}
              required
              className="w-full border rounded-lg px-4 py-3"
            >
              <option value="">Choose Role</option>

              {roles.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.role_name}
                </option>
              ))}
            </select>
          </div>

          {/* Module */}
          <div>
            <label className="block mb-2 font-medium">Select Module</label>

            <select
              name="module_id"
              value={formData.module_id}
              onChange={handleChange}
              required
              className="w-full border rounded-lg px-4 py-3"
            >
              <option value="">Choose Module</option>

              {modules.map((module) => (
                <option key={module.id} value={module.id}>
                  {module.name}
                </option>
              ))}
            </select>
          </div>

          {/* Permissions */}
          <div>
            <label className="block mb-3 font-medium">Permissions</label>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <label className="flex items-center gap-2 border rounded-lg p-3">
                <input
                  type="checkbox"
                  name="can_read"
                  checked={formData.can_read}
                  onChange={handleChange}
                />
                Read
              </label>

              <label className="flex items-center gap-2 border rounded-lg p-3">
                <input
                  type="checkbox"
                  name="can_create"
                  checked={formData.can_create}
                  onChange={handleChange}
                />
                Create
              </label>

              <label className="flex items-center gap-2 border rounded-lg p-3">
                <input
                  type="checkbox"
                  name="can_update"
                  checked={formData.can_update}
                  onChange={handleChange}
                />
                Update
              </label>

              <label className="flex items-center gap-2 border rounded-lg p-3">
                <input
                  type="checkbox"
                  name="can_delete"
                  checked={formData.can_delete}
                  onChange={handleChange}
                />
                Delete
              </label>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700"
            >
              {loading ? "Creating..." : "Create Permission"}
            </button>

            <button
              type="button"
              onClick={() => navigate("/permission")}
              className="border px-6 py-3 rounded-lg"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPermission;
