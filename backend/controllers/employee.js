import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.js";
import crypto from "crypto";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { Department } from "../models/department.js";
import { Asset } from "../models/asset.js";
import { Allocation } from "../models/allocation.js";
import { Maintenance } from "../models/maintenance.js";

export const requestAllocation = asyncHandler(async (req, res) => {
  const { assetId } = req.body;

  if (!assetId) {
    throw new ApiError(400, "Asset is required");
  }

  const asset = await Asset.findOne({
    _id: assetId,
    isDeleted: false,
  });

  if (!asset) {
    throw new ApiError(404, "Asset not found");
  }

  const existingRequest = await Allocation.findOne({
    asset: assetId,
    employee: req.user._id,
    status: "pending",
  });

  if (existingRequest) {
    throw new ApiError(409, "Request already submitted");
  }

  const allocation = await Allocation.create({
    asset: assetId,
    employee: req.user._id,
    allocatedBy: null,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, allocation, "Allocation request sent"));
});

export const requestMaintenance = asyncHandler(async (req, res) => {
  const { assetId, issue } = req.body;

  if (!assetId || !issue) {
    throw new ApiError(400, "Asset and issue are required");
  }

  const asset = await Asset.findOne({
    _id: assetId,
    isDeleted: false,
  });

  if (!asset) {
    throw new ApiError(404, "Asset not found");
  }

  const maintenance = await Maintenance.create({
    asset: assetId,
    requestedBy: req.user._id,
    issue,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, maintenance, "Maintenance request submitted"));
});

export const getDepartmentAssets = asyncHandler(async (req, res) => {
  const assets = await Asset.find({
    department: req.user.department,
    isDeleted: false,
  });

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        totalAssets: assets.length,
        assets,
      },
      "Department assets fetched successfully",
    ),
  );
});

export const myAllocationRequests = asyncHandler(async (req, res) => {
  const allocations = await Allocation.find({
    employee: req.user._id,
  })
    .populate("asset")
    .populate("allocatedBy", "name email");

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        allocations,
        "Allocation requests fetched successfully",
      ),
    );
});

export const myMaintenanceRequests = asyncHandler(async (req, res) => {
  const requests = await Maintenance.find({
    requestedBy: req.user._id,
  })
    .populate("asset")
    .populate("approvedBy", "name email");

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        requests,
        "Maintenance requests fetched successfully",
      ),
    );
});
