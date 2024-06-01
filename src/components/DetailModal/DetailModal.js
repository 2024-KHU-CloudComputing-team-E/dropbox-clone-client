import React, { useState } from 'react';
import './DetailModal.css';

const DetailModal = ({ isOpen, onClose, file, setIsButtonBlinking}) => {
  // const [newComment, setNewComment] = useState('');

  // const handleCommentChange = (e) => {
  //   setNewComment(e.target.value);
  // };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = `${process.env.REACT_APP_BASE_URL}${file.fileUrl}`;
    link.download = file.name;
    document.body.appendChild(link);

    setIsButtonBlinking(true); // 다운로드 시작 시 반짝임 시작
    setTimeout(() => setIsButtonBlinking(false), 3000); // 3초 후에 반짝임 멈춤

    link.click();
    document.body.removeChild(link);
  };


  // const handleCommentSubmit = (e) => {
  //   e.preventDefault();
  //   if (newComment.trim()) {
  //     setComments([...comments, { user: 'User', text: newComment }]);
  //     setNewComment('');
  //   }
  // };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <button onClick={handleDownload} className="download-button">Download</button>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-left">
          <img src={file.imgUrl} alt="Modal Thumbnail" />
        </div>
        <div className="modal-right">
          <h3>{file.context}</h3>
          <ul>
            {file.comments.map((comment, index) => (
              <li key={index}>
                {comment.userId}: {comment.comment}
              </li>
            ))}
          </ul>
          <form /*onSubmit={handleCommentSubmit}*/ className="comment-form">
            <input
              type="text"
              placeholder="Add a comment..."
              //value={newComment}
              //onChange={handleCommentChange}
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