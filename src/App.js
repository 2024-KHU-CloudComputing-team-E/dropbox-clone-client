import {Outlet, Routes, Route } from 'react-router-dom';
import MainPage from './pages/MainPage/MainPage'
import LoginPage from './pages/LoginPage/LoginPage';
import UploadPage from './pages/UploadPage';
import TrashPage from './pages/TrashPage';
import Header from './components/Header'
import Leftbar from './components/Leftbar';

const Layout = () => {
  return (
    <div>
      <Header />
      <Leftbar/>
      <Outlet />
    </div>
  )
}

function App() {
  return (
    <div className="App">

      <Routes>
        <Route path='/' element={<Layout />}>
          <Route index element={<MainPage />} />
          <Route path="/Upload" element={<UploadPage />} />
          <Route path="/Trash" element={<TrashPage />} />
        </Route>
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </div>
  );
}

export default App;