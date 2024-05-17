import React, {useState} from "react";
import Header from "../../components/Header";
import Leftbar from "../../components/Leftbar";
import { AiFillCaretDown } from "react-icons/ai";
import './MainPage.css'
import DetailModal from '../../components/DetailModal/DetailModal';


export default function MainPage() {

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

  return (
    <div>
      <Header />
      <Leftbar />
      <div className="layout">
        <div className="button">
          <button className='button-type'>
            <text>유형</text>
            <AiFillCaretDown />
          </button>
          <button  className='button-sort'>
            <text>정렬</text>
            <AiFillCaretDown />
          </button>
        </div>
        <div className="container">
        {[...Array(20)].map((_, index) => (
          <div key={index} className="item">
            <img 
              src="./logo192.png" 
              alt={`썸네일${index + 1}`} 
              onClick={() => openModal("./logo192.png")}
            />
          </div>
        ))}
      </div>
      <DetailModal isOpen={isModalOpen} onClose={closeModal} imgSrc={modalImgSrc} />
      </div>
    </div>
  );
}