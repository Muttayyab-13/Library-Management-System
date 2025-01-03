import React, { useState, useEffect } from "react";
import axios from "axios";
import { returnBook } from "../services/api";

const ManageBorrowedBooks = ({ userId }) => {
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [overdueBooks, setOverdueBooks] = useState([]);
  const [borrowedCount, setBorrowedCount] = useState(0);

  useEffect(() => {
    // Fetch overdue books
    axios
      .get(`http://localhost:3001/api/overdueBooks`)
      .then((response) => {
        setOverdueBooks(response.data);
      })
      .catch((error) => console.error("Error fetching overdue books:", error));

    // Fetch borrowed count
    axios
      .get(`http://localhost:3001/api/user/borrowedCount/${userId}`)
      .then((response) => {
        setBorrowedCount(response.data.borrowedBooksCount);
      })
      .catch((error) => console.error("Error fetching borrowed count:", error));
  }, [userId]);

  const handleReturnBook = (bookId) => {
    // Call the API to return the book (already assumed you have this implemented)
    returnBook(bookId)
      .then((response) => {
        console.log("Book returned successfully:", response);
        // Optionally update UI or show success message
        setBorrowedBooks(borrowedBooks.filter((book) => book.id !== bookId));
      })
      .catch((error) => {
        console.error("Error returning book:", error);
      });
  };

  return (
    <div className="manage-borrowed-books">
      <h2>Manage Borrowed Books</h2>
      <p>You have borrowed {borrowedCount} books.</p>

      {overdueBooks.length > 0 && (
        <div>
          <h3>Overdue Books:</h3>
          <ul>
            {overdueBooks.map((book) => (
              <li key={book.id}>
                <strong>{book.title}</strong> - Overdue by {book.fine} days. Fine: ${book.fine}
                <button onClick={() => handleReturnBook(book.id)}>Return Book</button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {borrowedBooks.length > 0 ? (
        <ul>
          {borrowedBooks.map((book) => (
            <li key={book.id}>
              Book ID: {book.id}{" "}
              <button onClick={() => handleReturnBook(book.id)}>Return Book</button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No borrowed books yet.</p>
      )}
    </div>
  );
};

export default ManageBorrowedBooks;
