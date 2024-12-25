import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from '@mui/material';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');

  useEffect(() => {
    // Fetch all users from the backend
    axios.get('/api/users')
      .then(response => setUsers(response.data))
      .catch(error => console.log(error));
  }, []);

  const handleCreate = () => {
    const newUser = { username, email, password, role };
    axios.post('/api/users/register', newUser)
      .then(response => {
        setUsers([...users, newUser]);
      })
      .catch(error => console.log(error));
  };

  const handleUpdate = (id) => {
    const updatedUser = { username, email, role };
    axios.put(`/api/users/${id}`, updatedUser)
      .then(response => {
        setUsers(users.map(user => (user.id === id ? updatedUser : user)));
      })
      .catch(error => console.log(error));
  };

  const handleDelete = (id) => {
    axios.delete(`/api/users/${id}`)
      .then(response => {
        setUsers(users.filter(user => user.id !== id));
      })
      .catch(error => console.log(error));
  };

  return (
    <div>
      <h2>Manage Users</h2>
      <div>
        <TextField label="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
        <TextField label="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <TextField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <TextField label="Role" value={role} onChange={(e) => setRole(e.target.value)} />
        <Button onClick={handleCreate} variant="contained" color="primary">Create User</Button>
      </div>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Username</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>
                  <Button onClick={() => handleUpdate(user.id)} color="secondary">Update</Button>
                  <Button onClick={() => handleDelete(user.id)} color="error">Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default ManageUsers;
