# Zeno AI - AI Assistant Builder & Embeddable Widget Platform

Zeno AI is a full-stack SaaS platform designed to let users easily create, customize, test, and embed custom AI-powered chat assistants onto any website. Powered by **Google Gemini API**, **React 19**, **Node.js**, **Express**, and **MongoDB**, Zeno AI offers a smooth builder interface, live preview widget, user authentication, and subscription billing via Razorpay.

---

## 🚀 Features

- 🤖 **Custom AI Assistant Builder**: Configure assistant name, custom system prompts, persona roles, colors, widget position, and greeting messages.
- 🔑 **Gemini API Integration**: Seamless integration with Google Gemini models to deliver fast and intelligent responses.
- 👁️ **Live Widget Preview**: Test assistant behavior and design changes in real time inside the dashboard before deployment.
- 📦 **Embeddable JavaScript Widget**: One-line script tag generation for embedding your assistant into any website or CMS.
- 🔒 **Authentication & Authorization**: Firebase Auth (Google & Email/Password) integrated with JWT cookie-based session management.
- 💳 **Billing & Subscription System**: Tiered pricing (Free & Pro plans) integrated with **Razorpay** payment gateway for seamless upgrades.
- 📊 **Usage Tracking**: Request limits for free tier users and automatic plan management.

---

## 🛠️ Tech Stack

### **Frontend (`/Client`)**
- **Framework**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Routing**: [React Router v7](https://reactrouter.com/)
- **Auth**: [Firebase Authentication](https://firebase.google.com/)
- **HTTP Client**: [Axios](https://axios-http.com/)
- **UI Feedback**: [React Hot Toast](https://react-hot-toast.com/) & [React Icons](https://react-icons.github.io/react-icons/)

### **Backend (`/Server`)**
- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express v5](https://expressjs.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) with [Mongoose ORM](https://mongoosejs.com/)
- **AI Engine**: [Google Gen AI SDK (@google/genai)](https://www.npmjs.com/package/@google/genai)
- **Payment Gateway**: [Razorpay API](https://razorpay.com/)
- **Security**: JSON Web Tokens (`jsonwebtoken`), Cookie Parser, CORS, Dotenv

---

## 📁 Repository Structure

```
Clone/
├── Client/                      # React 19 Frontend App
│   ├── public/                  # Public assets
│   ├── src/
│   │   ├── assets/              # Static media & images
│   │   ├── components/          # Reusable components (Navbar, AssistantPreview, ProtectedRoute)
│   │   ├── pages/               # Application pages (Home, Builder, Billing, Login)
│   │   ├── config.js            # Frontend configuration settings
│   │   ├── App.jsx              # Main App component & route definitions
│   │   └── main.jsx             # React entrypoint
│   ├── .env.example             # Frontend environment variables template
│   ├── package.json             # Frontend dependencies and scripts
│   └── vite.config.js           # Vite configuration
│
└── Server/                      # Express 5 Backend API
    ├── Configs/                 # DB Connection & Gemini AI initialization
    ├── Controllers/             # Business logic (Auth, User, Assistant, Billing)
    ├── Middleware/              # Express authentication middleware
    ├── Models/                  # Mongoose schemas (User model, etc.)
    ├── Routes/                  # Express API routes
    ├── .env.example             # Backend environment variables template
    ├── index.js                 # Server entrypoint file
    └── package.json             # Backend dependencies and scripts
```

---

## ⚙️ Getting Started

### Prerequisites

Ensure you have the following installed/configured:
- [Node.js](https://nodejs.org/) (v18+ recommended)
- [MongoDB](https://www.mongodb.com/) (Local instance or MongoDB Atlas cluster)
- [Firebase Project](https://console.firebase.google.com/) (Web app credentials)
- [Google Gemini API Key](https://aistudio.google.com/)
- [Razorpay Account](https://dashboard.razorpay.com/) (For payment testing in test mode)

---

### 📥 Installation & Setup

#### 1. Clone the Repository
```bash
git clone https://github.com/ranajit-behera/zeno-ai.git
cd zeno-ai
```

#### 2. Backend Setup (`/Server`)

1. Navigate to the `Server` directory:
   ```bash
   cd Server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```
4. Fill in your server configuration details in `.env`:
   ```env
   PORT=8080
   MONGODB_URL=mongodb+srv://<username>:<password>@cluster.mongodb.net/zeno-ai
   JWT_SECRET=your_jwt_secret_key
   CLIENT_URL=http://localhost:5173
   RAZORPAY_KEY_ID=your_razorpay_key_id
   RAZORPAY_KEY_SECRET=your_razorpay_key_secret
   ```
5. Start the backend development server:
   ```bash
   npm run dev
   ```
   The backend will run on `http://localhost:8080`.

---

#### 3. Frontend Setup (`/Client`)

1. Open a new terminal and navigate to the `Client` directory:
   ```bash
   cd Client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```
4. Fill in your client configuration details in `.env`:
   ```env
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_SERVER_URL=http://localhost:8080
   VITE_CLIENT_URL=http://localhost:5173
   VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
   ```
5. Start the frontend development server:
   ```bash
   npm run dev
   ```
   The frontend app will run on `http://localhost:5173`.

---

## 🔑 Environment Variables Reference

### Backend (`/Server/.env`)

| Variable | Description |
| :--- | :--- |
| `PORT` | Port number for Express server (Default: `8080`) |
| `MONGODB_URL` | MongoDB connection string |
| `JWT_SECRET` | Secret key for signing JSON Web Tokens |
| `CLIENT_URL` | Frontend client origin URL for CORS policy |
| `RAZORPAY_KEY_ID` | Key ID from Razorpay Dashboard |
| `RAZORPAY_KEY_SECRET` | Key Secret from Razorpay Dashboard |

### Frontend (`/Client/.env`)

| Variable | Description |
| :--- | :--- |
| `VITE_FIREBASE_API_KEY` | Public Firebase API key for web auth |
| `VITE_SERVER_URL` | Backend server base URL |
| `VITE_CLIENT_URL` | Frontend app URL |
| `VITE_RAZORPAY_KEY_ID` | Razorpay Key ID for client checkout SDK |

---

## 🔌 API Endpoints Summary

| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/google` | Authenticate user via Firebase Google OAuth | Public |
| `GET` | `/api/user/current-user` | Fetch currently logged in user profile | Private (Cookie Auth) |
| `PUT` | `/api/user/update-config` | Update assistant config (name, instructions, style) | Private |
| `POST` | `/api/assistant/ask` | Send query to AI assistant widget | Public / Embedded |
| `GET` | `/api/assistant/config/:userId` | Get assistant configuration for embed widget | Public |
| `POST` | `/api/billing/create-order` | Create Razorpay subscription order | Private |
| `POST` | `/api/billing/verify-payment` | Verify Razorpay payment signature & update plan | Private |

---

## 📜 License

This project is open-source and available under the [ISC License](LICENSE).
