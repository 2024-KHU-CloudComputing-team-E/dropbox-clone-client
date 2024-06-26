import React, { useEffect, useState } from "react";
import "./UploadPage.css";
import Leftbar from "../../components/Leftbar";
import Header from "../../components/Header";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function UploadPage() {
  return (
    <>
      <Header />
      <Leftbar />
      <UploadBox />
      <ToastContainer />{" "}
      {/* ToastContainer를 추가하여 알림이 화면에 표시되도록 합니다 */}
    </>
  );
}

const UploadBox = () => {
  const [isActive, setActive] = useState(false);
  const [uploadedInfo, setUploadedInfo] = useState(null);
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태 추가

  // 테스트 코드
  useEffect(() => {
    if (file) {
      console.log("file", file);
    }
  }, [file]);

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
    setFile(file);
  };

  const handleUpload = ({ target }) => {
    const file = target.files[0];
    if (!file) {
      return;
    }
    setFileInfo(file);
    setFile(file);

    const formData = new FormData();
    formData.append("file", file);
  };

  const setFileInfo = (file) => {
    const { name, size: byteSize, type } = file;
    let size;
    if (byteSize >= 1024 * 1024 * 1024) {
      size = Math.floor(byteSize / (1024 * 1024 * 1024)) + "GB";
    } else if (byteSize >= 1024 * 1024) {
      size = Math.floor(byteSize / (1024 * 1024)) + "MB";
    } else if (byteSize >= 1024) {
      size = Math.floor(byteSize / 1024) + "KB";
    } else {
      size = byteSize + "B";
    }
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

  const handleFileUpload = () => {
    if (!file) {
      toast.warn("파일을 선택해주세요.");
      return;
    }
    setIsLoading(true); // 로딩 상태 시작
    const formData = new FormData();
    formData.append("file", file);

    fetch("/api/uploadfile/file", {
      method: "POST",
      body: formData,
    })
      .then((data) => {
        console.log("Upload successful", data);
        toast.success("파일 업로드가 성공했습니다!");
        window.location.reload();
      })
      .catch((err) => {
        console.error("Error during file upload: ", err);
        toast.error("파일 업로드 중 오류가 발생했습니다.");
      })
      .finally(() => {
        setIsLoading(false); // 로딩 상태 종료
      });
  };

  return (
    <div className="uploadPageLayout">
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
          </>
        )}
      </label>
      <button
        className="uploadButton"
        onClick={handleFileUpload}
        disabled={isLoading}
      >
        {isLoading ? "업로드 중..." : "업로드"}
      </button>
      {isLoading && (
        <div className="loadingSpinner">
          <div className="spinner"></div>
          업로드 중입니다. 잠시만 기다려 주세요.
        </div>
      )}
    </div>
  );
};
