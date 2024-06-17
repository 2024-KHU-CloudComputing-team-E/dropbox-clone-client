import React, { useState, useEffect } from "react";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Navbar from "react-bootstrap/Navbar";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Header.css";

const BASE_URL = process.env.REACT_APP_BASE_URL;

function Header() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [debounceTimeout, setDebounceTimeout] = useState(null);

  // 유저 검색 요청
  const fetchSearchResults = async (term) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/search/${term}`);
      console.log(response.data);
      setSearchResults("fetchSearchResults", response.data);
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
                  <div key={index} className="search-result-item">
                    {result}
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
