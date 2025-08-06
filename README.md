# Mini-LinkedIn

Mini-LinkedIn is a full-stack MERN (MongoDB, Express.js, React, Node.js) application that simulates a simplified version of LinkedIn. 
It supports user authentication, posting, liking, deleting posts, and profile management.

## 🌐 Live Demo

(https://mini-linkedin-2.onrender.com/)

## 📁 Project Structure

Mini-LinkedIn/
├── api/ # Express backend
│ ├── controllers/ # Route controllers
│ ├── models/ # Mongoose models
│ ├── routes/ # API routes
│ └── index.js # Main server file
├── client/ # React frontend
│ ├── public/
│ ├── src/
│ └── vite.config.js
├── .env
├── package.json # Root package.json


## 🚀 Features

- 🔐 JWT-based authentication (signup, signin, signout)
- 📬 Email verification and password reset via OTP
- 👤 User profile update and delete
- 📝 Create, like, delete posts
- 🧾 Fetch all posts or user-specific posts
- 🌐 Responsive frontend with Vite + Tailwind CSS

## ⚙️ Technologies Used

### Frontend

- React
- Vite
- Tailwind CSS
- Redux
- Lexical Editor

### Backend

- Node.js
- Express
- MongoDB with Mongoose
- JSON Web Tokens (JWT)
- Nodemailer (for email verification and reset)
- dotenv, cookie-parser, CORS

---

## 🛠️ Getting Started (Local Development)

### 1. Clone the repository

git clone https://github.com/likhith1072/Mini-LinkedIn.git
cd Mini-LinkedIn

### 2. Install dependencies
   
npm install
npm install --prefix client

### 3. Create a .env file inside client 
Add FireBase ApiKey

### 4. Create a .env file inside in root directory Mini-LinkedIn
Add MONGO(mongodb api url key) ,JWT_SECRET,NODE_ENV='development',SMTP_USER,SMTP_PASS,SENDER_EMAIL 

4. Run locally
Start the backend:
npm run dev

Start the frontend:
cd client
npm run dev

📦 Deployment (Render)

-Build Command
npm install && npm install --prefix client && npm run build --prefix client

-Start Command
npm start
