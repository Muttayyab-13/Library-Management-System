import React from "react";
import AdminSidebar from "../Components/AdminSidebar";

const AdminDashboard = () => (
  <div className="admin-dashboard">
    <div className="admin-content">
      <h1>Admin Dashboard</h1>
      <p>Welcome to the admin panel. Use the sidebar to manage the library.</p>
    </div>
    <AdminSidebar />
    
  </div>
);

export default AdminDashboard;
