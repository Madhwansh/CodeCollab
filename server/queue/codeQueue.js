// server/queue/codeQueue.js
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const { Queue, Worker, QueueScheduler } = require("bullmq");

import IORedis from "ioredis";
import Code from "../models/codeModel.js";
import { getIO } from "../socket/ioInstance.js";
import { executeCode } from "../utils/compiler.js";

const connection = new IORedis(
  process.env.REDIS_URL || {
    host: process.env.REDIS_HOST,
    port: +process.env.REDIS_PORT,
  }
);

export const codeQueue = new Queue("code", { connection });
export const codeScheduler = new QueueScheduler("code", { connection });

export const codeWorker = new Worker(
  "code",
  async (job) => {
    const { code, language, input, userId, roomKey } = job.data;
    const { output, time } = await executeCode({ code, language, input });

    const record = await Code.create({
      user: userId,
      language,
      code,
      input,
      output,
      executionTime: time,
      status: output ? "success" : "error",
      room: roomKey || null,
    });

    getIO()
      .to(roomKey || userId.toString())
      .emit("run_result", {
        jobId: job.id,
        output,
        time,
        status: record.status,
      });
  },
  { connection }
);

codeWorker.on("failed", (job, err) => {
  const { roomKey, userId } = job.data;
  getIO()
    .to(roomKey || userId.toString())
    .emit("run_error", { jobId: job.id, message: err.message });
});
