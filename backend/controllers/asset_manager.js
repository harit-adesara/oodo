// // // Path: oodo\backend\controllers\asset_manager.js
// // import { Asset } from "../models/asset.js";
// // import { Allocation } from "../models/allocation.js";
// // import { Maintenance } from "../models/maintenance.js";
// // import { Department } from "../models/department.js";
// // import { ApiError } from "../utils/apiError.js";
// // import { asyncHandler } from "../utils/asyncHandler.js";
// // import mongoose from "mongoose";

// // export const registerAsset = asyncHandler(async (req, res) => {
// //   const { name, assetTag, category, count, department, isShared } = req.body;

// //   if (!name || !assetTag || count === undefined || !department) {
// //     throw new ApiError(
// //       400,
// //       "Name, assetTag, count, and department are required fields",
// //     );
// //   }

// //   const numericCount = Number(count);
// //   if (
// //     isNaN(numericCount) ||
// //     numericCount < 0 ||
// //     !Number.isInteger(numericCount)
// //   ) {
// //     throw new ApiError(400, "Count must be a non-negative whole integer");
// //   }

// //   // Check duplicate assetTag
// //   const existingAsset = await Asset.findOne({ assetTag });
// //   if (existingAsset) {
// //     throw new ApiError(409, "Asset with this tag already exists");
// //   }

// //   // Resolve department by Name or ID
// //   let departmentId = null;
// //   if (mongoose.Types.ObjectId.isValid(department)) {
// //     departmentId = department;
// //   } else {
// //     let dept = await Department.findOne({ name: department });
// //     if (!dept) {
// //       dept = await Department.create({ name: department });
// //     }
// //     departmentId = dept._id;
// //   }

// //   const asset = await Asset.create({
// //     name,
// //     assetTag,
// //     category,
// //     count: numericCount,
// //     department: departmentId,
// //     isShared: !!isShared,
// //     createdBy: req.user?._id,
// //   });

// //   return res.status(201).json({
// //     success: true,
// //     message: "Asset registered successfully",
// //     data: asset,
// //   });
// // });

// // // List / filter all assets
// // export const getAllAssets = asyncHandler(async (req, res) => {
// //   const { category, department } = req.query;
// //   const filter = {};

// //   if (category) {
// //     filter.category = category;
// //   }

// //   if (department) {
// //     if (mongoose.Types.ObjectId.isValid(department)) {
// //       filter.department = department;
// //     } else {
// //       const dept = await Department.findOne({ name: department });
// //       if (dept) {
// //         filter.department = dept._id;
// //       } else {
// //         // Return empty array since department does not exist
// //         return res.status(200).json({
// //           success: true,
// //           message: "Assets retrieved successfully",
// //           count: 0,
// //           data: [],
// //         });
// //       }
// //     }
// //   }

// //   const assets = await Asset.find(filter)
// //     .populate("department")
// //     .populate("createdBy", "name username email role");

// //   return res.status(200).json({
// //     success: true,
// //     message: "Assets retrieved successfully",
// //     count: assets.length,
// //     data: assets,
// //   });
// // });

// // // Update an existing asset (excluding count changes)
// // export const updateAsset = asyncHandler(async (req, res) => {
// //   const { assetId } = req.params;

// //   if (!mongoose.Types.ObjectId.isValid(assetId)) {
// //     throw new ApiError(400, "Invalid asset ID");
// //   }

// //   const asset = await Asset.findById(assetId);
// //   if (!asset) {
// //     throw new ApiError(404, "Asset not found");
// //   }

// //   const updates = { ...req.body };
// //   delete updates.count; // Prevent changing count directly

// //   // Resolve department if passed as string name
// //   if (
// //     updates.department &&
// //     !mongoose.Types.ObjectId.isValid(updates.department)
// //   ) {
// //     let dept = await Department.findOne({ name: updates.department });
// //     if (!dept) {
// //       dept = await Department.create({ name: updates.department });
// //     }
// //     updates.department = dept._id;
// //   }

// //   const updatedAsset = await Asset.findByIdAndUpdate(assetId, updates, {
// //     new: true,
// //     runValidators: true,
// //   }).populate("department");

