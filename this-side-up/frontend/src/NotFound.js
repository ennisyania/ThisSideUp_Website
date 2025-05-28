import React from 'react';
import { useNavigate } from 'react-router-dom';
import './NotFound.css';

function NotFound() {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/');
  };

  return (
    <div className="notfound-container">
      <div className="notfound-bg-shape" />
      <div className="notfound-error-text">
        Er<span className="errorWhite">ror</span>
      </div>
      <div className="notfound-subtext">
        <span className="blackWithWhiteOutline">Looks like som</span>
        <span className="whiteWithBlackOutline">ething went wrong</span>
      </div>
      <button className="notfound-button" onClick={handleBack}>
        Back To Homepage
      </button>
    </div>
  );
}

export default NotFound;
