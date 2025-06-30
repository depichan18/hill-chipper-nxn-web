from flask import Flask, request, jsonify
from flask_cors import CORS
import sympy as sp
import os
import tempfile
import json

app = Flask(__name__)
CORS(app)  # Enable CORS for React frontend

# CHARSET: printable ASCII (32–126) + 2 additional → total 97 characters
CHARSET = [chr(i) for i in range(32, 127)] + ['§', '¤']
CHARSET_SIZE = len(CHARSET)  # = 97
MODULUS = 97  # matches character count

# Character <-> Number mapping
char_to_num = {c: i for i, c in enumerate(CHARSET)}
num_to_char = {i: c for i, c in enumerate(CHARSET)}

def clean_text(text):
    # Replace common problematic characters
    text = text.replace('\n', ' ')  # Replace newlines with spaces
    text = text.replace('\r', ' ')  # Replace carriage returns with spaces
    text = text.replace('\t', ' ')  # Replace tabs with spaces
    
    # Remove characters not in CHARSET
    cleaned = ''.join(c for c in text if c in CHARSET)
    
    # If text becomes empty after cleaning, provide a default
    if not cleaned.strip():
        cleaned = 'Hello World!'  # Default text
    
    return cleaned

def pad_text(text, block_size):
    padding = (-len(text)) % block_size
    return text + '§' * padding  # padding character is guaranteed in CHARSET

def encrypt(text, key, modulus):
    try:
        size = key.shape[0]
        text = pad_text(clean_text(text), size)
        
        # Validate cleaned text is not empty
        if not text:
            raise ValueError("Text is empty after cleaning")
        
        nums = [char_to_num[c] for c in text]
        blocks = [nums[i:i+size] for i in range(0, len(nums), size)]

        cipher_nums = []
        for block in blocks:
            vec = sp.Matrix(block)
            res = key * vec % modulus
            cipher_nums.extend(res)

        return ''.join(num_to_char[int(n)] for n in cipher_nums)
        
    except Exception as e:
        raise ValueError(f"Encryption failed: {str(e)}")

def decrypt(cipher, key, modulus):
    try:
        size = key.shape[0]
        
        # Validate cipher text contains only valid characters
        invalid_chars = [c for c in cipher if c not in char_to_num]
        if invalid_chars:
            raise ValueError(f"Invalid characters in cipher text: {invalid_chars[:5]}")
        
        # Check if cipher length is compatible with matrix size
        if len(cipher) % size != 0:
            raise ValueError(f"Cipher text length ({len(cipher)}) is not compatible with matrix size {size}x{size}. "
                           f"The cipher text length must be divisible by {size}. "
                           f"This cipher may have been encrypted with a different matrix size.")
        
        nums = [char_to_num[c] for c in cipher]
        blocks = [nums[i:i+size] for i in range(0, len(nums), size)]

        inv_key = key.inv_mod(modulus)
        plain_nums = []
        for block in blocks:
            if len(block) != size:
                raise ValueError(f"Block size mismatch: expected {size}, got {len(block)}. "
                               f"This cipher may have been encrypted with a different matrix size.")
            vec = sp.Matrix(block)
            res = inv_key * vec % modulus
            plain_nums.extend(res)

        result = ''.join(num_to_char[int(n)] for n in plain_nums).rstrip('§')
        return result
        
    except Exception as e:
        raise ValueError(f"Decryption failed: {str(e)}")

def generate_valid_key(size, modulus):
    for _ in range(1000):
        candidate = sp.Matrix(sp.randMatrix(size, size, min=0, max=modulus - 1))
        try:
            _ = candidate.inv_mod(modulus)
            return candidate
        except:
            continue
    raise ValueError(f"Failed to find a {size}×{size} matrix that is invertible modulo {modulus}")

def matrix_to_list(matrix):
    """Convert SymPy matrix to list for JSON serialization"""
    return [[int(matrix[i, j]) for j in range(matrix.cols)] for i in range(matrix.rows)]

