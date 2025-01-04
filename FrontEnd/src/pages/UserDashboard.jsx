import React, { useEffect, useState } from "react";
import NotificationCard from "../Components/NotificationCard";
import {  getBorrowedBooks } from "../services/api";
import { jwtDecode } from "jwt-decode";
import ManageOverdueBooks from "./ManageOverdueBooks";

const UserDashboard = () => {
  const [notifications, setNotifications] = useState([]);
  const [borrowRecords, setBorrowRecords] = useState([]);
  const [userEmail, setUserEmail] = useState("");
  const [userId, setUserId] = useState();  // Initialize as null to check later if the value is set

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
    if (userId) {
      // Fetch notifications and borrowed books when userId is available
      //getUserNotifications()
       // .then((data) => setNotifications(data))
       // .catch((error) => console.error("Error fetching notifications:", error));

      getBorrowedBooks(userId)
        .then((data) => setBorrowRecords(data))
        .catch((error) => console.error("Error fetching borrowed books:", error));
    }
  }, [userId]);  // Only run this effect when userId is available

  return (
    <div>
      <h1>User Dashboard =={'>'}{userEmail}</h1>
      <div className="notification-list">
      <NotificationCard/>
      </div>
      <div>
        <ManageOverdueBooks/>
      </div>

      <h2>Borrow Records</h2>
      <table>
        <tbody>
        {borrowRecords.length > 0 ? (
            borrowRecords.map((book) => (
              <div key={book.Title} className="borrowed-book-card">
                <h3>{book.Title}</h3>
                <p>Borrowed on: {book.BorrowDate}</p>
                <p>Return by: {book.returnDate}</p>
                <p>Status: {book.status === true ? "Returned" : " Not Returned"}</p>
              </div>
            ))
          ) : (
            <p>No books borrowed yet.</p>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UserDashboard;
