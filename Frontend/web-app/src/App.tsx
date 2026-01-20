import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './components/MainLayout';
import Home from './pages/home';
import Write from './pages/write';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="write" element={<Write />} />
          <Route path="read" element={<div className="p-4">Read Page (Coming Soon)</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
