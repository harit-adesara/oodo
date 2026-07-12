import React, { useEffect, useState } from "react";
import axiosInstance from "../axios.js";

const CATEGORIES = ["electronics", "furniture", "vehicle", "other"];

const CreateAsset = () => {
  const [departments, setDepartments] = useState([]);
  const [departmentsLoading, setDepartmentsLoading] = useState(true);

  const [form, setForm] = useState({
    assetTag: "",
    name: "",
    category: CATEGORIES[0],
    isShared: false,
    count: 1,
    department: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Load the list of active departments so the user can only ever pick a
  // department that actually exists - this is what keeps the backend's
  // "Department not found" error from being hit in normal use.
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await axiosInstance.get(
          "https://oodo.onrender.com/oodo/departments",
          { withCredentials: true },
        );
        const depts = res.data?.data || [];
        setDepartments(depts);
        if (depts.length > 0) {
          setForm((prev) => ({ ...prev, department: depts[0]._id }));
        }
      } catch (err) {
        setError("Failed to load departments. Try refreshing the page.");
      } finally {
        setDepartmentsLoading(false);
      }
    };

    fetchDepartments();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!form.assetTag || !form.name || !form.count || !form.department) {
      setError("Asset Tag, Name, Count and Department are required");
      return;
    }

    setLoading(true);

    try {
      const res = await axiosInstance.post(
        "https://oodo.onrender.com/oodo/assets",
        {
          assetTag: form.assetTag,
          name: form.name,
          category: form.category,
          isShared: form.isShared,
          count: Number(form.count),
          department: form.department,
        },
        { withCredentials: true },
      );

      setSuccess(res.data?.message || "Asset created successfully");
      setForm((prev) => ({
        ...prev,
        assetTag: "",
        name: "",
        count: 1,
        isShared: false,
      }));
    } catch (err) {
      // If the department id somehow doesn't exist anymore (e.g. it was
      // deactivated between page load and submit), the backend now returns
      // a clear "Department not found" message instead of silently
      // creating the asset against a bad reference.
      const message =
        err.response?.data?.message || "Failed to create asset. Try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-4 font-sans py-10">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-150 h-100 rounded-full bg-violet-900/20 blur-[120px]" />
        <div className="absolute bottom-1/4 left-1/3 w-75 h-75 rounded-full bg-indigo-900/15 blur-[100px]" />
      </div>

      <div className="relative w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <h1 className="text-white text-2xl font-semibold tracking-tight">
            Create Asset
          </h1>
          <p className="text-[#6b6b7a] text-sm mt-1.5">
            Register a new asset and assign it to a department
          </p>
        </div>

        <div className="bg-[#13131a] border border-[#1e1e2a] rounded-2xl p-8 shadow-2xl shadow-black/60">
          <div className="space-y-5">
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs p-2 rounded-lg">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs p-2 rounded-lg">
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              <Field label="Asset Tag">
                <input
                  type="text"
                  name="assetTag"
                  value={form.assetTag}
                  onChange={handleChange}
                  placeholder="AST-0001"
                  className={inputClass}
                />
              </Field>

              <Field label="Name">
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Dell Laptop"
                  className={inputClass}
                />
              </Field>

              <Field label="Category">
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className={inputClass}
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Count">
                <input
                  type="number"
                  min="1"
                  name="count"
                  value={form.count}
                  onChange={handleChange}
                  className={inputClass}
                />
              </Field>

              <Field label="Department">
                {departmentsLoading ? (
                  <p className="text-[#6b6b7a] text-sm">Loading departments…</p>
                ) : departments.length === 0 ? (
                  <p className="text-red-400 text-sm">
                    No active departments found. Create one first.
                  </p>
                ) : (
                  <select
                    name="department"
                    value={form.department}
                    onChange={handleChange}
                    className={inputClass}
                  >
                    {departments.map((d) => (
                      <option key={d._id} value={d._id}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                )}
              </Field>

              <label className="flex items-center gap-2 text-[#9191a1] text-sm">
                <input
                  type="checkbox"
                  name="isShared"
                  checked={form.isShared}
                  onChange={handleChange}
                  className="accent-violet-600 w-4 h-4"
                />
                Shared asset
              </label>

              <button
                type="submit"
                disabled={loading || departments.length === 0}
                className="w-full mt-2 py-3 rounded-xl text-sm font-semibold transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed
                  bg-linear-to-r from-violet-600 to-indigo-600 text-white
                  hover:from-violet-500 hover:to-indigo-500
                  active:scale-[0.98] shadow-lg shadow-violet-900/40"
              >
                {loading ? "Creating…" : "Create asset"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

const inputClass =
  "w-full bg-[#0d0d14] text-white text-sm px-4 py-3 rounded-xl outline-none placeholder-[#35353f] shadow-[0_0_0_1px_rgba(255,255,255,0.06)] focus:shadow-[0_0_0_1.5px_rgba(139,92,246,0.7)] transition-all duration-200";

const Field = ({ label, children }) => (
  <div>
    <label className="block text-[#9191a1] text-xs font-medium mb-2 tracking-wide uppercase">
      {label}
    </label>
    {children}
  </div>
);

export default CreateAsset;
