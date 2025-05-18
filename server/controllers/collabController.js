// server/controllers/collabController.js
import Room from "../models/roomModel.js";
import { nanoid } from "nanoid";

// POST /api/collab/create
export const createRoom = async (req, res) => {
  try {
    const roomKey = nanoid(8);
    const room = await Room.create({
      roomKey,
      createdBy: req.user.id,
      participants: [req.user.id],
    });
    res.status(201).json({ success: true, roomKey });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Could not create room" });
  }
};

// POST /api/collab/join
export const joinRoom = async (req, res) => {
  try {
    const { roomKey } = req.body;
    const room = await Room.findOne({ roomKey });
    if (!room) {
      return res
        .status(404)
        .json({ success: false, message: "Room not found" });
    }
    if (!room.participants.includes(req.user.id)) {
      room.participants.push(req.user.id);
      await room.save();
    }
    res.json({ success: true, roomKey, participants: room.participants });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Could not join room" });
  }
};
