import React from "react";
import "../Styles/Componenets.css";

const GenreCard = ({ genre }) => (
  <div className="genre-card">
    <h3>{genre.name}</h3>
    <p>{genre.descriptions}</p>
  </div>
);

export default GenreCard;
