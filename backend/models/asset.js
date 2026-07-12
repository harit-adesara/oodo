import { mongoose, Schema } from "mongoose";
import { Department } from "./department.js";
import { User } from "./user.js";

const assetSchema = new Schema(
  {
    assetTag: {
      type: String,
      unique: true,
    },

    name: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      enum: ["electronics", "furniture", "vehicle", "other"],
    },

    isShared: {
      type: Boolean,
      default: false,
    },

    count: {
      type: Number,
      required: true,
    },

    department: {
      type: Schema.Types.ObjectId,
      ref: "Department",
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  },
);

export const Asset = mongoose.model("Asset", assetSchema);
