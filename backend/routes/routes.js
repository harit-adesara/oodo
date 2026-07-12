import { Router } from "express";

const router = Router();

import {
  loginJWT,
  logOut,
  getCurrentUser,
  refreshAccessToken,
  forgotPasswordRequest,
  resetForgetPassword,
  changePassword,
} from "../controllers/auth.js";

import { verifyJWT } from "../middleware/verifyJWT.js";

// auth routes

router.route("/login").post(loginJWT); // done

router.route("/forgot-password").post(forgotPasswordRequest); // done

router.route("/reset-password/:resetToken").post(resetForgetPassword); // done

router.route("/refresh-token").post(refreshAccessToken); // done

router.route("/me").get(verifyJWT, getCurrentUser); //done

router.route("/logout").post(verifyJWT, logOut); //done

router.route("/change-password").post(verifyJWT, changePassword); // done

// admin

import {
  createUser,
  createDepartment,
  deleteEmployee,
  deleteDepartment,
  searchEmployee,
  searchDepartment,
  createAsset,
  updateAsset,
  deleteAsset,
  getAllDepartments,
} from "../controllers/admin.js";

router.post("/users", verifyJWT, createUser);

router.delete("/users/:userId", verifyJWT, deleteEmployee);

router.get("/users/search", verifyJWT, searchEmployee);

router.post("/departments", verifyJWT, createDepartment);

router.get("/departments", verifyJWT, getAllDepartments);

router.get("/departments/search", verifyJWT, searchDepartment);

router.delete("/departments/:departmentId", verifyJWT, deleteDepartment);

router.post("/assets", verifyJWT, createAsset);

router.put("/assets/:assetId", verifyJWT, updateAsset);

router.delete("/assets/:assetId", verifyJWT, deleteAsset);

// employee

router.post("/allocation/request", verifyJWT, requestAllocation);

router.post("/maintenance/request", verifyJWT, requestMaintenance);

router.get("/department/assets", verifyJWT, getDepartmentAssets);

router.get("/allocation/my", verifyJWT, myAllocationRequests);

router.get("/maintenance/my", verifyJWT, myMaintenanceRequests);

import {
  getAllDepartments,
  getDepartmentAllocations,
} from "../controllers/admin.js";
import { verify } from "crypto";

router.get("/assets", verifyJWT, getDepartmentAssets);

router.get("/allocations", verifyJWT, getDepartmentAllocations);

export { router };
