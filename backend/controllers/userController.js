const sql=require('mssql');
const { connectToDatabase } = require('../server');
const jwt=require("jsonwebtoken")

const registerUser= async (req, res) => {
  const { FirstName, LastName, Email, Password, confirmPassword } = req.body;

  if (!FirstName || !LastName || !Email || !Password || !confirmPassword ) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {

    const pool = await sql.connect(connectToDatabase);
    await pool.request()
      .input('FirstName', sql.VarChar, FirstName)
      .input('LastName', sql.VarChar, LastName)
      .input('Email', sql.VarChar, Email)
      .input('Password', sql.VarChar, Password)
      .input('confirmPassword', sql.VarChar, confirmPassword)
      .query(`
        INSERT INTO Users (FirstName, LastName, Email, Password, confirmPassword) 
        VALUES (@FirstName, @LastName, @Email, @Password, @confirmPassword)
      `);

    res.status(201).json({ message: 'User created successfully!' });
  } catch (error) {
    console.error('Database query failed:', error);
    res.status(500).json({ message: 'Error creating user. Please try again.' });
  }
};

// User sign-in route
const signInUser= async (req, res) => {
  const { Email, Password } = req.body;

  if (!Email || !Password) {
    return res.status(400).json({ message: 'Email and Password are required' });
  }

  try {
    const pool = await sql.connect(connectToDatabase);
    const result = await pool.request()
      .input('Email', sql.VarChar, Email)
      .input('Password', sql.VarChar, Password)
      .query('SELECT Email, Password FROM users WHERE Email = @Email');

    if (result.recordset.length > 0) {
      // User found, generate a JWT token
      const user = result.recordset[0];
      const token = jwt.sign({ id: user.Id, email: user.Email }, 'your_secret_key', { expiresIn: '1h' });

      res.status(200).json({
        success: true,
        message: 'Sign in successful',
        user: { id: user.Id, email: user.Email },
        token, // Send token to the frontend
      });
    } else {
      res.status(401).json({
        success: false,
        message: 'Invalid Email or Password',
      });
    }
  } catch (error) {
    console.error('Database query failed:', error);
    res.status(500).json({ message: 'Error signing in. Please try again.' });
  }
};

module.exports = { registerUser,signInUser };
