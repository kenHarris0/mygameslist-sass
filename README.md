# 🎮 MyGamesList

A full-stack social gaming platform where players can track their game libraries, connect with friends, create gaming parties, and chat in real time.

---

## 🚀 Live Demo

- **Frontend:** [https://mygameslist-sass.vercel.app](https://mygameslist-sass.vercel.app)

---

## ✨ Features

- 🔐 **Authentication** — Register/Login with JWT-based authentication and secure cookie sessions
- 📚 **Game Library** — Add games to your personal list with statuses: *Playing*, *Completed*, or *Away*
- 👤 **User Profiles** — Customizable profiles with bio, avatar (via Cloudinary), currently playing game, and playtime tracking
- 👥 **Friends System** — Send/receive friend requests and manage your friends list
- 💬 **Private Messaging** — Real-time one-on-one chat powered by Socket.IO
- 🎉 **Gaming Parties** — Create parties, invite friends, and chat together in a dedicated party room
- 🛡️ **Rate Limiting** — IP-based rate limiting to prevent API abuse
- 📧 **Email Support** — Nodemailer integration for transactional emails

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 19 | UI framework |
| Redux Toolkit | Global state management |
| React Router v7 | Client-side routing |
| Tailwind CSS v4 + DaisyUI | Styling |
| GSAP | Animations |
| Three.js + Vanta | 3D background effects |
| Socket.IO Client | Real-time communication |
| Axios | HTTP requests |
| Vite | Build tool & dev server |

### Backend
| Technology | Purpose |
|---|---|
| Node.js + Express 5 | REST API server |
| MongoDB + Mongoose | Database & ODM |
| Socket.IO | WebSocket server |
| JWT | Authentication tokens |
| bcrypt | Password hashing |
| Cloudinary | Image uploads & storage |
| Nodemailer | Email sending |
| express-rate-limit | Rate limiting |

---

## 📁 Project Structure

```
mygameslist/
├── backend/
│   ├── config/          # DB connection, socket, env config
│   ├── controllers/     # Route handler logic
│   ├── middlewares/     # Auth & other middleware
│   ├── models/          # Mongoose schemas (User, Game, Party, Message)
│   ├── routes/          # Express route definitions
│   └── server.js        # App entry point
│
└── frontend/
    ├── public/          # Static assets
    └── src/
        ├── components/  # Reusable UI components
        ├── Context/     # React context providers
        ├── pages/       # Page-level components
        ├── Redux/       # Store, slices, and actions
        └── App.jsx      # Root component with routing
```

---

## ⚙️ Getting Started

### Prerequisites

- Node.js v18+
- MongoDB Atlas account (or local MongoDB)
- Cloudinary account

---

### 1. Clone the repository

```bash
git clone https://github.com/kenHarris0/mygameslist-sass.git
cd mygameslist
```

---

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend/` directory:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
CLIENT_URL=http://localhost:5173

CLOUD_NAME=your_cloudinary_cloud_name
CLOUD_API_KEY=your_cloudinary_api_key
CLOUD_API_SECRET=your_cloudinary_api_secret
```

Start the backend server:

```bash
npm start
```

The server will run on `http://localhost:5000`.

---

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend dev server will run on `http://localhost:5173`.

---

## 🔌 API Endpoints

| Prefix | Resource |
|---|---|
| `/user` | Auth, profile, friends |
| `/game` | Game library management |
| `/msg` | Private messages |
| `/party` | Party creation & management |
| `/partymsg` | Party chat messages |
| `/health` | Server health check |

---

## 🗄️ Data Models

| Model | Key Fields |
|---|---|
| **User** | name, email, password, bio, image, friends, games list, party requests |
| **Game** | Game metadata |
| **Party** | Party info, members |
| **Message** | Sender, receiver, content, timestamps |
| **PartyMessage** | Party room messages |

---

## 🌐 Deployment

| Layer | Platform |
|---|---|
| Frontend | [Vercel](https://vercel.com) |
| Backend | AWS EC2 / any Node.js host |
| Database | MongoDB Atlas |
| Media | Cloudinary |

> **Note:** Remember to set all environment variables in your deployment environment and never commit your `.env` file.

---

## 📄 License

This project is licensed under the **ISC License**.

---

## 👤 Author

Made with ❤️ by **KenHarris**
