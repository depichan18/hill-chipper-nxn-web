# Hill Cipher NxN Backend Deployment Guide

## 🚀 Deploy Flask Backend

Your React frontend is now deployed to GitHub Pages, but you need to deploy the Flask backend separately. Here are some options:

### Option 1: Railway (Recommended)
1. Go to [railway.app](https://railway.app)
2. Connect your GitHub repository
3. Select the `backend` folder
4. Add environment variables if needed
5. Deploy

### Option 2: Render
1. Go to [render.com](https://render.com)
2. Create a new Web Service
3. Connect your GitHub repository
4. Set build command: `pip install -r requirements.txt`
5. Set start command: `python app.py`
6. Deploy

### Option 3: Heroku
1. Install Heroku CLI
2. Create `Procfile` in backend folder:
   ```
   web: python app.py
   ```
3. Deploy with Heroku

### Option 4: PythonAnywhere
1. Upload your backend files
2. Create a web app
3. Configure WSGI file

## Update Frontend URL
After deploying backend, update `.env` file:
```
REACT_APP_BACKEND_URL=https://your-backend-url.com
```

Then redeploy frontend:
```bash
npm run deploy
```
