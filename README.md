# ☁️ CloudVault

> **A secure enterprise cloud storage platform for efficient file management, collaboration, and role-based access control.**

![Status](https://img.shields.io/badge/Status-In%20Development-orange?style=for-the-badge)
![Backend](https://img.shields.io/badge/Backend-Spring%20Boot-success?style=for-the-badge)
![Database](https://img.shields.io/badge/Database-MongoDB-green?style=for-the-badge)
![Frontend](https://img.shields.io/badge/Frontend-React-61DAFB?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)

---

## 📖 About

CloudVault is an enterprise-grade cloud storage platform that enables users to securely upload, organize, manage, and share files with role-based access control and scalable architecture.

---

## 🚀 Current Status

**Project Phase:** 🛠️ Initial Development

This project is currently under active development by a team of three developers following an enterprise GitHub workflow.

---

## 👥 Team Structure

- 👨‍💻 Backend Developer
- 🎨 Frontend Developer
- ⚙️ DevOps Engineer

---

## 🛠️ Tech Stack

### Backend
- Java 21
- Spring Boot
- Spring Security
- JWT Authentication
- MongoDB
- Redis
- MinIO

### Frontend
- React
- Vite
- Tailwind CSS
- Axios

### DevOps
- Docker
- Docker Compose
- GitHub Actions
- Nginx

---

## 📂 Project Structure

```text
CloudVault/
│
├── backend/
├── frontend/
├── devops/
└── README.md
```

---

## ▶️ Getting Started (Run Locally)

The frontend is a Vite/React app and the backend is a Spring Boot API backed by
MongoDB. They're wired together as follows:

- Backend runs on `http://localhost:8080`, API base path `/api/v1`
- Frontend runs on `http://localhost:5173` (Vite default) and talks to the
  backend via `VITE_API_BASE_URL` (see `frontend/.env`)
- CORS on the backend (`SecurityConfig`) is configured to allow
  `http://localhost:5173` — update it if you serve the frontend elsewhere

### 1. Start MongoDB

The backend needs a MongoDB instance at `localhost:27017` (database
`cloudvault_db`). The easiest way:

```bash
docker compose up -d
```

(uses the `docker-compose.yml` at the project root). Alternatively, point
`backend/src/main/resources/application.yml` at your own MongoDB instance.

### 2. Run the backend

```bash
cd backend
./mvnw spring-boot:run
```

The API will be available at `http://localhost:8080/api/v1`, with Swagger UI
at `http://localhost:8080/swagger-ui.html`.

### 3. Run the frontend

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`, register an account, and log in.

### Notes

- The backend issues short-lived access tokens (15 min) plus a 7-day refresh
  token; the frontend automatically refreshes expired access tokens.
- Uploaded files are stored on disk under `backend/uploads` by default
  (configurable via `file.upload-dir` in `application.yml`).

---

## 📅 Development Roadmap

### ✅ Week 1
- [ ] Project Setup
- [ ] Backend Initialization
- [ ] Frontend Initialization
- [ ] Docker Setup
- [ ] Authentication Module

### ✅ Week 2
- [ ] File Upload
- [ ] File Download
- [ ] Folder Management
- [ ] MongoDB Integration
- [ ] MinIO Integration

### ✅ Week 3
- [ ] File Sharing
- [ ] Role-Based Access Control
- [ ] File Versioning
- [ ] Audit Logs
- [ ] Deployment

---

## 🌳 Git Workflow

```
main
│
├── develop
│
├── feature/backend-*
├── feature/frontend-*
└── feature/devops-*
```

---

## 📌 Daily Progress

### Day 1
- ✅ Repository Created
- ✅ Team Setup
- ✅ Project Planning
- ✅ Tech Stack Finalized

> More updates will be added daily.

---

## 🎯 Project Objective

Build a secure, scalable, and enterprise-grade cloud storage platform for efficient file management, collaboration, and access control.

---

## 🚧 Project Status

This project is actively being developed. New features, documentation, and updates will be pushed daily.

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push your branch
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

⭐ If you like this project, consider giving it a Star!
