import React from "react";
import "../Styles/Componenets.css";

const BookCard = ({ book }) => (
  <div className="book-card">
    <h3>{book.title}</h3>
    <p>Author: {book.author}</p>
    {/* <button>View Details</button> */}
  </div>
);

export default BookCard;
