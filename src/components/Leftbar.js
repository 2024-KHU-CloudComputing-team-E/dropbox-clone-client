import React, { useState, useEffect } from "react";
import { useLocation, useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Dropdown from "react-bootstrap/Dropdown";
import ListGroup from "react-bootstrap/ListGroup";
import ProgressBar from "react-bootstrap/ProgressBar";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
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

// 특정 사용자 정보 요청
const fetchSpecificUserInfo = async (userId) => {
  try {
    const response = await axios.get(`${BASE_URL}/api/user/${userId}`);
    console.log("fetchSpecificUserInfo", response.data);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch specific user info", error);
    return null;
  }
};

// 팔로우 요청
const followUser = async (userId) => {
  try {
    const response = await axios.post(`${BASE_URL}/api/ff/follow/${userId}`);
    console.log(response.data);
    return response;
  } catch (error) {
    console.error("Failed to follow user", error);
    return null;
  }
};

// 언팔로우 요청
const unfollowUser = async (userId) => {
  try {
    const response = await axios.post(`${BASE_URL}/api/ff/unfollow/${userId}`);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Failed to unfollow user", error);
    return null;
  }
};

function Leftbar() {
  const location = useLocation();
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const [followingCount, setFollowingCount] = useState(0);
  const [followerCount, setFollowerCount] = useState(0);
  const [showFollowingModal, setShowFollowingModal] = useState(false);
  const [showFollowerModal, setShowFollowerModal] = useState(false);
  const [isFollow, setIsFollow] = useState(false);
  const [anotherUser, setAnotherUser] = useState({});
  const [anotherFollowingCount, setAnotherFollowingCount] = useState(0);
  const [anotherFollowerCount, setAnotherFollowerCount] = useState(0);

  const loadUserInfo = async () => {
    const userInfo = await fetchUserInfo();
    if (userInfo) {
      setUser(userInfo);
      console.log("userInfo", userInfo);
      setFollowingCount(userInfo.followings.length);
      setFollowerCount(userInfo.followers.length);
      // 현재 사용자가 팔로우하는지 확인
      const isFollowing = userInfo.followings.some(
        (following) => following.userId === userId
      );
      console.log("isFollowing", isFollowing);
      setIsFollow(isFollowing);
    }
    const anotherUserInfo = await fetchSpecificUserInfo(userId);
    if (anotherUserInfo) {
      setAnotherUser(anotherUserInfo);
      console.log("anotherUserInfo", anotherUserInfo);
      setAnotherFollowerCount(anotherUserInfo.followers.length);
      setAnotherFollowingCount(anotherUserInfo.followings.length);
    }
  };

  useEffect(() => {
    loadUserInfo();
  }, [location.key]);

  const isOwner =
    user.userId &&
    (user.userId === userId ||
      ["/upload", "/favorites", "/trash"].includes(location.pathname));

  const handleShowFollowing = () => setShowFollowingModal(true);
  const handleCloseFollowing = () => setShowFollowingModal(false);

  const handleShowFollower = () => setShowFollowerModal(true);
  const handleCloseFollower = () => setShowFollowerModal(false);

  const handleRedirect = (userId) => {
    navigate(`/${userId}`);
    handleCloseFollowing();
    handleCloseFollower();
    window.location.reload();
  };

  const handleFollow = async () => {
    const response = await followUser(userId);
    if (response) {
      loadUserInfo();
    }
  };

  const handleUnfollow = async () => {
    const response = await unfollowUser(userId);
    if (response) {
      loadUserInfo();
    }
  };

  return (
    <div className="leftbar">
      <div className="logo-container">
        <img src={"logo.png"} alt="logo" className="logo" />
        <h2>InstaBox</h2>
      </div>
      <div className="user-info">
        {isOwner ? (
          <>
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
          </>
        ) : (
          <>
            <div>{anotherUser.userName}</div>
            <div>{anotherUser.email}</div>
            {isFollow ? (
              <Button variant="outline-danger" onClick={handleUnfollow}>
                언팔로우
              </Button>
            ) : (
              <Button variant="outline-primary" onClick={handleFollow}>
                팔로우
              </Button>
            )}
            <div className="follow-info">
              <Button
                variant="outline-primary"
                className="m-1"
                onClick={handleShowFollowing}
              >
                팔로잉 {anotherFollowingCount}
              </Button>
              <Button
                variant="outline-primary"
                className="m-1"
                onClick={handleShowFollower}
              >
                팔로워 {anotherFollowerCount}
              </Button>
            </div>
            <Button
              as={Link}
              to={`/${user.userId}`}
              variant="outline-secondary"
              className="m-1"
              onClick={() => handleRedirect(user.userId)}
            >
              내 저장소로 이동하기
            </Button>
          </>
        )}
      </div>
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
      {isOwner && (
        <div className="storage-info">
          <h5>저장용량</h5>
          10GB 중 {user.volume}GB 사용
          <ProgressBar now={(user.volume / 10) * 100} />
        </div>
      )}

      {/* 팔로잉 목록 모달 */}
      <Modal show={showFollowingModal} onHide={handleCloseFollowing}>
        <Modal.Header closeButton>
          <Modal.Title>팔로잉 목록</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ListGroup>
            {(isOwner ? user.followings : anotherUser.followings)?.map(
              (following, index) => (
                <ListGroup.Item
                  key={index}
                  onClick={() => handleRedirect(following.userId)}
                >
                  {following.userName}
                </ListGroup.Item>
              )
            )}
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
            {(isOwner ? user.followers : anotherUser.followers)?.map(
              (follower, index) => (
                <ListGroup.Item
                  key={index}
                  onClick={() => handleRedirect(follower.userId)}
                >
                  {follower.userName}
                </ListGroup.Item>
              )
            )}
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
