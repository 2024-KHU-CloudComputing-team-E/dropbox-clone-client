import "./TrashPage.css";
import React, { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import Header from "../../components/Header";
import Leftbar from "../../components/Leftbar";
import { AiFillCaretDown } from "react-icons/ai";
import GameComponent from "../../components/game";

const BASE_URL = process.env.REACT_APP_BASE_URL;

// 휴지통 페이지 무한 스크롤 이미지 요청
const fetchImages = async (page) => {
  try {
    const response = await axios.get(`${BASE_URL}/api/RecycleBin?page=${page}`);
    return response.data.images;
  } catch (error) {
    console.error("Failed to fetch images", error);
    return [];
  }
};

// 유저 정보 요청
const fetchUserInfo = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/api/user/logined`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch user info", error);
    return null;
  }
};

// 파일 영구 삭제 요청
const deleteFilePermanently = async (fileId) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/api/deleteFile/deleteFileOnRecycleBin?fileId=${fileId}`
    );
    if (response.status === 200) {
      alert("파일이 영구적으로 삭제되었습니다.");
    } else {
      alert(`파일 삭제 실패: ${response.status}`);
    }
    return response;
  } catch (error) {
    console.log("Failed to permanently delete file", error);
    return null;
  }
};

// 파일 복원 요청
const restoreFile = async (fileId) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/api/deleteFile/restore?fileId=${fileId}`
    );
    if (response.status === 200) {
      alert("파일이 복원되었습니다.");
    } else {
      alert(`파일 복원 실패: ${response.status}`);
    }
    return response;
  } catch (error) {
    console.log("Failed to restore file", error);
    return null;
  }
};

// 휴지통 비우기 요청
const deleteAllFiles = async () => {
  try {
    const response = await axios.post(`${BASE_URL}/api/deleteFile/deleteAll`);
    if (response.status === 200) {
      alert("휴지통이 비워졌습니다.");
    } else {
      alert(`휴지통 비우기 실패: ${response.status}`);
    }
    return response;
  } catch (error) {
    console.log("Failed to delete all", error);
    return null;
  }
};

export default function TrashPage() {
  const [images, setImages] = useState([
    {
      fileId: 1,
      fileName: "fileName1",
      imgUrl: "/testImg.jpg",
    },
    {
      fileId: 2,
      fileName: "fileName2",
      imgUrl: "/testImg.jpg",
    },
    {
      fileId: 3,
      fileName: "fileName3",
      imgUrl: "/testImg.jpg",
    },
    {
      fileId: 4,
      fileName: "fileName",
      imgUrl: "/testImg.jpg",
    },
    {
      fileId: 5,
      fileName: "fileName",
      imgUrl: "/testImg.jpg",
    },
  ]);
  const [page, setPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [file, setFile] = useState({
    fileId: "fileId",
    comments: [
      { userId: "userId", comment: "comment" },
      { userId: "userId", comment: "comment" },
    ],
    context: "context",
    name: "name.jpg",
    size: "number",
    createdAt: "date",
    updatedAt: "date",
    aiType: "stirng",
    fileUrl: "/testImg.jpg",
    imgUrl: "/testImg.jpg",
  });
  const [isButtonBlinking, setIsButtonBlinking] = useState(false);
  const [isGameModalOpen, setIsGameModalOpen] = useState(false);
  const [user, setUser] = useState({
    email: "email@gmail.com",
    userName: "userName",
  });
  const [contextMenu, setContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
    fileId: null,
    fileName: null,
  });

  const observer = useRef(null);
  const lastImageRef = useRef(null);
  const isLastPage = useRef(false);

  const loadMoreImages = useCallback(async () => {
    if (!isLastPage.current) {
      setIsLoading(true);
      const newImages = await fetchImages(page);
      if (newImages.length === 0) {
        isLastPage.current = true;
      } else {
        setImages((prevImages) => [...prevImages, ...newImages]);
        setPage((prevPage) => prevPage + 1);
      }
      setIsLoading(false);
    }
  }, [page]);

  useEffect(() => {
    if (!observer.current) {
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !isLoading) {
          setPage((prevPage) => prevPage + 1);
        }
      });
    }
  }, [isLoading]);

  useEffect(() => {
    if (lastImageRef.current) {
      observer.current.observe(lastImageRef.current);
    }
  }, [lastImageRef.current]);

  useEffect(() => {
    loadMoreImages();
  }, [page]);

  const openGameModal = () => {
    setIsGameModalOpen(true);
    setIsButtonBlinking(false);
  };

  const closeGameModal = () => {
    setIsGameModalOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (contextMenu.visible) {
        closeContextMenu();
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [contextMenu.visible]);

  const handleContextMenu = (event, fileId, fileName) => {
    event.preventDefault();
    setContextMenu({
      visible: true,
      x: event.clientX,
      y: event.clientY,
      fileId,
      fileName,
    });
  };

  const handleDelete = async () => {
    if (contextMenu.fileId) {
      //const response = await deleteFilePermanently(contextMenu.fileId);
      //if (response && response.status === 200) {
      setImages((prevImages) =>
        prevImages.filter((image) => image.fileId !== contextMenu.fileId)
      );
      // }
    }
    setContextMenu({ visible: false, x: 0, y: 0, fileId: null });
  };

  const handleRestore = async () => {
    if (contextMenu.fileId) {
      //const response = await restoreFile(contextMenu.fileId);
      //if (response && response.status === 200) {
      setImages((prevImages) =>
        prevImages.filter((image) => image.fileId !== contextMenu.fileId)
      );
      //}
    }
    setContextMenu({ visible: false, x: 0, y: 0, fileId: null });
  };

  const closeContextMenu = () => {
    setContextMenu({ visible: false, x: 0, y: 0, fileId: null });
  };

  const handleDeleteAll = async () => {
    const response = await deleteAllFiles();
    //if (response && response.status === 200) {
    setImages([]);
    //}
  };

  return (
    <div>
      <Header />
      <Leftbar />
      <div className="layout">
        <div className="button-container">
          <button className="button-type">
            <span>유형</span>
            <AiFillCaretDown />
          </button>
          <button
            className={`game-button ${isButtonBlinking ? "blinking" : ""}`}
            onClick={openGameModal}
          >
            Game
          </button>
          <button className="button-sort">
            <span>정렬</span>
            <AiFillCaretDown />
          </button>
          <button className="button-clear" onClick={handleDeleteAll}>
            <span>휴지통 비우기</span>
          </button>
        </div>
        {isGameModalOpen && <GameComponent onClose={closeGameModal} />}
        <div className="container">
          {images.map((image, index) => {
            if (index === images.length - 1) {
              return (
                <div
                  key={index}
                  ref={lastImageRef}
                  className="item"
                  onContextMenu={(event) =>
                    handleContextMenu(event, image.fileId, image.fileName)
                  }
                >
                  <div>{image.fileName}</div>
                  <img src={image.imgUrl} alt="이미지" />
                </div>
              );
            } else {
              return (
                <div
                  key={index}
                  className="item"
                  onContextMenu={(event) =>
                    handleContextMenu(event, image.fileId, image.fileName)
                  }
                >
                  <div>{image.fileName}</div>
                  <img src={image.imgUrl} alt="이미지" />
                </div>
              );
            }
          })}
        </div>
        {isLoading && <div>Loading...</div>}
        {contextMenu.visible && (
          <div
            className="context-menu"
            style={{ top: contextMenu.y, left: contextMenu.x }}
            onClick={closeContextMenu}
          >
            <div className="context-menu-item" onClick={handleRestore}>
              복원
            </div>
            <div className="context-menu-item" onClick={handleDelete}>
              영구 삭제
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
