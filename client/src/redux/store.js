// src/store.js
import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage
import { combineReducers } from "redux";

import authReducer from "./slices/authSlice";
import codeReducer from "./slices/codeSlice";

const rootReducer = combineReducers({
  auth: authReducer,
  code: codeReducer,
});

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["code"], // only persist the 'code' slice
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // required for redux-persist
    }),
});

export const persistor = persistStore(store);
export default store;
