import { useEffect, useState } from "react";
import {
  managerGetMaintenanceRequests,
  managerApproveMaintenance,
  managerRejectMaintenance,
} from "../../api.js";
import {
  page,
  card,
  buttonPrimary,
  buttonDanger,
  errorBox,
  successBox,
  table,
  th,
  td,
} from "../../styles.js";

const ManagerMaintenance = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actingId, setActingId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const res = await managerGetMaintenanceRequests();
      setRequests(res.data?.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load requests.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleApprove = async (id) => {
    setError("");
    setSuccess("");
    setActingId(id);
    try {
      const res = await managerApproveMaintenance(id);
      setSuccess(res.data?.message || "Maintenance request approved");
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to approve request.");
    } finally {
      setActingId(null);
    }
  };

  const handleReject = async (id) => {
    setError("");
    setSuccess("");
    setActingId(id);
    try {
      const res = await managerRejectMaintenance(id);
      setSuccess(res.data?.message || "Maintenance request rejected");
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reject request.");
    } finally {
      setActingId(null);
    }
  };

  return (
    <div className={page}>
      <h1 className="text-2xl font-semibold tracking-tight">
        Maintenance requests
      </h1>
      <p className="text-[#6b6b7a] text-sm mt-1.5">
        Pending asset maintenance requests from employees
      </p>

      <div className={`${card} mt-8`}>
        {error && <div className={`${errorBox} mb-4`}>{error}</div>}
        {success && <div className={`${successBox} mb-4`}>{success}</div>}

        {loading ? (
          <p className="text-[#6b6b7a] text-sm">Loading…</p>
        ) : requests.length === 0 ? (
          <p className="text-[#6b6b7a] text-sm">No pending requests.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className={table}>
              <thead>
                <tr>
                  <th className={th}>Requested by</th>
                  <th className={th}>Asset</th>
                  <th className={th}>Tag</th>
                  <th className={th}>Issue</th>
                  <th className={th}>Requested</th>
                  <th className={th}></th>
                </tr>
              </thead>
              <tbody>
                {requests.map((req) => (
                  <tr key={req._id}>
                    <td className={td}>
                      {req.requestedBy?.name}
                      <div className="text-xs text-[#6b6b7a]">
                        {req.requestedBy?.email}
                      </div>
                    </td>
                    <td className={td}>{req.asset?.name}</td>
                    <td className={td}>{req.asset?.assetTag}</td>
                    <td className={td}>{req.issue}</td>
                    <td className={td}>
                      {new Date(req.createdAt).toLocaleDateString()}
                    </td>
                    <td className={td}>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleApprove(req._id)}
                          disabled={actingId === req._id}
                          className={buttonPrimary}
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(req._id)}
                          disabled={actingId === req._id}
                          className={buttonDanger}
                        >
                          Reject
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
  );
};

export default ManagerMaintenance;