// //   return res.status(200).json({
// //     success: true,
// //     message: "Asset updated successfully",
// //     data: updatedAsset,
// //   });
// // });

// // // Delete an asset
// // export const deleteAsset = asyncHandler(async (req, res) => {
// //   const { assetId } = req.params;

// //   if (!mongoose.Types.ObjectId.isValid(assetId)) {
// //     throw new ApiError(400, "Invalid asset ID");
// //   }

// //   const asset = await Asset.findById(assetId);
// //   if (!asset) {
// //     throw new ApiError(404, "Asset not found");
// //   }

// //   // Block deletion if the asset has active approved allocations
// //   const activeAllocations = await Allocation.findOne({
// //     asset: assetId,
// //     status: "approved",
// //   });
// //   if (activeAllocations) {
// //     throw new ApiError(400, "Cannot delete asset with active allocations");
// //   }

// //   await Asset.findByIdAndDelete(assetId);

// //   return res.status(200).json({
// //     success: true,
// //     message: "Asset deleted successfully",
// //   });
// // });

// // // View pending allocation requests
// // export const getAllocationRequests = asyncHandler(async (req, res) => {
// //   const allocations = await Allocation.find({ status: "pending" })
// //     .populate("employee", "name username email role")
// //     .populate("asset", "name assetTag count category");

// //   return res.status(200).json({
// //     success: true,
// //     message: "Allocation requests retrieved successfully",
// //     count: allocations.length,
// //     data: allocations,
// //   });
// // });

// // // Approve an allocation request
// // export const approveAllocation = asyncHandler(async (req, res) => {
// //   const { id } = req.params;

// //   if (!mongoose.Types.ObjectId.isValid(id)) {
// //     throw new ApiError(400, "Invalid allocation ID");
// //   }

// //   const allocation = await Allocation.findById(id);
// //   if (!allocation) {
// //     throw new ApiError(404, "Allocation request not found");
// //   }

// //   if (allocation.status !== "pending") {
// //     throw new ApiError(400, "This request has already been processed");
// //   }

// //   const asset = await Asset.findById(allocation.asset);
// //   if (!asset) {
// //     throw new ApiError(404, "Linked asset not found");
// //   }

// //   // Default quantity to 1 since schema doesn't have quantity
// //   const quantity = allocation.quantity || 1;

// //   // Atomically check availability and decrement in one query to close the race condition
// //   // and prevent negative counts without needing MongoDB transactions (which require a replica set)
// //   const updatedAsset = await Asset.findOneAndUpdate(
// //     { _id: allocation.asset, count: { $gte: quantity } },
// //     { $inc: { count: -quantity } },
// //     { new: true },
// //   );

// //   if (!updatedAsset) {
// //     throw new ApiError(400, "Not enough units available");
// //   }

// //   allocation.status = "approved";
// //   allocation.allocatedBy = req.user?._id;
// //   allocation.allocationDate = new Date();
// //   await allocation.save();

// //   // Populate references for the final response
// //   const populatedAllocation = await Allocation.findById(allocation._id)
// //     .populate("employee", "name username email role")
// //     .populate("asset", "name assetTag count category");

// //   return res.status(200).json({
// //     success: true,
// //     message: "Allocation approved",
// //     data: populatedAllocation,
// //   });
// // });

// // // Reject an allocation request
// // export const rejectAllocation = asyncHandler(async (req, res) => {
// //   const { id } = req.params;

// //   if (!mongoose.Types.ObjectId.isValid(id)) {
// //     throw new ApiError(400, "Invalid allocation ID");
// //   }

// //   const allocation = await Allocation.findById(id);
// //   if (!allocation) {
// //     throw new ApiError(404, "Allocation request not found");
// //   }

// //   if (allocation.status !== "pending") {
// //     throw new ApiError(400, "This request has already been processed");
// //   }

// //   allocation.status = "rejected";
// //   await allocation.save();

// //   return res.status(200).json({
// //     success: true,
// //     message: "Allocation request rejected",
// //     data: allocation,
// //   });
// // });

