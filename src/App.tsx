import './App.css';
import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Layout from './layouts/Layout';
import Home from './pages/Home';
import Techniques from './pages/Techniques';
import Positions from './pages/Positions';
import Rules from './pages/Rules';
import Glossary from './pages/Glossary';
import Scenarios from './pages/Scenarios';
import ScenarioDetail from './pages/ScenarioDetail';
import Guides from './pages/Guides';
import GuideDetail from './pages/GuideDetail';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Layout><Home /></Layout>} />
        <Route path="/techniques" element={<Layout><Techniques /></Layout>} />
        <Route path="/positions" element={<Layout><Positions /></Layout>} />
        <Route path="/scenarios" element={<Layout><Scenarios /></Layout>} />
        <Route path="/scenarios/:id" element={<Layout><ScenarioDetail /></Layout>} />
        <Route path="/rules" element={<Layout><Rules /></Layout>} />
        <Route path="/glossary" element={<Layout><Glossary /></Layout>} />
        <Route path="/guides" element={<Layout><Guides /></Layout>} />
        <Route path="/guides/:slug" element={<Layout><GuideDetail /></Layout>} />
      </Routes>
    </BrowserRouter>
  );
}
