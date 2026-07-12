import { mongoose, Schema } from "mongoose";
import { Asset } from "./asset.js";
import { User } from "./user.js";

const maintenanceSchema = new Schema(
  {
    asset: {
      type: Schema.Types.ObjectId,
      ref: "Asset",
    },

    requestedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

    approvedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    issue: String,

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    resolution: String,
  },
  {
    timestamps: true,
  },
);

export const Maintenance = mongoose.model("Maintenance", maintenanceSchema);
