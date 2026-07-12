import { useEffect, useState } from "react";
import { employeeGetMyMaintenance } from "../../api.js";
import { page, card, errorBox, table, th, td } from "../../styles.js";

const STATUS_BADGE = {
  approved:
    "inline-block px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/30",
  pending:
    "inline-block px-2.5 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/30",
  rejected:
    "inline-block px-2.5 py-1 rounded-full text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/30",
};



const EmployeeMaintenance = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await employeeGetMyMaintenance();
        setRequests(res.data?.data || []);
      } catch (err) {
        setError(err.response?.data?.msg || "Failed to load requests.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className={page}>
      <h1 className="text-2xl font-semibold tracking-tight">
        My maintenance requests
      </h1>
      <p className="text-[#6b6b7a] text-sm mt-1.5">
        Issues you've reported and their current status
      </p>

      <div className={`${card} mt-8`}>
        {error && <div className={`${errorBox} mb-4`}>{error}</div>}

        {loading ? (
          <p className="text-[#6b6b7a] text-sm">Loading…</p>
        ) : requests.length === 0 ? (
          <p className="text-[#6b6b7a] text-sm">
            You haven't reported any issues yet. Head to Department assets to
            report one.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className={table}>
              <thead>
                <tr>
                  <th className={th}>Asset</th>
                  <th className={th}>Tag</th>
                  <th className={th}>Issue</th>
                  <th className={th}>Status</th>
                  <th className={th}>Reported</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((req) => (
                  <tr key={req._id}>
                    <td className={td}>{req.asset?.name}</td>
                    <td className={td}>{req.asset?.assetTag}</td>
                    <td className={td}>{req.issue}</td>
                    <td className={td}>
                      <span className={STATUS_BADGE[req.status]}>
                        {req.status}
                      </span>
                    </td>
                    <td className={td}>
                      {new Date(req.createdAt).toLocaleDateString()}
                    </td>
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

export default EmployeeMaintenance;
