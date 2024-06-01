// GameModal.js

import React from 'react';

const GameModal = ({ onClose }) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="game-modal-content">
        <button className="close-button" onClick={onClose}>Close</button>
        <iframe
          src="http://ellisonleao.github.io/clumsy-bird/"
          title="Clumsy Bird"
          width="800"
          height="600"
          frameBorder="0"
          style={{ display: 'block', margin: '0 auto' }}
        ></iframe>
      </div>
    </div>
  );
};

export default GameModal;
