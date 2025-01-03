import React, { useState } from "react";

const Modal = ({ onClose, onSave, data }) => {
  const [title, setTitle] = useState(data ? data.title : "");
  const [author, setAuthor] = useState(data ? data.author : "");
  const [genre, setGenre] = useState(data ? data.genre : "");
  const [publisher, setPublisher] = useState(data ? data.publisher : "");
  const [ISBN, setISBN] = useState(data ? data.ISBN : "");
  const [noOfCopies, setNoOfCopies] = useState(data ? data.noOfCopies : "");

  const handleSave = () => {
    if (!title || !author || !genre || !publisher || !ISBN || !noOfCopies) {
      alert("Please fill all fields");
      return;
    }

    const newBook = { title, author, genre, publisher, ISBN, noOfCopies };
    onSave(newBook);
  };

  return (
    <div className="modal">
      <h2>{data ? "Edit Book" : "Add Book"}</h2>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
      />
      <input
        type="text"
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
        placeholder="Author"
      />
      <input
        type="text"
        value={genre}
        onChange={(e) => setGenre(e.target.value)}
        placeholder="Genre"
      />
      <input
        type="text"
        value={publisher}
        onChange={(e) => setPublisher(e.target.value)}
        placeholder="Publisher"
      />
      <input
        type="text"
        value={ISBN}
        onChange={(e) => setISBN(e.target.value)}
        placeholder="ISBN"
      />
      <input
        type="number"
        value={noOfCopies}
        onChange={(e) => setNoOfCopies(e.target.value)}
        placeholder="Number of Copies"
      />
      <button onClick={handleSave}>Save</button>
      <button onClick={onClose}>Cancel</button>
    </div>
  );
};

export default Modal;
