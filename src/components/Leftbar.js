import React from "react";
import { useLocation } from "react-router-dom";
import Dropdown from "react-bootstrap/Dropdown";
import ListGroup from "react-bootstrap/ListGroup";
import ProgressBar from "react-bootstrap/ProgressBar";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Leftbar.css";

function Leftbar() {
  const location = useLocation();

  return (
    <div className="leftbar">
      <div className="logo-container">
        <img src={"logo.png"} alt="logo" className="logo" />
        <h2>InstaBox</h2>
      </div>
      <ListGroup>
        <ListGroup.Item
          action
          href="/upload"
          active={location.pathname === "/upload"}
        >
          업로드
        </ListGroup.Item>
        <ListGroup.Item
          action
          href="/storage"
          active={location.pathname === "/storage"}
        >
          저장소
        </ListGroup.Item>
        <ListGroup.Item
          action
          href="/favorites"
          active={location.pathname === "/favorites"}
        >
          즐겨찾기
        </ListGroup.Item>
        <ListGroup.Item
          action
          href="/trash"
          active={location.pathname === "/trash"}
        >
          휴지통
        </ListGroup.Item>
      </ListGroup>
      <Dropdown.Item>
        <h5>저장용량</h5>
        100GB 중 18GB 사용
        <ProgressBar now={18} />
      </Dropdown.Item>
    </div>
  );
}

export default Leftbar;
