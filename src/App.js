import { Routes, Route } from "react-router-dom";
import MainPage from "./pages/MainPage/MainPage";
import LoginPage from "./pages/LoginPage/LoginPage";
import UploadPage from "./pages/UploadPage/UploadPage";
import TrashPage from "./pages/TrashPage/TrashPage";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/:userId" element={<MainPage />} />
        <Route path="/" element={<LoginPage />} />
        <Route path="/upload" element={<UploadPage />} />
        <Route path="/trash" element={<TrashPage />} />
      </Routes>
    </div>
  );
}

export default App;
