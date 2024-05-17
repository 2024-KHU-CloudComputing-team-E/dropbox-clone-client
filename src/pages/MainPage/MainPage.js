import React from "react";
import Header from "../../components/Header";
import Leftbar from "../../components/Leftbar";
import './MainPage.css'

export default function MainPage() {
  return (
    <div className="layout">
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
