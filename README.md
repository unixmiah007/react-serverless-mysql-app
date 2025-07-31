# React + Serverless Node.js + MySQL App

## Prerequisites
- WSL with Ubuntu installed
- Node.js (v18+ recommended)
- MySQL Server
- npm / yarn

## Setup Instructions

### 1. Clone or unzip this project
```bash
unzip react-serverless-mysql-app.zip
cd react-serverless-mysql-app
```

### 2. Set up MySQL database
```sql
CREATE DATABASE react_app_db;
USE react_app_db;
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  firstname VARCHAR(255),
  lastname VARCHAR(255),
  email VARCHAR(255),
  username VARCHAR(255)
);
```

### 3. Configure environment variables
Edit `backend/.env` file:
```
DB_HOST=localhost
DB_USER=your_mysql_user
DB_PASSWORD=your_mysql_password
DB_NAME=react_app_db
```

### 4. Start the backend (Express serverless-style)
```bash
cd backend
npm install
node index.js
```

### 5. Start the frontend
```bash
cd ../frontend
npm install
npm start
```

### 6. Open in browser
Visit [http://localhost:3000](http://localhost:3000)

## Notes
- This is a local simulation of a serverless app. You can later deploy backend functions to Vercel/Netlify if desired.
