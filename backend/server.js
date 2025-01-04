const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const sql = require("mssql");
require('dotenv').config();


// Importing Routes
const bookRoutes = require("./routes/bookRoutes");
const genreRoutes = require("./routes/genreRoutes");
const adminRoutes = require("./routes/adminRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();

// Enable CORS and body parsing middleware
app.use(cors());
app.use(bodyParser.json());

// Database Configuration
const dbConfig = {
  user: 'sa',
  password: '1234',
  server: 'localhost',
  database: 'project',
  port: 1433,
  options: {
    encrypt: false,
    trustServerCertificate: true,
    requestTimeout: 300000,
    integratedSecurity: true,
  },
};

// Connect to the Database
const connectToDatabase = async () => {
  try {
    console.log("Attempting to connect to the database...");
    await sql.connect(dbConfig);
    console.log("Connected to SQL Server successfully!");
  } catch (error) {
    console.error("Database connection failed:", error);
  }
};

// Call the database connection function
connectToDatabase();

// Routes
app.get("/", (req, res) => {
  res.send("Welcome to the Library Management System Backend!");
});


app.use("/books", bookRoutes);
app.use("/genres", genreRoutes);
app.use("/admin", adminRoutes);
app.use("/register", userRoutes);
app.use("/signIn", userRoutes);
app.use("/users", userRoutes);
app.use("/fines", userRoutes);

// Start the Server
const port = 3001;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

module.exports = { sql, connectToDatabase };
