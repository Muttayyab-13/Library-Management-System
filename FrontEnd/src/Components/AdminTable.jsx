import React from "react";
import "../Styles/Componenets.css";
const AdminTable = ({ data, onEdit, onDelete }) => (
  <table>
    <thead>
      <tr>
        {Object.keys(data[0] || {}).map((key) => (
          key !== 'id' && <th key={key}>{key}</th>
        ))}
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      {data.map((row) => (
        <tr key={row.title}>
          {Object.entries(row).map(([key, value], idx) => (
            key !== 'id' && <td key={idx}>{value}</td>
          ))}
          <td>
            <button onClick={() => onEdit(row)}>Edit</button> {/* Pass full row object here */}
            <button onClick={() => onDelete(row.title)}>Delete</button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);


export default AdminTable;
