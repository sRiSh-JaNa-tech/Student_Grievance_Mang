# Student Grievance Management System (SGN)

A full-stack web application built using the MERN (MongoDB, Express.js, React, Node.js) stack that allows students to report, track, and manage their grievances effectively.

## Features
- **User Authentication**: Secure registration and login using JWT and bcrypt.
- **Grievance Management**: Submit, view, update, and delete grievances.
- **Search & Filter**: Search grievances by title or unique ID.
- **Modern UI**: Clean, responsive light-themed interface with a floating action button and dashboard stats.
- **Protected Routes**: Ensuring only logged-in users can manage their data.

---

## Tech Stack
- **Frontend**: React.js, React Router, Axios, CSS3 (Custom Light Theme)
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose)
- **Security**: JWT (JSON Web Tokens), bcryptjs

---

## Getting Started

### Prerequisites
- Node.js installed
- MongoDB URI (Local or Atlas)

### Backend Setup
1. Navigate to the `backend` directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file and add the following:
   ```env
   MONGO_URL=your_mongodb_uri
   PORT=5000
   JWT_SECRET=your_jwt_secret
   ```
4. Start the server:
   ```bash
   node server.js
   ```

### Frontend Setup
1. Navigate to the `MyApp` directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

---

## Backend API Documentation

### Authentication APIs (`/api/auth`)

#### 1. Register User
- **Endpoint**: `POST /api/auth/register`
- **Description**: Registers a new student.
- **Request Body**:
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }
  ```
- **Response**: `201 Created` with JWT token and user info.

#### 2. Login User
- **Endpoint**: `POST /api/auth/login`
- **Description**: Authenticates a student and returns a token.
- **Request Body**:
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```
- **Response**: `200 OK` with JWT token and user info.

---

### Grievance APIs (`/api/grievances`)
*All Grievance APIs require an `Authorization: Bearer <token>` header.*

#### 1. Submit Grievance
- **Endpoint**: `POST /api/grievances`
- **Description**: Submits a new grievance.
- **Request Body**:
  ```json
  {
    "title": "Broken Fan in Room 202",
    "description": "The fan in my hostel room has been making noise...",
    "category": "Hostel"
  }
  ```
- **Categories**: `Academic`, `Hostel`, `Transport`, `Other`

#### 2. Get All Grievances
- **Endpoint**: `GET /api/grievances`
- **Description**: Retrieves all grievances submitted by the logged-in student.

#### 3. Get Grievance by ID
- **Endpoint**: `GET /api/grievances/:id`
- **Description**: Retrieves a specific grievance using its unique 24-character ID.

#### 4. Search Grievances
- **Endpoint**: `GET /api/grievances/search?title=xyz`
- **Description**: Searches grievances by title (case-insensitive).

#### 5. Update Grievance
- **Endpoint**: `PUT /api/grievances/:id`
- **Description**: Updates an existing grievance.
- **Request Body** (optional fields):
  ```json
  {
    "title": "Updated Title",
    "status": "Resolved"
  }
  ```

#### 6. Delete Grievance
- **Endpoint**: `DELETE /api/grievances/:id`
- **Description**: Permanently removes a grievance from the system.

---

## Folder Structure
- `backend/`: Express server, Mongoose models, and API routes.
- `MyApp/`: React frontend source code and assets.
