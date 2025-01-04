import React, { useState } from "react";
import BookCard from "../Components/BookCard";
import { searchBooks } from "../services/api";
import { jwtDecode } from "jwt-decode";
import { useEffect } from "react";  // Import jwt-decode
import { borrowBook } from "../services/api";  // Import borrowBook API

const SearchPage = () => {
  
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [userEmail, setUserEmail] = useState("");
  const [userId, setUserId] = useState();
const [borrowedBooks, setBorrowedBooks] = useState([]);  // Track borrowed books

  const handleSearch = () => {
    searchBooks(query).then(setResults);
  };

 const handleBorrowBook = (bookTitle, userId) => {
   console.log('Borrowing Book:', bookTitle);
   console.log('User ID:', userId);
 
   borrowBook(bookTitle, userId)
     .then((response) => {
       console.log("Book borrowed successfully:", response);
       alert("Book Borrowed Successfully!");
 
       // Add the newly borrowed book to the borrowedBooks list by using filter
       const newBorrowedBook = {
         Title: bookTitle,   // Assuming the response or API gives this data
         BorrowDate: new Date().toISOString(),  // Add the borrow date
         returnDate: "",     // Set a default return date if needed
         Status: 1,          // 1 means borrowed
       };
 
       // Update borrowedBooks state using the filter approach
       setBorrowedBooks((prevBorrowedBooks) => [
         ...prevBorrowedBooks,  // Existing borrowed books
         newBorrowedBook,       // Newly borrowed book
       ]);
     })
     .catch((error) => {
       console.error("Error borrowing book:", error);
       alert("Error borrowing book. Please try again!");
 
     });
 };


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

  return (
    <div>
      <h1>Search Books</h1>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search by title, author, or genre"
      />
      <button onClick={handleSearch}>Search</button>
      <div className="book-grid">
        {results.map((book) => (
          <BookCard
          key={book.title}
          book={book}
          onBorrow={() => handleBorrowBook(book.title, userId)}  // Correctly pass borrow handler
        />
        ))}
      </div>
    </div>
  );
};

export default SearchPage;
