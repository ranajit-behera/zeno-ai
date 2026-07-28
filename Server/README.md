# Zeno AI - Backend Server

This directory contains the Node.js + Express backend API for **Zeno AI**.

For complete system documentation, architecture overview, and full configuration instructions, see the main [Root README](../README.md).

## 🧰 Tech Stack
- **Runtime**: Node.js
- **Framework**: Express.js (v5)
- **Database**: MongoDB with Mongoose ORM
- **AI Integration**: Google Gen AI SDK (`@google/genai`)
- **Payments**: Razorpay Node SDK
- **Security & Session**: JWT (`jsonwebtoken`), Cookie Parser, CORS, Dotenv

## 🚀 Quick Start

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure environment variables (`.env`):
   ```env
   PORT=8080
   MONGODB_URL=mongodb+srv://<username>:<password>@cluster.mongodb.net/zeno-ai
   JWT_SECRET=your_jwt_secret
   CLIENT_URL=http://localhost:5173
   RAZORPAY_KEY_ID=your_razorpay_key_id
   RAZORPAY_KEY_SECRET=your_razorpay_key_secret
   ```

3. Start development server with nodemon:
   ```bash
   npm run dev
   ```
