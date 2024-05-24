import './MainPage.css';
import React, { useState, useEffect, useCallback } from "react";
import axios from 'axios';
import Header from "../../components/Header";
import Leftbar from "../../components/Leftbar";
import { AiFillCaretDown } from "react-icons/ai";
import DetailModal from '../../components/DetailModal/DetailModal';
import { useParams } from 'react-router-dom';

const BASE_URL = process.env.REACT_APP_BASE_URL;

const fetchImages = async (userId, page) => {
  try {
    const response = await axios.get(`${BASE_URL}/api/${userId}/images?page=${page}`);
    return response.data.images;
  } catch (error) {
    console.error("Failed to fetch images", error);
    return [];
  }
};

export default function MainPage() {
  const { userId } = useParams();
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImgSrc, setModalImgSrc] = useState('');

  const openModal = (imgSrc) => {
    setModalImgSrc(imgSrc);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalImgSrc('');
  };

  const loadMoreImages = useCallback(async () => {
    setIsLoading(true);
    const newImages = await fetchImages(userId, page);
    setImages(prevImages => [...prevImages, ...newImages]);
    setIsLoading(false);
  }, [userId, page]);

  useEffect(() => {
    setImages([]); // Reset images when userId changes
    setPage(0); // Reset page when userId changes
  }, [userId]);

  useEffect(() => {
    loadMoreImages();
  }, [page, loadMoreImages]);

  const handleScroll = useCallback(() => {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 500 && !isLoading) {
      setPage(prevPage => prevPage + 1);
    }
  }, [isLoading]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

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
          {images.map((image, index) => (
            <div key={index} className="item">
              <img 
                src={image.src} 
                alt='이미지' 
                onClick={() => openModal(image.src)}
              />
            </div>
          ))}
        </div>
        {isLoading && <div>Loading...</div>}
        <DetailModal isOpen={isModalOpen} onClose={closeModal} imgSrc={modalImgSrc} />
      </div>
    </div>
  );
}
