# Zeno AI - Frontend Client

This directory contains the React 19 + Vite frontend application for **Zeno AI**.

For full project documentation, setup guides, architecture, and API endpoints, please refer to the [Root README](../README.md).

## 🧰 Tech Stack
- **Framework**: React 19 + Vite
- **Styling**: Tailwind CSS v4
- **Routing**: React Router v7
- **Auth**: Firebase Authentication (Google OAuth & Email/Password)
- **HTTP Client**: Axios with credentials support
- **UI Components**: React Hot Toast, React Icons

## 🚀 Quick Start

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure environment variables (`.env`):
   ```env
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_SERVER_URL=http://localhost:8080
   VITE_CLIENT_URL=http://localhost:5173
   VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
   ```

3. Start development server:
   ```bash
   npm run dev
   ```