// // // View pending maintenance requests
// // export const getMaintenanceRequests = asyncHandler(async (req, res) => {
// //   const maintenance = await Maintenance.find({ status: "pending" })
// //     .populate("requestedBy", "name username email role")
// //     .populate("asset", "name assetTag count category");

// //   return res.status(200).json({
// //     success: true,
// //     message: "Maintenance requests retrieved successfully",
// //     count: maintenance.length,
// //     data: maintenance,
// //   });
// // });

// // // Approve a maintenance request
// // export const approveMaintenance = asyncHandler(async (req, res) => {
// //   const { id } = req.params;

// //   if (!mongoose.Types.ObjectId.isValid(id)) {
// //     throw new ApiError(400, "Invalid maintenance ID");
// //   }

// //   const maintenance = await Maintenance.findById(id);
// //   if (!maintenance) {
// //     throw new ApiError(404, "Maintenance request not found");
// //   }

// //   if (maintenance.status !== "pending") {
// //     throw new ApiError(400, "This request has already been processed");
// //   }

// //   maintenance.status = "approved";
// //   maintenance.approvedBy = req.user?._id;
// //   await maintenance.save();

// //   return res.status(200).json({
// //     success: true,
// //     message: "Maintenance request approved",
// //     data: maintenance,
// //   });
// // });

// // // Reject a maintenance request
// // export const rejectMaintenance = asyncHandler(async (req, res) => {
// //   const { id } = req.params;

// //   if (!mongoose.Types.ObjectId.isValid(id)) {
// //     throw new ApiError(400, "Invalid maintenance ID");
// //   }

// //   const maintenance = await Maintenance.findById(id);
// //   if (!maintenance) {
// //     throw new ApiError(404, "Maintenance request not found");
// //   }

// //   if (maintenance.status !== "pending") {
// //     throw new ApiError(400, "This request has already been processed");
// //   }

// //   maintenance.status = "rejected";
// //   maintenance.approvedBy = req.user?._id;
// //   await maintenance.save();

// //   return res.status(200).json({
// //     success: true,
// //     message: "Maintenance request rejected",
// //     data: maintenance,
// //   });
// // });
// // Path: oodo\backend\controllers\asset_manager.js
// import { Asset } from "../models/asset.js";
// import { Allocation } from "../models/allocation.js";
// import { Maintenance } from "../models/maintenance.js";
// import { Department } from "../models/department.js";
// import { ApiError } from "../utils/apiError.js";
// import { asyncHandler } from "../utils/asyncHandler.js";
// import mongoose from "mongoose";

// export const registerAsset = asyncHandler(async (req, res) => {
//   const { name, assetTag, category, count, department, isShared } = req.body;

//   if (!name || !assetTag || count === undefined || !department) {
//     throw new ApiError(
//       400,
//       "Name, assetTag, count, and department are required fields",
//     );
//   }

//   const numericCount = Number(count);
//   if (
//     isNaN(numericCount) ||
//     numericCount < 0 ||
//     !Number.isInteger(numericCount)
//   ) {
//     throw new ApiError(400, "Count must be a non-negative whole integer");
//   }

//   // Check duplicate assetTag
//   const existingAsset = await Asset.findOne({ assetTag });
//   if (existingAsset) {
//     throw new ApiError(409, "Asset with this tag already exists");
//   }

//   // Resolve department by Name or ID.
//   // Bug fix: this used to do `Department.create(...)` when no matching
//   // department was found. Departments are only ever created by the
//   // admin (Organization Setup > Department Management) - an asset
//   // manager registering an asset should never be able to silently
//   // create a new department. So now this just looks the department up
//   // and throws if it doesn't exist.
//   let departmentDoc = null;
//   if (mongoose.Types.ObjectId.isValid(department)) {
//     departmentDoc = await Department.findOne({ _id: department });
//   } else {
//     departmentDoc = await Department.findOne({ name: department });
//   }

//   if (!departmentDoc) {
//     throw new ApiError(
//       404,
//       "Department not found. Ask an admin to create it first.",
//     );
//   }

//   const asset = await Asset.create({
//     name,
//     assetTag,
//     category,
//     count: numericCount,
//     department: departmentDoc._id,
//     isShared: !!isShared,
//     createdBy: req.user?._id,
//   });

