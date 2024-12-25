import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from '@mui/material';

const ManageGenres = () => {
  const [genres, setGenres] = useState([]);
  const [genreName, setGenreName] = useState('');

  useEffect(() => {
    // Fetch all genres from the backend
    axios.get('/api/genres')
      .then(response => setGenres(response.data))
      .catch(error => console.log(error));
  }, []);

  const handleCreate = () => {
    const newGenre = { name: genreName };
    axios.post('/api/genres', newGenre)
      .then(response => {
        setGenres([...genres, response.data]); // Add the new genre to the list
        setGenreName(''); // Clear input field after creation
      })
      .catch(error => console.log(error));
  };

  const handleDelete = (id) => {
    axios.delete(`/api/genres/${id}`)
      .then(response => {
        setGenres(genres.filter(genre => genre.id !== id)); // Remove the deleted genre
      })
      .catch(error => console.log(error));
  };

  const handleUpdate = (id) => {
    const updatedGenre = { name: genreName };
    axios.put(`/api/genres/${id}`, updatedGenre)
      .then(response => {
        setGenres(genres.map(genre => (genre.id === id ? { ...genre, name: genreName } : genre))); // Update the genre in the list
        setGenreName(''); // Clear input field after update
      })
      .catch(error => console.log(error));
  };

  return (
    <div>
      <h2>Manage Genres</h2>
      
      {/* Input to create/update genre */}
      <div>
        <TextField 
          label="Genre Name" 
          value={genreName} 
          onChange={(e) => setGenreName(e.target.value)} 
          fullWidth 
        />
        <Button 
          onClick={handleCreate} 
          variant="contained" 
          color="primary"
          style={{ marginTop: '10px' }}
        >
          Create Genre
        </Button>
      </div>

      <TableContainer style={{ marginTop: '20px' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Genre Name</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {genres.map((genre) => (
              <TableRow key={genre.id}>
                <TableCell>{genre.name}</TableCell>
                <TableCell>
                  {/* Update genre */}
                  <Button 
                    onClick={() => setGenreName(genre.name)} 
                    color="secondary"
                  >
                    Edit
                  </Button>
                  {/* Delete genre */}
                  <Button 
                    onClick={() => handleDelete(genre.id)} 
                    color="error"
                  >
                    Delete
                  </Button>
                  {/* Update genre after editing */}
                  <Button 
                    onClick={() => handleUpdate(genre.id)} 
                    color="primary"
                    style={{ marginLeft: '10px' }}
                  >
                    Update
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default ManageGenres;
