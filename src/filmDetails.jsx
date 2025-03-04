import React from 'react';
import './FilmDetails.css';

const FilmDetails = ({ isOpen, movie, onClose }) => {
  if (!isOpen || !movie) {
    return null;
  }

  return (
    <div className="modalOverlay">
      <div className="modalContent">
        <button className="closeButton" onClick={onClose}>Close</button>
        <h2>{movie['#TITLE']}</h2>
        <img src={movie['#IMG_POSTER']} alt={movie['#TITLE']} />
        <div className="info">
          <p>Year: {movie['#YEAR']}</p>
          <p>Rank: {movie['#RANK']}</p>
          <p>Cast: {movie['#ACTORS']}</p>
        </div>
        <p>{movie['#DESCRIPTION']}</p>
      </div>
    </div>
  );
};

export default FilmDetails;
