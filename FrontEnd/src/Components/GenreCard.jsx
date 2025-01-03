import React, { useState } from "react";
import "../Styles/Componenets.css";

const GenreCard = ({ genre, books }) => {
  // State to handle whether the books for a specific genre are shown or not
  const [showBooks, setShowBooks] = useState(false);

  const handleToggleBooks = () => {
    // Toggle the visibility of books when the button is clicked
    setShowBooks(!showBooks);
  };

  return (
    <div className="genre-card">
      <h3>{genre.name}</h3>
      <p>{genre.descriptions}</p>
      {/* Button to show/hide books */}
      <button onClick={handleToggleBooks}>
        {showBooks ? "Hide Books" : "Show Books"}
      </button>

      {/* Display books when showBooks is true */}
      {showBooks && (
        <ul>
          {books
            .filter((book) => book.genre === genre.name)
            .map((book) => (
              <li key={book.title}>{book.title}</li>
            ))}
        </ul>
      )}
    </div>
  );
};

export default GenreCard;
