import React from "react";
import { Link } from "react-router-dom";
import "../Styles/Componenets.css";

const Navbar = () => (
  <nav className="navbar">
    <h1>Online Library</h1>
    <ul>
      <li><Link to="/">Home</Link></li>
      <li><Link to="/search">Search</Link></li>
      <li><Link to="/userDashboard">Dashboard</Link></li>
      <li><Link to="/admin">Admin</Link></li>
    </ul>
  </nav>
);

export default Navbar;
