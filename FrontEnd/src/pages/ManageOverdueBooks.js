import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ManageOverdueBooks = () => {
  const [overdueBooks, setOverdueBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch overdue books from backend
    axios.get('http://localhost:3001/books/overdueBooks')
      .then((response) => {
        setOverdueBooks(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching overdue books:", error);
        setLoading(false);
      });
  }, []);

  const handleFinePayment = (bookId) => {
    // Logic to handle fine payment
    alert(`Fine for Book ID: ${bookId} has been paid.`);
  };

  return (
    <div>
      <h2>Overdue Books</h2>
      {loading ? (
        <p>Loading overdue books...</p>
      ) : (
        overdueBooks.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Book Title</th>
                <th>Fine Amount</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {overdueBooks.map((book, index) => (
                <tr key={index}>
                  <td>{book.title}</td>
                  <td>${book.fine}</td>
                  <td>
                    <button onClick={() => handleFinePayment(book.title)}>
                      Pay Fine
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No overdue books found.</p>
        )
      )}
    </div>
  );
};

export default ManageOverdueBooks;
