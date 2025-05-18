// controllers/codeController.js
import Code from "../models/codeModel.js";
import { executeCode } from "../utils/compiler.js";

export const execute = async (req, res) => {
  try {
    const { code, language, input } = req.body;

    // Create code record
    const codeRecord = await Code.create({
      user: req.user.id,
      language,
      code,
      input,
      status: "pending",
    });

    // Execute code
    const result = await executeCode({ language, code, input });

    // Update record
    codeRecord.output = result.output;
    codeRecord.executionTime = result.time;
    codeRecord.status = result.output ? "success" : "error";
    await codeRecord.save();

    res.json({
      output: result.output,
      time: result.time,
      status: codeRecord.status,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
