import React, { useState } from 'react';
import './DetailModal.css';

const DetailModal = ({ isOpen, onClose, imgSrc }) => {
  const [comments, setComments] = useState([
    { user: 'User1', text: 'ㅇㅇㅇㅇ' },
    { user: 'User2', text: 'aaaa' },
    { user: 'User3', text: '1111' },
  ]);
  const [newComment, setNewComment] = useState('');

  const handleCommentChange = (e) => {
    setNewComment(e.target.value);
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (newComment.trim()) {
      setComments([...comments, { user: 'User', text: newComment }]);
      setNewComment('');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-left">
          <img src={imgSrc} alt="Modal Thumbnail" />
        </div>
        <div className="modal-right">
          <h3>Comments</h3>
          <ul>
            {comments.map((comment, index) => (
              <li key={index}>
                {comment.user}: {comment.text}
              </li>
            ))}
          </ul>
          <form onSubmit={handleCommentSubmit} className="comment-form">
            <input
              type="text"
              placeholder="Add a comment..."
              value={newComment}
              onChange={handleCommentChange}
              className="comment-input"
            />
            <button type="submit" className="comment-button">Post</button>
          </form>
        </div>
        <button className="close-button" onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

export default DetailModal;
