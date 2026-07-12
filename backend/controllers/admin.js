import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.js";
import crypto from "crypto";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { Department } from "../models/department.js";
import { Asset } from "../models/asset.js";

export const createUser = asyncHandler(async (req, res) => {
  const { name, username, department, email, role } = req.body;

  if (req.user.role !== "admin") {
    throw new ApiError(404, "Unathorized user");
  }

  if (!name || !username || !department || !email || !role) {
    throw new ApiError(400, "All fields are required");
  }

  const allowedRoles = ["asset manager", "department head", "employee"];

  if (!allowedRoles.includes(role)) {
    throw new ApiError(400, "Invalid role");
  }

  const existingUser = await User.findOne({
    $or: [{ email }, { username }],
  });

  if (existingUser) {
    if (!existingUser.isDeleted) {
      throw new ApiError(409, "User already exists");
    }

    existingUser.name = name;
    existingUser.username = username;
    existingUser.department = department;
    existingUser.email = email;
    existingUser.role = role;
    existingUser.isDeleted = false;

    await existingUser.save();

    const restoredUser = await User.findById(existingUser._id).select(
      "-password -refreshToken -forgetPasswordToken -forgetPasswordExpiry",
    );

    return res
      .status(200)
      .json(
        new ApiResponse(200, restoredUser, "Employee restored successfully"),
      );
  }

  const user = await User.create({
    name,
    username,
    departement,
    email,
    role,
    isDeleted: false,
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken -forgetPasswordToken -forgetPasswordExpiry",
  );

  return res
    .status(201)
    .json(new ApiResponse(201, createdUser, "Employee created successfully"));
});

export const createDepartment = asyncHandler(async (req, res) => {
  const { name } = req.body;
  if (req.user.role !== "admin") {
    throw new ApiError(404, "Unathorized user");
  }

  if (!name?.trim()) {
    throw new ApiError(400, "Department name is required");
  }

  const existingDepartment = await Department.findOne({
    name: name.trim(),
  });

  if (existingDepartment) {
    if (existingDepartment.status === "active") {
      throw new ApiError(409, "Department already exists");
    }

    existingDepartment.status = "active";
    await existingDepartment.save();

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          existingDepartment,
          "Department reactivated successfully",
        ),
      );
  }

  const department = await Department.create({
    name: name.trim(),
  });

  return res
    .status(201)
    .json(new ApiResponse(201, department, "Department created successfully"));
});

export const deleteEmployee = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  if (req.user.role !== "admin") {
    throw new ApiError(404, "Unathorized user");
  }

  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (user.isDeleted) {
    throw new ApiError(400, "User is already deleted");
  }

  user.isDeleted = true;
  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Employee deleted successfully"));
});

export const deleteDepartment = asyncHandler(async (req, res) => {
  const { departmentId } = req.params;

  if (req.user.role !== "admin") {
    throw new ApiError(404, "Unathorized user");
  }

  const department = await Department.findById(departmentId);

  if (!department) {
    throw new ApiError(404, "Department not found");
  }

  if (department.status === "inactive") {
    throw new ApiError(400, "Department is already inactive");
  }

  department.status = "inactive";
  await department.save();

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Department deleted successfully"));
});

export const searchEmployee = asyncHandler(async (req, res) => {
  const { email = "" } = req.query;

  if (req.user.role !== "admin") {
    throw new ApiError(404, "Unathorized user");
  }

  const employees = await User.find({
    isDeleted: false,
    email: {
      $regex: email,
      $options: "i",
    },
  })
    .populate("departement", "name")
    .select(
      "-password -refreshToken -forgetPasswordToken -forgetPasswordExpiry",
    );

  return res
    .status(200)
    .json(new ApiResponse(200, employees, "Employees fetched successfully"));
});

export const searchDepartment = asyncHandler(async (req, res) => {
  const { name = "" } = req.query;

  if (req.user.role !== "admin") {
    throw new ApiError(404, "Unathorized user");
  }

  const departments = await Department.find({
    status: "active",
    name: {
      $regex: name,
      $options: "i",
    },
  }).sort({ name: 1 });

  return res
    .status(200)
    .json(
      new ApiResponse(200, departments, "Departments fetched successfully"),
    );
});

export const createAsset = asyncHandler(async (req, res) => {
  const { assetTag, name, category, isShared, count, department } = req.body;

  if (req.user.role !== "admin") {
    throw new ApiError(404, "Unathorized user");
  }

  if (!assetTag || !name || !count || !department) {
    throw new ApiError(
      400,
      "Asset Tag, Name, Count and Department are required",
    );
  }

  const existingAsset = await Asset.findOne({ assetTag });

  if (existingAsset) {
    if (!existingAsset.isDeleted) {
      throw new ApiError(409, "Asset already exists");
    }

    // Restore deleted asset
    existingAsset.name = name;
    existingAsset.category = category;
    existingAsset.isShared = isShared;
    existingAsset.count = count;
    existingAsset.department = department;
    existingAsset.createdBy = req.user._id;
    existingAsset.isDeleted = false;

    await existingAsset.save();

    return res
      .status(200)
      .json(new ApiResponse(200, existingAsset, "Asset restored successfully"));
  }

  const asset = await Asset.create({
    assetTag,
    name,
    category,
    isShared,
    count,
    department,
    createdBy: req.user._id,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, asset, "Asset created successfully"));
});

export const updateAsset = asyncHandler(async (req, res) => {
  const { assetId } = req.params;

  if (req.user.role !== "admin") {
    throw new ApiError(404, "Unathorized user");
  }

  const asset = await Asset.findOne({
    _id: assetId,
    isDeleted: false,
  });

  if (!asset) {
    throw new ApiError(404, "Asset not found");
  }

  const { assetTag, name, category, isShared, count, department } = req.body;

  if (assetTag !== undefined) asset.assetTag = assetTag;
  if (name !== undefined) asset.name = name;
  if (category !== undefined) asset.category = category;
  if (isShared !== undefined) asset.isShared = isShared;
  if (count !== undefined) asset.count = count;
  if (department !== undefined) asset.department = department;

  await asset.save();

  return res
    .status(200)
    .json(new ApiResponse(200, asset, "Asset updated successfully"));
});

export const deleteAsset = asyncHandler(async (req, res) => {
  const { assetId } = req.params;

  if (req.user.role !== "admin") {
    throw new ApiError(404, "Unathorized user");
  }

  const asset = await Asset.findById(assetId);

  if (!asset) {
    throw new ApiError(404, "Asset not found");
  }

  if (asset.isDeleted) {
    throw new ApiError(400, "Asset is already deleted");
  }

  asset.isDeleted = true;

  await asset.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Asset deleted successfully"));
});

export const getAllDepartments = asyncHandler(async (req, res) => {
  if (req.user.role !== "admin") {
    throw new ApiError(404, "Unathorized user");
  }
  const departments = await Department.find({
    status: "active",
  }).sort({ name: 1 });

  return res
    .status(200)
    .json(
      new ApiResponse(200, departments, "Departments fetched successfully"),
    );
});
