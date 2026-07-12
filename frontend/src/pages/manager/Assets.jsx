import { useEffect, useState } from "react";
import {
  managerGetAllAssets,
} from "../../api.js";
import {
  page,
  card,
  inputClass,
  buttonPrimary,
  errorBox,
  table,
  th,
  td,
} from "../../styles.js";

const CATEGORIES = ["electronics", "furniture", "vehicle", "other"];

const ManagerAssets = () => {
  const [assets, setAssets] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [loadingList, setLoadingList] = useState(true);
  const [error, setError] = useState("");

  const loadAssets = async (category = "") => {
    setLoadingList(true);
    try {
      const res = await managerGetAllAssets(category ? { category } : {});
      setAssets(res.data?.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load assets.");
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    loadAssets();
  }, []);

  const handleFilter = (e) => {
    e.preventDefault();
    loadAssets(categoryFilter);
  };

  return (
    <div className={page}>
      <h1 className="text-2xl font-semibold tracking-tight">Assets</h1>
      <p className="text-[#6b6b7a] text-sm mt-1.5">
        View and filter assets across all departments
      </p>

      {error && <div className={`${errorBox} mb-4 mt-4`}>{error}</div>}

      <div className="mt-8">
        <div className={card}>
          <div className="flex items-center justify-between gap-4 mb-4">
            <h2 className="text-white font-semibold">All assets</h2>
            <form onSubmit={handleFilter} className="flex gap-2">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className={`${inputClass} !py-2 !w-44`}
              >
                <option value="">All categories</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <button type="submit" className={buttonPrimary}>
                Filter
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

export default ManagerAssets;
