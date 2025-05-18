// models/codeModel.js
import mongoose from "mongoose";

const codeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    language: {
      type: String,
      enum: ["python", "cpp", "java"],
      required: true,
    },
    code: {
      type: String,
      required: true,
    },
    input: String,
    output: String,
    executionTime: Number,
    status: {
      type: String,
      enum: ["success", "error", "pending"],
      default: "pending",
    },
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "rooms",
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model("codes", codeSchema);
