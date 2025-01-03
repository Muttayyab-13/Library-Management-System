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
    `  );

    
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
    // Establish a connection to the database
    const pool = await sql.connect(connectToDatabase);

    // Query to fetch featured books
    const result = await pool.request()
      .query(`SELECT b.title,a.name AS author
        FROM BooksCopies1 b
        join Authors a on a.id=b.author_id
        WHERE is_featured = 1`); // Adjust this query based on your schema
    // Return the result of the query as a JSON response
    res.status(200).json(result.recordset); // recordset contains the rows returned from the query
  } catch (error) {
    console.error('Error fetching featured books from SQL Server:', error);
    res.status(500).json({ error: 'Failed to fetch featured books from SQL Server' });
  }
};


// Add a new book
const addBook = async (req, res) => {
  const { title, author, genre, publisher, noOfCopies } = req.body;

  try {
    const pool = await sql.connect(connectToDatabase);

    // Retrieve the author_id from the Authors table
    const authorResult = await pool
      .request()
      .input("author", sql.NVarChar, author)
      .query("SELECT id FROM Authors WHERE name = @author");

    if (authorResult.recordset.length === 0) {
      return res.status(400).json({ error: "Author not found" });
    }

    const author_id = authorResult.recordset[0].id;

    // Retrieve the genre_id from the Genres table
    const genreResult = await pool
      .request()
      .input("genre", sql.NVarChar, genre)
      .query("SELECT id FROM Genres WHERE name = @genre");

    if (genreResult.recordset.length === 0) {
      return res.status(400).json({ error: "Genre not found" });
    }

    const genre_id = genreResult.recordset[0].id;

    // Retrieve the publisher_id from the Publishers table
    const publisherResult = await pool
      .request()
      .input("publisher", sql.NVarChar, publisher)
      .query("SELECT id FROM Publishers WHERE name = @publisher");

    if (publisherResult.recordset.length === 0) {
      return res.status(400).json({ error: "Publisher not found" });
    }

    const publisher_id = publisherResult.recordset[0].id;

    // Insert the book into the BooksCopies1 table with the respective IDs
    await pool
      .request()
      .input("title", sql.VarChar, title)
      .input("author_id", sql.Int, author_id)
      .input("genre_id", sql.Int, genre_id)
      .input("publisher_id", sql.Int, publisher_id)
      .input("copiesAvailable", sql.Int, noOfCopies)
      .query(
        "INSERT INTO BooksCopies1 (Title, Author_id, Genre_id, Publisher_id, noOfCopies) VALUES (@title, @author_id, @genre_id, @publisher_id, @copiesAvailable)"
      );

    res.status(201).json({ message: "Book added successfully" });

  } catch (error) {
    console.error('Error adding book:', error);
    res.status(500).json({ error: error.message });
  }
};


// Function to borrow a book
const borrowBook = async (req, res) => {
  const { bookTitle, userId } = req.body; // Assuming user ID is available via authentication
  const today = new Date();
  const dueDate = new Date(today);
  dueDate.setDate(today.getDate() + 14); // Set due date to 14 days later

  try {
    const pool = await sql.connect(connectToDatabase);


    // Check if the book exists and if it's already borrowed
    const book = await pool.request()
      .input('bookTitle', sql.VarChar, bookTitle)
      .query('SELECT * FROM BooksCopies1 WHERE title= @bookTitle AND noOfCopies > 0');

    if (book.recordset.length === 0) {
      return res.status(400).json({ message: "Book not available or already borrowed" });
    }

    // Mark the book as borrowed
    await pool.request()
      .input('bookTitle', sql.VarChar, bookTitle)
      .query('UPDATE BooksCopies1 SET noOfCopies = noOfCopies-1 WHERE title = @bookTitle');

    // Insert a record into the BorrowedBooks table
    await pool.request()
      .input('userId', sql.Int, userId)
      .input('dueDate', sql.DateTime, dueDate)
      .input('today', sql.DateTime, today)
      .input('bookTitle', sql.VarChar, bookTitle)
      .query('INSERT INTO borrowRecords (user_id,book_title,borrowDate,returnDate,Status) VALUES ( @userId,@bookTitle ,@today, @dueDate, 1)');

    return res.status(200).json({ message: "Book borrowed successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

const returnBook = async (req, res) => {
  const { bookTitle, userId } = req.body;  // Extract bookTitle and userId from the request body
  const today = new Date();

  try {
    const pool = await sql.connect(connectToDatabase);

    // Check if the book is borrowed by the user
    const borrowedBook = await pool.request()
      .input('bookTitle', sql.VarChar, bookTitle)
      .input('userId', sql.Int, userId)
      .query('SELECT * FROM borrowRecords WHERE user_id = @userId AND book_title = @bookTitle AND Status = 1');  // Status 1 means borrowed

    if (borrowedBook.recordset.length === 0) {
      return res.status(400).json({ message: "Book not borrowed by this user" });
    }

    // Mark the book as returned (update BooksCopies1 table)
    await pool.request()
      .input('bookTitle', sql.VarChar, bookTitle)
      .query('UPDATE BooksCopies1 SET noOfCopies = noOfCopies + 1 WHERE title = @bookTitle');
      await pool.request()
      .input('bookTitle', sql.VarChar, bookTitle)
      .input('userId', sql.Int, userId)
      .input('today', sql.DateTime, today)
      .query('UPDATE borrowRecords SET actualReturnDate = @today, Status = 0 WHERE user_id = @userId AND book_title = @bookTitle AND Status = 1');  // Status 0 means returned

    // Update the borrowRecords table to mark the book as returned
    await pool.request()
      .input('bookTitle', sql.VarChar, bookTitle)
      .input('userId', sql.Int, userId)
      .input('today', sql.DateTime, today)
      .query('DELETE FROM borrowRecords WHERE user_id = @userId AND book_title = @bookTitle AND Status = 1');  // Status 0 means returned

    return res.status(200).json({ message: "Book returned successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};



/// Function to get a list of borrowed books for a user
const getBorrowedBooks = async (req, res) => {
  try {
    const { userId } = req.query; // Extract userId from the request query parameters
    console.log(userId); // Debugging line, you can remove it in production.

    // Connect to the database using the pool connection
    const pool = await sql.connect(connectToDatabase);

    // Execute the query to fetch borrowed books based on the userId
    const result = await pool.request()
      .input('userId', sql.Int, userId)
      .query(`
        SELECT 
          b.Title, 
          bb.BorrowDate, 
          bb.returnDate, 
          bb.Status 
        FROM 
          borrowRecords bb 
        INNER JOIN 
          BooksCopies1 b ON bb.book_title = b.Title
        WHERE 
          bb.user_id = @userId AND bb.Status = 1;
      `);

    // Check if no records are found
    if (result.recordset.length === 0) {
      return res.status(404).json({ message: "No borrowed books found" });
    }

    // Send the result back as JSON
    res.status(200).json(result.recordset);  // The result already contains the necessary values

  } catch (error) {
    // Handle any errors
    console.error('Error fetching borrowed books:', error);
    res.status(500).json({ error: error.message });
  }
};



// Controller function to handle book search
const searchBooks = async (req, res) => {
  const { q } = req.query; // Get the query parameter

  if (!q) {
    return res.status(400).json({ error: 'Query parameter `q` is required' });
  }

  try {
    
    const pool = await sql.connect(connectToDatabase);

    const result = await pool.request()
      .input('searchQuery', sql.VarChar, `%${q}%`)  // Use NVarChar for string search
      .query( ` SELECT b.title,a.name as Author FROM BooksCopies1 b
