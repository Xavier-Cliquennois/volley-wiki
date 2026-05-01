import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './layouts/Layout';
import Home from './pages/Home';
import Techniques from './pages/Techniques';
import Positions from './pages/Positions';
import Rules from './pages/Rules';
import Glossary from './pages/Glossary';
import Scenarios from './pages/Scenarios';
import ScenarioDetail from './pages/ScenarioDetail';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout><Home /></Layout>} />
        <Route path="/techniques" element={<Layout><Techniques /></Layout>} />
        <Route path="/positions" element={<Layout><Positions /></Layout>} />
        <Route path="/scenarios" element={<Layout><Scenarios /></Layout>} />
        <Route path="/scenarios/:id" element={<Layout><ScenarioDetail /></Layout>} />
        <Route path="/rules" element={<Layout><Rules /></Layout>} />
        <Route path="/glossary" element={<Layout><Glossary /></Layout>} />
      </Routes>
    </BrowserRouter>
  );
}
