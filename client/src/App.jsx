import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomeView from './components/HomeView.jsx';
import RoomView from './components/RoomView.jsx';

// Application root defining the client routes.
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeView />} />
        <Route path="/room/:id" element={<RoomView />} />
      </Routes>
    </BrowserRouter>
  );
}
