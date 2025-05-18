// src/slices/codeSlice.jsx
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  python: "# Write Python code here",
  cpp: "// Write C++ code here",
  java: "// Write Java code here",
};

const codeSlice = createSlice({
  name: "code",
  initialState,
  reducers: {
    updateCode: (state, action) => {
      const { language, value } = action.payload;
      state[language] = value;
    },
    resetCode: () => initialState,
  },
});

export const { updateCode, resetCode } = codeSlice.actions;
export default codeSlice.reducer;
