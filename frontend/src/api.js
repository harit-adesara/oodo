import axiosInstance from "./axios.js";

// Single source of truth for the backend origin. Change this once if the
// API ever moves off localhost:3000.
export const API_BASE = "https://oodo.onrender.com/oodo";

const withCreds = { withCredentials: true };

// ---------------------------------------------------------------------
// Auth
// ---------------------------------------------------------------------
export const loginRequest = (email, password) =>
  axiosInstance.post(`${API_BASE}/login`, { email, password }, withCreds);

export const logoutRequest = () =>
  axiosInstance.post(`${API_BASE}/logout`, {}, withCreds);

export const getMe = () => axiosInstance.get(`${API_BASE}/me`, withCreds);

export const forgotPasswordRequest = (email) =>
  axiosInstance.post(`${API_BASE}/forgot-password`, { email }, withCreds);

export const resetPasswordRequest = (resetToken, newPassword) =>
  axiosInstance.post(`${API_BASE}/reset-password/${resetToken}`, {
    newPassword,
  });

export const changePasswordRequest = (oldPassword, newPassword) =>
  axiosInstance.post(
    `${API_BASE}/change-password`,
    { oldPassword, newPassword },
    withCreds,
  );

// ---------------------------------------------------------------------
// Admin - users
// ---------------------------------------------------------------------
export const adminCreateUser = (payload) =>
  axiosInstance.post(`${API_BASE}/users`, payload, withCreds);

export const adminDeleteEmployee = (userId) =>
  axiosInstance.delete(`${API_BASE}/users/${userId}`, withCreds);

export const adminSearchEmployees = (email = "") =>
  axiosInstance.get(`${API_BASE}/users/search`, {
    ...withCreds,
    params: { email },
  });

// ---------------------------------------------------------------------
// Admin - departments
// ---------------------------------------------------------------------
export const adminCreateDepartment = (name) =>
  axiosInstance.post(`${API_BASE}/departments`, { name }, withCreds);

export const getAllDepartments = () =>
  axiosInstance.get(`${API_BASE}/departments`, withCreds);

export const adminSearchDepartments = (name = "") =>
  axiosInstance.get(`${API_BASE}/departments/search`, {
    ...withCreds,
    params: { name },
  });

export const adminDeleteDepartment = (departmentId) =>
  axiosInstance.delete(`${API_BASE}/departments/${departmentId}`, withCreds);

// ---------------------------------------------------------------------
// Admin - assets
// ---------------------------------------------------------------------
export const adminCreateAsset = (payload) =>
  axiosInstance.post(`${API_BASE}/assets`, payload, withCreds);

<<<<<<< HEAD
=======
export const adminSearchAssets = (params = {}) =>
  axiosInstance.get(`${API_BASE}/assets/search`, { ...withCreds, params });

>>>>>>> mahi
export const adminUpdateAsset = (assetId, payload) =>
  axiosInstance.put(`${API_BASE}/assets/${assetId}`, payload, withCreds);

export const adminDeleteAsset = (assetId) =>
  axiosInstance.delete(`${API_BASE}/assets/${assetId}`, withCreds);

// ---------------------------------------------------------------------
// Asset manager
// Note: these live on the same router as everything else, mounted at the
// router's own root ("/" == `${API_BASE}/`), not under a distinct
// "/asset-manager" prefix - that's how routes.js wires them.
// ---------------------------------------------------------------------
export const managerRegisterAsset = (payload) =>
  axiosInstance.post(`${API_BASE}/`, payload, withCreds);

export const managerGetAllAssets = (params = {}) =>
  axiosInstance.get(`${API_BASE}/`, { ...withCreds, params });

export const managerUpdateAsset = (assetId, payload) =>
  axiosInstance.patch(`${API_BASE}/${assetId}`, payload, withCreds);

export const managerDeleteAsset = (assetId) =>
  axiosInstance.delete(`${API_BASE}/${assetId}`, withCreds);

export const managerGetAllocationRequests = () =>
  axiosInstance.get(`${API_BASE}/allocation`, withCreds);

export const managerApproveAllocation = (id) =>
  axiosInstance.patch(`${API_BASE}/allocation/${id}/approve`, {}, withCreds);

export const managerRejectAllocation = (id) =>
  axiosInstance.patch(`${API_BASE}/allocation/${id}/reject`, {}, withCreds);

export const managerGetMaintenanceRequests = () =>
  axiosInstance.get(`${API_BASE}/maintenance`, withCreds);

export const managerApproveMaintenance = (id) =>
  axiosInstance.patch(`${API_BASE}/maintenance/${id}/approve`, {}, withCreds);

export const managerRejectMaintenance = (id) =>
  axiosInstance.patch(`${API_BASE}/maintenance/${id}/reject`, {}, withCreds);

// ---------------------------------------------------------------------
// Department head
// ---------------------------------------------------------------------
export const deptHeadGetAssets = () =>
  axiosInstance.get(`${API_BASE}/assets`, withCreds);

export const deptHeadGetAllocations = () =>
  axiosInstance.get(`${API_BASE}/allocations`, withCreds);

// ---------------------------------------------------------------------
// Employee
// ---------------------------------------------------------------------
export const employeeRequestAllocation = (assetId) =>
  axiosInstance.post(`${API_BASE}/allocation/request`, { assetId }, withCreds);

export const employeeRequestMaintenance = (assetId, issue) =>
  axiosInstance.post(
    `${API_BASE}/maintenance/request`,
    { assetId, issue },
    withCreds,
  );

export const employeeGetDepartmentAssets = () =>
  axiosInstance.get(`${API_BASE}/department/assets`, withCreds);

export const employeeGetMyAllocations = () =>
  axiosInstance.get(`${API_BASE}/allocation/my`, withCreds);

export const employeeGetMyMaintenance = () =>
  axiosInstance.get(`${API_BASE}/maintenance/my`, withCreds);
