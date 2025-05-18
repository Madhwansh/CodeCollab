import express from "express";
import { createServer } from "http";
import cors from "cors";
import { connectRedis } from "./configs/redisConfig.js";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import passport from "passport";
import connectDB from "./configs/dbConfig.js";
import authRoutes from "./routes/authRoute.js"; // Import auth routes
import codeRoutes from "./routes/codeRoute.js"; // Import code routes
import collabRoutes from "./routes/collabRoute.js"; // Import collaboration routes
import { Server as IOServer } from "socket.io";
import { createAdapter } from "@socket.io/redis-adapter";
import createClient from "ioredis";
import initCollabSockets from "./socket/collabSockets.js";

const app = express();
const server = createServer(app);

app.use(
  cors({
    origin: process.env.CLIENT_SUCCESS_REDIRECT,
    credentials: true,
  })
);

app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());
app.use(passport.initialize());

app.use(morgan("dev")); // Log requests to the console

connectRedis(); // Connect to Redis

const pubClient = createClient({ url: process.env.REDIS_URL });
const subClient = pubClient.duplicate();
await pubClient.connect();
await subClient.connect();

const io = new IOServer(server, {
  cors: {
    origin: process.env.CLIENT_SUCCESS_REDIRECT,
    credentials: true,
  },
});
io.adapter(createAdapter(pubClient, subClient)); // Use Redis adapter for Socket.IO

initCollabSockets(io); // Initialize collaboration sockets

connectDB(); // Connect to MongoDB

const PORT = process.env.PORT || 5000;

app.use("/api/auth", authRoutes); // Use auth routes
app.use("/api/code", codeRoutes);
app.use("/api/collab", collabRoutes); // Use collaboration routes

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
