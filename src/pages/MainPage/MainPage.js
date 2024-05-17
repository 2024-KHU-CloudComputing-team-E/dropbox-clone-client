import React from "react";
import Header from "../../components/Header";
import Leftbar from "../../components/Leftbar";
import './MainPage.css'
import { AiFillCaretDown } from "react-icons/ai";


export default function MainPage() {
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
