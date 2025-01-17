import './App.css';
import '@fontsource/inter';
import HomePage from './pages/HomePage/HomePage';
import AboutPage from './pages/AboutPage/AboutPage';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SubstationDiagram from './Components/Substation/Substation';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
