// import { mongoose, Schema } from "mongoose";

// const departmentSchema = new Schema(
//   {
//     name: {
//       type: String,
//       required: true,
//       unique: true,
//     },

//     status: {
//       type: String,
//       enum: ["active", "inactive"],
//       default: "active",
//     },
//   },
//   {
//     timestamps: true,
//   },
// );

// export const Department = mongoose.model("Department", departmentSchema);
import { mongoose, Schema } from "mongoose";

const departmentSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  {
    timestamps: true,
  },
);

export const Department = mongoose.model("Department", departmentSchema);
