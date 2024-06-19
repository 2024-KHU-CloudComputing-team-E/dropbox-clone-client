import "./TrashPage.css";
import React, { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import Header from "../../components/Header";
import Leftbar from "../../components/Leftbar";
import { AiFillCaretDown, AiFillCaretUp } from "react-icons/ai";

const BASE_URL = process.env.REACT_APP_BASE_URL;

// 휴지통 무한 스크롤 이미지 요청
const fetchImages = async (userId, page, sortKey, sortOrder) => {
  console.log("fetchImages", userId, page, sortKey, sortOrder);
  try {
    const response = await axios.get(
      `${BASE_URL}/api/RecycleBin?userId=${userId}&page=${page}&sortKey=${sortKey}&sortOrder=${sortOrder}`
    );
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch images", error);
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

// 파일 영구 삭제 요청
const deleteFilePermanently = async (fileId) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/api/deleteFile/deleteFileOnRecycleBin/${fileId}`
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
      `${BASE_URL}/api/deleteFile/restore/${fileId}`
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
  const [page, setPage] = useState(0);
  const [sortKey, setSortKey] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState({});
  const [contextMenu, setContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
    fileId: null,
    fileName: null,
  });
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);

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

  const loadMoreImages = useCallback(async () => {
    console.log("loadMoreImages");
    if (!user.userId) return;
    if (isLastPage.current) {
      return;
    }
    setIsLoading(true);
    const newImages = await fetchImages(user.userId, page, sortKey, sortOrder);
    if (newImages.length === 0) {
      isLastPage.current = true;
    } else {
      setImages((prevImages) => [...prevImages, ...newImages]);
    }
    setIsLoading(false);
  }, [user.userId, page, sortKey, sortOrder]);

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
  }, [sortKey, sortOrder]);

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

  const handleDelete = async () => {
    if (contextMenu.fileId) {
      const response = await deleteFilePermanently(contextMenu.fileId);
      if (response && response.status === 200) {
        setImages((prevImages) =>
          prevImages.filter((image) => image.fileId !== contextMenu.fileId)
        );
      }
    }
    setContextMenu({ visible: false, x: 0, y: 0, fileId: null });
  };

  const handleRestore = async () => {
    if (contextMenu.fileId) {
      const response = await restoreFile(contextMenu.fileId);
      if (response && response.status === 200) {
        setImages((prevImages) =>
          prevImages.filter((image) => image.fileId !== contextMenu.fileId)
        );
      }
    }
    setContextMenu({ visible: false, x: 0, y: 0, fileId: null });
  };

  const handleDeleteAll = async () => {
    const response = await deleteAllFiles();
    if (response && response.status === 200) {
      setImages([]);
    }
  };

  return (
    <div className="TrashPage">
      <Header />
      <Leftbar />
      <div className="layout">
        <div className="button-container">
          <button className="button-clear" onClick={handleDeleteAll}>
            <span>휴지통 비우기</span>
          </button>
          <div className="sort-dropdown">
            <button className="sort-order-button" onClick={handleSortOrder}>
              {sortOrder === "asc" ? <AiFillCaretUp /> : <AiFillCaretDown />}
            </button>
            <button className="button-sort" onClick={toggleSortDropdown}>
              <span>{sortKey === "name" ? "이름" : "최종 수정 날짜"}</span>
              <AiFillCaretDown />
            </button>
            <div className={`sort-options ${isSortDropdownOpen ? "show" : ""}`}>
              <div onClick={() => handleSort("name")}>이름</div>
              <div onClick={() => handleSort("date")}>최종 수정 날짜</div>
            </div>
          </div>
        </div>
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
                  <img src={image.imageUrl} alt="이미지" />
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
