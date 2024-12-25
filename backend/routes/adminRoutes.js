const express = require("express");
const sql = require("mssql");

const router = express.Router();

// Endpoint: Add a new admin
router.post("/add", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const request = new sql.Request();
    const query = `
      INSERT INTO Admin (name, email, password, created_at)
      VALUES ('${name}', '${email}', '${password}', GETDATE());
    `;
    await request.query(query);
    res.status(201).json({ message: "Admin added successfully!" });
  } catch (error) {
    console.error("Error adding admin:", error);
    res.status(500).json({ error: "Failed to add admin." });
  }
});

// Endpoint: Get all admins
router.get("/", async (req, res) => {
  try {
    const request = new sql.Request();
    const result = await request.query("SELECT * FROM Admin");
    res.status(200).json(result.recordset);
  } catch (error) {
    console.error("Error fetching admins:", error);
    res.status(500).json({ error: "Failed to fetch admins." });
  }
});

// Endpoint: Update admin details
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { name, email, password } = req.body;

  try {
    const request = new sql.Request();
    const query = `
      UPDATE Admin
      SET name = '${name}', email = '${email}', password = '${password}'
      WHERE id = ${id};
    `;
    await request.query(query);
    res.status(200).json({ message: "Admin updated successfully!" });
  } catch (error) {
    console.error("Error updating admin:", error);
    res.status(500).json({ error: "Failed to update admin." });
  }
});

// Endpoint: Delete an admin
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const request = new sql.Request();
    const query = `DELETE FROM Admin WHERE id = ${id}`;
    await request.query(query);
    res.status(200).json({ message: "Admin deleted successfully!" });
  } catch (error) {
    console.error("Error deleting admin:", error);
    res.status(500).json({ error: "Failed to delete admin." });
  }
});

module.exports = router;
