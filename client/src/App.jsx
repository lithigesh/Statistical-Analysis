// client/src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import DistributionPlotter from './components/DistributionPlotter';
import HypothesisTest from './components/HypothesisTest';
import RegressionAnalysis from './components/RegressionAnalysis';
import Dashboard from './components/Dashboard';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white font-sans antialiased">
        <Navigation />
        
        <div className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/distributions" element={<DistributionPlotter />} />
            <Route path="/hypothesis-testing" element={<HypothesisTest />} />
            <Route path="/regression" element={<RegressionAnalysis />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;