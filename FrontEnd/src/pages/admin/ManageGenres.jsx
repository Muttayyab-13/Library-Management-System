import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from '@mui/material';
import { getGenres } from '../../services/api';

const ManageGenres = () => {
  const [genres, setGenres] = useState([]);
  const [id, setId] = useState('');
  const [genreName, setGenreName] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    // Fetch all genres from the backend
    getGenres().then(setGenres).catch(console.error);
  }, []);

  const handleCreate = () => {
    if (!id || !genreName || !description) {
      // Alert if any field is missing
      alert('Please fill all fields.');
      return;
    }
  
    const newGenre = { id, name: genreName, descriptions: description };
  
    try {
      // Send the POST request to create a new genre
      axios.post('http://localhost:3001/genres', newGenre)  // Adjust the URL based on your endpoint
        .then(response => {
          setGenres([...genres, response.data]); // Add the new genre to the list
          setId(''); // Clear id input field
          setGenreName(''); // Clear name input field
          setDescription(''); // Clear description input field
          alert('Genre Created Successfully'); // Success alert
        })
        .catch(error => {
          console.log(error);
          alert('Failed to create genre. Please try again.'); // Error alert
        });
    } catch (error) {
      console.log(error);
      alert('An unexpected error occurred.'); // General error alert
    }
  };
  
  return (
    <div>
      <h2>Manage Genres</h2>
      
      {/* Input to create genre */}
      <div>
        <TextField 
          label="ID" 
          value={id} 
          onChange={(e) => setId(e.target.value)} 
          fullWidth 
          style={{ marginBottom: '10px' }} 
        />
        <TextField 
          label="Genre Name" 
          value={genreName} 
          onChange={(e) => setGenreName(e.target.value)} 
          fullWidth 
          style={{ marginBottom: '10px' }} 
        />
        <TextField 
          label="Description" 
          value={description} 
          onChange={(e) => setDescription(e.target.value)} 
          fullWidth 
          multiline 
          rows={4} 
          style={{ marginBottom: '10px' }} 
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
              <TableCell>ID</TableCell>
              <TableCell>Genre Name</TableCell>
              <TableCell>Description</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {genres.map((genre) => (
              <TableRow key={genre.id}>
                <TableCell>{genre.id}</TableCell>
                <TableCell>{genre.name}</TableCell>
                <TableCell>{genre.descriptions}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default ManageGenres;
