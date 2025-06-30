import React, { useState, useEffect } from 'react';
import './HelpModal.css';

const HelpModal = ({ onClose }) => {
  const [helpData, setHelpData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHelpData();
  }, []);

  const fetchHelpData = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/help');
      const data = await response.json();
      setHelpData(data);
    } catch (err) {
      // Fallback help data if backend is unavailable
      setHelpData({
        title: 'Hill Cipher MOD 97 Program Help',
        description: 'This program encrypts and decrypts text or .txt files using the Hill Cipher algorithm.',
        charset_info: 'Supported characters are printable ASCII (space to ~) plus two extra: \'§\' and \'¤\'.',
        modulus_info: 'Operations are performed using an nxn key matrix and modulo 97 arithmetic.',
        features: [
          'Encrypt or decrypt text directly from input',
          'Encrypt or decrypt .txt files via upload',
          'Automatically generates an invertible key matrix modulo 97',
          'Displays the key matrix and its inverse',
          'Real-time preview of encryption/decryption results'
        ],
        usage_steps: [
          'Select key matrix size from 2 to 7',
          'Choose between direct text input or file upload',
          'For file mode, upload your .txt file',
          'View the encrypted and decrypted results with matrix visualization',
          'Download the processed files if needed'
        ],
        notes: [
          'Do not use characters outside ASCII 32–126 + [\'§\', \'¤\']',
          'Automatic padding uses \'§\' to complete matrix blocks',
          'Matrix size affects encryption strength and block size'
        ]
      });
    }
    setLoading(false);
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (loading) {
    return (
      <div className="help-modal-overlay" onClick={handleOverlayClick}>
        <div className="help-modal">
          <div className="help-loading">
            <div className="help-spinner"></div>
            <p>Loading help content...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="help-modal-overlay" onClick={handleOverlayClick}>
      <div className="help-modal">
        <div className="help-header">
          <h2>📘 {helpData?.title || 'Help'}</h2>
          <button className="help-close" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="help-content">
          {/* Description */}
          <section className="help-section">
            <p className="help-description">{helpData?.description}</p>
            <div className="help-technical-info">
              <p><strong>Character Set:</strong> {helpData?.charset_info}</p>
              <p><strong>Mathematics:</strong> {helpData?.modulus_info}</p>
            </div>
          </section>

          {/* Features */}
          <section className="help-section">
            <h3>🔢 Main Features</h3>
            <ul className="help-list">
              {helpData?.features?.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
          </section>

          {/* Usage Steps */}
          <section className="help-section">
            <h3>✅ Usage Steps</h3>
            <ol className="help-ordered-list">
              {helpData?.usage_steps?.map((step, index) => (
                <li key={index}>{step}</li>
              ))}
            </ol>
          </section>

          {/* Technical Details */}
          <section className="help-section">
            <h3>🧮 Technical Details</h3>
            <div className="technical-grid">
              <div className="technical-item">
                <h4>Character Mapping</h4>
                <p>Each character is mapped to a number (0-96):</p>
                <ul>
                  <li>Space (ASCII 32) → 0</li>
                  <li>! (ASCII 33) → 1</li>
                  <li>... (ASCII 34-126) → 2-94</li>
                  <li>§ → 95</li>
                  <li>¤ → 96</li>
                </ul>
              </div>
              <div className="technical-item">
                <h4>Matrix Operations</h4>
                <p>Hill cipher uses linear algebra:</p>
                <ul>
                  <li><strong>Encryption:</strong> C = K × P (mod 97)</li>
                  <li><strong>Decryption:</strong> P = K⁻¹ × C (mod 97)</li>
                  <li>K = Key matrix</li>
                  <li>K⁻¹ = Inverse key matrix</li>
                  <li>P = Plaintext vector</li>
                  <li>C = Ciphertext vector</li>
                </ul>
              </div>
              <div className="technical-item">
                <h4>Block Processing</h4>
                <p>Text is processed in blocks:</p>
                <ul>
                  <li>Block size = Matrix size (n)</li>
                  <li>Text padded with '§' if needed</li>
                  <li>Each block becomes a column vector</li>
                  <li>Matrix multiplication per block</li>
                </ul>
              </div>
              <div className="technical-item">
                <h4>Security Features</h4>
                <p>Enhanced security measures:</p>
                <ul>
                  <li>Larger matrices = stronger encryption</li>
                  <li>Modulo 97 ensures invertibility</li>
                  <li>Random key generation</li>
                  <li>Automatic validation of matrix properties</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Important Notes */}
          <section className="help-section">
            <h3>🔐 Important Notes</h3>
            <div className="notes-container">
              {helpData?.notes?.map((note, index) => (
                <div key={index} className="note-item">
                  <span className="note-icon">⚠️</span>
                  <span>{note}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Example */}
          <section className="help-section">
            <h3>💡 Example</h3>
            <div className="example-container">
              <div className="example-step">
                <h4>Step 1: Matrix Setup</h4>
                <p>Generate a 3×3 invertible matrix modulo 97</p>
                <div className="example-matrix">
                  [15  8  23]<br/>
                  [42  1  67]<br/>
                  [91  34  5]
                </div>
              </div>
              <div className="example-step">
                <h4>Step 2: Text Processing</h4>
                <p>"Hi!" → [40, 73, 1] (H=40, i=73, !=1)</p>
              </div>
              <div className="example-step">
                <h4>Step 3: Encryption</h4>
                <p>Matrix × [40, 73, 1] mod 97 → [encrypted vector]</p>
              </div>
              <div className="example-step">
                <h4>Step 4: Result</h4>
                <p>Encrypted vector → "xZ&" (example output)</p>
              </div>
            </div>
          </section>
        </div>

        <div className="help-footer">
          <button className="help-close-button" onClick={onClose}>
            Got it! ✨
          </button>
        </div>
      </div>
    </div>
  );
};

export default HelpModal;
