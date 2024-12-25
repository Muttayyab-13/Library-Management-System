import React, { useState } from "react";
import BookCard from "../Components/BookCard";
import { searchBooks } from "../services/api";

const SearchPage = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const handleSearch = () => {
    searchBooks(query).then(setResults);
  };

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
          <BookCard key={book.id} book={book} />
        ))}
      </div>
    </div>
  );
};

export default SearchPage;
