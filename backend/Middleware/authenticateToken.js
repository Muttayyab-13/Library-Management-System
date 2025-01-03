const jwt = require('jsonwebtoken');
//const config = require('../config/dbConfig'); // Your database or JWT config
require('dotenv').config();
 

// Middleware to authenticate user
const authenticateUser = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];  // Extract token from Authorization header

  if (!token) {
    return res.status(401).json({ message: 'Authorization required' });
  }

  try {
    // Verify token using JWT secret
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Attach user information to the request object
    req.user = { id: decoded.id, email: decoded.email };  // You can also store the role or other user data here

    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};


module.exports = { authenticateUser };
