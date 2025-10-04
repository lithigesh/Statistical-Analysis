// client/src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import DistributionPlotter from './components/DistributionPlotter';
import HypothesisTest from './components/HypothesisTest';
import RegressionAnalysis from './components/RegressionAnalysis';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 font-sans antialiased">
        <Navigation />
        
        <div className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<DistributionPlotter />} />
            <Route path="/hypothesis-testing" element={<HypothesisTest />} />
            <Route path="/regression" element={<RegressionAnalysis />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;