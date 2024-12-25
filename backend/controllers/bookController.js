const { connectToDatabase, sql } = require("../server.js");

// Get all books
const getBooks = async (req, res) => {
  try {
    const pool = await connectDB();
    const result = await pool.request().query("SELECT * FROM Books");
    res.status(200).json(result.recordset);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get featured books
const getFeaturedBooks = async (req, res) => {
  try {
    const pool = await connectToDatabase();
    const result = await pool
      .request()
      .query("SELECT TOP 5 * FROM Books WHERE IsFeatured = 1");
    res.status(200).json(result.recordset);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Add a new book
const addBook = async (req, res) => {
  const { title, author, genre, publisher, copiesAvailable } = req.body;
  try {
    const pool = await connectToDatabase();
    await pool
      .request()
      .input("title", sql.NVarChar, title)
      .input("author", sql.NVarChar, author)
      .input("genre", sql.NVarChar, genre)
      .input("publisher", sql.NVarChar, publisher)
      .input("copiesAvailable", sql.Int, copiesAvailable)
      .query(
        "INSERT INTO Books (Title, Author, Genre, Publisher, CopiesAvailable) VALUES (@title, @author, @genre, @publisher, @copiesAvailable)"
      );
    res.status(201).json({ message: "Book added successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getBooks, getFeaturedBooks, addBook };
