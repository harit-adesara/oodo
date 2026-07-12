// import { Router } from "express";

// const router = Router();

// import {
//   loginJWT,
//   logOut,
//   getCurrentUser,
//   refreshAccessToken,
//   forgotPasswordRequest,
//   resetForgetPassword,
//   changePassword,
// } from "../controllers/auth.js";

// import { verifyJWT } from "../middleware/verifyJWT.js";

// // auth routes

// router.route("/login").post(loginJWT); // done

// router.route("/forgot-password").post(forgotPasswordRequest); // done

// router.route("/reset-password/:resetToken").post(resetForgetPassword); // done

// router.route("/refresh-token").post(refreshAccessToken); // done

// router.route("/me").get(verifyJWT, getCurrentUser); //done

// router.route("/logout").post(verifyJWT, logOut); //done

// router.route("/change-password").post(verifyJWT, changePassword); // done

// // admin

// import {
//   createUser,
//   createDepartment,
//   deleteEmployee,
//   deleteDepartment,
//   searchEmployee,
//   searchDepartment,
//   createAsset,
//   updateAsset,
//   deleteAsset,
//   getAllDepartments,
// } from "../controllers/admin.js";

// router.post("/users", verifyJWT, createUser);

// router.delete("/users/:userId", verifyJWT, deleteEmployee);

// router.get("/users/search", verifyJWT, searchEmployee);

// router.post("/departments", verifyJWT, createDepartment);

// router.get("/departments", verifyJWT, getAllDepartments);

// router.get("/departments/search", verifyJWT, searchDepartment);

// router.delete("/departments/:departmentId", verifyJWT, deleteDepartment);

// router.post("/assets", verifyJWT, createAsset);

// router.put("/assets/:assetId", verifyJWT, updateAsset);

// router.delete("/assets/:assetId", verifyJWT, deleteAsset);

// // employee

// router.post("/allocation/request", verifyJWT, requestAllocation);

// router.post("/maintenance/request", verifyJWT, requestMaintenance);

// router.get("/department/assets", verifyJWT, getDepartmentAssets);

// router.get("/allocation/my", verifyJWT, myAllocationRequests);

// router.get("/maintenance/my", verifyJWT, myMaintenanceRequests);

// import {
//   getAllDepartments,
//   getDepartmentAllocations,
// } from "../controllers/admin.js";
// import { verify } from "crypto";

// router.get("/assets", verifyJWT, getDepartmentAssets);

// router.get("/allocations", verifyJWT, getDepartmentAllocations);

// // asset manager

// // Path: oodo\backend\routes\asset.routes.js
// import { Router } from "express";
// import {
//   registerAsset,
//   getAllAssets,
//   updateAsset,
//   deleteAsset,
//   getAllocationRequests,
//   approveAllocation,
//   rejectAllocation,
//   getMaintenanceRequests,
//   approveMaintenance,
//   rejectMaintenance,
// } from "../controllers/asset_manager.js";
// import { verifyJWT } from "../middleware/verifyJWT.js";

// const router = Router();

// // Local middleware to check for 'asset manager' role
// const authorizeAssetManager = (req, res, next) => {
//   if (!req.user) {
//     return res.status(401).json({
//       success: false,
//       message: "User not authenticated",
//     });
//   }

//   // Support both "asset manager" (stored in DB) and "assetManager"
//   if (req.user.role !== "asset manager" && req.user.role !== "assetManager") {
//     return res.status(403).json({
//       success: false,
//       message: "You do not have permission to perform this action",
//     });
//   }
//   next();
// };

// router.use(verifyJWT, authorizeAssetManager);

// router.route("/").post(registerAsset).get(getAllAssets);
// router.route("/:assetId").patch(updateAsset).delete(deleteAsset);
// router.route("/allocation").get(getAllocationRequests);
// router.route("/allocation/:id/approve").patch(approveAllocation);
// router.route("/allocation/:id/reject").patch(rejectAllocation);

// // Maintenance Management
// router.route("/maintenance").get(getMaintenanceRequests);
// router.route("/maintenance/:id/approve").patch(approveMaintenance);
// router.route("/maintenance/:id/reject").patch(rejectMaintenance);

// export { router };
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

