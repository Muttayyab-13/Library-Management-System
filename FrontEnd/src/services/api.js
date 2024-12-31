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



export const getBooks = async () => {
  const res = await fetch(`${API_URL}/books`);
  return res.json();
};

export const createBook = async (book) => {
  const res = await fetch(`${API_URL}/books`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(book),
  });
  return res.json();
};

export const updateBook = async (book) => {
  const res = await fetch(`${API_URL}/books/${book.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(book),
  });
  return res.json();
};

export const deleteBook = async (id) => {
  const res = await fetch(`${API_URL}/books/${id}`, { method: "DELETE" });
  return res.json();
};


export const searchBooks = async (query) => {
    const res = await fetch(`${API_URL}/books/search?q=${query}`);
    return res.json();
  };
 
  

  export const getUserNotifications = async () => {
    const res = await fetch(`${API_URL}/notifications/user`);
    return res.json();
  };

  export const getUserBorrowRecords = async () => {
    const res = await fetch(`${API_URL}/borrow-records/user`);
    return res.json();
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
