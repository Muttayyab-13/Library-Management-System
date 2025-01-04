import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from "jwt-decode";

const NotificationCard = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(); // Initialize as null to check later if the value is set
  const [userEmail,setUserEmail]=useState('') // Initialize as null to check later if the value is set

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
    // Make sure userId is available before sending the request
    if (userId) {
      axios.get('http://localhost:3001/users/notifications', {
        params: { userId }  // Pass userId as a query parameter
      })
      .then((response) => {
        setNotifications(response.data); // Set notifications from the response
        setLoading(false); // Stop loading
      })
      .catch((error) => {
        console.error("Error fetching notifications:", error);
        setLoading(false); // Stop loading even on error
      });
    }
  }, [userId]);  // Dependency array should depend on userId
  

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

export default NotificationCard;
