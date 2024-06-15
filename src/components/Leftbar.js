import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import Dropdown from "react-bootstrap/Dropdown";
import ListGroup from "react-bootstrap/ListGroup";
import ProgressBar from "react-bootstrap/ProgressBar";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Leftbar.css";

const BASE_URL = process.env.REACT_APP_BASE_URL;

// 유저 정보 요청
const fetchUserInfo = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/api/user/logined`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch user info", error);
    return null;
  }
};

function Leftbar() {
  const location = useLocation();
  const [user, setUser] = useState({
    email: "email@gmail.com",
    userName: "userName",
    userId: "userId",
  });

  useEffect(() => {
    const loadUserInfo = async () => {
      const userInfo = await fetchUserInfo();
      if (userInfo) {
        setUser(userInfo);
      }
    };
    loadUserInfo();
  }, []);

  return (
    <div className="leftbar">
      <div className="logo-container">
        <img src={"logo.png"} alt="logo" className="logo" />
        <h2>InstaBox</h2>
      </div>
      {user && (
        <div className="user-info">
          <div>{user.userName}</div>
          <div>{user.email}</div>
        </div>
      )}
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
          href={`/${user.userId}`}
          active={location.pathname === `/${user.userId}`}
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
