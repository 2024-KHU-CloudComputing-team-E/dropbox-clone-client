import React, { useState, useEffect } from "react";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Navbar from "react-bootstrap/Navbar";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Header.css";
import { useNavigate } from "react-router-dom";

const BASE_URL = process.env.REACT_APP_BASE_URL;

function Header() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([
    { userId: "114945935223681152221", userName: "홍승표" },
  ]);
  const [debounceTimeout, setDebounceTimeout] = useState(null);
  const navigate = useNavigate();

  // 유저 검색 요청
  const fetchSearchResults = async (term) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/search/${term}`);
      console.log("fetchSearchResults ---- ", term, "----", response.data);
      if (Array.isArray(response.data)) {
        setSearchResults(response.data);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error("Failed to fetch search results", error);
    }
  };

  useEffect(() => {
    if (searchTerm) {
      if (debounceTimeout) {
        clearTimeout(debounceTimeout);
      }
      const timeout = setTimeout(() => {
        fetchSearchResults(searchTerm);
      }, 300);
      setDebounceTimeout(timeout);
    } else {
      setSearchResults([]);
    }
  }, [searchTerm]);

  const handleResultClick = (userId) => {
    navigate(`/${userId}`);
  };

  return (
    <>
      <Navbar className="header-navbar" bg="light" variant="light">
        <Container>
          <Form className="d-flex search-form">
            <Form.Control
              type="search"
              placeholder="Search"
              className="search-bar"
              aria-label="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchResults.length > 0 && (
              <div className="search-results">
                {searchResults.map((result, index) => (
                  <div
                    key={index}
                    className="search-result-item"
                    onClick={() => handleResultClick(result.userId)}
                  >
                    {result.userName}
                  </div>
                ))}
              </div>
            )}
          </Form>
        </Container>
      </Navbar>
    </>
  );
}

export default Header;
