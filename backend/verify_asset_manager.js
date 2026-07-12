import mongoose from "mongoose";
import dotenv from "dotenv";

// Load dotenv
dotenv.config();

import { Asset } from "./models/asset.js";
import { Allocation } from "./models/allocation.js";
import { Maintenance } from "./models/maintenance.js";
import { Department } from "./models/department.js";
import { User } from "./models/user.js";

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
} from "./controllers/asset_manager.js";

async function runTests() {
  const mongoUrl = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/oodo_test";
  console.log(`Connecting to MongoDB at: ${mongoUrl}`);
  await mongoose.connect(mongoUrl);
  console.log("Connected successfully!");

  // Clean databases
  await User.deleteMany({});
  await Asset.deleteMany({});
  await Allocation.deleteMany({});
  await Maintenance.deleteMany({});
  await Department.deleteMany({});
  console.log("Database collections cleared.");

  // Create mock users
  const manager = await User.create({
    name: "Asset Manager User",
    username: "assetmanager",
    email: "manager@test.com",
    role: "asset manager",
  });

  const employee = await User.create({
    name: "John Doe Employee",
    username: "johndoe",
    email: "john@test.com",
    role: "employee",
  });
  console.log("Mock users created successfully.");

  // Response mock utility
  let mockResJson = null;
  let mockResStatus = null;
  const mockRes = {
    status(code) {
      mockResStatus = code;
      return {
        json(data) {
          mockResJson = data;
          return data;
        },
      };
    },
  };

  // 1. Test registerAsset
  const reqRegister = {
    body: {
      name: "Dell Latitude 5420",
      assetTag: "DL-2026-001",
      category: "electronics",
      count: 30,
      department: "Engineering",
      isShared: false,
    },
    user: manager,
  };

  console.log("\n--- Testing registerAsset ---");
  await registerAsset(reqRegister, mockRes);
  if (mockResStatus !== 201 || !mockResJson.success) {
    throw new Error(`registerAsset failed with status ${mockResStatus}`);
  }
  const createdAsset = mockResJson.data;
  console.log("registerAsset PASSED. Created asset count:", createdAsset.count);

  // 2. Test duplicate register check
  console.log("\n--- Testing registerAsset duplicate tag check ---");
  try {
    await registerAsset(reqRegister, mockRes);
    throw new Error("Expected duplicate registration to throw an error");
  } catch (error) {
    if (error.statusCode !== 409) {
      throw error;
    }
    console.log("registerAsset duplicate check PASSED:", error.message);
  }

  // 3. Test getAllAssets
  console.log("\n--- Testing getAllAssets ---");
  const reqGet = {
    query: { category: "electronics" },
  };
  await getAllAssets(reqGet, mockRes);
  if (mockResStatus !== 200 || mockResJson.count !== 1) {
    throw new Error("getAllAssets failed to fetch assets by category");
  }
  console.log("getAllAssets PASSED. Found asset tag:", mockResJson.data[0].assetTag);

  // 4. Test updateAsset (and check that count updates are ignored)
  console.log("\n--- Testing updateAsset ---");
  const reqUpdate = {
    params: { assetId: createdAsset._id },
    body: {
      name: "Dell Latitude 5420 (Upgraded Screen)",
      count: 999, // Should be ignored
      department: "Design",
    },
  };
  await updateAsset(reqUpdate, mockRes);
  if (mockResStatus !== 200 || mockResJson.data.count !== 30) {
    throw new Error("updateAsset count validation failed (count should not be modified)");
  }
  console.log("updateAsset PASSED. Updated name:", mockResJson.data.name);
  console.log("Count remained at:", mockResJson.data.count);

  // 5. Test approveAllocation
  console.log("\n--- Testing approveAllocation ---");
  const allocation = await Allocation.create({
    asset: createdAsset._id,
    employee: employee._id,
    status: "pending",
  });

  const reqApprove = {
    params: { id: allocation._id },
    user: manager,
  };

  await approveAllocation(reqApprove, mockRes);
  if (mockResStatus !== 200 || mockResJson.data.status !== "approved") {
    throw new Error("approveAllocation status update failed");
  }

  // Check if count decremented by 1
  const updatedAsset = await Asset.findById(createdAsset._id);
  if (updatedAsset.count !== 29) {
    throw new Error(`Asset count expected to be 29, found ${updatedAsset.count}`);
  }
  console.log("approveAllocation PASSED. Asset count decremented from 30 to:", updatedAsset.count);

  // 6. Test deleteAsset blocker (should fail due to active allocation)
  console.log("\n--- Testing deleteAsset blocker (active allocations) ---");
  const reqDelete = {
    params: { assetId: createdAsset._id },
  };
  try {
    await deleteAsset(reqDelete, mockRes);
    throw new Error("Expected deleteAsset to be blocked by active allocation");
  } catch (error) {
    if (error.statusCode !== 400) {
      throw error;
    }
    console.log("deleteAsset blocker PASSED:", error.message);
  }

  // 7. Test rejectAllocation
  console.log("\n--- Testing rejectAllocation ---");
  const allocationToReject = await Allocation.create({
    asset: createdAsset._id,
    employee: employee._id,
    status: "pending",
  });

  const reqRejectAllocation = {
    params: { id: allocationToReject._id },
  };

  await rejectAllocation(reqRejectAllocation, mockRes);
  if (mockResStatus !== 200 || mockResJson.data.status !== "rejected") {
    throw new Error("rejectAllocation status update failed");
  }
  console.log("rejectAllocation PASSED. Status is:", mockResJson.data.status);

  // 8. Test approveMaintenance & rejectMaintenance
  console.log("\n--- Testing Maintenance approval ---");
  const maintenance = await Maintenance.create({
    asset: createdAsset._id,
    requestedBy: employee._id,
    status: "pending",
    issue: "Keyboard keys sticky",
  });

  const reqApproveMaintenance = {
    params: { id: maintenance._id },
    user: manager,
  };

  await approveMaintenance(reqApproveMaintenance, mockRes);
  if (mockResStatus !== 200 || mockResJson.data.status !== "approved") {
    throw new Error("approveMaintenance status update failed");
  }
  console.log("approveMaintenance PASSED. Status is:", mockResJson.data.status);

  console.log("\n=============================");
  console.log("ALL INTEGRATION TESTS PASSED!");
  console.log("=============================");

  await mongoose.disconnect();
}

runTests().catch(async (error) => {
  console.error("\nTEST RUN FAILED:", error);
  await mongoose.disconnect();
  process.exit(1);
});
