import { Routes, Route } from "react-router-dom";

import MainPage from "./pages/MainPage";
import LoginPage from "./pages/LoginPage";
import UploadPage from "./pages/UploadPage";
import TrashPage from "./pages/TrashPage";
import Header from "./components/Header";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route index element={<MainPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/Upload" element={<UploadPage />} />
        <Route path="/Trash" element={<TrashPage />} />
        <Route path="/Test" element={<Header />} />
      </Routes>
    </div>
  );
}

export default App;
