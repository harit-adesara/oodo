import { useEffect, useState } from "react";
import {
  adminCreateDepartment,
  adminDeleteDepartment,
  adminSearchDepartments,
} from "../../api.js";
import {
  page,
  card,
  inputClass,
  label,
  buttonPrimary,
  buttonDanger,
  errorBox,
  successBox,
  table,
  th,
  td,
} from "../../styles.js";

const AdminDepartments = () => {
  const [departments, setDepartments] = useState([]);
  const [search, setSearch] = useState("");
  const [name, setName] = useState("");

  const [loadingList, setLoadingList] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadDepartments = async (q = "") => {
    setLoadingList(true);
    try {
      const res = await adminSearchDepartments(q);
      setDepartments(res.data?.data || []);
    } catch (err) {
      setError(err.response?.data?.msg || "Failed to load departments.");
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    loadDepartments();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    loadDepartments(search);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!name.trim()) {
      setError("Department name is required");
      return;
    }

    setSubmitting(true);
    try {
      const res = await adminCreateDepartment(name.trim());
      setSuccess(res.data?.msg || "Department created successfully");
      setName("");
      loadDepartments(search);
    } catch (err) {
      setError(err.response?.data?.msg || "Failed to create department.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeactivate = async (departmentId) => {
    setError("");
    setSuccess("");
    try {
      const res = await adminDeleteDepartment(departmentId);
      setSuccess(res.data?.msg || "Department deactivated");
      loadDepartments(search);
    } catch (err) {
      setError(
        err.response?.data?.msg || "Failed to deactivate department.",
      );
    }
  };

  return (
    <div className={page}>
      <h1 className="text-2xl font-semibold tracking-tight">Departments</h1>
      <p className="text-[#6b6b7a] text-sm mt-1.5">
        Create and manage departments
      </p>

      <div className="grid lg:grid-cols-[380px_1fr] gap-6 mt-8">
        <div className={card}>
          <h2 className="text-white font-semibold mb-4">Add department</h2>

          {error && <div className={`${errorBox} mb-4`}>{error}</div>}
          {success && <div className={`${successBox} mb-4`}>{success}</div>}

          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className={label}>Name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={inputClass}
                placeholder="Engineering"
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className={`${buttonPrimary} w-full`}
            >
              {submitting ? "Creating…" : "Create department"}
            </button>
          </form>
        </div>

        <div className={card}>
          <div className="flex items-center justify-between gap-4 mb-4">
            <h2 className="text-white font-semibold">Active departments</h2>
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
          ) : departments.length === 0 ? (
            <p className="text-[#6b6b7a] text-sm">No departments found.</p>
          ) : (
            <table className={table}>
              <thead>
                <tr>
                  <th className={th}>Name</th>
                  <th className={th}>Created</th>
                  <th className={th}></th>
                </tr>
              </thead>
              <tbody>
                {departments.map((d) => (
                  <tr key={d._id}>
                    <td className={td}>{d.name}</td>
                    <td className={td}>
                      {new Date(d.createdAt).toLocaleDateString()}
                    </td>
                    <td className={td}>
                      <button
                        onClick={() => handleDeactivate(d._id)}
                        className={buttonDanger}
                      >
                        Deactivate
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDepartments;