//   return res.status(201).json({
//     success: true,
//     message: "Asset registered successfully",
//     data: asset,
//   });
// });

// // List / filter all assets
// export const getAllAssets = asyncHandler(async (req, res) => {
//   const { category, department } = req.query;
//   const filter = {};

//   if (category) {
//     filter.category = category;
//   }

//   if (department) {
//     if (mongoose.Types.ObjectId.isValid(department)) {
//       filter.department = department;
//     } else {
//       const dept = await Department.findOne({ name: department });
//       if (dept) {
//         filter.department = dept._id;
//       } else {
//         // Return empty array since department does not exist
//         return res.status(200).json({
//           success: true,
//           message: "Assets retrieved successfully",
//           count: 0,
//           data: [],
//         });
//       }
//     }
//   }

//   const assets = await Asset.find(filter)
//     .populate("department")
//     .populate("createdBy", "name username email role");

//   return res.status(200).json({
//     success: true,
//     message: "Assets retrieved successfully",
//     count: assets.length,
//     data: assets,
//   });
// });

// // Update an existing asset (excluding count changes)
// export const updateAsset = asyncHandler(async (req, res) => {
//   const { assetId } = req.params;

//   if (!mongoose.Types.ObjectId.isValid(assetId)) {
//     throw new ApiError(400, "Invalid asset ID");
//   }

//   const asset = await Asset.findById(assetId);
//   if (!asset) {
//     throw new ApiError(404, "Asset not found");
//   }

//   const updates = { ...req.body };
//   delete updates.count; // Prevent changing count directly

//   // Bug fix: same as registerAsset above - resolve an existing
//   // department instead of creating one on the fly.
//   if (updates.department) {
//     let departmentDoc = null;
//     if (mongoose.Types.ObjectId.isValid(updates.department)) {
//       departmentDoc = await Department.findOne({ _id: updates.department });
//     } else {
//       departmentDoc = await Department.findOne({ name: updates.department });
//     }

//     if (!departmentDoc) {
//       throw new ApiError(
//         404,
//         "Department not found. Ask an admin to create it first.",
//       );
//     }

//     updates.department = departmentDoc._id;
//   }

//   const updatedAsset = await Asset.findByIdAndUpdate(assetId, updates, {
//     new: true,
//     runValidators: true,
//   }).populate("department");

//   return res.status(200).json({
//     success: true,
//     message: "Asset updated successfully",
//     data: updatedAsset,
//   });
// });

// // Delete an asset
// export const deleteAsset = asyncHandler(async (req, res) => {
//   const { assetId } = req.params;

//   if (!mongoose.Types.ObjectId.isValid(assetId)) {
//     throw new ApiError(400, "Invalid asset ID");
//   }

//   const asset = await Asset.findById(assetId);
//   if (!asset) {
//     throw new ApiError(404, "Asset not found");
//   }

//   // Block deletion if the asset has active approved allocations
//   const activeAllocations = await Allocation.findOne({
//     asset: assetId,
//     status: "approved",
//   });
//   if (activeAllocations) {
//     throw new ApiError(400, "Cannot delete asset with active allocations");
//   }

//   await Asset.findByIdAndDelete(assetId);

//   return res.status(200).json({
//     success: true,
//     message: "Asset deleted successfully",
//   });
// });

// // View pending allocation requests
// export const getAllocationRequests = asyncHandler(async (req, res) => {
//   const allocations = await Allocation.find({ status: "pending" })
//     .populate("employee", "name username email role")
//     .populate("asset", "name assetTag count category");

//   return res.status(200).json({
//     success: true,
//     message: "Allocation requests retrieved successfully",
//     count: allocations.length,
//     data: allocations,
//   });
// });

// // Approve an allocation request
// export const approveAllocation = asyncHandler(async (req, res) => {
//   const { id } = req.params;

//   if (!mongoose.Types.ObjectId.isValid(id)) {
//     throw new ApiError(400, "Invalid allocation ID");
//   }

//   const allocation = await Allocation.findById(id);
//   if (!allocation) {
//     throw new ApiError(404, "Allocation request not found");
//   }

