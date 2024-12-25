import React from "react";
import "../Styles/Componenets.css";

const NotificationCard = ({ notification }) => (
  <div className={`notification-card ${notification.read_status ? "read" : "unread"}`}>
    <p>{notification.message}</p>
    <small>{new Date(notification.created_at).toLocaleString()}</small>
  </div>
);

export default NotificationCard;
