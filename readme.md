# Store Ratings Platform

Welcome to the **Store Ratings Platform**, a full-stack web application that enables users to rate stores based on their experiences. The platform supports three distinct user roles—**System Administrator**, **Normal User**, and **Store Owner**—each with tailored functionalities. Built with modern web technologies, it emphasizes usability, data integrity, and responsive design.

---

## 🔗 Live Demo Link

* 🌐 Main Application: [https://store-rating-six.vercel.app/]

> After logging in, users are automatically directed to the appropriate interface based on their role (Normal User, System Administrator, or Store Owner).

---

## 🧠 Overview

This project was developed as part of a FullStack Intern Coding Challenge. Users can:

* Register and log in based on their roles.
* Add/view/update ratings for stores.
* Perform role-specific actions with data validations and proper access control.

---

## ✨ Key Features

### 🔐 Role-Based Functionalities

* **System Administrator**:

  * Manage users (add, edit, delete, filter by role).
  * Manage stores.
  * View total counts: users, stores, ratings.

* **Normal User**:

  * Sign up with validation.
  * Browse and rate stores.
  * Edit submitted ratings.

* **Store Owner**:

  * View ratings and average score of their store.
  * Edit password.

### ✅ Validations

* **Name**: 20–60 characters.
* **Address**: Up to 400 characters.
* **Email**: Must be valid and unique.
* **Password**: 8–16 characters, at least one uppercase and one special character.

### 📊 Features

* One rating per user per store (editable).
* Filter/search by name, email, address, or role.
* Sortable columns (ascending/descending).
* JWT-based authentication and protected routes.
* Responsive layout and real-time alerts using Toastify.

---

## 🧱 Tech Stack

| Layer        | Technologies                                   |
| ------------ | ---------------------------------------------- |
| **Frontend** | Vite, React, React Router DOM, Axios, Toastify |
| **Backend**  | Node.js, Express.js                            |
| **Database** | PostgreSQL (deployed via Render)               |
| **Auth**     | JSON Web Token (JWT)                           |

---

## ⚙️ Setup Instructions

### 📥 Prerequisites

* Node.js (v16+)
* PostgreSQL
* npm or yarn

---

### 🔧 Backend Setup

1. **Navigate** to the backend:

   ```bash
   cd backend
   ```

2. **Install packages**:

   ```bash
   npm install
   ```

3. **Configure environment**:
   Create `.env`:

   ```
   PORT=8000
   DATABASE_URL=postgresql://<user>:<password>@localhost:5432/store_ratings
   JWT_SECRET=your_jwt_secret
   ```

4. **Initialize the database**:

   ```bash
   psql -U postgres
   CREATE DATABASE store_ratings;
   \q
   ```

   Then:

   ```bash
   psql -U postgres -d store_ratings -f ../docs/schema.sql
   ```

5. **Run the server**:

   ```bash
   node server.js
   ```

---

### 🎨 Frontend Setup

1. **Navigate** to the frontend:

   ```bash
   cd frontend
   ```

2. **Install packages**:

   ```bash
   npm install
   ```

3. **Run frontend**:

   ```bash
   npm run dev
   ```
---

## 🌍 Deployment

### 🔁 Backend (Render)

* Create PostgreSQL database on Render.
* Deploy backend via GitHub (Node build).
* Add environment variables in Render dashboard.

### 🖼️ Frontend (Vercel or Netlify)

* Deploy Vite project via GitHub.
* Set:

  * **Build Command**: `npm run build`
  * **Output Directory**: `dist`
  * **VITE_API_URL**: your Render backend URL

---

## 🧪 Sample Credentials

| Role        | Email                | Password     |
| ----------- | -------------------- | ------------ |
| system admin|susanta721467@gmail.com| Susanta@123 |
| normal user | example1@gmail.com   | Example@123  |
| store owner | tapas@gmail.com      | Tapas@123    |

> Replace with real test accounts from your deployed app.

---

## ✅ Testing Guide

* Use Postman for backend API.
* Validate roles and field constraints.
* Try login/signup/ratings flow across roles.
* Test sorting, filtering, and updating ratings.

---

## 🌟 Best Practices Followed

* Environment-safe configs.
* Secure API with JWT.
* Role-based routing and UI.
* DRY, modular React components.
* Error-handling and input sanitation.

---

## 🤝 Contribution Guide

1. Fork the repo.
2. Create a feature branch.
3. Commit and push.
4. Open a PR.

---

## 📬 Contact

For questions or feedback:
📧 [susanta721467@gmail.com]

---

⭐ **If you found this helpful, star the repo!**
💡 Happy Coding!