//   if (allocation.status !== "pending") {
//     throw new ApiError(400, "This request has already been processed");
//   }

//   const asset = await Asset.findById(allocation.asset);
//   if (!asset) {
//     throw new ApiError(404, "Linked asset not found");
//   }

//   // Default quantity to 1 since schema doesn't have quantity
//   const quantity = allocation.quantity || 1;

//   // Atomically check availability and decrement in one query to close the race condition
//   // and prevent negative counts without needing MongoDB transactions (which require a replica set)
//   const updatedAsset = await Asset.findOneAndUpdate(
//     { _id: allocation.asset, count: { $gte: quantity } },
//     { $inc: { count: -quantity } },
//     { new: true },
//   );

//   if (!updatedAsset) {
//     throw new ApiError(400, "Not enough units available");
//   }

//   allocation.status = "approved";
//   allocation.allocatedBy = req.user?._id;
//   allocation.allocationDate = new Date();
//   await allocation.save();

//   // Populate references for the final response
//   const populatedAllocation = await Allocation.findById(allocation._id)
//     .populate("employee", "name username email role")
//     .populate("asset", "name assetTag count category");

//   return res.status(200).json({
//     success: true,
//     message: "Allocation approved",
//     data: populatedAllocation,
//   });
// });

// // Reject an allocation request
// export const rejectAllocation = asyncHandler(async (req, res) => {
//   const { id } = req.params;

//   if (!mongoose.Types.ObjectId.isValid(id)) {
//     throw new ApiError(400, "Invalid allocation ID");
//   }

//   const allocation = await Allocation.findById(id);
//   if (!allocation) {
//     throw new ApiError(404, "Allocation request not found");
//   }

//   if (allocation.status !== "pending") {
//     throw new ApiError(400, "This request has already been processed");
//   }

//   allocation.status = "rejected";
//   await allocation.save();

//   return res.status(200).json({
//     success: true,
//     message: "Allocation request rejected",
//     data: allocation,
//   });
// });

// // View pending maintenance requests
// export const getMaintenanceRequests = asyncHandler(async (req, res) => {
//   const maintenance = await Maintenance.find({ status: "pending" })
//     .populate("requestedBy", "name username email role")
//     .populate("asset", "name assetTag count category");

//   return res.status(200).json({
//     success: true,
//     message: "Maintenance requests retrieved successfully",
//     count: maintenance.length,
//     data: maintenance,
//   });
// });

// // Approve a maintenance request
// export const approveMaintenance = asyncHandler(async (req, res) => {
//   const { id } = req.params;

//   if (!mongoose.Types.ObjectId.isValid(id)) {
//     throw new ApiError(400, "Invalid maintenance ID");
//   }

//   const maintenance = await Maintenance.findById(id);
//   if (!maintenance) {
//     throw new ApiError(404, "Maintenance request not found");
//   }

//   if (maintenance.status !== "pending") {
//     throw new ApiError(400, "This request has already been processed");
//   }

//   maintenance.status = "approved";
//   maintenance.approvedBy = req.user?._id;
//   await maintenance.save();

//   return res.status(200).json({
//     success: true,
//     message: "Maintenance request approved",
//     data: maintenance,
//   });
// });

// // Reject a maintenance request
// export const rejectMaintenance = asyncHandler(async (req, res) => {
//   const { id } = req.params;

//   if (!mongoose.Types.ObjectId.isValid(id)) {
//     throw new ApiError(400, "Invalid maintenance ID");
//   }

//   const maintenance = await Maintenance.findById(id);
//   if (!maintenance) {
//     throw new ApiError(404, "Maintenance request not found");
//   }

//   if (maintenance.status !== "pending") {
//     throw new ApiError(400, "This request has already been processed");
//   }

//   maintenance.status = "rejected";
//   maintenance.approvedBy = req.user?._id;
//   await maintenance.save();

//   return res.status(200).json({
//     success: true,
//     message: "Maintenance request rejected",
//     data: maintenance,
//   });
// });
// Path: oodo\backend\controllers\asset_manager.js
import { Asset } from "../models/asset.js";
import { Allocation } from "../models/allocation.js";
import { Maintenance } from "../models/maintenance.js";
import { Department } from "../models/department.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import mongoose from "mongoose";

