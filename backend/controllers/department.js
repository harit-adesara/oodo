import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.js";
import crypto from "crypto";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { Department } from "../models/department.js";
import { Asset } from "../models/asset.js";
import { Allocation } from "../models/allocation.js";
import { Maintenance } from "../models/maintenance.js";

export const getDepartmentAssets = asyncHandler(async (req, res) => {
  if (req.user.role !== "department head") {
    throw new ApiError(404, "Unauthrized user");
  }

  const assets = await Asset.find({
    department: req.user.department,
    isDeleted: false,
  })
    .populate("department", "name")
    .populate("createdBy", "name email")
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(
      new ApiResponse(200, assets, "Department assets fetched successfully"),
    );
});

export const getDepartmentAllocations = asyncHandler(async (req, res) => {
  if (req.user.role !== "department head") {
    throw new ApiError(404, "Unauthrized user");
  }

  const employees = await User.find({
    department: req.user.department,
    isDeleted: false,
  }).select("_id");

  const employeeIds = employees.map((employee) => employee._id);

  const allocations = await Allocation.find({
    employee: { $in: employeeIds },
  })
    .populate("employee", "name email")
    .populate("asset", "assetTag name category")
    .populate("allocatedBy", "name email")
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        allocations,
        "Department allocation requests fetched successfully",
      ),
    );
});
