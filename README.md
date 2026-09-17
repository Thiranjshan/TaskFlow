# TaskFlow

A simple full-stack task manager built with the MERN stack, containerized with Docker,
and deployed via a Jenkins CI/CD pipeline to AWS EC2.

## Features
- User registration and login (JWT authentication, bcrypt password hashing)
- Create, complete, and delete tasks
- Each user only sees their own tasks

## Tech Stack
- **Frontend:** React (Vite)
- **Backend:** Node.js, Express
- **Database:** MongoDB
- **DevOps:** Docker, Docker Compose, Jenkins, GitHub, AWS EC2

## Running Locally (without Docker)

### Backend
```bash
cd server
cp .env.example .env   # fill in a real JWT_SECRET
npm install
npm run dev
```

### Frontend
```bash
cd client
cp .env.example .env
npm install
npm run dev
```

Visit `http://localhost:5173`.

## Running with Docker Compose
```bash
cp server/.env.example server/.env   # set JWT_SECRET
docker-compose up --build
```

Visit `http://localhost`.

## Project Structure
```
taskflow/
├── client/        # React frontend
├── server/        # Express backend
├── docker-compose.yml
└── Jenkinsfile
```
