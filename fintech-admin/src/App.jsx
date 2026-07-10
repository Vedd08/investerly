import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import TestimonialsManager from './pages/TestimonialsManager';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* Default route is now the Testimonials manager */}
          <Route index element={<TestimonialsManager />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
