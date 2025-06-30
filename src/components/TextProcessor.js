import React, { useState, useEffect, useCallback } from 'react';
import './TextProcessor.css';

const TextProcessor = ({ keyMatrix, matrixSize }) => {
  const [inputText, setInputText] = useState('');
  const [encryptedText, setEncryptedText] = useState('');
  const [decryptedText, setDecryptedText] = useState('');
  const [operation, setOperation] = useState('encrypt');
  const [processing, setProcessing] = useState(false);
  const [textStats, setTextStats] = useState(null);

  const processText = useCallback(async () => {
    if (!inputText.trim() || keyMatrix.length === 0) return;

    setProcessing(true);
    try {
      let endpoint, requestBody;

      if (operation === 'encrypt') {
        endpoint = `${process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000'}/api/encrypt`;
        requestBody = {
          text: inputText,
          key_matrix: keyMatrix
        };
      } else {
        endpoint = `${process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000'}/api/decrypt`;
        requestBody = {
          cipher_text: inputText,
          key_matrix: keyMatrix
        };
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();
      
      if (response.ok) {
        if (operation === 'encrypt') {
          setEncryptedText(data.encrypted_text);
          setTextStats({
            originalLength: data.text_length,
            processedLength: data.encrypted_length,
            cleanedText: data.cleaned_text
          });
        } else {
          setDecryptedText(data.decrypted_text);
          setTextStats({
            originalLength: data.cipher_length,
            processedLength: data.decrypted_length
          });
        }
      } else {
        // Enhanced error handling for matrix size mismatches
        let errorMessage = data.error || 'Processing failed';
        if (errorMessage.includes('not compatible with matrix size') || 
            errorMessage.includes('Block size mismatch') ||
            errorMessage.includes('Matrix size mismatch')) {
          errorMessage = `❌ Matrix Size Mismatch!\n\n${errorMessage}\n\n💡 Tip: Make sure you're using the same matrix size for decryption as was used for encryption.`;
        }
        alert(errorMessage);
      }
    } catch (err) {
      alert('Backend connection failed. Please ensure Flask server is running.');
    }
    setProcessing(false);
  }, [inputText, operation, keyMatrix]);

  // Reset input text when operation changes
  useEffect(() => {
    setInputText('');
    setEncryptedText('');
    setDecryptedText('');
    setTextStats(null);
  }, [operation]);

  // Auto-process when input changes (with debounce)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (inputText.trim()) {
        processText();
      } else {
        setEncryptedText('');
        setDecryptedText('');
        setTextStats(null);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [inputText, operation, keyMatrix, processText]);

  const copyToClipboard = (text, event) => {
    navigator.clipboard.writeText(text);
    // Add visual feedback
    const button = event.target;
    const originalText = button.textContent;
    button.textContent = '✅ Copied!';
    setTimeout(() => {
      button.textContent = originalText;
    }, 2000);
  };

  const handleExampleText = () => {
    setInputText('Hello World! This is a sample text for Hill Cipher encryption. 🔐');
  };

  const resultText = operation === 'encrypt' ? encryptedText : decryptedText;

  return (
    <div className="text-processor">
      <div className="processor-header">
        <h2>✍️ Direct Text Processing</h2>
        <p>Enter your text and see real-time encryption/decryption</p>
      </div>

      {/* Operation Toggle */}
      <div className="operation-toggle">
        <button
          className={`toggle-button ${operation === 'encrypt' ? 'active' : ''}`}
          onClick={() => setOperation('encrypt')}
        >
          🔒 Encrypt
        </button>
        <button
          className={`toggle-button ${operation === 'decrypt' ? 'active' : ''}`}
          onClick={() => setOperation('decrypt')}
        >
          🔓 Decrypt
        </button>
      </div>

      {/* Input Section */}
      <div className="input-section">
        <div className="input-header">
          <label htmlFor="text-input">
            {operation === 'encrypt' ? '📝 Enter text to encrypt:' : '🔐 Enter cipher text to decrypt:'}
          </label>
          <button className="example-button" onClick={handleExampleText}>
            ✨ Use Example
          </button>
        </div>
        
        <textarea
          id="text-input"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={
            operation === 'encrypt' 
              ? 'Type your message here...\nSupported: ASCII printable characters + § ¤'
              : 'Paste encrypted text here...'
          }
          className="text-input"
          rows={6}
        />
        
        <div className="input-info">
          <span className="char-count">
            {inputText.length} characters
          </span>
          {inputText.length > 0 && matrixSize > 0 && (
            <span className="block-info">
              → {Math.ceil(inputText.length / matrixSize)} blocks of {matrixSize}
            </span>
          )}
        </div>
      </div>

      {/* Processing Indicator */}
      {processing && (
        <div className="processing-indicator">
          <div className="processing-spinner"></div>
          <span>Processing text...</span>
        </div>
      )}

      {/* Results Section */}
      {resultText && (
        <div className="results-section">
          <div className="result-header">
            <h3>
              {operation === 'encrypt' ? '🔒 Encrypted Result:' : '🔓 Decrypted Result:'}
            </h3>
            <button
              className="copy-button"
              onClick={(e) => copyToClipboard(resultText, e)}
            >
              📋 Copy Result
            </button>
          </div>
          
          <div className="result-display">
            <textarea
              value={resultText}
              readOnly
              className="result-text"
              rows={6}
            />
          </div>

          {/* Text Statistics */}
          {textStats && (
            <div className="text-stats">
              <div className="stat-item">
                <span className="stat-label">Original Length:</span>
                <span className="stat-value">{textStats.originalLength}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">
                  {operation === 'encrypt' ? 'Encrypted' : 'Decrypted'} Length:
                </span>
                <span className="stat-value">{textStats.processedLength}</span>
              </div>
              {textStats.cleanedText && (
                <div className="stat-item">
                  <span className="stat-label">Characters Removed:</span>
                  <span className="stat-value">
                    {inputText.length - textStats.cleanedText.length}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Live Preview */}
      {inputText && !processing && (
        <div className="live-preview">
          <h4>🔬 Live Preview:</h4>
          <div className="preview-steps">
            <div className="preview-step">
              <span className="step-number">1</span>
              <span className="step-text">
                Text → Numbers: "{inputText.substring(0, 20)}{inputText.length > 20 ? '...' : ''}"
              </span>
            </div>
            <div className="preview-step">
              <span className="step-number">2</span>
              <span className="step-text">
                Group into {matrixSize}×1 vectors
              </span>
            </div>
            <div className="preview-step">
              <span className="step-number">3</span>
              <span className="step-text">
                Apply {operation === 'encrypt' ? 'Key' : 'Inverse'} Matrix transformation
              </span>
            </div>
            <div className="preview-step">
              <span className="step-number">4</span>
              <span className="step-text">
                Numbers → Text: "{resultText.substring(0, 20)}{resultText.length > 20 ? '...' : ''}"
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Matrix Compatibility Warning for Decryption */}
      {operation === 'decrypt' && inputText.length > 0 && matrixSize > 0 && inputText.length % matrixSize !== 0 && (
        <div className="compatibility-warning">
          ⚠️ <strong>Matrix Size Warning:</strong> 
          <br />
          Cipher text length ({inputText.length}) is not compatible with current matrix size ({matrixSize}×{matrixSize}).
          <br />
          <small>This cipher may have been encrypted with a different matrix size. Expected length should be divisible by {matrixSize}.</small>
        </div>
      )}
    </div>
  );
};

export default TextProcessor;
