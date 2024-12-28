const sql=require('mssql');
const { connectToDatabase } = require('../server'); // Ensure this is importing your connection function


const getAllBooks = async (req, res) => {
  try {
    // Connect to the database using the pool connection
    const pool = await sql.connect(connectToDatabase);

    // Execute the query
    const result = await pool.request().query(`
      SELECT 
        b.ISBN,
        g.name AS genre,
        b.title,
        p.name AS publisher,
        a.name AS author
      FROM 
        BooksCopies1 b
      JOIN 
        Genres g ON b.genre_id = g.id
      JOIN 
        Publishers p ON b.publisher_id = p.id
      JOIN 
        Authors a ON b.author_id = a.id;
    `);

    // Send the result back as JSON
    res.status(200).json(result.recordset);
  } catch (error) {
    // Handle any errors
    console.error('Error fetching books:', error);
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

module.exports = { getAllBooks, getFeaturedBooks, addBook };
