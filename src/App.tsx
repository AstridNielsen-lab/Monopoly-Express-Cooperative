import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// Pages
import Home from './pages/Home';
import About from './pages/About';
import HowItWorks from './pages/HowItWorks';
import Membership from './pages/Membership';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';

// Layout
import Layout from './components/layout/Layout';

function App() {
  return (
    <Router>
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="quem-somos" element={<About />} />
            <Route path="como-funciona" element={<HowItWorks />} />
            <Route path="seja-membro" element={<Membership />} />
            <Route path="blog" element={<Blog />} />
            <Route path="blog/:id" element={<BlogPost />} />
          </Route>
        </Routes>
      </AnimatePresence>
    </Router>
  );
}

export default App;