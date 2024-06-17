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
const fetchImages = async (userId, page, sortKey, sortOrder, filter) => {
  console.log("fetchImages", userId, page, sortKey, sortOrder, filter);
  try {
    let params = { userId, page, sortKey, sortOrder };
    if (filter !== "") {
      params.filter = filter;
    }
    const response = await axios.get(`${BASE_URL}/api/files`, {
      params: params,
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch images", error);
    return [];
  }
};

// 파일 상세보기 조회 요청
const fetchFile = async (fileId) => {
  console.log("fetchFile", fileId);
  try {
    const response = await axios.get(`${BASE_URL}/api/file/${fileId}`);
    console.log(response.data);
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
    console.log("fetchUserInfo", response.data);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch user info", error);
    return null;
  }
};

// 파일 다운로드 요청
const downloadFile = async (fileId) => {
  console.log("downloadFile", fileId);
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
  console.log("deleteFile", fileId);
  try {
    const response = await axios.post(
      `${BASE_URL}/api/deleteFile/moveFileToRecycleBin/${fileId}`
    );
    if (response.status === 200) {
      alert("파일이 휴지통으로 이동했습니다.");
    } else {
      alert(`파일 이동 실패: ${response.status}`);
    }
    return response;
  } catch (error) {
    console.log("Failed to delete file", error);
    return null;
  }
};

export default function MainPage() {
  const { userId } = useParams();
  const [page, setPage] = useState(0);
  const [sortKey, setSortKey] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [file, setFile] = useState({});
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
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const [filter, setFilter] = useState(""); // filter 상태 추가

  const observer = useRef(null);
  const lastImageRef = useRef(null);
  const isLastPage = useRef(false);

  useEffect(() => {
    const loadUserInfo = async () => {
      const userInfo = await fetchUserInfo();
      if (userInfo) {
        setUser(userInfo);
      }
    };
    loadUserInfo();
  }, []);

  const openModal = async (fileId) => {
    setIsModalOpen(true);
    const fetchedFile = await fetchFile(fileId);
    setFile(fetchedFile);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setFile({});
  };

  const loadMoreImages = useCallback(async () => {
    console.log("loadMoreImages");
    if (isLastPage.current) {
      return;
    }
    setIsLoading(true);
    const newImages = await fetchImages(
      userId,
      page,
      sortKey,
      sortOrder,
      filter
    );
    if (newImages.length === 0) {
      isLastPage.current = true;
    } else {
      setImages((prevImages) => [...prevImages, ...newImages]);
    }
    setIsLoading(false);
  }, [userId, page, sortKey, sortOrder, filter]);

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
    return () => {
      if (lastImageRef.current) {
        observer.current.unobserve(lastImageRef.current);
      }
    };
  }, [lastImageRef.current]);

  useEffect(() => {
    loadMoreImages();
    setInitialLoad(false); // 초기 로딩 후 상태 변경
  }, []);

  useEffect(() => {
    if (initialLoad) {
      return; // 초기 로딩 시에는 페이지 변경을 무시합니다.
    }
    loadMoreImages();
  }, [page]);

  useEffect(() => {
    if (initialLoad) {
      return; // 초기 로딩 시에는 페이지 변경을 무시합니다.
    }
    setPage(0);
    setImages([]);
    isLastPage.current = false;
    loadMoreImages();
  }, [sortKey, sortOrder, filter]); // filter 추가

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
      x: event.clientX + window.scrollX,
      y: event.clientY + window.scrollY,
      fileId,
      fileName,
    });
  };

  const handleDownload = async () => {
    if (contextMenu.fileId) {
      const fileUrl = await downloadFile(contextMenu.fileId);
      const link = document.createElement("a");
      link.href = fileUrl.fileUrl;
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
      const response = await deleteFile(contextMenu.fileId);
      if (response.status === 200) {
        setImages((prevImages) =>
          prevImages.filter((image) => image.fileId !== contextMenu.fileId)
        );
      }
    }
    setContextMenu({ visible: false, x: 0, y: 0, fileId: null });
  };

  const closeContextMenu = () => {
    setContextMenu({ visible: false, x: 0, y: 0, fileId: null });
  };

  const handleSort = (sortKey) => {
    setSortKey(sortKey);
    setIsSortDropdownOpen(!isSortDropdownOpen);
  };

  const handleSortOrder = () => {
    setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
  };

  const toggleSortDropdown = () => {
    setIsSortDropdownOpen(!isSortDropdownOpen);
  };

  // 드롭다운 외부 클릭 시 닫기
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

  return (
    <div className="MainPage">
      <Header setFilter={setFilter} /> {/* setFilter 전달 */}
      <Leftbar />
      <div className="layout">
        <div className="button-container">
          <button
            className={`game-button ${isButtonBlinking ? "blinking" : ""}`}
            onClick={openGameModal}
          >
            Game
          </button>
          <div className="sort-dropdown">
            <button className="sort-order-button" onClick={handleSortOrder}>
              {sortOrder === "asc" ? <AiFillCaretUp /> : <AiFillCaretDown />}
            </button>
            <button className="button-sort" onClick={toggleSortDropdown}>
              <span>{sortKey === "name" ? "이름" : "최종 수정 날짜"}</span>
            </button>
            <div className={`sort-options ${isSortDropdownOpen ? "show" : ""}`}>
              <div onClick={() => handleSort("name")}>이름</div>
              <div onClick={() => handleSort("date")}>최종 수정 날짜</div>
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
                    handleContextMenu(event, image.fileId, image.fileName)
                  }
                >
                  <div>{image.fileName}</div>
                  <img src={image.imageUrl} alt="이미지" />
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
                  <img src={image.imageUrl} alt="이미지" />
                </div>
              );
            }
          })}
        </div>
        {isLoading && <div>Loading...</div>}
        {contextMenu.visible && (
          <div
            className="context-menu"
            style={{ top: `${contextMenu.y}px`, left: `${contextMenu.x}px` }}
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
