import React from "react";
import "../Styles/Componenets.css";

const GenreCard = ({ genre }) => (
  <div className="genre-card">
    <h3>{genre.name}</h3>
    <p>{genre.description}</p>
  </div>
);

export default GenreCard;
