# 🔐 Hill Cipher NxN - Secure Text Encryption System

A beautiful, modern web application for encrypting and decrypting text using the Hill Cipher algorithm with customizable matrix sizes (2x2 to 7x7). Features a stunning black-purple theme with interactive matrix visualization and real-time processing.

![Hill Cipher Demo](https://img.shields.io/badge/Status-Ready-brightgreen) ![React](https://img.shields.io/badge/Frontend-React-blue) ![Flask](https://img.shields.io/badge/Backend-Flask-red) ![Python](https://img.shields.io/badge/Math-SymPy-orange)

## ✨ Features

### 🎯 Core Functionality
- **Multiple Matrix Sizes**: Support for 2x2 to 7x7 encryption matrices
- **Dual Input Methods**: Direct text input or file upload (.txt files)
- **Real-time Processing**: Live encryption/decryption with visual feedback
- **Matrix Visualization**: Interactive display of key and inverse matrices
- **File Processing**: Upload, process, and download encrypted/decrypted files
- **Character Set**: Full ASCII printable characters (32-126) + special padding characters

### 🎨 User Experience
- **Beautiful UI**: Modern black-purple gradient theme with glass morphism effects
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Interactive Elements**: Hover effects, animations, and smooth transitions
- **Real-time Feedback**: Live character counting, block information, and processing status
- **Comprehensive Help**: Built-in help system with technical details and examples

### 🔧 Technical Features
- **Modulo 97 Arithmetic**: Ensures perfect encryption/decryption symmetry
- **Automatic Padding**: Smart text padding using reserved characters
- **Matrix Validation**: Automatic generation of invertible matrices
- **Error Handling**: Comprehensive error management and user feedback
- **Cross-platform**: Works on Windows, macOS, and Linux

## 🚀 Quick Start

### Option 1: Easy Setup (Windows)
1. **Start Backend**: Double-click `start-backend.bat`
2. **Start Frontend**: Double-click `start-frontend.bat`
3. **Open Browser**: Navigate to `http://localhost:3000`

### Option 2: Manual Setup

#### Prerequisites
- **Python 3.7+** with pip
- **Node.js 14+** with npm
- **Git** (optional)

#### Backend Setup (Flask + Python)
```bash
# Navigate to project directory
cd secure-hill-chipper-nxn

# Install Python dependencies
cd backend
pip install -r requirements.txt

# Start Flask server
python app.py
```
Backend will be available at: `http://localhost:5000`

#### Frontend Setup (React)
```bash
# Navigate to project root
cd secure-hill-chipper-nxn

# Install React dependencies
npm install

# Start React development server
npm start
```
Frontend will be available at: `http://localhost:3000`

## 📖 How to Use

### 1. **Matrix Configuration**
- Select your desired matrix size (2x2 to 7x7)
- Click "Regenerate Key" to create a new encryption matrix
- View the key matrix and its inverse for decryption

### 2. **Text Processing Mode**
- Choose "Direct Text Input"
- Select "Encrypt" or "Decrypt" operation
- Type or paste your text
- View real-time results with statistics

### 3. **File Processing Mode**
- Choose "File Upload (.txt)"
- Drag & drop or click to upload a .txt file
- Select encryption or decryption
- Process and download the result

### 4. **Advanced Features**
- Click the "Help" button for comprehensive documentation
- Use example text/files to test the system
- View live processing steps and matrix operations

## 🧮 Technical Details

### Hill Cipher Algorithm
The Hill cipher uses linear algebra for encryption:
- **Encryption**: `C = K × P (mod 97)`
- **Decryption**: `P = K⁻¹ × C (mod 97)`

Where:
- `K` = Key matrix (n×n)
- `K⁻¹` = Inverse key matrix
- `P` = Plaintext vector
- `C` = Ciphertext vector

### Character Mapping
- **ASCII 32-126**: Space through ~ (95 characters)
- **Special Characters**: § (padding) and ¤ (reserved)
- **Total**: 97 characters for modulo 97 arithmetic

### Security Features
- **Automatic Key Generation**: Ensures matrices are invertible mod 97
- **Block Processing**: Text processed in n-character blocks
- **Secure Padding**: Uses reserved characters for block completion

## 📁 Project Structure

```
secure-hill-chipper-nxn/
├── 📁 backend/                 # Flask backend
│   ├── app.py                 # Main Flask application
│   └── requirements.txt       # Python dependencies
├── 📁 src/                    # React frontend
│   ├── 📁 components/         # React components
│   │   ├── HillCipherApp.js   # Main app component
│   │   ├── MatrixVisualization.js
│   │   ├── TextProcessor.js
│   │   ├── FileProcessor.js
│   │   ├── HelpModal.js
│   │   └── *.css             # Component stylesheets
│   ├── App.js                # App entry point
│   └── App.css               # Global styles
├── 📁 public/                # Static files
├── start-backend.bat         # Windows backend launcher
├── start-frontend.bat        # Windows frontend launcher
├── package.json              # Node.js dependencies
└── README.md                 # This file
```

## 🎨 Design Features

### Visual Elements
- **Color Scheme**: Black (#0a0a0a) to purple (#8b5cf6) gradients
- **Typography**: Modern sans-serif with monospace for code/matrices
- **Effects**: Glass morphism, neon borders, smooth animations
- **Icons**: Emoji-based icons for intuitive navigation

### Interactive Components
- **Matrix Display**: Animated cells with hover effects
- **File Upload**: Drag & drop with visual feedback
- **Real-time Updates**: Live character counting and processing
- **Responsive Buttons**: Gradient backgrounds with state animations

## 🔧 API Endpoints

The Flask backend provides these REST API endpoints:

- `POST /api/generate-key` - Generate new encryption matrix
- `POST /api/encrypt` - Encrypt text
- `POST /api/decrypt` - Decrypt text  
- `POST /api/process-file` - Process uploaded files
- `GET /api/help` - Get help information

## 🐛 Troubleshooting

### Common Issues

**Backend won't start:**
- Ensure Python 3.7+ is installed
- Install requirements: `pip install -r backend/requirements.txt`
- Check if port 5000 is available

**Frontend won't start:**
- Ensure Node.js 14+ is installed  
- Install dependencies: `npm install`
- Check if port 3000 is available

**CORS Errors:**
- Ensure backend is running on port 5000
- Check Flask-CORS is installed

**Matrix Generation Fails:**
- Restart backend server
- Try different matrix sizes
- Check SymPy installation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **SymPy** for matrix mathematics
- **React** for the beautiful frontend framework
- **Flask** for the lightweight backend
- **Create React App** for project bootstrapping

## 📞 Support

If you encounter any issues or have questions:
1. Check the built-in Help system (📘 Help button)
2. Review this README
3. Open an issue on GitHub

---

**Made with ❤️ for secure communications**

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
