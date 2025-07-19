import { Routes, Route } from 'react-router-dom';
import Nav from './components/Nav';
import Login from './components/Login';
import Register from './components/Register';
import SearchMovies from './components/SearchMovies';

function App() {
  return (
    <div>
      <Nav />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/search" element={<SearchMovies />} />
        <Route path="/" element={<Login />} /> {/* Default route */}
      </Routes>
    </div>
  );
}

export default App;
