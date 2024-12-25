// src/controllers/userController.js
// User Registration


const registerUser= async (req, res) => {
  const { FirstName, LastName, Email, Password, confirmPassword } = req.body;

  if (!FirstName || !LastName || !Email || !Password || !confirmPassword || !budgetLimit) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {

    const pool = await sql.connect(dbConfig);
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

module.exports = { registerUser };
