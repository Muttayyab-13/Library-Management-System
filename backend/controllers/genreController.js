const sql=require('mssql');
const { connectToDatabase } = require('../server'); // Ensure this is importing your connection function

// get according to genre
const getGenres = async (req, res) => {
  try {
    const pool = await sql.connect(connectToDatabase);
    const result = await pool.request().query(`
      SELECT id, name, descriptions FROM Genres
    `);
    res.status(200).json(result.recordset);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



const addGenre = async (req, res) => {
  const { id, name, description } = req.body; // Expecting id, name, and description in the body
  try {
    const pool = await sql.connect(connectToDatabase);
    // Insert the genre with id, name, and description
    await pool
      .request()
      .input("id", sql.Int, id) // Optionally pass id if required (if not auto-generated)
      .input("name", sql.VarChar, name)
      .input("description", sql.VarChar, description)
      .query("INSERT INTO Genres (id, name, descriptions) VALUES (@id, @name, @description)");
      
    res.status(201).json({ message: "Genre added successfully" });
  } catch (error) {
    console.error("Error adding genre:", error);
    res.status(500).json({ error: error.message });
  }
};


module.exports = { getGenres, addGenre };
