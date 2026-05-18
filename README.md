# 💬 Nexavo — Real-Time Chat Application

<div align="center">

![Nexavo](https://img.shields.io/badge/Nexavo-Chat%20App-6366f1?style=for-the-badge&logo=chatbot&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

**A modern real-time chat application with OAuth2 authentication and room-based messaging.**

🌐 **Live Demo → [nexavo-chat.vercel.app](https://nexavo-chat.vercel.app)**

</div>

---

## ✨ Features

- 🔐 **OAuth2 Authentication** — Sign in with Google or Facebook
- 💬 **Real-Time Messaging** — Instant messaging powered by WebSockets (STOMP)
- 🏠 **Chat Rooms** — Create or join rooms to chat with others
- 👤 **User Profiles** — Auto-synced name and profile photo from OAuth provider
- 📱 **Responsive Design** — Works seamlessly on desktop and mobile
- 🔒 **JWT Security** — Stateless, secure token-based sessions

---

## 🛠 Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React + Vite | UI framework |
| Tailwind CSS | Styling |
| React Router | Client-side routing |
| SockJS + STOMP | WebSocket client |
| Vercel | Deployment |

### Backend
| Technology | Purpose |
|---|---|
| Spring Boot | REST API + WebSocket server |
| Spring Security | OAuth2 + JWT authentication |
| Spring WebSocket | Real-time messaging (STOMP broker) |
| MongoDB | Database |
| Render | Deployment |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Java 17+
- MongoDB Atlas account
- Google & Facebook OAuth2 credentials

---

### 1. Clone the repository

```bash
git clone https://github.com/your-username/nexavo.git
cd nexavo
```

---

### 2. Backend Setup

```bash
cd backend
```

Create `src/main/resources/application.properties`:

```properties
# Server
server.port=8080

# MongoDB
spring.data.mongodb.uri=your_mongodb_connection_string

# JWT
jwt.secret=your_jwt_secret

# OAuth2 - Google
spring.security.oauth2.client.registration.google.client-id=your_google_client_id
spring.security.oauth2.client.registration.google.client-secret=your_google_client_secret

# OAuth2 - Facebook
spring.security.oauth2.client.registration.facebook.client-id=your_facebook_client_id
spring.security.oauth2.client.registration.facebook.client-secret=your_facebook_client_secret

# Frontend URL
app.frontend.base-url=http://localhost:5173
```

Run the backend:

```bash
./mvnw spring-boot:run
```

---

### 3. Frontend Setup

```bash
cd frontend
npm install
```

Create `.env`:

```env
VITE_BACKEND_URL=http://localhost:8080
```

Run the frontend:

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📁 Project Structure

```
nexavo/
├── frontend/                  # React + Vite app
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   ├── pages/             # Route pages (Login, Join, Chat)
│   │   ├── context/           # React context (auth, chat state)
│   │   ├── services/          # API & WebSocket services
│   │   └── config/            # Axios base config
│   └── vercel.json
│
└── backend/                   # Spring Boot app
    └── src/main/java/
        ├── controller/        # REST controllers
        ├── security/          # JWT, OAuth2 handlers, SecurityConfig
        ├── services/          # Business logic
        ├── entities/          # MongoDB documents
        └── repositories/      # Spring Data repositories
```

---

## 🔑 OAuth2 Setup

### Google
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project → Enable **Google+ API**
3. Create OAuth 2.0 credentials
4. Add authorized redirect URI: `https://your-backend.onrender.com/login/oauth2/code/google`

### Facebook
1. Go to [Meta for Developers](https://developers.facebook.com)
2. Create a new app → Add **Facebook Login** product
3. Add valid OAuth redirect URI: `https://your-backend.onrender.com/login/oauth2/code/facebook`

---

## 🌍 Deployment

### Frontend → Vercel
1. Import your repo on [vercel.com](https://vercel.com)
2. Set environment variable: `VITE_BACKEND_URL=https://your-backend.onrender.com`
3. Deploy

### Backend → Render
1. Create a new **Web Service** on [render.com](https://render.com)
2. Set all environment variables from `application.properties`
3. Deploy

---

<div align="center">
  Made by <a href="https://github.com/dhruvil931">Dhruvil Kapadiya</a>
  <br/><br/>
  <a href="https://nexavo-chat.vercel.app">🌐 Live Demo</a>
</div>
