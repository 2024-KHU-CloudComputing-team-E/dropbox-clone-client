import React from 'react';
import './DetailModal.css';

const DetailModal = ({ isOpen, onClose, imgSrc }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <img src={imgSrc} alt="Modal Thumbnail" />
        <button className="close-button" onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

export default DetailModal;
