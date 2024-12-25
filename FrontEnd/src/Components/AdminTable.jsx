import React from "react";
import "../Styles/Componenets.css";

const AdminTable = ({ data, onEdit, onDelete }) => (
  <table>
    <thead>
      <tr>
        {Object.keys(data[0] || {}).map((key) => (
          <th key={key}>{key}</th>
        ))}
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      {data.map((row) => (
        <tr key={row.id}>
          {Object.values(row).map((value, idx) => (
            <td key={idx}>{value}</td>
          ))}
          <td>
            <button onClick={() => onEdit(row)}>Edit</button>
            <button onClick={() => onDelete(row.id)}>Delete</button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);

export default AdminTable;
