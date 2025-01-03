import React from "react";
import "../Styles/Componenets.css";

const BookCard = ({ book,onBorrow }) => (
  <div className="book-card">
    <h3>{book.title}</h3>
    <p>Author: {book.author}</p>
    {/* <button>View Details</button> */}
    {/* Borrow Button */}
    <button onClick={() => onBorrow(book.title)}>Borrow</button>
  </div>
);

export default BookCard;
