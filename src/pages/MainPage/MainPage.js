import './MainPage.css';
import React, { useState, useEffect, useCallback, useRef} from "react";
import axios from 'axios';
import Header from "../../components/Header";
import Leftbar from "../../components/Leftbar";
import { AiFillCaretDown } from "react-icons/ai";
import DetailModal from '../../components/DetailModal/DetailModal';
import { useParams } from 'react-router-dom';

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
const fetchFiles = async (fileId) => {
  try {
    const response = await axios.get(`${BASE_URL}/api/${fileId}/comments`);
    return response.data.comments;
  } catch (error) {
    console.error("Failed to fetch comments", error);
    return [];
  }
};


export default function MainPage() {
  const { userId } = useParams();
  const [images, setImages] = useState([{
    "fileId": 1,
    "fileName": "fileName",
    "src": "/testImg.jpg",
  },
  {
    "fileId": 1,
    "fileName": "fileName",
    "src": "/testImg.jpg",
  },
  {
    "fileId": 1,
    "fileName": "fileName",
    "src": "/testImg.jpg",
  },
  {
    "fileId": 1,
    "fileName": "fileName",
    "src": "/testImg.jpg",
  },
  {
    "fileId": 1,
    "fileName": "fileName",
    "src": "/testImg.jpg",
  }]);
  const [page, setPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImgSrc, setModalImgSrc] = useState('');
  const [modalImgId, setModalImgId] = useState(null);
  const [files, setFiles] = useState([]);
  const [comments, setComments] = useState([]);

  const observer = useRef(null);
  const lastImageRef = useRef(null);
  const isLastPage = useRef(false);

  const openModal = async (imgId, imgSrc) => {
    setModalImgSrc(imgSrc);
    setModalImgId(imgId);
    setIsModalOpen(true);
    const fetchedFiles = await fetchFiles(imgId);
    setFiles(fetchedFiles);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalImgSrc('');
    setModalImgId(null);
    setFiles([]);
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
          <button className='button-sort'>
            <span>정렬</span>
            <AiFillCaretDown />
          </button>
        </div>
        <div className="container">
          {images.map((image, index) => {
            if (index === images.length - 1) {
              return (
                <div key={index} ref={lastImageRef} className="item">
                  <div>
                    {image.fileName}
                  </div>
                  <img 
                    src={image.src} 
                    alt='이미지' 
                    onClick={() => openModal(image.id, image.src)}
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
                    src={image.src} 
                    alt='이미지' 
                    onClick={() => openModal(image.id, image.src)}
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
          imgSrc={modalImgSrc} 
          comments={comments} 
          imgId={modalImgId}
          />
      </div>
    </div>
  );
}
