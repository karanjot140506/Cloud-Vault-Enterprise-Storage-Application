# ☁️ CloudVault

<h3 align="center">
Enterprise Cloud Storage Platform
</h3>

<p align="center">
A secure, scalable and modern cloud storage application built with 
Spring Boot, React, MongoDB and DevOps practices.
</p>


<p align="center">

<img src="https://img.shields.io/badge/Java-17-orange?style=for-the-badge&logo=openjdk"/>
<img src="https://img.shields.io/badge/Spring%20Boot-3.x-green?style=for-the-badge&logo=springboot"/>
<img src="https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react"/>
<img src="https://img.shields.io/badge/MongoDB-Database-green?style=for-the-badge&logo=mongodb"/>
<img src="https://img.shields.io/badge/Docker-Containerization-blue?style=for-the-badge&logo=docker"/>
<img src="https://img.shields.io/badge/JWT-Security-black?style=for-the-badge"/>

</p>


---

# 🌟 Overview

**CloudVault** is an enterprise-level cloud storage platform that allows users to securely upload, manage, organize and access their files from anywhere.

The application follows a modern full-stack architecture with a secure backend, responsive frontend and containerized deployment approach.

The main objective of this project is to design and implement a real-world cloud storage system with authentication, file management, cloud storage integration and production-ready development practices.


---

# 🚀 Key Features


## 🔐 Authentication & Security

✅ User Registration & Login  
✅ JWT Based Authentication  
✅ Secure Password Encryption using BCrypt  
✅ Protected Routes  
✅ Role Based Authorization  


---

## 📂 File Management

✅ Upload Files  
✅ Download Files  
✅ Delete Files  
✅ Restore Deleted Files  
✅ Recycle Bin Management  
✅ File Metadata Storage  
✅ File Organization  


---

## ☁️ Storage System

✅ Secure File Storage  
✅ Metadata Management using MongoDB  
✅ Scalable Storage Architecture  
✅ File Access Control  


---

## 🎨 Frontend Experience

✅ Modern Responsive UI  
✅ Dashboard Interface  
✅ File Explorer Design  
✅ Smooth User Experience  
✅ Component Based Architecture  


---

## ⚙️ DevOps & Deployment

✅ Docker Containerization  
✅ Docker Compose Setup  
✅ Environment Based Configuration  
✅ Git Based Development Workflow  


---

# 🏗️ System Architecture


```
                         User
                           |
                           |
                    React Frontend
                           |
                           |
                    REST API Layer
                           |
                           |
                  Spring Boot Backend
                           |
          --------------------------------
          |                              |
          |                              |
      MongoDB                     File Storage
   (Metadata/Data)                (Objects)

```


---

# 🛠️ Technology Stack


## Backend

| Technology | Purpose |
|------------|---------|
| Java | Core Programming Language |
| Spring Boot | Backend Framework |
| Spring Security | Application Security |
| JWT | Authentication |
| Spring Data MongoDB | Database Integration |
| REST APIs | Communication Layer |


---

## Frontend

| Technology | Purpose |
|------------|---------|
| React.js | UI Development |
| JavaScript | Frontend Logic |
| Axios | API Communication |
| Tailwind CSS | Styling |


---

## Database

| Technology | Purpose |
|------------|---------|
| MongoDB | User & File Metadata Storage |


---

## DevOps

| Technology | Purpose |
|------------|---------|
| Docker | Containerization |
| Docker Compose | Multi Container Setup |
| Git/GitHub | Version Control |


---

# 📁 Project Structure


```
CloudVault
│
├── backend
│   │
│   ├── src/main/java
│   │
│   ├── pom.xml
│   │
│   └── application.properties
│
│
├── frontend
│   │
│   ├── src
│   │
│   ├── package.json
│
│
├── docker-compose.yml
│
├── README.md
│
└── .gitignore

```


---

# ⚡ Installation & Setup


## 1. Clone Repository


```bash
git clone https://github.com/yourusername/CloudVault.git
```


Move into project:

```bash
cd CloudVault
```


---

# 🔧 Backend Setup


Navigate to backend:

```bash
cd backend
```


Install dependencies:

```bash
mvn clean install
```


Run Spring Boot application:


```bash
mvn spring-boot:run
```


Backend will start on:

```
http://localhost:8080
```


---

# 🎨 Frontend Setup


Navigate to frontend:


```bash
cd frontend
```


Install packages:


```bash
npm install
```


Run application:


```bash
npm run dev
```


Frontend will start on:

```
http://localhost:5173
```


---

# 🐳 Docker Setup


Build and run containers:


```bash
docker-compose up --build
```


Stop containers:


```bash
docker-compose down
```


---

# 🔑 Environment Configuration


## Backend

Create:

```
application.properties
```


Add:


```properties
spring.data.mongodb.uri=YOUR_MONGODB_URI

jwt.secret=YOUR_SECRET_KEY

storage.access.key=YOUR_ACCESS_KEY

storage.secret.key=YOUR_SECRET_KEY
```


---

## Frontend


Create:

```
.env
```


Add:


```env
VITE_API_URL=http://localhost:8080/api
```


---

# 📸 Screenshots


## Login Page

Add screenshot here


---

## Dashboard

Add screenshot here


---

## File Management

Add screenshot here


---

# 🔮 Future Enhancements


🚀 Cloud Deployment on AWS/Azure  
🚀 File Sharing with Public Links  
🚀 Email Notifications  
🚀 File Preview System  
🚀 Search & Filtering  
🚀 CI/CD Pipeline  
🚀 Kubernetes Deployment  


---

# 📚 Learning Outcomes


Through this project I gained practical experience in:


✅ Designing Full Stack Applications  
✅ Building RESTful APIs using Spring Boot  
✅ Implementing JWT Authentication  
✅ Working with MongoDB Database Design  
✅ Containerizing Applications using Docker  
✅ Following Production Level Development Practices  


---

# 👨‍💻 Author


## Garvit Malik


Java Backend Developer | Full Stack Developer


### Skills

Java • Spring Boot • React • MongoDB • Docker • REST APIs • System Design


---

# ⭐ Support

If you found this project useful, consider giving it a ⭐ on GitHub.

