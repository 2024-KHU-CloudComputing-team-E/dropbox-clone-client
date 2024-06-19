import React, { useState, useEffect } from "react";
import axios from "axios";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "./DetailModal.css";

const DetailModal = ({ isOpen, onClose, file, setIsButtonBlinking, user }) => {
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState([]);

  useEffect(() => {
    if (file && Array.isArray(file.comments)) {
      setComments(file.comments);
    } else {
      setComments([]); // comments가 정의되지 않았거나 배열이 아닌 경우 빈 배열로 초기화
    }
  }, [file]);

  const handleCommentChange = (e) => {
    setNewComment(e.target.value);
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = `${file.url}`;
    link.download = file.fileName;
    document.body.appendChild(link);

    setIsButtonBlinking(true); // 다운로드 시작 시 반짝임 시작
    setTimeout(() => setIsButtonBlinking(false), 3000); // 3초 후에 반짝임 멈춤

    link.click();
    document.body.removeChild(link);
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();

    const newCommentObj = { userName: user.userName, comment: newComment }; // 가짜 데이터로 새로운 댓글 객체 생성
    setComments((prevComments) => [...prevComments, newCommentObj]); // 상태 업데이트로 새로운 댓글 추가
    setNewComment(""); // 댓글 입력 필드 초기화

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/api/comments`,
        {
          fileId: file._id,
          comment: newComment,
        }
      );
      console.log("Comment posted:", response.data);
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  };

  const renderFileContent = (file) => {
    if (!file) return null;

    switch (file.type) {
      case ".png":
      case ".jpeg":
      case ".jpg":
      case ".gif":
        return <img alt="Modal Thumbnail" src={file.url} />;
      case ".mp4":
        return (
          <video controls>
            <source src={file.url} type={`video/${file.type.slice(1)}`} />
            Your browser does not support the video tag.
          </video>
        );
      case ".ppt":
      case ".pptx":
      case "application/vnd.ms-powerpoint":
      case "application/vnd.openxmlformats-officedocument.presentationml.presentation":
        return (
          <iframe
            src={`https://view.officeapps.live.com/op/embed.aspx?src=${file.url}`}
            width="100%"
            height="600px"
            frameBorder="0"
          >
            This is an embedded{" "}
            <a target="_blank" href="http://office.com">
              Microsoft Office
            </a>{" "}
            document, powered by{" "}
            <a target="_blank" href="http://office.com/webapps">
              Office Online
            </a>
            .
          </iframe>
        );
      case ".docx":
        return (
          <iframe
            src={`https://view.officeapps.live.com/op/embed.aspx?src=${file.url}`}
            width="100%"
            height="600px"
            frameBorder="0"
          >
            This is an embedded{" "}
            <a target="_blank" href="http://office.com">
              Microsoft Office
            </a>{" "}
            document, powered by{" "}
            <a target="_blank" href="http://office.com/webapps">
              Office Online
            </a>
            .
          </iframe>
        );
      default:
        return (
          <div className="unsupported-file-message">
            파일 미리보기를 지원하지 않는 파일 형식입니다.
          </div>
        );
    }
  };

  if (!isOpen || !file) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <button onClick={handleDownload} className="download-button">
        Download
      </button>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-left">{renderFileContent(file)}</div>
        <div className="modal-right">
          <ul>
            {comments.length > 0 ? (
              comments.map((comment, index) => (
                <li key={index}>
                  {comment.userName}: {comment.comment}
                </li>
              ))
            ) : (
              <li>No comments</li> // 댓글이 없는 경우
            )}
          </ul>
          <form onSubmit={handleCommentSubmit} className="comment-form">
            <input
              type="text"
              placeholder="Add a comment..."
              value={newComment}
              onChange={handleCommentChange}
              className="comment-input"
            />
            <button type="submit" className="comment-button">
              Post
            </button>
          </form>
        </div>
        <button className="close-button" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default DetailModal;
