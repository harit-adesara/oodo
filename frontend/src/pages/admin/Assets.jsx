import { useEffect, useState } from "react";
import {
  adminCreateAsset,
  adminSearchAssets,
  adminUpdateAsset,
  adminDeleteAsset,
  getAllDepartments,
} from "../../api.js";
import {
  page,
  card,
  inputClass,
  label,
  buttonPrimary,
  buttonDanger,
  buttonGhost,
  errorBox,
  successBox,
  table,
  th,
  td,
} from "../../styles.js";

const CATEGORIES = ["electronics", "furniture", "vehicle", "other"];

const emptyForm = {
  assetTag: "",
  name: "",
  category: CATEGORIES[0],
  isShared: false,
  count: 1,
  department: "",
};

const AdminAssets = () => {
  const [departments, setDepartments] = useState([]);
  const [assets, setAssets] = useState([]);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);

  const [loadingList, setLoadingList] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadDepartments = async () => {
    try {
      const res = await getAllDepartments();
      const depts = res.data?.data || [];
      setDepartments(depts);
      setForm((prev) => ({
        ...prev,
        department: prev.department || depts[0]?._id || "",
      }));
    } catch {
      setError("Failed to load departments.");
    }
  };

  const loadAssets = async (name = "") => {
    setLoadingList(true);
    try {
      const res = await adminSearchAssets({ name });
      setAssets(res.data?.data || []);
    } catch (err) {
      setError(err.response?.data?.msg || "Failed to load assets.");
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    loadDepartments();
    loadAssets();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    loadAssets(search);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const resetForm = () => {
    setEditingId(null);
    setForm((prev) => ({ ...emptyForm, department: prev.department }));
  };

  const handleEdit = (asset) => {
    setEditingId(asset._id);
    setForm({
      assetTag: asset.assetTag || "",
      name: asset.name || "",
      category: asset.category || CATEGORIES[0],
      isShared: !!asset.isShared,
      count: asset.count,
      department: asset.department?._id || "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!form.assetTag || !form.name || !form.count || !form.department) {
      setError("Asset Tag, Name, Count and Department are required");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        assetTag: form.assetTag,
        name: form.name,
        category: form.category,
        isShared: form.isShared,
        count: Number(form.count),
        department: form.department,
      };

      const res = editingId
        ? await adminUpdateAsset(editingId, payload)
        : await adminCreateAsset(payload);

      setSuccess(
        res.data?.msg ||
          (editingId ? "Asset updated successfully" : "Asset created successfully"),
      );
      resetForm();
      loadAssets(search);
    } catch (err) {
      setError(err.response?.data?.msg || "Failed to save asset.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (assetId) => {
    setError("");
    setSuccess("");
    try {
      const res = await adminDeleteAsset(assetId);
      setSuccess(res.data?.msg || "Asset deleted");
      if (editingId === assetId) resetForm();
      loadAssets(search);
    } catch (err) {
      setError(err.response?.data?.msg || "Failed to delete asset.");
    }
  };

  return (
    <div className={page}>
      <h1 className="text-2xl font-semibold tracking-tight">Assets</h1>
      <p className="text-[#6b6b7a] text-sm mt-1.5">
        Register assets and assign them to departments
      </p>

      <div className="grid lg:grid-cols-[380px_1fr] gap-6 mt-8">
        <div className={card}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-semibold">
              {editingId ? "Edit asset" : "Add asset"}
            </h2>
            {editingId && (
              <button onClick={resetForm} className={buttonGhost}>
                Cancel
              </button>
            )}
          </div>

          {error && <div className={`${errorBox} mb-4`}>{error}</div>}
          {success && <div className={`${successBox} mb-4`}>{success}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className={label}>Asset Tag</label>
              <input
                name="assetTag"
                value={form.assetTag}
                onChange={handleChange}
                className={inputClass}
                placeholder="AST-0001"
              />
            </div>
            <div>
              <label className={label}>Name</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                className={inputClass}
                placeholder="Dell Laptop"
              />
            </div>
            <div>
              <label className={label}>Category</label>
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
            </div>
            <div>
              <label className={label}>Count</label>
              <input
                type="number"
                min="0"
                name="count"
                value={form.count}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
            <div>
              <label className={label}>Department</label>
              <select
                name="department"
                value={form.department}
                onChange={handleChange}
                className={inputClass}
              >
                {departments.length === 0 && (
                  <option value="">No departments yet</option>
                )}
                {departments.map((d) => (
                  <option key={d._id} value={d._id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>
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
              disabled={submitting || departments.length === 0}
              className={`${buttonPrimary} w-full`}
            >
              {submitting
                ? "Saving…"
                : editingId
                  ? "Save changes"
                  : "Create asset"}
            </button>
          </form>
        </div>

        <div className={card}>
          <div className="flex items-center justify-between gap-4 mb-4">
            <h2 className="text-white font-semibold">All assets</h2>
            <form onSubmit={handleSearch} className="flex gap-2">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name…"
                className={`${inputClass} !py-2 !w-56`}
              />
              <button type="submit" className={buttonPrimary}>
                Search
              </button>
            </form>
          </div>

          {loadingList ? (
            <p className="text-[#6b6b7a] text-sm">Loading…</p>
          ) : assets.length === 0 ? (
            <p className="text-[#6b6b7a] text-sm">No assets found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className={table}>
                <thead>
                  <tr>
                    <th className={th}>Tag</th>
                    <th className={th}>Name</th>
                    <th className={th}>Category</th>
                    <th className={th}>Count</th>
                    <th className={th}>Department</th>
                    <th className={th}>Shared</th>
                    <th className={th}></th>
                  </tr>
                </thead>
                <tbody>
                  {assets.map((a) => (
                    <tr key={a._id}>
                      <td className={td}>{a.assetTag}</td>
                      <td className={td}>{a.name}</td>
                      <td className={td}>{a.category}</td>
                      <td className={td}>{a.count}</td>
                      <td className={td}>{a.department?.name || "—"}</td>
                      <td className={td}>{a.isShared ? "Yes" : "No"}</td>
                      <td className={td}>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(a)}
                            className={buttonGhost}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(a._id)}
                            className={buttonDanger}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminAssets;
