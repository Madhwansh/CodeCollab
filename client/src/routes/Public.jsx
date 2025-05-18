// src/routes/Public.jsx
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { checkAuthStatus } from "../redux/slices/authSlice";
import { Navigate, Outlet } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";

const Public = () => {
  const dispatch = useDispatch();
  const { user, status } = useSelector((state) => state.auth);

  useEffect(() => {
    if (status === "idle") {
      dispatch(checkAuthStatus());
    }
  }, [dispatch, status]);

  if (status === "loading" || status === "idle") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <ClipLoader color="#36d7b7" size={50} />
      </div>
    );
  }

  if (status === "succeeded" && user) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default Public;
