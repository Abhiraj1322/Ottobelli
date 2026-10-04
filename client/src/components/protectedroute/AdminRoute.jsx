import React from "react";
import { Navigate, Outlet } from "react-router-dom";

export default function AdminRoute() {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // Check if authenticated and role is admin
  if (!token || user?.role !== "admin") {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