// Bug fix: none of the asset-manager-only routes below (register/update/
// delete asset, approve/reject allocation & maintenance) were ever checking
// that the logged-in user actually IS an asset manager. verifyJWT only
// confirms the user is logged in, not what role they hold, so any
// authenticated employee/department head could hit these endpoints
// directly. This mirrors the authorizeAssetManager middleware that already
// existed for this in the old asset_manager router file.
const authorizeAssetManager = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "User not authenticated",
    });
  }

  if (req.user.role !== "asset manager" && req.user.role !== "assetManager") {
    return res.status(403).json({
      success: false,
      message: "You do not have permission to perform this action",
    });
  }
  next();
};

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
<<<<<<< HEAD
=======
  searchAssets,
>>>>>>> mahi
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

<<<<<<< HEAD
=======
router.get("/assets/search", verifyJWT, searchAssets);

>>>>>>> mahi
router.put("/assets/:assetId", verifyJWT, updateAsset);

router.delete("/assets/:assetId", verifyJWT, deleteAsset);

// employee

// Bug fix: requestAllocation, requestMaintenance, getDepartmentAssets,
// myAllocationRequests, myMaintenanceRequests were used below but were
// never imported from anywhere - this import block simply didn't exist.
import {
  requestAllocation,
  requestMaintenance,
  getDepartmentAssets,
  myAllocationRequests,
  myMaintenanceRequests,
} from "../controllers/employee.js";

router.post("/allocation/request", verifyJWT, requestAllocation);

router.post("/maintenance/request", verifyJWT, requestMaintenance);

router.get("/department/assets", verifyJWT, getDepartmentAssets);

router.get("/allocation/my", verifyJWT, myAllocationRequests);

router.get("/maintenance/my", verifyJWT, myMaintenanceRequests);

// department head

// Bug fix: getDepartmentAllocations was imported from "../controllers/admin.js"
// but it isn't defined there - it lives in "../controllers/department.js".
// department.js also exports a function called getDepartmentAssets, same
// name as the one already imported above from employee.js, so it's
// aliased here to avoid clobbering that import. getAllDepartments is
// dropped from this import since it's already imported once above.
import {
  getDepartmentAssets as getDepartmentHeadAssets,
  getDepartmentAllocations,
} from "../controllers/department.js";

router.get("/assets", verifyJWT, getDepartmentHeadAssets);

router.get("/allocations", verifyJWT, getDepartmentAllocations);

// asset manager

// Bug fix: updateAsset/deleteAsset already imported above from admin.js -
// aliased here so importing asset_manager.js's versions doesn't clash
// with those identifiers.
import {
  registerAsset,
  getAllAssets,
  updateAsset as updateAssetByManager,
  deleteAsset as deleteAssetByManager,
  getAllocationRequests,
  approveAllocation,
  rejectAllocation,
  getMaintenanceRequests,
  approveMaintenance,
  rejectMaintenance,
} from "../controllers/asset_manager.js";

<<<<<<< HEAD
router.route("/").post(verifyJWT, registerAsset).get(verifyJWT, getAllAssets);

router
  .route("/:assetId")
  .patch(verifyJWT, updateAssetByManager)
  .delete(verifyJWT, deleteAssetByManager);

router.route("/allocation").get(verifyJWT, getAllocationRequests);

router.route("/allocation/:id/approve").patch(verifyJWT, approveAllocation);

router.route("/allocation/:id/reject").patch(verifyJWT, rejectAllocation);

// Maintenance Management
router.route("/maintenance").get(verifyJWT, getMaintenanceRequests);

router.route("/maintenance/:id/approve").patch(verifyJWT, approveMaintenance);

router.route("/maintenance/:id/reject").patch(verifyJWT, rejectMaintenance);
=======
router
  .route("/")
  .post(verifyJWT, authorizeAssetManager, registerAsset)
  .get(verifyJWT, authorizeAssetManager, getAllAssets);

router
  .route("/:assetId")
  .patch(verifyJWT, authorizeAssetManager, updateAssetByManager)
  .delete(verifyJWT, authorizeAssetManager, deleteAssetByManager);

router
  .route("/allocation")
  .get(verifyJWT, authorizeAssetManager, getAllocationRequests);

router
  .route("/allocation/:id/approve")
  .patch(verifyJWT, authorizeAssetManager, approveAllocation);

router
  .route("/allocation/:id/reject")
  .patch(verifyJWT, authorizeAssetManager, rejectAllocation);

// Maintenance Management
router
  .route("/maintenance")
  .get(verifyJWT, authorizeAssetManager, getMaintenanceRequests);

router
  .route("/maintenance/:id/approve")
  .patch(verifyJWT, authorizeAssetManager, approveMaintenance);

router
  .route("/maintenance/:id/reject")
  .patch(verifyJWT, authorizeAssetManager, rejectMaintenance);
>>>>>>> mahi

export { router };
