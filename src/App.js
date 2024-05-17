import { Routes, Route } from 'react-router-dom';
import MainPage from './pages/MainPage'
import LoginPage from './pages/LoginPage/LoginPage';
import UploadPage from './pages/UploadPage';
import TrashPage from './pages/TrashPage';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route index element={<MainPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/Upload" element={<UploadPage />} />
        <Route path="/Trash" element={<TrashPage />} />
      </Routes>
    </div>
  );
}

export default App;