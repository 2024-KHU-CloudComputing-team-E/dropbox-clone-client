import React, { useEffect, useState } from "react";
import "../UploadPage.css";
import Leftbar from "../components/Leftbar";
import Header from "../components/Header";

export default function UploadPage() {
  return (
    <>
      <Header />
      <Leftbar />
      <UploadBox />
    </>
  );
}

const UploadBox = () => {
  const [isActive, setActive] = useState(false);
  const [uploadedInfo, setUploadedInfo] = useState(null);

  //테스트코드
  useEffect(() => {
    if (uploadedInfo) {
      console.log(uploadedInfo);
    }
  }, [uploadedInfo]);

  const handleDragStart = () => setActive(true);
  const handleDragEnd = () => setActive(false);

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setActive(false);
    const file = e.dataTransfer.files[0];
    setFileInfo(file);
  };

  const handleUpload = ({ target }) => {
    const file = target.files[0];
    if (!file) {
      return;
    }
    setFileInfo(file);

    const formData = new FormData();
    formData.append("file", file);

    fetch("/upload_file", {
      method: "POST",
      body: formData,
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        return res.json();
      })
      .then((data) => {
        console.log("Upload successful", data);
      })
      .catch((err) => {
        console.error("Error during file upload: ", err);
      });
  };

  const setFileInfo = (file) => {
    const { name, size: byteSize, type } = file;
    const size = (byteSize / (1024 * 1024)).toFixed(2) + "mb";
    setUploadedInfo({ name, size, type });
  };

  const FileInfo = ({ name, size, type }) => (
    <ul className="preview_info">
      <li>
        <span className="info_key">이름</span>
        <span className="info_value">{name}</span>
      </li>
      <li>
        <span className="info_key">크기</span>
        <span className="info_value">{size}</span>
      </li>
      <li>
        <span className="info_key">타입</span>
        <span className="info_value">{type}</span>
      </li>
    </ul>
  );

  return (
    <div className="layout">
      <label
        className={`preview${isActive ? " active" : ""}`}
        onDragEnter={handleDragStart}
        onDragOver={handleDragOver}
        onDragLeave={handleDragEnd}
        onDrop={handleDrop}
      >
        <input type="file" className="file" onChange={handleUpload}></input>
        {uploadedInfo ? (
          <FileInfo {...uploadedInfo} />
        ) : (
          <>
            <p className="preview_msg">클릭 혹은 파일을 이곳에 드롭하세요.</p>
            <p className="preview_desc">여기다가 보조문구를 적는다.</p>
          </>
        )}
      </label>
    </div>
  );
};
