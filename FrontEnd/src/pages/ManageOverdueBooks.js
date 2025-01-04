import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';




const ManageOverdueBooks = () => {
  const [overdueBooks, setOverdueBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(); 
  const [email,setUserEmail]=useState()


    useEffect(() => {
      // Get the JWT token from localStorage
      const token = localStorage.getItem("token");
  
      if (token) {
        // Decode the token and get the user's email
        const decodedToken = jwtDecode(token);
        console.log('Decoded Token:', decodedToken);
        setUserId(decodedToken.id);  // Assuming the token has userId
        setUserEmail(decodedToken.email); 
         // Assuming the token has email
      }
    }, []);
  

    useEffect(() => {
      if (userId) {
    
        // Fetch overdue books from backend using the userId as a query parameter
        axios.get(`http://localhost:3001/books/overdueBooks`, {
          params: { userId } // Pass userId in the 'params' object
        })
        .then((response) => {
          setOverdueBooks(response.data); // Set overdue books from the response
          setLoading(false); // Stop loading
          console.log('Overdue Books:', response.data); // Log the fetched data
        })
        .catch((error) => {
          console.error("Error fetching overdue books:", error);
          setLoading(false); // Stop loading even on error
        });
      }
    }, [userId]);
    

    const handleFinePayment = async (userId, bookTitle) => {
      try {
        // Make an API call to delete the fine
        const response = await axios.delete(`http://localhost:3001/fines/${userId}/${bookTitle}`);
        alert(response.data.message); // Show success message from server
      } catch (error) {
        console.error("Error paying fine:", error);
        alert("Error paying the fine. Please try again.");
      }
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
                  <td>{book.book_title}</td>
                  <td>${book.fine}</td>
                  <td>
                    <button onClick={() => handleFinePayment(userId,book.book_title)}>
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
