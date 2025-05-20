import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import Nav from './components/Nav/Nav';
import Home from './pages/Home/Home';
import Empleados from './pages/Empleados/Empleados';

// Pages



function App() {
  return (

      <Router>
        <Nav />
          <Routes>
           <Route path="/" element={<Home />} />
           <Route path="/empleados" element={<Empleados />} />
          </Routes>
      </Router>

  );
}

export default App;
