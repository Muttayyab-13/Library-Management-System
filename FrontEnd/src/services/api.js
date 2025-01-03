import axios from 'axios';


const API_URL = "http://localhost:3001/backend";




export const getAllBooks = () => {
  return axios.get('http://localhost:3001/books/allBooks')
    .then(response => response.data)  // Axios provides the response data directly
    .catch(error => {
      console.error('Error fetching books:', error);
      throw error;  // Rethrow or handle error accordingly
    });
};

export const getGenres = () => {
  return axios.get('http://localhost:3001/genres/get')  // Adjust the URL to match your API
    .then(response => response.data)
    .catch(error => {
      console.error('Error fetching genres:', error);
      throw error;
    });
};

export const getFeaturedBooks = async () => {
  try {
    const response = await axios.get(`http://localhost:3001/books/featured`); 
    return response.data; // axios returns the response data directly
  } catch (error) {
    console.error("Error fetching featured books:", error);
    throw error; // Rethrow the error to allow further handling by the calling code
  }
};

export const getBorrowedBooks = async (userId) => {
  try {
    if (!userId) {
      throw new Error("userId is required and cannot be empty");
    }
    // Pass the userId as a query parameter in the URL
    const response = await axios.get('http://localhost:3001/books/borrowed', {
      params: { userId },  // This will automatically append `?userId=value` to the URL
    });

    // Return the response data directly
    return response.data;  
  } catch (error) {
    console.error("Error fetching borrowed books:", error);
    throw error;  // Rethrow the error to allow further handling by the calling code
  }
};



// Function to borrow a book without authorization header
export const borrowBook = async (bookTitle,userId) => {
  try {
    // Make the POST request without the token in the Authorization header
    const response = await axios.post(
      'http://localhost:3001/books/borrow', 
      {bookTitle,userId} // Request payload
    );
    
    // Return the response data
    return response.data;
  } catch (error) {
    console.error("Error borrowing book:", error);
    throw error;  // Rethrow error for handling at a higher level
  }
};


// Function to return a borrowed book without authorization header
export const returnBook = async (bookTitle,userId) => {
  return axios
    .post('http://localhost:3001/books/return', { bookTitle,userId })  // Direct POST request without route parameter or auth header
    .then((response) => response.data)  // Return the response data
    .catch((error) => {
      console.error("Error returning book:", error);
      throw error;  // Rethrow error for handling at a higher level
    });
};



// Create Book API Call
export const createBook = async (book) => {
  try {
    const res = await axios.post(`http://localhost:3001/books/createBook`, book, {
      headers: { "Content-Type": "application/json" },
    });
    return res.data;  // Return the response data
  } catch (error) {
    console.error("Error creating book:", error);
    throw error;
  }
};

// Update Book API Call
export const updateBook = async (book) => {
  try {
    const res = await axios.put(`http://localhost:3001/books/updateBook`, book, {
      headers: { "Content-Type": "application/json" },
    });
    return res.data;  // Return the response data
  } catch (error) {
    console.error("Error updating book:", error);
    throw error;
  }
};

// Delete Book API Call
export const deleteBook = async (title) => {
  try {
    const res = await axios.delete(`http://localhost:3001/books/deleteBook`, {
      data: { title },  // Send title in the request body instead of URL
      headers: { "Content-Type": "application/json" },
    });
    return res.data;  // Return the response data
  } catch (error) {
    console.error("Error deleting book:", error);
    // If the error is due to the book being borrowed, display a specific message
    if (error.response && error.response.data && error.response.data.error) {
      return error.response.data.error;  // Return the error message from backend
    }
    throw error;
  }
};




export const searchBooks = async (query) => {
  try {
    const response = await axios.get(`http://localhost:3001/books/search?q=${query}`);
    return response.data;
  } catch (error) {
    console.error('Error searching books:', error);
    throw error;
  }
};
 
  

  export const getUserNotifications = async () => {
    const res = await fetch(`${API_URL}/notifications/user`);
    return res.json();
  };

  export const getUserBorrowRecords = async () => {
    const res = await fetch(`${API_URL}/borrow-records/user`);
    return res.json();
  };


 