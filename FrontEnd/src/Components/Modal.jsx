import React, { useState } from "react";
import "../Styles/Componenets.css";

const Modal = ({ onClose, onSave, data = {} }) => {
  const [formData, setFormData] = useState(data);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = () => {
    onSave(formData);
    onClose();
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>{data.id ? "Edit Record" : "Add Record"}</h2>
        {Object.keys(data || {}).map((key) => (
          <div key={key}>
            <label>{key}</label>
            <input
              name={key}
              value={formData[key] || ""}
              onChange={handleChange}
              disabled={key === "id"}
            />
          </div>
        ))}
        <button onClick={handleSubmit}>Save</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};

export default Modal;
