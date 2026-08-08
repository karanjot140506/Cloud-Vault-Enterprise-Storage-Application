# ☁️ CloudVault

<h3 align="center">Enterprise Cloud Storage Platform</h3>

<p align="center">
  A secure, scalable and modern cloud storage platform for managing, storing and accessing files.
</p>

<p align="center">

![Java](https://img.shields.io/badge/Java-21-orange?style=for-the-badge\&logo=openjdk)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.x-brightgreen?style=for-the-badge\&logo=springboot)
![React](https://img.shields.io/badge/React-18-blue?style=for-the-badge\&logo=react)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-green?style=for-the-badge\&logo=mongodb)
![MinIO](https://img.shields.io/badge/MinIO-Object%20Storage-red?style=for-the-badge\&logo=minio)
![Docker](https://img.shields.io/badge/Docker-Containerization-blue?style=for-the-badge\&logo=docker)
![JWT](https://img.shields.io/badge/JWT-Authentication-black?style=for-the-badge\&logo=jsonwebtokens)

</p>

---

## 🌟 Overview

**CloudVault** is a full-stack cloud storage platform designed to provide users with a secure and organized way to upload, manage, store and access their files.

The application follows a modern layered architecture using **Spring Boot** for backend services, **React** for the frontend, **MongoDB** for application and file metadata, and **MinIO** for S3-compatible object storage.

The project also uses **Docker** for containerization, making the application easier to configure, run and deploy across different environments.

### 🎯 Core Objective

The goal of CloudVault is to simulate a real-world cloud storage system while applying practical concepts such as:

* Secure authentication
* RESTful API design
* File and object storage
* Database management
* Access control
* Containerization
* Full-stack application architecture

---

# 🚀 Key Features

## 🔐 Authentication & Security

* User registration and login
* JWT-based authentication
* Secure password hashing using BCrypt
* Protected API endpoints
* Role-based authorization
* Token-based session management

---

## 📂 File Management

* Upload files
* Download files
* Delete files
* Restore deleted files
* Recycle bin
* File metadata management
* File organization
* File access control

---

## 🗑️ Recycle Bin

CloudVault provides a recycle-bin workflow instead of permanently deleting files immediately.

Users can:

* Move files to recycle bin
* View deleted files
* Restore files
* Permanently delete files

This provides a safer file-management experience.

---

# ☁️ Object Storage with MinIO

CloudVault uses **MinIO** as the object storage layer for storing actual uploaded files.

Instead of storing large files directly inside MongoDB, CloudVault separates:

```text
File Metadata  → MongoDB

Actual File    → MinIO
```

This separation improves the overall storage architecture and keeps the database focused on application metadata.

### Example

```text
MongoDB
│
├── fileId
├── originalFileName
├── storedFileName
├── contentType
├── fileSize
├── ownerId
└── uploadDate


MinIO
│
└── Actual File Object
```

MinIO provides an **S3-compatible object storage interface**, making the storage layer suitable for cloud-oriented architectures.

---

# 🎨 Frontend Experience

* Modern responsive dashboard
* Clean file-management interface
* File explorer experience
* Upload interface
* Recycle bin interface
* Authentication screens
* Responsive component architecture
* REST API integration using Axios

---

# ⚙️ DevOps

* Docker containerization
* Docker Compose
* Containerized MinIO
* Environment-based configuration
* Git/GitHub version control
* Reproducible local development environment

---

# 🏗️ System Architecture

```text
                           ┌───────────────┐
                           │     User      │
                           └───────┬───────┘
                                   │
                                   ▼
                           ┌───────────────┐
                           │ React Frontend│
                           └───────┬───────┘
                                   │
                              REST APIs
                                   │
                                   ▼
                     ┌─────────────────────────┐
                     │    Spring Boot Backend  │
                     │                         │
                     │  ┌───────────────────┐  │
                     │  │ Spring Security   │  │
                     │  │ JWT Authentication│  │
                     │  └───────────────────┘  │
                     └──────────┬───────┬──────┘
                                │       │
                         Metadata       │ Files
                                │       │
                                ▼       ▼
                         ┌──────────┐ ┌──────────┐
                         │ MongoDB  │ │  MinIO   │
                         │          │ │          │
                         │ Metadata │ │ Objects  │
                         └──────────┘ └──────────┘
                               
                         Docker / Compose
```

---

# 🔄 File Upload Flow

```text
User
 │
 │ Upload File
 ▼
React Frontend
 │
 │ Multipart Request
 ▼
Spring Boot API
 │
 ├──────────────► MinIO
 │                  │
 │                  └── Stores actual file
 │
 └──────────────► MongoDB
                    │
                    └── Stores file metadata
```

### Example

When a user uploads:

```text
resume.pdf
```

CloudVault stores:

**MinIO**

```text
resume.pdf → Actual file/object
```

**MongoDB**

```text
{
    "originalFileName": "resume.pdf",
    "storedFileName": "...",
    "contentType": "application/pdf",
    "fileSize": 245678,
    "ownerId": "...",
    "deleted": false
}
```

---

# 🛠️ Technology Stack

## Backend

| Technology          | Purpose                        |
| ------------------- | ------------------------------ |
| Java 17             | Core Programming Language      |
| Spring Boot         | Backend Framework              |
| Spring Security     | Application Security           |
| JWT                 | Authentication & Authorization |
| Spring Data MongoDB | MongoDB Integration            |
| REST APIs           | Backend Communication          |
| Lombok              | Boilerplate Reduction          |
| Maven               | Dependency Management          |

---

## Frontend

| Technology   | Purpose             |
| ------------ | ------------------- |
| React.js     | UI Development      |
| JavaScript   | Frontend Logic      |
| Axios        | API Communication   |
| Tailwind CSS | UI Styling          |
| Vite         | Frontend Build Tool |

---

## Database

| Technology    | Purpose                |
| ------------- | ---------------------- |
| MongoDB       | User & File Metadata   |
| MongoDB Atlas | Cloud Database Support |

---

## Object Storage

| Technology | Purpose                      |
| ---------- | ---------------------------- |
| MinIO      | S3-Compatible Object Storage |
| S3 API     | Object Storage Communication |

---

## DevOps

| Technology     | Purpose                       |
| -------------- | ----------------------------- |
| Docker         | Containerization              |
| Docker Compose | Multi-Container Orchestration |
| Git            | Version Control               |
| GitHub         | Source Code Management        |

---

# 📁 Project Structure

```text
CloudVault
│
├── backend
│   │
│   ├── src
│   │   └── main
│   │       ├── java
│   │       │   └── com.cloudvault.backend
│   │       │
│   │       └── resources
│   │
│   ├── pom.xml
│   └── Dockerfile
│
├── frontend
│   │
│   ├── src
│   ├── public
│   ├── package.json
│   └── Dockerfile
│
├── docker-compose.yml
│
├── .gitignore
│
└── README.md
```

---

# ⚡ Getting Started

## Prerequisites

Make sure the following are installed:

* Java 21+
* Maven
* Node.js
* npm
* Docker
* Docker Compose
* MongoDB / MongoDB Atlas

---

# 🔧 Backend Setup

Navigate to the backend:

```bash
cd backend
```

Build the project:

```bash
mvn clean install
```

Run the application:

```bash
mvn spring-boot:run
```

Backend:

```text
http://localhost:8080
```

---

# 🎨 Frontend Setup

Navigate to frontend:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start development server:

```bash
npm run dev
```

Frontend:

```text
http://localhost:5173
```

---

# 🐳 Docker Setup

CloudVault can be started using Docker Compose.

From the project root:

```bash
docker-compose up --build
```

Run in detached mode:

```bash
docker-compose up -d --build
```

Stop containers:

```bash
docker-compose down
```

View running containers:

```bash
docker ps
```

---

# 🗄️ MinIO Configuration

MinIO is used as the object storage service for CloudVault.

Typical local MinIO configuration:

```text
MinIO API:
http://localhost:9000

MinIO Console:
http://localhost:9001
```

MinIO stores the actual uploaded files while MongoDB stores their metadata.

### Storage Architecture

```text
                    CloudVault
                        │
                        ▼
                 Spring Boot API
                   /         \
                  /           \
                 ▼             ▼
             MongoDB         MinIO
           File Metadata   Actual Files
```

---

# 🔑 Environment Configuration

## Backend

Configure your environment variables or `application.properties`.

Example:

```properties
spring.data.mongodb.uri=YOUR_MONGODB_URI

jwt.secret=YOUR_JWT_SECRET

minio.url=http://localhost:9000
minio.access-key=YOUR_MINIO_ACCESS_KEY
minio.secret-key=YOUR_MINIO_SECRET_KEY
minio.bucket-name=cloudvault
```

> ⚠️ Never commit real credentials, JWT secrets or API keys to GitHub.

---

## Frontend

Create a `.env` file:

```env
VITE_API_URL=http://localhost:8080/api
```

---

# 🔒 Security

CloudVault follows several security practices:

* JWT-based authentication
* BCrypt password hashing
* Protected API endpoints
* Role-based access control
* Environment-based secret configuration
* Separation of metadata and object storage
* No sensitive credentials committed to source control

---

# 📸 Screenshots

## 🔐 Login

Add your login screenshot here:

```text
![CloudVault Login](./screenshots/login.png)
```

---

## 📊 Dashboard

```text
![CloudVault Dashboard](./screenshots/dashboard.png)
```

---

## 📂 File Management

```text
![CloudVault Files](./screenshots/files.png)
```

---

## 🗑️ Recycle Bin

```text
![CloudVault Recycle Bin](./screenshots/recycle-bin.png)
```

---

# 📡 API Overview

CloudVault exposes REST APIs for authentication and file management.

### Authentication

```text
POST   /api/auth/register
POST   /api/auth/login
```

### Files

```text
POST   /api/files/upload
GET    /api/files
GET    /api/files/{id}/download
DELETE /api/files/{id}
```

### Recycle Bin

```text
GET    /api/files/recycle-bin
PUT    /api/files/{id}/restore
DELETE /api/files/{id}/permanent
```

> API paths may vary depending on the current backend implementation.

---

# 🧩 Core Backend Architecture

CloudVault follows a layered backend architecture:

```text
Controller
    │
    ▼
Service
    │
    ▼
Repository
    │
    ▼
MongoDB
```

For file operations:

```text
Controller
    │
    ▼
File Service
    │
    ├──────────► MongoDB
    │             │
    │             └── File Metadata
    │
    └──────────► MinIO
                  │
                  └── Actual File
```

This separation keeps business logic, persistence and storage responsibilities organized.

---

# 🧠 Learning Outcomes

Through CloudVault, I gained practical experience in:

* Full-stack application development
* Spring Boot backend architecture
* REST API development
* JWT authentication and authorization
* Spring Security
* MongoDB database design
* File upload and download workflows
* Object storage with MinIO
* S3-compatible storage concepts
* React frontend development
* Docker containerization
* Docker Compose
* Git and GitHub workflow
* Environment-based configuration
* Production-oriented application architecture

---

# 🔮 Future Enhancements

The following features can be added in future versions:

* 🔗 Public file sharing links
* 👥 File sharing between users
* 📧 Email notifications
* 🔍 Advanced file search
* 👁️ File preview system
* 📊 Storage analytics
* ☁️ AWS deployment
* 🔄 CI/CD pipeline
* ☸️ Kubernetes deployment
* 📈 Application monitoring
* ⚡ Redis caching
* 🛡️ Rate limiting

---

# 🚀 Future Architecture

```text
                       CloudVault
                           │
                           ▼
                    Load Balancer
                           │
                           ▼
                  Spring Boot Services
                    /      |       \
                   /       |        \
                  ▼        ▼         ▼
              MongoDB    Redis      MinIO
                           │
                           │
                       Caching
```

---

# 👨‍💻 Author

## Garvit Malik

**Java Backend Developer | Full Stack Developer**

Interested in building scalable backend systems, full-stack applications and production-oriented software.

### Tech Stack

```text
Java
Spring Boot
Spring Security
REST APIs
React
MongoDB
MinIO
Docker
Git
GitHub
System Design
DSA
```

---

# ⭐ Support

If you found **CloudVault** useful or interesting, consider giving the repository a ⭐.

---

<p align="center">
  Built with ☕ Java, Spring Boot, React & Docker
</p>

<p align="center">
  © 2026 CloudVault
</p>
