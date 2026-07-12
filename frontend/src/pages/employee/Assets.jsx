import { useEffect, useState, Fragment } from "react";
import {
  employeeGetDepartmentAssets,
  employeeRequestAllocation,
  employeeRequestMaintenance,
} from "../../api.js";
import {
  page,
  card,
  inputClass,
  buttonPrimary,
  buttonGhost,
  errorBox,
  successBox,
  table,
  th,
  td,
} from "../../styles.js";

const EmployeeAssets = () => {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actingId, setActingId] = useState(null);
  const [issueDrafts, setIssueDrafts] = useState({});
  const [maintenanceAssetId, setMaintenanceAssetId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const res = await employeeGetDepartmentAssets();
      setAssets(res.data?.data?.assets || []);
    } catch (err) {
      setError(err.response?.data?.msg || "Failed to load assets.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleRequestAllocation = async (assetId) => {
    setError("");
    setSuccess("");
    setActingId(assetId);
    try {
      const res = await employeeRequestAllocation(assetId);
      setSuccess(res.data?.msg || "Allocation request sent");
    } catch (err) {
      setError(err.response?.data?.msg || "Failed to request allocation.");
    } finally {
      setActingId(null);
    }
  };

  const handleRequestMaintenance = async (assetId) => {
    const issue = (issueDrafts[assetId] || "").trim();
    if (!issue) {
      setError("Describe the issue before submitting a maintenance request");
      return;
    }

    setError("");
    setSuccess("");
    setActingId(assetId);
    try {
      const res = await employeeRequestMaintenance(assetId, issue);
      setSuccess(res.data?.msg || "Maintenance request submitted");
      setIssueDrafts((prev) => ({ ...prev, [assetId]: "" }));
      setMaintenanceAssetId(null);
    } catch (err) {
      setError(err.response?.data?.msg || "Failed to request maintenance.");
    } finally {
      setActingId(null);
    }
  };

  return (
    <div className={page}>
      <h1 className="text-2xl font-semibold tracking-tight">
        Department assets
      </h1>
      <p className="text-[#6b6b7a] text-sm mt-1.5">
        Browse assets in your department and request allocation or
        maintenance
      </p>

      <div className={`${card} mt-8`}>
        {error && <div className={`${errorBox} mb-4`}>{error}</div>}
        {success && <div className={`${successBox} mb-4`}>{success}</div>}

        {loading ? (
          <p className="text-[#6b6b7a] text-sm">Loading…</p>
        ) : assets.length === 0 ? (
          <p className="text-[#6b6b7a] text-sm">
            No assets in your department yet.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className={table}>
              <thead>
                <tr>
                  <th className={th}>Tag</th>
                  <th className={th}>Name</th>
                  <th className={th}>Category</th>
                  <th className={th}>Available</th>
                  <th className={th}></th>
                </tr>
              </thead>
              <tbody>
                {assets.map((a) => (
                  <Fragment key={a._id}>
                    <tr>
                      <td className={td}>{a.assetTag}</td>
                      <td className={td}>{a.name}</td>
                      <td className={td}>{a.category}</td>
                      <td className={td}>{a.count}</td>
                      <td className={td}>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleRequestAllocation(a._id)}
                            disabled={actingId === a._id || a.count < 1}
                            className={buttonPrimary}
                          >
                            Request allocation
                          </button>
                          <button
                            onClick={() =>
                              setMaintenanceAssetId((prev) =>
                                prev === a._id ? null : a._id,
                              )
                            }
                            className={buttonGhost}
                          >
                            {maintenanceAssetId === a._id
                              ? "Cancel"
                              : "Report issue"}
                          </button>
                        </div>
                      </td>
                    </tr>
                    {maintenanceAssetId === a._id && (
                      <tr key={`${a._id}-maintenance`}>
                        <td className={td} colSpan={5}>
                          <div className="flex gap-2 items-start">
                            <input
                              value={issueDrafts[a._id] || ""}
                              onChange={(e) =>
                                setIssueDrafts((prev) => ({
                                  ...prev,
                                  [a._id]: e.target.value,
                                }))
                              }
                              placeholder="Describe the issue…"
                              className={`${inputClass} !py-2`}
                            />
                            <button
                              onClick={() => handleRequestMaintenance(a._id)}
                              disabled={actingId === a._id}
                              className={buttonPrimary}
                            >
                              Submit
                            </button>
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeAssets;
