import React, { useState, useEffect } from 'react';
import MatrixVisualization from './MatrixVisualization';
import TextProcessor from './TextProcessor';
import FileProcessor from './FileProcessor';
import HelpModal from './HelpModal';
import './HillCipherApp.css';

const HillCipherApp = () => {
  const [keyMatrix, setKeyMatrix] = useState([]);
  const [inverseMatrix, setInverseMatrix] = useState([]);
  const [matrixSize, setMatrixSize] = useState(3);
  const [mode, setMode] = useState('text'); // 'text' or 'file'
  const [loading, setLoading] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [error, setError] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Scroll effect for dynamic header
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset;
      const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercentage = (scrollTop / documentHeight) * 100;
      
      setIsScrolled(scrollTop > 100);
      setScrollProgress(scrollPercentage);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const generateKey = async (size) => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('http://localhost:5000/api/generate-key', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ size }),
      });
      
      const data = await response.json();
      if (response.ok) {
        setKeyMatrix(data.key_matrix);
        setInverseMatrix(data.inverse_matrix);
        setMatrixSize(size);
      } else {
        setError(data.error || 'Failed to generate key');
      }
    } catch (err) {
      setError('Backend connection failed. Please ensure Flask server is running on port 5000.');
    }
    setLoading(false);
  };

  useEffect(() => {
    generateKey(3); // Generate initial 3x3 matrix
  }, []);

  const handleMatrixSizeChange = (size) => {
    generateKey(size);
  };

  return (
    <div className="hill-cipher-app">
      {/* Dynamic Header with Progress */}
      <header className={`app-header ${isScrolled ? 'scrolled' : ''}`}>
        <div className="header-content">
          <h1 className={`app-title ${isScrolled ? 'compact' : ''}`}>
            <span className="title-icon">🔐</span>
            <span className="title-text">
              Hill Cipher NxN
              {!isScrolled && <span className="title-subtitle">Secure Text Encryption</span>}
            </span>
          </h1>
          <button 
            className="help-button"
            onClick={() => setShowHelp(true)}
          >
            <span>📘</span> 
            {!isScrolled && <span>Help</span>}
          </button>
        </div>
        {/* Scroll Progress Bar */}
        <div 
          className="scroll-progress" 
          style={{ transform: `scaleX(${scrollProgress / 100})` }}
        ></div>
      </header>

      {/* Error Display */}
      {error && (
        <div className="error-banner">
          <span className="error-icon">⚠️</span>
          {error}
          <button onClick={() => setError('')} className="error-close">×</button>
        </div>
      )}

      {/* Main Content */}
      <main className="app-main">
        {/* Matrix Configuration Section */}
        <section className="matrix-config-section">
          <div className="section-header">
            <h2>🔢 Matrix Configuration</h2>
            <p>Choose your key matrix size and generate encryption keys</p>
          </div>
          
          <div className="matrix-size-selector">
            <label>Matrix Size (n×n):</label>
            <div className="size-buttons">
              {[2, 3, 4, 5, 6, 7].map(size => (
                <button
                  key={size}
                  className={`size-button ${matrixSize === size ? 'active' : ''}`}
                  onClick={() => handleMatrixSizeChange(size)}
                  disabled={loading}
                >
                  {size}×{size}
                </button>
              ))}
            </div>
            <button 
              className="regenerate-button"
              onClick={() => generateKey(matrixSize)}
              disabled={loading}
            >
              {loading ? '🔄 Generating...' : '🎲 Regenerate Key'}
            </button>
          </div>

          {/* Matrix Visualization */}
          {keyMatrix.length > 0 && (
            <MatrixVisualization 
              keyMatrix={keyMatrix}
              inverseMatrix={inverseMatrix}
              matrixSize={matrixSize}
            />
          )}
        </section>

        {/* Mode Selection */}
        <section className="mode-selection">
          <div className="mode-buttons">
            <button
              className={`mode-button ${mode === 'text' ? 'active' : ''}`}
              onClick={() => setMode('text')}
            >
              <span className="mode-icon">✍️</span>
              Direct Text Input
            </button>
            <button
              className={`mode-button ${mode === 'file' ? 'active' : ''}`}
              onClick={() => setMode('file')}
            >
              <span className="mode-icon">📄</span>
              File Upload (.txt)
            </button>
          </div>
        </section>

        {/* Processing Section */}
        <section className="processing-section">
          {mode === 'text' ? (
            <TextProcessor 
              keyMatrix={keyMatrix}
              matrixSize={matrixSize}
            />
          ) : (
            <FileProcessor 
              keyMatrix={keyMatrix}
              matrixSize={matrixSize}
            />
          )}
        </section>
      </main>

      {/* Help Modal */}
      {showHelp && (
        <HelpModal onClose={() => setShowHelp(false)} />
      )}

      {/* Footer */}
      <footer className="app-footer">
        <p>Hill Cipher NxN • Modulo 97 Arithmetic • Secure Encryption System</p>
      </footer>
    </div>
  );
};

export default HillCipherApp;
