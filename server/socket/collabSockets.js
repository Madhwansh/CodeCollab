import { nanoid } from "nanoid";
import Room from "../models/roomModel.js";
import { codeQueue } from "../queue/codeQueue.js";

export default function initCollabSockets(io) {
  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    socket.on("create_room", async ({ userId }) => {
      const roomKey = nanoid(8);
      const room = await Room.create({
        roomKey,
        createdBy: userId,
        participants: [userId],
      });
      socket.join(roomKey);
      socket.emit("room_created", { roomKey, participants: room.participants });
    });

    socket.on("join_room", async ({ roomKey, userId }) => {
      const room = await Room.findOne({ roomKey });
      if (!room) return socket.emit("error", "Room not found");
      if (!room.participants.includes(userId)) {
        room.participants.push(userId);
        await room.save();
      }
      socket.join(roomKey);
      socket.emit("joined_room", { roomKey, participants: room.participants });
      socket.to(roomKey).emit("participant_joined", { userId });
    });

    socket.on("code_change", ({ roomKey, delta }) => {
      socket.to(roomKey).emit("remote_code_change", delta);
    });

    socket.on("run_code", ({ roomKey, code, language, input, userId }) => {
      // enqueue job; results will be emitted by worker
      codeQueue.add("execute", { roomKey, code, language, input, userId });
      socket.emit("run_queued");
    });

    socket.on("disconnect", (reason) => {
      console.log("Socket disconnected:", socket.id, reason);
    });
  });
}
