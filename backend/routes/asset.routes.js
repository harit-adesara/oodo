// Path: oodo\backend\routes\asset.routes.js
import { Router } from "express";
import {
  registerAsset,
  getAllAssets,
  updateAsset,
  deleteAsset,
  getAllocationRequests,
  approveAllocation,
  rejectAllocation,
  getMaintenanceRequests,
  approveMaintenance,
  rejectMaintenance,
} from "../controllers/asset_manager.js";
import { verifyJWT } from "../middleware/verifyJWT.js";

const router = Router();

// Local middleware to check for 'asset manager' role
const authorizeAssetManager = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "User not authenticated",
    });
  }

  // Support both "asset manager" (stored in DB) and "assetManager"
  if (req.user.role !== "asset manager" && req.user.role !== "assetManager") {
    return res.status(403).json({
      success: false,
      message: "You do not have permission to perform this action",
    });
  }
  next();
};

// All asset routes require authentication and asset manager role
router.use(verifyJWT, authorizeAssetManager);

// Asset CRUD
router.route("/").post(registerAsset).get(getAllAssets);
router.route("/:assetId").patch(updateAsset).delete(deleteAsset);

// Allocation Management
router.route("/allocation").get(getAllocationRequests);
router.route("/allocation/:id/approve").patch(approveAllocation);
router.route("/allocation/:id/reject").patch(rejectAllocation);

// Maintenance Management
router.route("/maintenance").get(getMaintenanceRequests);
router.route("/maintenance/:id/approve").patch(approveMaintenance);
router.route("/maintenance/:id/reject").patch(rejectMaintenance);

export { router as assetRouter };


