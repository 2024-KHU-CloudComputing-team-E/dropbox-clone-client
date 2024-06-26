import React from "react";
import login from "./googleLoginImage.svg";
import "bootstrap/dist/css/bootstrap.min.css";

const BASE_URL = process.env.REACT_APP_BASE_URL;

export default function LoginPage() {
  return (
    <div className="container d-flex flex-column justify-content-center align-items-center vh-100">
      <div className="h-25">
        <h1 className="w-100">InstaBox</h1>
      </div>
      <div className="w-25">
        <a href={`${BASE_URL}/api/login/google`}>
          <img
            src={login}
            alt="구글 로그인"
            className="w-100"
            style={{ cursor: "pointer" }}
          />
        </a>
      </div>
    </div>
  );
}
