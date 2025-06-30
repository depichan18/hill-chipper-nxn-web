import React, { useState, useRef, useEffect } from 'react';
import './FileProcessor.css';

const FileProcessor = ({ keyMatrix, matrixSize }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileContent, setFileContent] = useState('');
  const [processedContent, setProcessedContent] = useState('');
  const [operation, setOperation] = useState('encrypt');
  const [processing, setProcessing] = useState(false);
  const [fileStats, setFileStats] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileUpload = (file) => {
    if (!file) return;

    if (file.type !== 'text/plain' && !file.name.endsWith('.txt')) {
      alert('Please select a .txt file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target.result;
      setSelectedFile(file);
      setFileContent(content);
      setProcessedContent('');
      setFileStats(null);
    };
    reader.readAsText(file);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const processFile = async () => {
    if (!fileContent || keyMatrix.length === 0) return;

    setProcessing(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000'}/api/process-file`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          file_content: fileContent,
          operation: operation,
          key_matrix: keyMatrix,
          filename: selectedFile?.name || 'file.txt'
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setProcessedContent(data.processed_content);
        setFileStats({
          originalLength: data.original_length,
          processedLength: data.processed_length,
          originalFilename: data.original_filename,
          resultFilename: data.result_filename,
          operation: data.operation
        });
      } else {
        alert('Error: ' + (data.error || 'Processing failed'));
      }
    } catch (err) {
      alert('Backend connection failed. Please ensure Flask server is running.');
    }
    setProcessing(false);
  };

  const downloadFile = (content, filename) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleExampleFile = () => {
    const exampleContent = `Welcome to Hill Cipher NxN Encryption System!

This is a sample text file for demonstration purposes.
The Hill cipher is a polygraphic substitution cipher based on linear algebra.

Key Features:
- Uses matrix multiplication for encryption
- Works with blocks of characters
- Modulo arithmetic ensures reversibility
- Supports various matrix sizes (2x2 to 7x7)

Sample text with special characters:
"Hello, World!" - Testing punctuation & symbols.
Numbers: 12345 67890
Mixed case: AbCdEfGhIjKlMnOpQrStUvWxYz

§ Padding character example ¤

This text will be processed using your selected matrix configuration.
Enjoy experimenting with the Hill cipher!`;

    setSelectedFile({ name: 'example.txt' });
    setFileContent(exampleContent);
    setProcessedContent('');
    setFileStats(null);
  };

  // Reset file content when operation changes
  useEffect(() => {
    setSelectedFile(null);
    setFileContent('');
    setProcessedContent('');
    setFileStats(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [operation]);

  return (
    <div className="file-processor">
      <div className="processor-header">
        <h2>📄 File Processing</h2>
        <p>Upload .txt files for batch encryption/decryption</p>
      </div>

      {/* Operation Toggle */}
      <div className="operation-toggle">
        <button
          className={`toggle-button ${operation === 'encrypt' ? 'active' : ''}`}
          onClick={() => setOperation('encrypt')}
        >
          🔒 Encrypt File
        </button>
        <button
          className={`toggle-button ${operation === 'decrypt' ? 'active' : ''}`}
          onClick={() => setOperation('decrypt')}
        >
          🔓 Decrypt File
        </button>
      </div>

      {/* File Upload Section */}
      <div className="upload-section">
        <div 
          className={`file-drop-zone ${dragActive ? 'drag-active' : ''} ${selectedFile ? 'has-file' : ''}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".txt"
            onChange={(e) => handleFileUpload(e.target.files[0])}
            style={{ display: 'none' }}
          />
          
          {selectedFile ? (
            <div className="file-selected">
              <div className="file-icon">📄</div>
              <div className="file-info">
                <div className="file-name">{selectedFile.name}</div>
                <div className="file-size">
                  {fileContent.length} characters
                </div>
              </div>
              <button 
                className="change-file-button"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedFile(null);
                  setFileContent('');
                  setProcessedContent('');
                  setFileStats(null);
                }}
              >
                Change File
              </button>
            </div>
          ) : (
            <div className="file-upload-prompt">
              <div className="upload-icon">📤</div>
              <div className="upload-text">
                <strong>Click to upload</strong> or drag and drop
              </div>
              <div className="upload-subtext">
                .txt files only
              </div>
            </div>
          )}
        </div>

        <div className="upload-actions">
          <button className="example-file-button" onClick={handleExampleFile}>
            ✨ Use Example File
          </button>
        </div>
      </div>

      {/* File Content Preview */}
      {fileContent && (
        <div className="file-preview-section">
          <h3>📋 File Content Preview:</h3>
          <div className="file-content-preview">
            <textarea
              value={fileContent}
              readOnly
              className="content-preview"
              rows={8}
            />
          </div>
          <div className="preview-info">
            <span>Showing content of: {selectedFile?.name}</span>
            <span>{fileContent.length} characters</span>
          </div>
        </div>
      )}

      {/* Process Button */}
      {fileContent && (
        <div className="process-section">
          <button
            className="process-button"
            onClick={processFile}
            disabled={processing || keyMatrix.length === 0}
          >
            {processing ? (
              <>
                <div className="button-spinner"></div>
                Processing...
              </>
            ) : (
              <>
                {operation === 'encrypt' ? '🔒 Encrypt File' : '🔓 Decrypt File'}
              </>
            )}
          </button>
        </div>
      )}

      {/* Results Section */}
      {processedContent && fileStats && (
        <div className="results-section">
          <div className="result-header">
            <h3>
              {operation === 'encrypt' ? '🔒 Encrypted File Content:' : '🔓 Decrypted File Content:'}
            </h3>
            <button
              className="download-button"
              onClick={() => downloadFile(processedContent, fileStats.resultFilename)}
            >
              💾 Download {operation === 'encrypt' ? 'Encrypted' : 'Decrypted'} File
            </button>
          </div>

          <div className="result-content">
            <textarea
              value={processedContent}
              readOnly
              className="result-text"
              rows={8}
            />
          </div>

          {/* File Statistics */}
          <div className="file-stats">
            <div className="stats-grid">
              <div className="stat-item">
                <span className="stat-label">Original File:</span>
                <span className="stat-value">{fileStats.originalFilename}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Result File:</span>
                <span className="stat-value">{fileStats.resultFilename}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Original Size:</span>
                <span className="stat-value">{fileStats.originalLength} chars</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Processed Size:</span>
                <span className="stat-value">{fileStats.processedLength} chars</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Operation:</span>
                <span className="stat-value">{fileStats.operation}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Matrix Size:</span>
                <span className="stat-value">{matrixSize}×{matrixSize}</span>
              </div>
            </div>
          </div>

          {/* Before/After Comparison */}
          <div className="comparison-section">
            <h4>📊 Before vs After Comparison:</h4>
            <div className="comparison-grid">
              <div className="comparison-item">
                <h5>Original Content (first 200 chars):</h5>
                <div className="comparison-text">
                  {fileContent.substring(0, 200)}
                  {fileContent.length > 200 && '...'}
                </div>
              </div>
              <div className="comparison-item">
                <h5>{operation === 'encrypt' ? 'Encrypted' : 'Decrypted'} Content (first 200 chars):</h5>
                <div className="comparison-text">
                  {processedContent.substring(0, 200)}
                  {processedContent.length > 200 && '...'}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileProcessor;
