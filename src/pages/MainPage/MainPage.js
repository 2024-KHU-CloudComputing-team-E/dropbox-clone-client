import React from "react";
import Header from "../../components/Header";
import Leftbar from "../../components/Leftbar";
import './MainPage.css'
import { AiFillCaretDown } from "react-icons/ai";


export default function MainPage() {

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImgSrc, setModalImgSrc] = useState('');

  const openModal = (imgSrc) =&gt; {
    setModalImgSrc(imgSrc);
    setIsModalOpen(true);
  };

  const closeModal = () =&gt; {
    setIsModalOpen(false);
    setModalImgSrc('');
  };

  return (
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
            <img src="./logo192.png" alt={`썸네일${index + 1}`} />
          </div>
        ))}
      </div>
    </div>
  );
}
