import { Outlet, Navigate } from "react-router-dom";
import React from "react";

const PrivateRoutes = () => {
  const isAuthenticated = {"token": false};
  return isAuthenticated ? <Outlet /> : <Navigate to={"/"} />;
};

export default PrivateRoutes