import React from 'react';
import login from './googleLoginImage.svg';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';

const BASE_URL = process.env.REACT_APP_BASE_URL;

export default function LoginPage() {
  const handleLoginClick = async () => {
    try {
      console.log(`${BASE_URL}/api/login/google`);
      const response = await axios.get(`${BASE_URL}/api/login/google`);
      console.log(response.data);
    } catch (error) {
      console.error('Error logging in with Google:', error);
    }
  };

  return (
    <div className="container d-flex flex-column justify-content-center align-items-center vh-100">
      <div className="h-25">
        <h1 className="w-100">InstaBox</h1>
      </div>
      <div className="w-25">
        <img 
          src={login} 
          alt='구글 로그인' 
          className="w-100"
          onClick={handleLoginClick}
          style={{ cursor: 'pointer' }}
        />
      </div>
    </div>
  );
}
