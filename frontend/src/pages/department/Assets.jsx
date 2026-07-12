import { useEffect, useState } from "react";
import { deptHeadGetAssets } from "../../api.js";
import { page, card, errorBox, table, th, td } from "../../styles.js";

const DeptAssets = () => {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await deptHeadGetAssets();
        setAssets(res.data?.data || []);
      } catch (err) {
        setError(err.response?.data?.msg || "Failed to load assets.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className={page}>
      <h1 className="text-2xl font-semibold tracking-tight">
        Department assets
      </h1>
      <p className="text-[#6b6b7a] text-sm mt-1.5">
        Assets currently assigned to your department
      </p>

      <div className={`${card} mt-8`}>
        {error && <div className={`${errorBox} mb-4`}>{error}</div>}

        {loading ? (
          <p className="text-[#6b6b7a] text-sm">Loading…</p>
        ) : assets.length === 0 ? (
          <p className="text-[#6b6b7a] text-sm">
            No assets assigned to your department yet.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className={table}>
              <thead>
                <tr>
                  <th className={th}>Tag</th>
                  <th className={th}>Name</th>
                  <th className={th}>Category</th>
                  <th className={th}>Count</th>
                  <th className={th}>Shared</th>
                  <th className={th}>Created by</th>
                </tr>
              </thead>
              <tbody>
                {assets.map((a) => (
                  <tr key={a._id}>
                    <td className={td}>{a.assetTag}</td>
                    <td className={td}>{a.name}</td>
                    <td className={td}>{a.category}</td>
                    <td className={td}>{a.count}</td>
                    <td className={td}>{a.isShared ? "Yes" : "No"}</td>
                    <td className={td}>{a.createdBy?.name || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeptAssets;