@app.route('/api/generate-key', methods=['POST'])
def generate_key():
    try:
        data = request.get_json()
        size = data.get('size', 3)
        
        if size < 2 or size > 7:
            return jsonify({'error': 'Matrix size must be between 2 and 7'}), 400
        
        key = generate_valid_key(size, MODULUS)
        key_inv = key.inv_mod(MODULUS)
        
        return jsonify({
            'key_matrix': matrix_to_list(key),
            'inverse_matrix': matrix_to_list(key_inv),
            'size': size
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/encrypt', methods=['POST'])
def encrypt_text():
    try:
        data = request.get_json()
        text = data.get('text', '')
        key_matrix = data.get('key_matrix', [])
        
        if not text:
            return jsonify({'error': 'Text is required'}), 400
        
        if not key_matrix:
            return jsonify({'error': 'Key matrix is required'}), 400
        
        # Convert list back to SymPy matrix
        key = sp.Matrix(key_matrix)
        
        # Clean and encrypt text
        cleaned_text = clean_text(text)
        encrypted_text = encrypt(cleaned_text, key, MODULUS)
        
        return jsonify({
            'original_text': text,
            'cleaned_text': cleaned_text,
            'encrypted_text': encrypted_text,
            'text_length': len(cleaned_text),
            'encrypted_length': len(encrypted_text)
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/decrypt', methods=['POST'])
def decrypt_text():
    try:
        data = request.get_json()
        cipher_text = data.get('cipher_text', '')
        key_matrix = data.get('key_matrix', [])
        
        if not cipher_text:
            return jsonify({'error': 'Cipher text is required'}), 400
        
        if not key_matrix:
            return jsonify({'error': 'Key matrix is required'}), 400
        
        # Convert list back to SymPy matrix
        key = sp.Matrix(key_matrix)
        
        # Decrypt text
        decrypted_text = decrypt(cipher_text, key, MODULUS)
        
        return jsonify({
            'cipher_text': cipher_text,
            'decrypted_text': decrypted_text,
            'cipher_length': len(cipher_text),
            'decrypted_length': len(decrypted_text)
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/process-file', methods=['POST'])
def process_file():
    try:
        data = request.get_json()
        file_content = data.get('file_content', '')
        operation = data.get('operation', 'encrypt')  # 'encrypt' or 'decrypt'
        key_matrix = data.get('key_matrix', [])
        filename = data.get('filename', 'file.txt')
        
        if not file_content:
            return jsonify({'error': 'File content is required'}), 400
        
        if not key_matrix:
            return jsonify({'error': 'Key matrix is required'}), 400
        
        # Convert list back to SymPy matrix
        key = sp.Matrix(key_matrix)
        
        if operation == 'encrypt':
            cleaned_content = clean_text(file_content)
            processed_content = encrypt(cleaned_content, key, MODULUS)
            result_filename = f"encrypted_{filename}"
        else:  # decrypt
            processed_content = decrypt(file_content, key, MODULUS)
            result_filename = f"decrypted_{filename}"
        
        return jsonify({
            'original_content': file_content,
            'processed_content': processed_content,
            'original_filename': filename,
            'result_filename': result_filename,
            'operation': operation,
            'original_length': len(file_content),
            'processed_length': len(processed_content)
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/help', methods=['GET'])
def get_help():
    help_content = {
        'title': 'Hill Cipher MOD 97 Program Help',
        'description': 'This program encrypts and decrypts text or .txt files using the Hill Cipher algorithm.',
        'charset_info': 'Supported characters are printable ASCII (space to ~) plus two extra: \'§\' and \'¤\'.',
        'modulus_info': 'Operations are performed using an nxn key matrix and modulo 97 arithmetic.',
        'features': [
            'Encrypt or decrypt text directly from input',
            'Encrypt or decrypt .txt files via upload',
            'Automatically generates an invertible key matrix modulo 97',
            'Displays the key matrix and its inverse',
            'Real-time preview of encryption/decryption results'
        ],
        'usage_steps': [
            'Select key matrix size from 2 to 7',
            'Choose between direct text input or file upload',
            'For file mode, upload your .txt file',
            'View the encrypted and decrypted results with matrix visualization',
            'Download the processed files if needed'
        ],
        'notes': [
            'Do not use characters outside ASCII 32–126 + [\'§\', \'¤\']',
            'Automatic padding uses \'§\' to complete matrix blocks',
            'Matrix size affects encryption strength and block size'
        ]
    }
    return jsonify(help_content)

if __name__ == '__main__':
    app.run(debug=True, port=5000)
