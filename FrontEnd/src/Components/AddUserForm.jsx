// src/components/AddUserForm.jsx
import React, { useState } from 'react';
import { createUser } from '../services/api';

const AddUserForm = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', phone_number: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    createUser(formData).then(() => alert('User added successfully!'));
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Name"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
      />
      <input
        type="email"
        placeholder="Email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
      />
      <input
        type="password"
        placeholder="Password"
        value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
      />
      <input
        type="text"
        placeholder="Phone Number"
        value={formData.phone_number}
        onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
      />
      <button type="submit">Add User</button>
    </form>
  );
};

export default AddUserForm;
