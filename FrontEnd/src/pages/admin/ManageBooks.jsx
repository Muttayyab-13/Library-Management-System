import React, { useState, useEffect } from "react";
import AdminTable from "../../Components/AdminTable";
import Modal from "../../Components/Modal";
import { getAllBooks, createBook, updateBook, deleteBook } from "../../services/api";

const ManageBooks = () => {
  const [books, setBooks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentBook, setCurrentBook] = useState(null);

  useEffect(() => {
    getAllBooks().then(setBooks);
  }, []);

  const handleSave = async (book) => {
    try {
      if (book.title) {
        // If the book already exists, update it
        await updateBook(book); // Await the updateBook API call
  
        // Update the list of books in the state with the modified book
        setBooks(books.map((b) => (b.title === book.title ? book : b)));
        alert("Book updated successfully"); // Optional success alert
      } else {
        // If it's a new book, create it
        const newBook = await createBook(book); // Await the createBook API call
  
        // Add the new book to the state
        setBooks([...books, newBook]);
        alert("Book added successfully"); // Optional success alert
      }
    } catch (error) {
      // Catch any errors that occur during the API call
      console.error("Error saving book:", error);
      alert(`An error occurred: ${error.response ? error.response.data.error : error.message}`);
    } finally {
      // Close the modal regardless of success or failure
      setShowModal(false);
    }
  };
  

  const handleDelete = async (title) => {
    try {
      const response = await deleteBook(title);
      if (response.error) {
        alert(response.error);
      } else {
        setBooks(books.filter((b) => b.title !== title));
        alert("Book deleted successfully");
      }
    } catch (error) {
      console.error("Error deleting book:", error);
      alert("An error occurred while deleting the book.");
    }
  };

  const handleEdit = (book) => {
    setCurrentBook(book);  // Set the entire book object here
    setShowModal(true);     // Open the modal to edit the selected book
  };

  return (
    <div>
      <h1>Manage Books</h1>
      <AdminTable data={books} onEdit={handleEdit} onDelete={handleDelete} />
      {showModal && <Modal onClose={() => setShowModal(false)} onSave={handleSave}  />}
    </div>
  );
};


export default ManageBooks;
