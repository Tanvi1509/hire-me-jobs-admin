import { useState } from "react";
import {
  Plus,
  Search,
  MapPin,
  DollarSign,
  Users,
  Calendar,
  Briefcase,
  Trash2,
  X,
} from "lucide-react";
import { jobsData } from "../../data/mockData";
import {
  Card,
  StatusBadge,
  Badge,
  PageHeader,
  Table,
  Btn,
} from "../../components/ui/index";

const typeColors = {
  "Full-time": "blue",
  "Part-time": "purple",
  Contract: "yellow",
  Internship: "cyan",
};

const EMPTY_FORM = {
  title: "",
  company: "",
  location: "",
  salary: "",
  type: "Full-time",
  category: "Engineering",
  status: "Active",
  description: "",
};

// Turns "Posted 3 days ago"-style relative text into a fresh "Just now" for new/edited rows.
function formatPostedNow() {
  return "Just now";
}

const Jobs = () => {
  const [jobs, setJobs] = useState(jobsData);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [viewMode, setViewMode] = useState("table");

  // Modal state: null = closed, 'create' = new job, or the job object being edited
  const [modalMode, setModalMode] = useState(null); // 'create' | 'edit' | null
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null); // job pending delete confirmation
  const [errors, setErrors] = useState({});

  const statuses = ["All", "Active", "Closed", "Draft"];
  const types = ["All", "Full-time", "Part-time", "Contract"];

  const filtered = jobs.filter(
    (j) =>
      (statusFilter === "All" || j.status === statusFilter) &&
      (typeFilter === "All" || j.type === typeFilter) &&
      (j.title.toLowerCase().includes(search.toLowerCase()) ||
        j.company.toLowerCase().includes(search.toLowerCase())),
  );

  function openCreateModal() {
    setForm(EMPTY_FORM);
    setErrors({});
    setEditingId(null);
    setModalMode("create");
  }

  function openEditModal(job) {
    // Pre-fill every field from the selected job
    setForm({
      title: job.title,
      company: job.company,
      location: job.location,
      salary: job.salary,
      type: job.type,
      category: job.category,
      status: job.status,
      description: job.description || "",
    });
    setErrors({});
    setEditingId(job.id);
    setModalMode("edit");
  }

  function closeModal() {
    setModalMode(null);
    setForm(EMPTY_FORM);
    setEditingId(null);
    setErrors({});
  }

  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  function validate() {
    const nextErrors = {};
    if (!form.title.trim()) nextErrors.title = "Job title is required";
    if (!form.company.trim()) nextErrors.company = "Company is required";
    if (!form.location.trim()) nextErrors.location = "Location is required";
    if (!form.salary.trim()) nextErrors.salary = "Salary range is required";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function handleSubmit() {
    if (!validate()) return;

    if (modalMode === "create") {
      const newJob = {
        ...form,
        id: Date.now(), // auto-generated unique id
        applications: 0, // auto-generated starting value
        posted: formatPostedNow(), // auto-generated posted date label
      };
      setJobs((prev) => [newJob, ...prev]);
    } else if (modalMode === "edit") {
      // Update in place — reflected on the page immediately, no reload needed
      setJobs((prev) =>
        prev.map((j) => (j.id === editingId ? { ...j, ...form } : j)),
      );
    }
    closeModal();
  }

  function confirmDelete() {
    setJobs((prev) => prev.filter((j) => j.id !== deleteTarget.id));
    setDeleteTarget(null);
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Job Listings"
        subtitle={`${jobs.length} total jobs`}
        action={
          <Btn onClick={openCreateModal}>
            <Plus size={16} /> Post New Job
          </Btn>
        }
      />

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-[200px]">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search jobs or companies..."
              className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all"
            />
          </div>

          <div className="flex gap-2 flex-wrap">
            {statuses.map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-all ${statusFilter === s ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
              >
                {s}
              </button>
            ))}
          </div>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30"
          >
            {types.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>

          <div className="flex rounded-xl border border-slate-200 overflow-hidden ml-auto">
            {["table", "grid"].map((m) => (
              <button
                key={m}
                onClick={() => setViewMode(m)}
                className={`px-3 py-2 text-xs font-medium capitalize transition-colors ${viewMode === m ? "bg-blue-600 text-white" : "bg-white text-slate-600 hover:bg-slate-50"}`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Table view */}
      {viewMode === "table" ? (
        <Card>
          <Table
            headers={[
              "Job Title",
              "Company",
              "Location",
              "Type",
              "Salary",
              "Applications",
              "Status",
              "Posted",
              "Actions",
            ]}
          >
            {filtered.map((job) => (
              <tr
                key={job.id}
                className="hover:bg-slate-50/50 transition-colors"
              >
                <td className="px-5 py-3.5">
                  <div>
                    <p className="font-medium text-slate-800 text-sm">
                      {job.title}
                    </p>
                    <p className="text-xs text-slate-400">{job.category}</p>
                  </div>
                </td>
                <td className="px-5 py-3.5 text-sm text-slate-600">
                  {job.company}
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-1.5 text-sm text-slate-500">
                    <MapPin size={12} />
                    {job.location}
                  </div>
                </td>
                <td className="px-5 py-3.5">
                  <Badge color={typeColors[job.type] || "gray"}>
                    {job.type}
                  </Badge>
                </td>
                <td className="px-5 py-3.5 text-sm text-slate-600">
                  {job.salary}
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-1.5 text-sm text-slate-600">
                    <Users size={12} />
                    {job.applications}
                  </div>
                </td>
                <td className="px-5 py-3.5">
                  <StatusBadge status={job.status} />
                </td>
                <td className="px-5 py-3.5 text-sm text-slate-500">
                  {job.posted}
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex gap-2">
                    <Btn
                      size="sm"
                      variant="outline"
                      onClick={() => openEditModal(job)}
                    >
                      Edit
                    </Btn>
                    <Btn
                      size="sm"
                      variant="ghost"
                      onClick={() => setDeleteTarget(job)}
                    >
                      <Trash2 size={14} />
                    </Btn>
                  </div>
                </td>
              </tr>
            ))}
          </Table>
          {filtered.length === 0 && (
            <div className="text-center py-16 text-slate-400">
              <Briefcase size={32} className="mx-auto mb-3 opacity-30" />
              <p>No jobs found</p>
            </div>
          )}
        </Card>
      ) : (
        /* Grid view */
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((job) => (
            <Card
              key={job.id}
              className="p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                  <Briefcase size={18} className="text-blue-600" />
                </div>
                <StatusBadge status={job.status} />
              </div>
              <h3 className="font-semibold text-slate-800 mb-1">{job.title}</h3>
              <p className="text-sm text-slate-500 mb-3">{job.company}</p>
              <div className="space-y-1.5 text-xs text-slate-500 mb-4">
                <div className="flex items-center gap-1.5">
                  <MapPin size={11} /> {job.location}
                </div>
                <div className="flex items-center gap-1.5">
                  <DollarSign size={11} /> {job.salary}
                </div>
                <div className="flex items-center gap-1.5">
                  <Users size={11} /> {job.applications} applications
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar size={11} /> Posted {job.posted}
                </div>
              </div>
              <div className="flex gap-2">
                <Badge color={typeColors[job.type] || "gray"}>{job.type}</Badge>
                <Badge color="gray">{job.category}</Badge>
              </div>
              <div className="flex gap-2 mt-4">
                <Btn
                  size="sm"
                  variant="primary"
                  className="flex-1 justify-center"
                  onClick={() => openEditModal(job)}
                >
                  Edit
                </Btn>
                <Btn
                  size="sm"
                  variant="outline"
                  onClick={() => setDeleteTarget(job)}
                >
                  <Trash2 size={14} />
                </Btn>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Create / Edit Job Modal */}
      {modalMode && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-slate-800">
                {modalMode === "edit" ? "Edit Job" : "Post New Job"}
              </h2>
              <button
                onClick={closeModal}
                className="text-slate-400 hover:text-slate-600"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              {[
                {
                  field: "title",
                  label: "Job Title",
                  placeholder: "e.g. Senior React Developer",
                },
                {
                  field: "company",
                  label: "Company",
                  placeholder: "Company name",
                },
                {
                  field: "location",
                  label: "Location",
                  placeholder: "City, State or Remote",
                },
                {
                  field: "salary",
                  label: "Salary Range",
                  placeholder: "e.g. $80k–$100k",
                },
              ].map(({ field, label, placeholder }) => (
                <div key={field}>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    {label}
                  </label>
                  <input
                    type="text"
                    value={form[field]}
                    onChange={(e) => handleChange(field, e.target.value)}
                    placeholder={placeholder}
                    className={`w-full px-3 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 ${
                      errors[field] ? "border-red-300" : "border-slate-200"
                    }`}
                  />
                  {errors[field] && (
                    <p className="text-xs text-red-500 mt-1">{errors[field]}</p>
                  )}
                </div>
              ))}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Type
                  </label>
                  <select
                    value={form.type}
                    onChange={(e) => handleChange("type", e.target.value)}
                    className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                  >
                    <option>Full-time</option>
                    <option>Part-time</option>
                    <option>Contract</option>
                    <option>Internship</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Category
                  </label>
                  <select
                    value={form.category}
                    onChange={(e) => handleChange("category", e.target.value)}
                    className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                  >
                    <option>Engineering</option>
                    <option>Design</option>
                    <option>Marketing</option>
                    <option>Data</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Status
                </label>
                <select
                  value={form.status}
                  onChange={(e) => handleChange("status", e.target.value)}
                  className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                >
                  <option>Active</option>
                  <option>Closed</option>
                  <option>Draft</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  placeholder="Job description..."
                  className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 resize-none"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Btn className="flex-1 justify-center" onClick={handleSubmit}>
                {modalMode === "edit" ? "Update Job" : "Post Job"}
              </Btn>
              <Btn variant="outline" onClick={closeModal}>
                Cancel
              </Btn>
            </div>
          </Card>
        </div>
      )}

      {/* Delete confirmation */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-sm p-6">
            <h2 className="text-lg font-bold text-slate-800 mb-2">
              Delete job?
            </h2>
            <p className="text-sm text-slate-500 mb-6">
              This will permanently remove{" "}
              <span className="font-medium text-slate-700">
                {deleteTarget.title}
              </span>{" "}
              at {deleteTarget.company}. This action can't be undone.
            </p>
            <div className="flex gap-3">
              <Btn
                variant="danger"
                className="flex-1 justify-center"
                onClick={confirmDelete}
              >
                Delete
              </Btn>
              <Btn variant="outline" onClick={() => setDeleteTarget(null)}>
                Cancel
              </Btn>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Jobs;
