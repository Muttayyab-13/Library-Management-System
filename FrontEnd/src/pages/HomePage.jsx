import React, { useEffect, useState } from "react";
import BookCard from "../Components/BookCard";
import GenreCard from "../Components/GenreCard";
import { getFeaturedBooks, getGenres } from "../services/api";
import "../Styles/HomePage.css";

const HomePage = () => {
  const [books, setBooks] = useState([]);
  const [genres, setGenres] = useState([]);

  useEffect(() => {
    // Fetch featured books and genres on component mount
    getFeaturedBooks().then(setBooks).catch(console.error);
    getGenres().then(setGenres).catch(console.error);
  }, []);

  return (
    <div>
      <header className="hero">
        <h1>Welcome to the Online Library</h1>
        <p>Find your next great read from our vast collection of books!</p>
      </header>

      <section className="featured-books">
        <h2>Featured Books</h2>
        <div className="grid">
          {books.length > 0 ? (
            books.map((book) => <BookCard key={book.id} book={book} />)
          ) : (
            <p>No books available.</p>
          )}
        </div>
      </section>

      <section className="genres">
        <h2>Browse by Genres</h2>
        <div className="grid">
          {genres.length > 0 ? (
            genres.map((genre) => <GenreCard key={genre.id} genre={genre} />)
          ) : (
            <p>No genres available.</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