join Authors a on a.id=b.author_id  
WHERE b.Title LIKE @searchQuery OR a.name LIKE @searchQuery ` );

    // Send the search results back to the client
    return res.json(result.recordset);  // Return the list of books
  } catch (error) {
    console.error('Database error:', error);
    return res.status(500).json({ error: 'Database error occurred' });
  } 
};



// Update Book by Title
const updateBook = async (req, res) => {
  const { title, author, genre, publisher, noOfCopies } = req.body;

  if (!title || !author || !genre || !publisher || !noOfCopies) {
    return res.status(400).json({ error: 'Title, author, genre, publisher, and number of copies are required' });
  }

  try {
    const pool = await sql.connect(connectToDatabase);

    // Step 1: Retrieve the author_id from the Authors table
    const authorResult = await pool.request()
      .input('author', sql.VarChar, author)
      .query(`
        SELECT id FROM Authors WHERE name = @author
      `);

    if (authorResult.recordset.length === 0) {
      return res.status(404).json({ error: 'Author not found' });
    }
    const author_id = authorResult.recordset[0].id;

    // Step 2: Retrieve the genre_id from the Genres table
    const genreResult = await pool.request()
      .input('genre', sql.VarChar, genre)
      .query(`
        SELECT id FROM Genres WHERE name = @genre
      `);

    if (genreResult.recordset.length === 0) {
      return res.status(404).json({ error: 'Genre not found' });
    }
    const genre_id = genreResult.recordset[0].id;

    // Step 3: Retrieve the publisher_id from the Publishers table
    const publisherResult = await pool.request()
      .input('publisher', sql.VarChar, publisher)
      .query(`
        SELECT id FROM Publishers WHERE name = @publisher
      `);

    if (publisherResult.recordset.length === 0) {
      return res.status(404).json({ error: 'Publisher not found' });
    }
    const publisher_id = publisherResult.recordset[0].id;

    // Step 4: Update the book in the BooksCopies1 table
    const result = await pool.request()
      .input('title', sql.VarChar, title)
      .input('author_id', sql.Int, author_id)
      .input('genre_id', sql.Int, genre_id)
      .input('publisher_id', sql.Int, publisher_id)
      .input('noOfCopies', sql.Int, noOfCopies)
      .query(`
        UPDATE BooksCopies1
        SET 
          author_id = @author_id,
          genre_id = @genre_id,
          publisher_id = @publisher_id,
          noOfCopies = @noOfCopies
        WHERE title = @title
      `);

    if (result.rowsAffected === 0) {
      return res.status(404).json({ error: 'Book not found' });
    }

    return res.json({ message: 'Book updated successfully' });
  } catch (error) {
    console.error('Database error:', error);
    return res.status(500).json({ error: 'Database error occurred' });
  }
};

// Delete Book by Title
  
  
const deleteBook = async (req, res) => {
  const { title } = req.body;

  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }

  try {
    const pool = await sql.connect(connectToDatabase);

    // Check if the book is currently borrowed (in the borrow records table)
    const borrowCheckResult = await pool.request()
      .input('title', sql.VarChar, title)
      .query(`
        SELECT COUNT(*) AS count FROM borrowRecords WHERE book_title = @title `);

    const isBorrowed = borrowCheckResult.recordset[0].count > 0;

    if (isBorrowed) {
      // If the book is currently borrowed (i.e., returnDate is NULL), prevent deletion
      return res.status(400).json({ error: 'Book is currently borrowed and cannot be deleted' });
    }

    // Proceed with the deletion from BooksCopies1 table
    const result = await pool.request()
      .input('title', sql.VarChar, title)
      .query(`
        DELETE FROM BooksCopies1 
        WHERE title = @title
      `);

    if (result.rowsAffected === 0) {
      return res.status(404).json({ error: 'Book not found' });
    }

    return res.json({ message: 'Book deleted successfully' });
  } catch (error) {
    console.error('Database error:', error);
    return res.status(500).json({ error: 'Database error occurred' });
  }
};


// Route to get overdue books and send notifications
  
  const overdueBooks=async (req, res) => {
  const currentDate = new Date();
  try {
    // Establish a connection to the database
    const pool = await sql.connect(connectToDatabase);

    // Query to find all overdue books (those that have not been returned yet and the returnDate has passed)
    const result = await pool.request()
      .input('currentDate', sql.DateTime, currentDate)
      .query(`
        SELECT * 
        FROM borrowRecords
        WHERE actualReturnDate IS NULL  
          AND returnDate < @currentDate;  
      `);

    const overdueBooks = result.recordset;

    // Process overdue books, calculate fines and send notifications
    const overdueWithFines = [];
    
    for (let book of overdueBooks) {
      const fine = calculateFine(book.returnDate, currentDate);  // Calculate fine based on overdue days

      if (fine > 0) {
        // Insert the fine into the Fines table
        await pool.request()
          .input('userId', sql.Int, book.userId)
          .input('bookTitle', sql.VarChar, book.title)
          .input('fineAmount', sql.Decimal, fine)
          .input('fineDate', sql.DateTime, currentDate)
          .query(`
            INSERT INTO Fines (userId, book_title, fineAmount, fineDate)
            VALUES (@userId, @bookTitle, @fineAmount, @fineDate);
          `);
      }

      // Insert a notification for the overdue book
      await pool.request()
        .input('userId', sql.Int, book.userId)
        .input('message', sql.VarChar, `Your book "${book.title}" is overdue. A fine of $${fine} has been applied.`)
        .input('notificationDate', sql.DateTime, currentDate)
        .query(`
          INSERT INTO Notifications (userId, message, notificationDate)
          VALUES (@userId, @message, @notificationDate);
        `);

      // Add the fine information to the overdueBooks list
      overdueWithFines.push({
        ...book,
        fine: fine
      });
    }

    res.json(overdueWithFines);  // Return the list of overdue books with fines
  } catch (error) {
    console.error('Error fetching overdue books:', error);
    res.status(500).json({ error: 'Error fetching overdue books' });
  }
};

// Function to calculate fine based on days overdue
const calculateFine = (returnDate, currentDate) => {
  const difference = Math.ceil((currentDate - new Date(returnDate)) / (1000 * 3600 * 24));  // Difference in days
  return difference > 0 ? difference * 1 : 0;  // Assuming a fine of $1 per day overdue
};






// Export the controller functions
module.exports = { getAllBooks, getFeaturedBooks, addBook ,
  borrowBook, returnBook, getBorrowedBooks,
  searchBooks,deleteBook,updateBook,overdueBooks};
