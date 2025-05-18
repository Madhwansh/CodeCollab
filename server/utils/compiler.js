// utils/compiler.js
import axios from "axios";

const JUDGE0_API = "https://judge0-ce.p.rapidapi.com";
const headers = {
  "X-RapidAPI-Key": process.env.RAPID_API_KEY,
  "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
};

const languageIds = {
  python: 71,
  cpp: 54,
  java: 62,
};

async function executeCode({ language, code, input }) {
  const options = {
    method: "POST",
    url: `${JUDGE0_API}/submissions`,
    params: { base64_encoded: "false", wait: "true" },
    headers,
    data: {
      source_code: code,
      language_id: languageIds[language],
      stdin: input,
      cpu_time_limit: 5,
    },
  };

  const response = await axios.request(options);
  return {
    output: response.data.stdout || response.data.stderr,
    time: response.data.time,
  };
}

export { executeCode };
