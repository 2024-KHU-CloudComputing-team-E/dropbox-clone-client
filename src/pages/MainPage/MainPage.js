import './MainPage.css';
import React, { useState, useEffect, useCallback, useRef} from "react";
import axios from 'axios';
import Header from "../../components/Header";
import Leftbar from "../../components/Leftbar";
import { AiFillCaretDown } from "react-icons/ai";
import DetailModal from '../../components/DetailModal/DetailModal';
import { useParams } from 'react-router-dom';
import GameComponent from '../../components/game';

const BASE_URL = process.env.REACT_APP_BASE_URL;

// 메인페이지 무한 스크롤 이미지 요청
const fetchImages = async (userId, page) => {
  try {
    const response = await axios.get(`${BASE_URL}/api/${userId}?page=${page}`);
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


export default function MainPage() {
  const { userId } = useParams();
  const [images, setImages] = useState([{
    "fileId": 1,
    "fileName": "fileName",
    "imgUrl": "/testImg.jpg",
  },
  {
    "fileId": 1,
    "fileName": "fileName",
    "imgUrl": "/testImg.jpg",
  },
  {
    "fileId": 1,
    "fileName": "fileName",
    "imgUrl": "/testImg.jpg",
  },
  {
    "fileId": 1,
    "fileName": "fileName",
    "imgUrl": "/testImg.jpg",
  },
  {
    "fileId": 1,
    "fileName": "fileName",
    "imgUrl": "/testImg.jpg",
  }]);
  const [page, setPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [file, setFile] = useState({
    "fileId": "fileId",
    "comments":[
      {"userId": "userId", "comment": "comment"},
      {"userId": "userId", "comment": "comment"},
    ],
    "context": "context",
    "name": "name.jpg",
    "size": "number",
    "createdAt": "date",
    "updatedAt": "date",
    "aiType": "stirng",
    "fileUrl": "/testImg.jpg",
    "imgUrl": "/testImg.jpg"
  });
  const [isButtonBlinking, setIsButtonBlinking] = useState(false);
  const [isGameModalOpen, setIsGameModalOpen] = useState(false);


  const observer = useRef(null);
  const lastImageRef = useRef(null);
  const isLastPage = useRef(false);
  

  const openModal = async (fileId) => {
    setIsModalOpen(true);
    const fetchedFile = await fetchFile(fileId);
    //setFile(fetchedFile);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    //setFile([]);
  };

  const loadMoreImages = useCallback(async () => {
    if (!isLastPage.current) {
      setIsLoading(true);
      const newImages = await fetchImages(userId, page);
      if (newImages.length === 0) {
        isLastPage.current = true;
      } else {
        setImages(prevImages => [...prevImages, ...newImages]);
        setPage(prevPage => prevPage + 1);
      }
      setIsLoading(false);
    }
  }, [userId, page]);

  useEffect(() => {
    if (!observer.current) {
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !isLoading) {
          setPage(prevPage => prevPage + 1);
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
    setIsButtonBlinking(false); // 게임 버튼 깜빡임 중지
  };

  const closeGameModal = () => {
    setIsGameModalOpen(false);
  };

  return (
    <div>
      <Header />
      <Leftbar />
      <div className="layout">
        <div className="button">
          <button className='button-type'>
            <span>유형</span>
            <AiFillCaretDown />
          </button>
          <button className={`game-button ${isButtonBlinking ? 'blinking' : ''}`} onClick={openGameModal} >Game</button>
          <button className='button-sort'>
            <span>정렬</span>
            <AiFillCaretDown />
          </button>
        </div>
        {isGameModalOpen && <GameComponent onClose={closeGameModal} />}
        <div className="container">
          {images.map((image, index) => {
            if (index === images.length - 1) {
              return (
                <div key={index} ref={lastImageRef} className="item">
                  <div>
                    {image.fileName}
                  </div>
                  <img 
                    src={image.imgUrl} 
                    alt='이미지' 
                    onClick={() => openModal(image.fileId)}
                  />
                </div>
              );
            } else {
              return (
                <div key={index} className="item">
                  <div>
                    {image.fileName}
                  </div>
                  <img 
                    src={image.imgUrl} 
                    alt='이미지' 
                    onClick={() => openModal(image.fileId)}
                  />
                </div>
              );
            }
          })}
        </div>
        {isLoading && <div>Loading...</div>}
        <DetailModal 
          isOpen={isModalOpen}
          onClose={closeModal}
          file={file}
          setIsButtonBlinking={setIsButtonBlinking}
          />
      </div>
    </div>
  );
}
