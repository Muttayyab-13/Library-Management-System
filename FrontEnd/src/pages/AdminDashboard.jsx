import React from "react";
import AdminSidebar from "../Components/AdminSidebar";

const AdminDashboard = () => (
  <div className="admin-dashboard">
    <AdminSidebar />
    <div className="admin-content">
      <h1>Admin Dashboard</h1>
      <p>Welcome to the admin panel. Use the sidebar to manage the library.</p>
    </div>
  </div>
);

export default AdminDashboard;
