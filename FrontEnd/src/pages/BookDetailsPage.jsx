import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getBookDetails } from '../services/api';

const BookDetailsPage = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);

  useEffect(() => {
    getBookDetails(id).then(setBook);
  }, [id]);

  if (!book) return <p>Loading...</p>;

  return (
    <div>
      <h1>{book.title}</h1>
      <p>Author: {book.author}</p>
      <p>Publisher: {book.publisher}</p>
      <p>Genre: {book.genre}</p>
      <p>{book.description}</p>
    </div>
  );
};

export default BookDetailsPage;