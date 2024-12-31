import React, { useEffect, useState } from "react";
import BookCard from "../Components/BookCard";
import GenreCard from "../Components/GenreCard";
import { getFeaturedBooks, getGenres, getAllBooks } from "../services/api";  // assuming getAllBooks exists in your api services
import "../Styles/HomePage.css";
import Navbar from "../Components/Navbar";
import "../Styles/Componenets.css";

const HomePage = () => {
  const [books, setBooks] = useState([]);
  
  const [featuredBooks, setFeaturedBooks] = useState([]);

  const [genres, setGenres] = useState([]);
  const [showAllBooks, setShowAllBooks] = useState(false);  // Track whether to show all books

  useEffect(() => {
    // Fetch featured books and genres on component mount
    getFeaturedBooks().then(setFeaturedBooks).catch(console.error);
    getAllBooks().then(setBooks).catch(console.error);
    getGenres().then(setGenres).catch(console.error);

    
  }, []);

  const handleToggleBooks = () => {
    // Toggle the visibility of books when the button is clicked
    setShowAllBooks(!showAllBooks);
  };



  return (
    <div className="main">
      <header className="hero">
        <h1>Welcome to the Online Library</h1>
        <p>Find your next great read from our vast collection of books!</p>
      </header>
      <Navbar/>
      
      <section className="featured-books">
        <h2>Featured Books</h2>
        <div className="grid">
          {featuredBooks.length > 0 ? (
            featuredBooks.map((book) => <BookCard key={book.id} book={book} />)
          ) : (
            <p>No books available.</p>
          )}
        </div>
        <div>
        <h2>All Books</h2>

        
        {/* Button to show all books */}
        <button onClick={handleToggleBooks} style={{ marginBottom: '15px' }}>
        {showAllBooks ? "Hide Books" : "Show Books"}
      </button>
        {showAllBooks &&  (books.length > 0 ? (
            books.map((book) => <BookCard key={book.id} book={book} />)
           ): (
            <p>No books available.</p>
          ))}
      </div>
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
    </div>
  );
};

export default HomePage;
