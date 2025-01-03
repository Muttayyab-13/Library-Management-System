import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);  // Initialize as null to check later if the value is set

  useEffect(() => {

    // Get the JWT token from localStorage
    const token = localStorage.getItem("token");

    if (token) {
      // Decode the token and get the user's email
      const decodedToken = jwtDecode(token);
      console.log('Decoded Token:', decodedToken);
      setUserId(decodedToken.id);  // Assuming the token has userId
      setUserEmail(decodedToken.email);  // Assuming the token has email
    }
  }, []);

  useEffect(() => {
    
    axios.get(`http://localhost:3001/users/notifications?userId=${userId}`)
      .then((response) => {
        setNotifications(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching notifications:", error);
        setLoading(false);
      });
  }, []);

  const handleMarkAsRead = (notificationId) => {
    // Mark notification as read (adjusted to the correct PATCH endpoint)
    axios.patch(`http://localhost:3001/users/notifications/${notificationId}`, { isRead: true })
      .then(() => {
        // Update the state to reflect the notification status change
        setNotifications(notifications.map(notification =>
          notification.id === notificationId ? { ...notification, isRead: true } : notification
        ));
      })
      .catch((error) => console.error("Error updating notification:", error));
  };

  return (
    <div>
      <h2>Notifications</h2>
      {loading ? (
        <p>Loading notifications...</p>
      ) : (
        notifications.length > 0 ? (
          <ul>
            {notifications.map((notification) => (
              <li key={notification.id}>
                <span>{notification.message}</span>
                <button onClick={() => handleMarkAsRead(notification.id)}>
                  {notification.isRead ? 'Read' : 'Mark as Read'}
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No notifications found.</p>
        )
      )}
    </div>
  );
};

export default Notifications;
