import React from 'react';
import './App.css';
import HillCipherApp from './components/HillCipherApp';

function App() {
  return (
    <div className="App">
      {/* Organic Floating Particles Background */}
      <div className="floating-particles">
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
      </div>
      
      <HillCipherApp />
    </div>
  );
}

export default App;
