// src/App.jsx
import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider, useDispatch } from "react-redux";
import store, { persistor } from "./redux/store";
import { checkAuthStatus } from "./redux/slices/authSlice";
import { PersistGate } from "redux-persist/integration/react";

import Home from "./screens/Home";
import Login from "./screens/auth/Login";
import Register from "./screens/auth/Register";
import Collab from "./screens/Collab";
import Private from "./routes/Private";
import Public from "./routes/Public";
import LocalEditor from "./screens/LocalEditor";

function AppContent() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAuthStatus());
  }, [dispatch]);

  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route element={<Public />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      <Route element={<Private />}>
        <Route path="/collab" element={<Collab />} />
        <Route path="/local/edit" element={<LocalEditor />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Router>
          <AppContent />
        </Router>
      </PersistGate>
    </Provider>
  );
}