export const registerAsset = asyncHandler(async (req, res) => {
  const { name, assetTag, category, count, department, isShared } = req.body;

  if (!name || !assetTag || count === undefined || !department) {
    throw new ApiError(
      400,
      "Name, assetTag, count, and department are required fields",
    );
  }

  const numericCount = Number(count);
  if (
    isNaN(numericCount) ||
    numericCount < 0 ||
    !Number.isInteger(numericCount)
  ) {
    throw new ApiError(400, "Count must be a non-negative whole integer");
  }

  // Check duplicate assetTag
  const existingAsset = await Asset.findOne({ assetTag });
  if (existingAsset) {
    throw new ApiError(409, "Asset with this tag already exists");
  }

  // Resolve department by Name or ID.
  // Fix: this used to fall back to `Department.create(...)` whenever no
  // matching department was found. Departments should only ever be created
  // by an admin - an asset manager registering an asset must not be able
  // to silently create a new department. So this now just looks the
  // department up and throws if it doesn't exist.
  let departmentDoc = null;
  if (mongoose.Types.ObjectId.isValid(department)) {
    departmentDoc = await Department.findOne({ _id: department });
  } else {
    departmentDoc = await Department.findOne({ name: department });
  }

  if (!departmentDoc) {
    throw new ApiError(
      404,
      "Department not found. Ask an admin to create it first.",
    );
  }

  const asset = await Asset.create({
    name,
    assetTag,
    category,
    count: numericCount,
    department: departmentDoc._id,
    isShared: !!isShared,
    createdBy: req.user?._id,
  });

  return res.status(201).json({
    success: true,
    message: "Asset registered successfully",
    data: asset,
  });
});

// List / filter all assets
export const getAllAssets = asyncHandler(async (req, res) => {
  const { category, department } = req.query;
  const filter = {};

  if (category) {
    filter.category = category;
  }

  if (department) {
    if (mongoose.Types.ObjectId.isValid(department)) {
      filter.department = department;
    } else {
      const dept = await Department.findOne({ name: department });
      if (dept) {
        filter.department = dept._id;
      } else {
        // Return empty array since department does not exist
        return res.status(200).json({
          success: true,
          message: "Assets retrieved successfully",
          count: 0,
          data: [],
        });
      }
    }
  }

  const assets = await Asset.find(filter)
    .populate("department")
    .populate("createdBy", "name username email role");

  return res.status(200).json({
    success: true,
    message: "Assets retrieved successfully",
    count: assets.length,
    data: assets,
  });
});

// Update an existing asset (excluding count changes)
export const updateAsset = asyncHandler(async (req, res) => {
  const { assetId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(assetId)) {
    throw new ApiError(400, "Invalid asset ID");
  }

  const asset = await Asset.findById(assetId);
  if (!asset) {
    throw new ApiError(404, "Asset not found");
  }

  const updates = { ...req.body };
  delete updates.count; // Prevent changing count directly

  // Fix: same as registerAsset above - resolve an existing department
  // instead of creating one on the fly.
  if (updates.department) {
    let departmentDoc = null;
    if (mongoose.Types.ObjectId.isValid(updates.department)) {
      departmentDoc = await Department.findOne({ _id: updates.department });
    } else {
      departmentDoc = await Department.findOne({ name: updates.department });
    }

    if (!departmentDoc) {
      throw new ApiError(
        404,
        "Department not found. Ask an admin to create it first.",
      );
    }

    updates.department = departmentDoc._id;
  }

  const updatedAsset = await Asset.findByIdAndUpdate(assetId, updates, {
    new: true,
    runValidators: true,
  }).populate("department");

  return res.status(200).json({
    success: true,
    message: "Asset updated successfully",
    data: updatedAsset,
  });
});

