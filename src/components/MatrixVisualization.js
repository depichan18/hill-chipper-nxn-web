import React, { useState } from 'react';
import './MatrixVisualization.css';

const MatrixVisualization = ({ keyMatrix, inverseMatrix, matrixSize }) => {
  const [activeMatrix, setActiveMatrix] = useState('key'); // 'key' or 'inverse'

  const renderMatrix = (matrix, title, isActive) => {
    if (!matrix || matrix.length === 0) return null;

    return (
      <div className={`matrix-container ${isActive ? 'active' : ''}`}>
        <h3 className="matrix-title">{title}</h3>
        <div className="matrix-wrapper">
          <div className="matrix-bracket left-bracket">[</div>
          <div className="matrix-grid" style={{ gridTemplateColumns: `repeat(${matrixSize}, 1fr)` }}>
            {matrix.map((row, i) =>
              row.map((value, j) => (
                <div
                  key={`${i}-${j}`}
                  className="matrix-cell"
                  style={{
                    animationDelay: `${(i * matrixSize + j) * 0.05}s`
                  }}
                >
                  {value}
                </div>
              ))
            )}
          </div>
          <div className="matrix-bracket right-bracket">]</div>
        </div>
        <div className="matrix-info">
          <span className="matrix-size-label">{matrixSize}×{matrixSize} Matrix</span>
          <span className="matrix-mod-label">mod 97</span>
        </div>
      </div>
    );
  };

  return (
    <div className="matrix-visualization">
      <div className="matrix-tabs">
        <button
          className={`tab-button ${activeMatrix === 'key' ? 'active' : ''}`}
          onClick={() => setActiveMatrix('key')}
        >
          🔐 Key Matrix
        </button>
        <button
          className={`tab-button ${activeMatrix === 'inverse' ? 'active' : ''}`}
          onClick={() => setActiveMatrix('inverse')}
        >
          ♻️ Inverse Matrix
        </button>
      </div>

      <div className="matrices-display">
        {activeMatrix === 'key' && renderMatrix(keyMatrix, '🔐 Key Matrix', true)}
        {activeMatrix === 'inverse' && renderMatrix(inverseMatrix, '♻️ Inverse Matrix (for decryption)', true)}
      </div>

      {/* Matrix Properties */}
      <div className="matrix-properties">
        <div className="property-item">
          <span className="property-label">Determinant:</span>
          <span className="property-value">Invertible mod 97</span>
        </div>
        <div className="property-item">
          <span className="property-label">Block Size:</span>
          <span className="property-value">{matrixSize} characters</span>
        </div>
        <div className="property-item">
          <span className="property-label">Charset:</span>
          <span className="property-value">ASCII 32-126 + § ¤ (97 chars)</span>
        </div>
      </div>

      {/* Matrix Explanation */}
      <div className="matrix-explanation">
        <h4>🧮 How It Works:</h4>
        <ul>
          <li>Text is converted to numbers (0-96) based on character set</li>
          <li>Numbers are grouped into blocks of size {matrixSize}</li>
          <li><strong>Encryption:</strong> Block Vector × Key Matrix (mod 97)</li>
          <li><strong>Decryption:</strong> Cipher Vector × Inverse Matrix (mod 97)</li>
          <li>Results are converted back to text characters</li>
        </ul>
      </div>
    </div>
  );
};

export default MatrixVisualization;
