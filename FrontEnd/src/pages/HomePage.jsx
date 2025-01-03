import React, { use, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";  // Import jwt-decode
import BookCard from "../Components/BookCard";
import GenreCard from "../Components/GenreCard";
import { getFeaturedBooks, getGenres, getAllBooks,getBorrowedBooks } from "../services/api";
import { borrowBook } from "../services/api";
import { returnBook } from "../services/api";  // Import returnBook API
import ManageBorrowedRecords from "../pages/ManageBorrowRecords";  // Import the new component
import "../Styles/HomePage.css";
import Navbar from "../Components/Navbar";
import "../Styles/Componenets.css";

const HomePage = () => {
  const [books, setBooks] = useState([]);
  const [featuredBooks, setFeaturedBooks] = useState([]);
  const [genres, setGenres] = useState([]);
  const [showAllBooks, setShowAllBooks] = useState(false);
  const [borrowedBooks, setBorrowedBooks] = useState([]);  // Track borrowed books
  const [userEmail, setUserEmail] = useState("");
  const [userId, setUserId] = useState();

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

        // Fetch featured books,borrwed bookd and genres on component mount
        getFeaturedBooks().then(setFeaturedBooks).catch(console.error);
        getAllBooks().then(setBooks).catch(console.error);
        getGenres().then(setGenres).catch(console.error);
  }, []);

  useEffect(() => {
    // Fetch borrowed books only if userId is available
    if (userId) {
      getBorrowedBooks(userId).then(setBorrowedBooks).catch(console.error);
    }
  }, [userId]); 

  const handleToggleBooks = () => {
    setShowAllBooks(!showAllBooks);
  };

  // Borrow Book Handler
// Borrow Book Handler
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


  // Return Book Handler
  const handleReturnBook = (bookTitle) => {
    // Call the returnBook API to delete the record from the database
    returnBook(bookTitle, userId)
      .then((response) => {
        console.log("Book returned successfully:", response);
        alert("Book Returned Successfully!");
        
        // Option 1: Update state locally to reflect the removal of the book
        setBorrowedBooks((prevBooks) =>
          prevBooks.filter((book) => book.Title !== bookTitle)
        );
  
        // Option 2: Alternatively, re-fetch borrowed books from the backend (if you prefer)
        // getBorrowedBooks(userId).then(setBorrowedBooks).catch(console.error);
      })
      .catch((error) => {
        console.error("Error returning book:", error);
        alert("Error returning book. Please try again!");
      });
  };
  

  return (
    <div className="main">
      <div>
        <h2 style={{ color: 'green', fontSize: '24px', fontWeight: 'bold', textAlign: 'center', background:'#f8f9fa', padding:'4px',border:'2px solid black' }}>
          {userEmail}-----{userId}
        </h2>
      </div>
      <header className="hero">
        <h1>Welcome to the Online Library</h1>
        <p>Find your next great read from our vast collection of books!</p>
      </header>
      <Navbar />
      
      <section className="featured-books">
        <h2>Featured Books</h2>
        <div className="grid">
          {featuredBooks.length > 0 ? (
            featuredBooks.map((book) => (
              <BookCard
                key={book.title}
                book={book}
                onBorrow={() => handleBorrowBook(book.title, userId)}  // Pass borrow handler correctly
              />
            ))
          ) : (
            <p>No books available.</p>
          )}
        </div>

        <h2>All Books</h2>
        <button onClick={handleToggleBooks} style={{ marginBottom: '15px' }}>
          {showAllBooks ? "Hide Books" : "Show Books"}
        </button>
        {showAllBooks && books.length > 0 ? (
          books.map((book) => (
            <BookCard
              key={book.title}
              book={book}
              onBorrow={() => handleBorrowBook(book.title, userId)}  // Correctly pass borrow handler
            />
           
          ))
        ) : (
          <p>No books available.</p>
        )}
      </section>

      <section className="genres">
        <h2>Browse by Genres</h2>
        <div className="grid">
          {genres.length > 0 ? (
            genres.map((genre) => <GenreCard key={genre.name} genre={genre} books={books} />)
          ) : (
            <p>No genres available.</p>
          )}
        </div>
      </section>

      <section className="borrowed-books">
        <h2>Borrowed Books</h2>
        <div className="grid">
          {borrowedBooks.length > 0 ? (
            borrowedBooks.map((book) => (
              <div key={book.Title} className="borrowed-book-card">
                <h3>{book.Title}</h3>
                <p>Borrowed on: {book.BorrowDate}</p>
                <p>Return by: {book.returnDate}</p>
                <p>Status: {book.status === true ? "Returned" : " Not Returned"}</p>
                <button onClick={() => handleReturnBook(book.Title)}>Return Book</button>
              </div>
            ))
          ) : (
            <p>No books borrowed yet.</p>
          )}
        </div>
      </section>

      {/* Manage Borrowed Books Section 
      <ManageBorrowedRecords 
        borrowedBooks={borrowedBooks} 
        onReturn={handleReturnBook}  // Pass the return handler to manage borrowed books
      />*/}
      
    </div>
  );
};

export default HomePage;
