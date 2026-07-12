import { mongoose, Schema } from "mongoose";
import { Asset } from "./asset.js";
import { User } from "./user.js";
import { Department } from "./department.js";

const allocationSchema = new Schema(
  {
    asset: {
      type: Schema.Types.ObjectId,
      ref: "Asset",
    },

    employee: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

    allocatedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

    allocationDate: {
      type: Date,
      default: Date.now,
    },

    status: {
      type: String,
      enum: ["approved", "pending", "rejected"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  },
);

export const Allocation = mongoose.model("Allocation", allocationSchema);
