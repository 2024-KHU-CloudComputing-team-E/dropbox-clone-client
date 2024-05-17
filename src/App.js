import { Routes, Route } from "react-router-dom";
import MainPage from "./pages/MainPage";
import LoginPage from "./pages/LoginPage";
import UploadPage from "./pages/UploadPage";
import TrashPage from "./pages/TrashPage";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<MainPage />}>
          <Route path="login" element={<LoginPage />} />
          <Route path="upload" element={<UploadPage />} />
          <Route path="Trash" element={<TrashPage />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
