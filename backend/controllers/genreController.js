const { connectToDatabase, sql } = require("../server.js"); 

const getGenres = async (req, res) => {
  try {
    const pool = await connectToDatabase();
    const result = await pool.request().query("SELECT * FROM Genres");
    res.status(200).json(result.recordset);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const addGenre = async (req, res) => {
  const { name, description } = req.body;
  try {
    const pool = await connectToDatabase();
    await pool
      .request()
      .input("name", sql.NVarChar, name)
      .input("description", sql.NVarChar, description)
      .query("INSERT INTO Genres (Name, Description) VALUES (@name, @description)");
    res.status(201).json({ message: "Genre added successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getGenres, addGenre };
