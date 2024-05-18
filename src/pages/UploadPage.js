import React, { useEffect, useState } from "react";
import "../UploadPage.css";

export default function UploadPage() {
  return (
    <>
      UploadPage
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
  //브라우저화면에 파일을 드롭하게 되면 브라우저의 기본동작에 의해 새 창이 뜨는 것을 방지
  const handleDragOver = (e) => {
    e.preventDefault();
  };
  //영역 내에 파일이 드롭되는 순간의 이벤트에 접근하기 위한 drop 이벤트핸들러
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
    //'file'은 서버에서 파일을 식별할 키이다.
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

  //name, size, type정보를 uploadedInfo에 state값으로 저장
  const setFileInfo = (file) => {
    const { name, size: byteSize, type } = file;
    const size = (byteSize / (1024 * 1024)).toFixed(2) + "mb";
    setUploadedInfo({ name, size, type });
  };

  const FileInfo = ({ uploadedInfo }) => (
    <ul className="preview_info">
      {Object.entries(uploadedInfo || { name: "", size: "", type: "" }).map(
        ([key, value]) => (
          <li key={key}>
            <span className="info_key">{key}</span>
            <span className="info_value">{value}</span>
          </li>
        )
      )}
    </ul>
  );

  return (
    //isActive 값에 따라 className을 제어한다
    <label
      className={`preview${isActive ? " active" : ""}`}
      onDragEnter={handleDragStart}
      onDragOver={handleDragOver}
      onDragLeave={handleDragEnd}
      onDrop={handleDrop}
    >
      <input type="file" className="file" onChange={handleUpload}></input>
      {/* uploadedInfo값 유무에 따른 분기 */}
      {uploadedInfo ? (
        <FileInfo {...uploadedInfo} />
      ) : (
        <>
          <p className="preview_msg">클릭 혹은 파일을 이곳에 드롭하세요.</p>
          <p className="preview_desc">여기다가 보조문구를 적는다.</p>
        </>
      )}
    </label>
  );
};
