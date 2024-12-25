import React, { useEffect, useState } from "react";
import NotificationCard from "../Components/NotificationCard";
import { getUserNotifications, getUserBorrowRecords } from "../Services/api";

const UserDashboard = () => {
  const [notifications, setNotifications] = useState([]);
  const [borrowRecords, setBorrowRecords] = useState([]);

  useEffect(() => {
    getUserNotifications().then(setNotifications);
    getUserBorrowRecords().then(setBorrowRecords);
  }, []);

  return (
    <div>
      <h1>User Dashboard</h1>
      <h2>Notifications</h2>
      <div className="notification-list">
        {notifications.map((notification) => (
          <NotificationCard key={notification.id} notification={notification} />
        ))}
      </div>

      <h2>Borrow Records</h2>
      <table>
        <thead>
          <tr>
            <th>Book</th>
            <th>Borrow Date</th>
            <th>Return Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {borrowRecords.map((record) => (
            <tr key={record.id}>
              <td>{record.book_title}</td>
              <td>{new Date(record.borrow_date).toLocaleDateString()}</td>
              <td>{new Date(record.return_date).toLocaleDateString()}</td>
              <td>{record.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserDashboard;
