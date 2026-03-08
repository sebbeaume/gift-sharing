import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { EventPage } from './pages/EventPage';
import './App.css';

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/event/:id" element={<EventPage />} />
    </Routes>
  </BrowserRouter>
);

export default App;
