import React, { useState, useEffect } from "react";
import { useLocation, useParams, Link } from "react-router-dom";
import axios from "axios";
import Dropdown from "react-bootstrap/Dropdown";
import ListGroup from "react-bootstrap/ListGroup";
import ProgressBar from "react-bootstrap/ProgressBar";
import Button from "react-bootstrap/Button"; // Button import 추가
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

// 팔로잉 카운트 요청
const getFollowingCount = async (userId) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/api/ff/followingCount/${userId}`
    );
    console.log("getFollowingCount", response.data);
    return response.data;
  } catch (error) {
    console.error("Failed to get following count", error);
    return 0;
  }
};

// 팔로워 카운트 요청
const getFollowerCount = async (userId) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/api/ff/followerCount/${userId}`
    );
    console.log("getFollowerCount", response.data);

    return response.data;
  } catch (error) {
    console.error("Failed to get follower count", error);
    return 0;
  }
};

function Leftbar() {
  const location = useLocation();
  const { userId } = useParams();
  const [user, setUser] = useState({});
  const [followingCount, setFollowingCount] = useState(0);
  const [followerCount, setFollowerCount] = useState(0);

  useEffect(() => {
    const loadUserInfo = async () => {
      const userInfo = await fetchUserInfo();
      if (userInfo) {
        setUser(userInfo);
        const following = await getFollowingCount(userInfo.userId);
        const follower = await getFollowerCount(userInfo.userId);
        setFollowingCount(following);
        setFollowerCount(follower);
      }
    };
    loadUserInfo();
  }, []);

  const isOwner =
    user.userId &&
    (user.userId === userId ||
      ["/upload", "/favorites", "/trash"].includes(location.pathname));

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
          <div className="follow-info">
            <Button variant="outline-primary" className="m-1">
              팔로잉 {followingCount}
            </Button>
            <Button variant="outline-primary" className="m-1">
              팔로워 {followerCount}
            </Button>
          </div>
          <Button
            as={Link}
            to={`/${user.userId}`}
            variant="outline-secondary"
            className="m-1"
          >
            내 저장소로 이동하기
          </Button>
        </div>
      )}
      <ListGroup>
        <ListGroup.Item
          as={Link}
          to={`/${user.userId}`}
          active={
            location.pathname !== "/upload" &&
            location.pathname !== "/favorites" &&
            location.pathname !== "/trash"
          }
          disabled={!isOwner}
        >
          저장소
        </ListGroup.Item>
        {isOwner && (
          <>
            <ListGroup.Item
              as={Link}
              to="/upload"
              active={location.pathname === "/upload"}
            >
              업로드
            </ListGroup.Item>
            <ListGroup.Item
              as={Link}
              to="/favorites"
              active={location.pathname === "/favorites"}
            >
              즐겨찾기
            </ListGroup.Item>
            <ListGroup.Item
              as={Link}
              to="/trash"
              active={location.pathname === "/trash"}
            >
              휴지통
            </ListGroup.Item>
          </>
        )}
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
