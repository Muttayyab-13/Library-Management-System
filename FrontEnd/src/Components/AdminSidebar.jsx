import React from "react";
import { Link } from "react-router-dom";
import "../Styles/Componenets.css";

const AdminSidebar = () => (
  <aside className="admin-sidebar">
    <ul>
      <li><Link to="/admin/manage-books">Manage Books</Link></li>
      <li><Link to="/admin/manage-users">Manage Users</Link></li>
      <li><Link to="/admin/manage-genres">Manage Genres</Link></li>
      <li><Link to="/admin/manage-borrow-records">Manage Borrow Records</Link></li>
    </ul>
  </aside>
);

export default AdminSidebar;
