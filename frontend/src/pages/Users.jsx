import { useEffect, useState } from "react";
import {
  adminCreateUser,
  adminDeleteEmployee,
  adminSearchEmployees,
  getAllDepartments,
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

const ROLES = ["asset manager", "department head", "employee"];

const emptyForm = {
  name: "",
  username: "",
  email: "",
  department: "",
  role: ROLES[0],
};

const AdminUsers = () => {
  const [departments, setDepartments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [searchEmail, setSearchEmail] = useState("");
  const [form, setForm] = useState(emptyForm);

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
    } catch (err) {
      setError("Failed to load departments.");
    }
  };

  const loadEmployees = async (email = "") => {
    setLoadingList(true);
    try {
      const res = await adminSearchEmployees(email);
      setEmployees(res.data?.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load employees.");
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    loadDepartments();
    loadEmployees();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    loadEmployees(searchEmail);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!form.name || !form.username || !form.email || !form.department) {
      setError("All fields are required");
      return;
    }

    setSubmitting(true);
    try {
      const res = await adminCreateUser(form);
      setSuccess(res.data?.message || "Employee created successfully");
      setForm((prev) => ({ ...emptyForm, department: prev.department }));
      loadEmployees(searchEmail);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create employee.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (userId) => {
    setError("");
    setSuccess("");
    try {
      const res = await adminDeleteEmployee(userId);
      setSuccess(res.data?.message || "Employee deleted");
      loadEmployees(searchEmail);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete employee.");
    }
  };

  return (
    <div className={page}>
      <h1 className="text-2xl font-semibold tracking-tight">Employees</h1>
      <p className="text-[#6b6b7a] text-sm mt-1.5">
        Create employee accounts and manage existing ones
      </p>

      <div className="grid lg:grid-cols-[380px_1fr] gap-6 mt-8">
        {/* Create form */}
        <div className={card}>
          <h2 className="text-white font-semibold mb-4">Add employee</h2>

          {error && <div className={`${errorBox} mb-4`}>{error}</div>}
          {success && <div className={`${successBox} mb-4`}>{success}</div>}

          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className={label}>Name</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                className={inputClass}
                placeholder="Jane Doe"
              />
            </div>
            <div>
              <label className={label}>Username</label>
              <input
                name="username"
                value={form.username}
                onChange={handleChange}
                className={inputClass}
                placeholder="jdoe"
              />
            </div>
            <div>
              <label className={label}>Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className={inputClass}
                placeholder="jane@company.com"
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
            <div>
              <label className={label}>Role</label>
              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                className={inputClass}
              >
                {ROLES.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>
            <button
              type="submit"
              disabled={submitting || departments.length === 0}
              className={`${buttonPrimary} w-full`}
            >
              {submitting ? "Creating…" : "Create employee"}
            </button>
          </form>
        </div>

        {/* List */}
        <div className={card}>
          <div className="flex items-center justify-between gap-4 mb-4">
            <h2 className="text-white font-semibold">All employees</h2>
            <form onSubmit={handleSearch} className="flex gap-2">
              <input
                value={searchEmail}
                onChange={(e) => setSearchEmail(e.target.value)}
                placeholder="Search by email…"
                className={`${inputClass} !py-2 !w-56`}
              />
              <button type="submit" className={buttonPrimary}>
                Search
              </button>
            </form>
          </div>

          {loadingList ? (
            <p className="text-[#6b6b7a] text-sm">Loading…</p>
          ) : employees.length === 0 ? (
            <p className="text-[#6b6b7a] text-sm">No employees found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className={table}>
                <thead>
                  <tr>
                    <th className={th}>Name</th>
                    <th className={th}>Email</th>
                    <th className={th}>Department</th>
                    <th className={th}>Role</th>
                    <th className={th}></th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map((emp) => (
                    <tr key={emp._id}>
                      <td className={td}>{emp.name}</td>
                      <td className={td}>{emp.email}</td>
                      <td className={td}>{emp.department?.name || "—"}</td>
                      <td className={td}>{emp.role}</td>
                      <td className={td}>
                        <button
                          onClick={() => handleDelete(emp._id)}
                          className={buttonDanger}
                        >
                          Delete
                        </button>
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

export default AdminUsers;
