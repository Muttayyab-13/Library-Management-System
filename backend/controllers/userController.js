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
      .query('SELECT id,Email, Password FROM users WHERE Email = @Email');

    if (result.recordset.length > 0) {
      // User found, generate a JWT token
      const user = result.recordset[0];
      const token = jwt.sign({ id: user.id, email: user.Email }, 'your_secret_key', { expiresIn: '1h' });

      res.status(200).json({
        success: true,
        message: 'Sign in successful',
        user: { id: user.id, email: user.Email },
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

const getAllUsers = async (req, res) => {
  try {
    // Connect to the database
    const pool = await sql.connect(connectToDatabase);

    // Fetch all users from the Users table
    const result = await pool.request().query('SELECT * FROM Users');

    // Return the users data
    res.json(result.recordset); // recordset contains the rows returned from SQL query
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Error fetching users' });
  }
};

const deleteUser = async (req, res) => {
  const { id } = req.params; // Use params for the ID instead of body

  try {
    const pool = await sql.connect(connectToDatabase);

    // Check if user exists in the database
    const checkUserResult = await pool.request()
      .input('id', sql.Int, id)
      .query('SELECT * FROM Users WHERE id = @id');

    if (checkUserResult.recordset.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Delete user
    await pool.request()
      .input('id', sql.Int, id)
      .query('DELETE FROM Users WHERE id = @id');

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Error deleting user' });
  }
};


  
const getNotifications = async (req, res) => {
  try {
    // Assume `userId` is passed as a query parameter
    const userId = req.query.userId;

    if (!userId) {
      return res.status(400).json({ error: 'UserId is required' });
    }

    const result = await sql.query`
      SELECT * 
      FROM Notifications 
      WHERE userId = ${userId} AND isRead = 0
    `;

    // Check if notifications exist
    if (result.recordset.length === 0) {
      return res.status(404).json({ message: 'No unread notifications found' });
    }

    // Return the notifications in the response
    res.json(result.recordset);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ error: 'Error fetching notifications' });
  }
};
// Endpoint to mark a notification as read

  

const markAsRead = async (req, res) => {
  try {
    const notificationId = req.params.id;
    const notificationIdInt = parseInt(notificationId, 10);

    // Ensure the ID is valid
    if (isNaN(notificationIdInt)) {
      return res.status(400).json({ error: 'Invalid notification ID' });
    }

    // Start a transaction
    const transaction = await sql.beginTransaction();

    try {
      // SQL query to update the notification
      await sql.query`UPDATE Notifications
                      SET isRead = 1
                      WHERE id = ${notificationIdInt}`;

      // Retrieve the updated notification
      const result = await sql.query`SELECT * FROM [Notifications] WHERE id = ${notificationIdInt}`;

      // Check if notification exists
      if (result.recordset.length === 0) {
        await transaction.rollback();  // Rollback if no notification is found
        return res.status(404).json({ error: 'Notification not found' });
      }

      // Commit the transaction if everything is successful
      await transaction.commit();

      res.status(200).json({ message: 'Notification marked as read' });

    } catch (error) {
      await transaction.rollback();  // Rollback if an error occurs during the transaction
      console.error('Error during transaction:', error);
      res.status(500).json({ error: 'Error updating notification' });
    }

  } catch (error) {
    console.error('Error updating notification:', error);
    res.status(500).json({ error: 'Error updating notification' });
  }
};






module.exports = { registerUser,signInUser,getAllUsers,deleteUser,markAsRead,getNotifications};
