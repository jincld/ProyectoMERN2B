import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import Nav from './components/Nav/Nav';
import Home from './pages/Home/Home';
import Empleados from './pages/Empleados/Empleados';
import Productos from './pages/Productos/Productos';
import Blog from './pages/Blog/Blog';

function App() {
  return (

      <Router>
        <Nav />
          <Routes>
           <Route path="/" element={<Home />} />
           <Route path="/empleados" element={<Empleados />} />
           <Route path="/productos" element={<Productos />} />
            <Route path="/blog" element={<Blog />} />
          </Routes>
      </Router>

  );
}

export default App;
