import React, { useState, useEffect } from "react";
import AdminTable from "../../Components/AdminTable";
import Modal from "../../Components/Modal";
import { getBooks, createBook, updateBook, deleteBook } from "../../services/api";

const ManageBooks = () => {
  const [books, setBooks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentBook, setCurrentBook] = useState(null);

  useEffect(() => {
    getBooks().then(setBooks);
  }, []);

  const handleSave = (book) => {
    if (book.id) {
      updateBook(book).then(() => {
        setBooks(books.map((b) => (b.id === book.id ? book : b)));
      });
    } else {
      createBook(book).then((newBook) => {
        setBooks([...books, newBook]);
      });
    }
    setShowModal(false);
  };

  const handleDelete = (id) => {
    deleteBook(id).then(() => {
      setBooks(books.filter((b) => b.id !== id));
    });
  };

  return (
    <div>
      <h1>Manage Books</h1>
      <button onClick={() => setShowModal(true)}>Add Book</button>
      <AdminTable data={books} onEdit={setCurrentBook} onDelete={handleDelete} />
      {showModal && (
        <Modal onClose={() => setShowModal(false)} onSave={handleSave} data={currentBook} />
      )}
    </div>
  );
};

export default ManageBooks;
