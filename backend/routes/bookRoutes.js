const express = require("express");
const { getAllBooks, addBook, getFeaturedBooks, searchBooks,deleteBook,updateBook,overdueBooks  } = require("../controllers/bookController");
const { borrowBook, returnBook, getBorrowedBooks } = require('../controllers/bookController');
const { authenticateUser } = require('../Middleware/authenticateToken'); // Authentication middleware



const router = express.Router();

router.get("/allBooks", getAllBooks);
router.get("/featured", getFeaturedBooks);
router.get("/search", searchBooks);
router.post('/borrow', borrowBook);

// Route to return a borrowed book
router.post('/return', returnBook);

// Route to get borrowed books for a user
router.get('/borrowed', getBorrowedBooks);

// Create a new book
router.post('/createBook', addBook);

router.get('/overdueBooks', overdueBooks);

// Delete a book
router.delete('/deleteBook',deleteBook)

router.put('/updateBook',updateBook)


module.exports = router;
