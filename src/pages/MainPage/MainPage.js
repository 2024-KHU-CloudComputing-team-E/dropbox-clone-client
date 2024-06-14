import "./MainPage.css";
import React, { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import Header from "../../components/Header";
import Leftbar from "../../components/Leftbar";
import { AiFillCaretDown, AiFillCaretUp } from "react-icons/ai";
import DetailModal from "../../components/DetailModal/DetailModal";
import { useParams } from "react-router-dom";
import GameComponent from "../../components/game";

const BASE_URL = process.env.REACT_APP_BASE_URL;

// 메인페이지 무한 스크롤 이미지 요청
const fetchImages = async (userId, page, sortKey, sortOrder) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/api/files?userId=${userId}&page=${page}&sortKey=${sortKey}&sortOrder=${sortOrder}`
    );
    return response.data.images;
  } catch (error) {
    console.error("Failed to fetch images", error);
    return [];
  }
};

// 파일 상세보기 조회 요청
const fetchFile = async (fileId) => {
  try {
    const response = await axios.get(`${BASE_URL}/api/${fileId}`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch files", error);
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

// 파일 다운로드 요청
const downloadFile = async (fileId) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/api/downloadFile?fileId=${fileId}`
    );
    return response.data;
  } catch (error) {
    console.log("Failed to download file", error);
    return null;
  }
};

// 파일 삭제 요청
const deleteFile = async (fileId) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/api/deleteFile/moveFileToRecycleBin?fileId=${fileId}`
    );
    if (response.status === 200) {
      alert("파일이 휴지통으로 이동했습니다.");
    } else {
      alert(`파일 이동 실패: ${response.status}`);
    }
    return response;
  } catch (error) {
    console.log("Faild to delete file", error);
    return null;
  }
};

export default function MainPage() {
  const { userId } = useParams();
  const [images, setImages] = useState([]);
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
    aiType: "string",
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
  const [sortKey, setSortKey] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);

  const observer = useRef(null);
  const lastImageRef = useRef(null);
  const isLastPage = useRef(false);

  const openModal = async (fileId) => {
    setIsModalOpen(true);
    const fetchedFile = await fetchFile(fileId);
    setFile(fetchedFile);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setFile([]);
  };

  const loadMoreImages = useCallback(async () => {
    if (!isLastPage.current && !isLoading) {
      setIsLoading(true);
      const newImages = await fetchImages(userId, page, sortKey, sortOrder);
      if (newImages.length === 0) {
        isLastPage.current = true;
      } else {
        setImages((prevImages) => [...prevImages, ...newImages]);
        setPage((prevPage) => prevPage + 1);
      }
      setIsLoading(false);
    }
  }, [userId, page, sortKey, sortOrder, isLoading]);

  useEffect(() => {
    if (!observer.current) {
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !isLoading) {
          loadMoreImages();
        }
      });
    }
  }, [isLoading, loadMoreImages]);

  useEffect(() => {
    if (lastImageRef.current) {
      observer.current.observe(lastImageRef.current);
    }
  }, [lastImageRef.current]);

  useEffect(() => {
    const initializeImages = async () => {
      setIsLoading(true);
      const initialImages = await fetchImages(userId, 0, sortKey, sortOrder);
      setImages(initialImages);
      setIsLoading(false);
      setPage(1); // 초기화 후 페이지를 1로 설정
    };

    initializeImages();
  }, [userId, sortKey, sortOrder]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isSortDropdownOpen && !event.target.closest(".sort-dropdown")) {
        setIsSortDropdownOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isSortDropdownOpen]);

  const openGameModal = () => {
    setIsGameModalOpen(true);
    setIsButtonBlinking(false); // 게임 버튼 깜빡임 중지
  };

  const closeGameModal = () => {
    setIsGameModalOpen(false);
  };

  // 다른 부분을 클릭하면 컨텍스트가 닫힘
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

  const handleDownload = async () => {
    if (contextMenu.fileId) {
      //const fileUrl = await downloadFile(contextMenu.fileId);
      const fileUrl = "/testImg.jpg";
      const link = document.createElement("a");
      link.href = `${process.env.REACT_APP_BASE_URL}${fileUrl}`;
      link.download = contextMenu.fileName;
      document.body.appendChild(link);

      setIsButtonBlinking(true); // 다운로드 시작 시 반짝임 시작
      setTimeout(() => setIsButtonBlinking(false), 3000); // 3초 후에 반짝임 멈춤

      link.click();
      document.body.removeChild(link);
    }
    setContextMenu({ visible: false, x: 0, y: 0, fileId: null });
  };

  const handleDelete = async () => {
    if (contextMenu.fileId) {
      //const response = await deleteFile(contextMenu.fileId);
      //if (response.status === 200) {
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

  const handleSort = (sortKey, sortOrder) => {
    setSortKey(sortKey);
    setSortOrder(sortOrder);
    setIsSortDropdownOpen(false);
  };

  const toggleSortDropdown = () => {
    setIsSortDropdownOpen(!isSortDropdownOpen);
  };

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
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
          <div className="sort-dropdown">
            <button className="sort-order-button" onClick={toggleSortOrder}>
              {sortOrder === "asc" ? <AiFillCaretUp /> : <AiFillCaretDown />}
            </button>
            <button className="button-sort" onClick={toggleSortDropdown}>
              <span>{sortKey === "name" ? "이름" : "최종 수정 날짜"}</span>
            </button>
            <div className={`sort-options ${isSortDropdownOpen ? "show" : ""}`}>
              <div onClick={() => handleSort("name", sortOrder)}>이름</div>
              <div onClick={() => handleSort("date", sortOrder)}>수정 날짜</div>
            </div>
          </div>
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
                  onClick={() => openModal(image.fileId)}
                  onContextMenu={(event) =>
                    handleContextMenu(event, image.fileId)
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
                  onClick={() => openModal(image.fileId)}
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
            onClick={closeContextMenu} // 클릭 시 컨텍스트 메뉴 닫기
          >
            <div className="context-menu-item" onClick={handleDownload}>
              다운로드
            </div>
            <div className="context-menu-item" onClick={handleDelete}>
              휴지통으로 이동
            </div>
          </div>
        )}
        <DetailModal
          isOpen={isModalOpen}
          onClose={closeModal}
          file={file}
          setIsButtonBlinking={setIsButtonBlinking}
          user={user}
        />
      </div>
    </div>
  );
}
