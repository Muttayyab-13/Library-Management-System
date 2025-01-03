import React, { useState } from "react";
import { createBook } from "../services/api";  // Import the API function for creating a book
import "../Styles/AddBookForm.css";  // Assuming you have styles for your form

const AddBookForm = () => {
  // State to store the form fields
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [genre, setGenre] = useState("");
  const [publisher, setPublisher] = useState("");
  const [ISBN, setISBN] = useState("");
  const [error, setError] = useState("");

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate the form fields
    if (!title || !author || !genre || !publisher || !ISBN) {
      setError("All fields are required");
      return;
    }

    try {
      const newBook = {
        title,
        author,
        genre,
        publisher,
        ISBN,
      };
      
      // Call the API to create a new book
      const response = await createBook(newBook);
      console.log("Book added successfully:", response);
      
      // Reset form fields after successful submission
      setTitle("");
      setAuthor("");
      setGenre("");
      setPublisher("");
      setISBN("");
      setError("");  // Clear any previous errors
    } catch (error) {
      setError("There was an error adding the book");
      console.error("Error adding book:", error);
    }
  };

  return (
    <div className="add-book-form">
      <h2>Add a New Book</h2>
      
      {/* Display error message */}
      {error && <p className="error">{error}</p>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="author">Author:</label>
          <input
            type="text"
            id="author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="genre">Genre:</label>
          <input
            type="text"
            id="genre"
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="publisher">Publisher:</label>
          <input
            type="text"
            id="publisher"
            value={publisher}
            onChange={(e) => setPublisher(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="ISBN">ISBN:</label>
          <input
            type="text"
            id="ISBN"
            value={ISBN}
            onChange={(e) => setISBN(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="submit-button">Add Book</button>
      </form>
    </div>
  );
};

export default AddBookForm;
