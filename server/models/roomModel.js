// server/models/roomModel.js
import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
  {
    // a short unique key, e.g. “AB12CD34”
    roomKey: { type: String, required: true, unique: true },

    // who created it
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },

    // users currently joined
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
      },
    ],

    // optional: default language for the room
    language: {
      type: String,
      enum: ["python", "cpp", "java", "javascript"],
      default: "javascript",
    },
  },
  { timestamps: true }
);

export default mongoose.model("rooms", roomSchema);
