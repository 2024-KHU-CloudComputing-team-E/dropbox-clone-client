import React, { useState, useEffect } from "react";
import { useLocation, useParams, Link } from "react-router-dom";
import axios from "axios";
import Dropdown from "react-bootstrap/Dropdown";
import ListGroup from "react-bootstrap/ListGroup";
import ProgressBar from "react-bootstrap/ProgressBar";
import Button from "react-bootstrap/Button"; // Button import 추가
import Modal from "react-bootstrap/Modal"; // Modal import 추가
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
  const { userId } = useParams();
  const [user, setUser] = useState({});
  const [followingCount, setFollowingCount] = useState(0);
  const [followerCount, setFollowerCount] = useState(0);
  const [showFollowingModal, setShowFollowingModal] = useState(false);
  const [showFollowerModal, setShowFollowerModal] = useState(false);

  useEffect(() => {
    const loadUserInfo = async () => {
      const userInfo = await fetchUserInfo();
      if (userInfo) {
        setUser(userInfo);
        const following = userInfo.followings.length;
        const follower = userInfo.followers.length;
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

  const handleShowFollowing = () => setShowFollowingModal(true);
  const handleCloseFollowing = () => setShowFollowingModal(false);

  const handleShowFollower = () => setShowFollowerModal(true);
  const handleCloseFollower = () => setShowFollowerModal(false);

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
            <Button
              variant="outline-primary"
              className="m-1"
              onClick={handleShowFollowing}
            >
              팔로잉 {followingCount}
            </Button>
            <Button
              variant="outline-primary"
              className="m-1"
              onClick={handleShowFollower}
            >
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

      {/* 팔로잉 목록 모달 */}
      <Modal show={showFollowingModal} onHide={handleCloseFollowing}>
        <Modal.Header closeButton>
          <Modal.Title>팔로잉 목록</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ListGroup>
            {user.followings &&
              user.followings.map((following, index) => (
                <ListGroup.Item key={index}>
                  {following.userName} ({following.email})
                </ListGroup.Item>
              ))}
          </ListGroup>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseFollowing}>
            닫기
          </Button>
        </Modal.Footer>
      </Modal>

      {/* 팔로워 목록 모달 */}
      <Modal show={showFollowerModal} onHide={handleCloseFollower}>
        <Modal.Header closeButton>
          <Modal.Title>팔로워 목록</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ListGroup>
            {user.followers &&
              user.followers.map((follower, index) => (
                <ListGroup.Item key={index}>
                  {follower.userName} ({follower.email})
                </ListGroup.Item>
              ))}
          </ListGroup>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseFollower}>
            닫기
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Leftbar;