// Delete an asset
export const deleteAsset = asyncHandler(async (req, res) => {
  const { assetId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(assetId)) {
    throw new ApiError(400, "Invalid asset ID");
  }

  const asset = await Asset.findById(assetId);
  if (!asset) {
    throw new ApiError(404, "Asset not found");
  }

  // Block deletion if the asset has active approved allocations
  const activeAllocations = await Allocation.findOne({
    asset: assetId,
    status: "approved",
  });
  if (activeAllocations) {
    throw new ApiError(400, "Cannot delete asset with active allocations");
  }

  await Asset.findByIdAndDelete(assetId);

  return res.status(200).json({
    success: true,
    message: "Asset deleted successfully",
  });
});

// View pending allocation requests
export const getAllocationRequests = asyncHandler(async (req, res) => {
  const allocations = await Allocation.find({ status: "pending" })
    .populate("employee", "name username email role")
    .populate("asset", "name assetTag count category");

  return res.status(200).json({
    success: true,
    message: "Allocation requests retrieved successfully",
    count: allocations.length,
    data: allocations,
  });
});

// Approve an allocation request
export const approveAllocation = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid allocation ID");
  }

  const allocation = await Allocation.findById(id);
  if (!allocation) {
    throw new ApiError(404, "Allocation request not found");
  }

  if (allocation.status !== "pending") {
    throw new ApiError(400, "This request has already been processed");
  }

  const asset = await Asset.findById(allocation.asset);
  if (!asset) {
    throw new ApiError(404, "Linked asset not found");
  }

  // Default quantity to 1 since schema doesn't have quantity
  const quantity = allocation.quantity || 1;

  // Atomically check availability and decrement in one query to close the
  // race condition and prevent negative counts without needing MongoDB
  // transactions (which require a replica set)
  const updatedAsset = await Asset.findOneAndUpdate(
    { _id: allocation.asset, count: { $gte: quantity } },
    { $inc: { count: -quantity } },
    { new: true },
  );

  if (!updatedAsset) {
    throw new ApiError(400, "Not enough units available");
  }

  allocation.status = "approved";
  allocation.allocatedBy = req.user?._id;
  allocation.allocationDate = new Date();
  await allocation.save();

  // Populate references for the final response
  const populatedAllocation = await Allocation.findById(allocation._id)
    .populate("employee", "name username email role")
    .populate("asset", "name assetTag count category");

  return res.status(200).json({
    success: true,
    message: "Allocation approved",
    data: populatedAllocation,
  });
});

// Reject an allocation request
export const rejectAllocation = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid allocation ID");
  }

  const allocation = await Allocation.findById(id);
  if (!allocation) {
    throw new ApiError(404, "Allocation request not found");
  }

  if (allocation.status !== "pending") {
    throw new ApiError(400, "This request has already been processed");
  }

  allocation.status = "rejected";
  await allocation.save();

  return res.status(200).json({
    success: true,
    message: "Allocation request rejected",
    data: allocation,
  });
});

// View pending maintenance requests
export const getMaintenanceRequests = asyncHandler(async (req, res) => {
  const maintenance = await Maintenance.find({ status: "pending" })
    .populate("requestedBy", "name username email role")
    .populate("asset", "name assetTag count category");

  return res.status(200).json({
    success: true,
    message: "Maintenance requests retrieved successfully",
    count: maintenance.length,
    data: maintenance,
  });
});

// Approve a maintenance request
export const approveMaintenance = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid maintenance ID");
  }

  const maintenance = await Maintenance.findById(id);
  if (!maintenance) {
    throw new ApiError(404, "Maintenance request not found");
  }

  if (maintenance.status !== "pending") {
    throw new ApiError(400, "This request has already been processed");
  }

  maintenance.status = "approved";
  maintenance.approvedBy = req.user?._id;
  await maintenance.save();

  return res.status(200).json({
    success: true,
    message: "Maintenance request approved",
    data: maintenance,
  });
});

// Reject a maintenance request
export const rejectMaintenance = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid maintenance ID");
  }

  const maintenance = await Maintenance.findById(id);
  if (!maintenance) {
    throw new ApiError(404, "Maintenance request not found");
  }

  if (maintenance.status !== "pending") {
    throw new ApiError(400, "This request has already been processed");
  }

  maintenance.status = "rejected";
  maintenance.approvedBy = req.user?._id;
  await maintenance.save();

  return res.status(200).json({
    success: true,
    message: "Maintenance request rejected",
    data: maintenance,
  });
});
