// src/routes/Private.jsx
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { checkAuthStatus } from "../redux/slices/authSlice";
import ClipLoader from "react-spinners/ClipLoader";

const Private = () => {
  const dispatch = useDispatch();
  const location = useLocation();
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

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default Private;
