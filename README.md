# Tech Blog - Django REST + React

A modern, full-stack tech blog platform designed for developers to share expertise, connect, and explore the latest in technology. This project leverages a robust Django REST Framework backend and a dynamic React frontend, delivering a seamless user experience across all devices.

> **Status:** This project is currently under active development. Some social features (like following) are implemented as functional placeholders in the UI for future expansion.

---

## **Table of Contents**

- [Overview](#overview)
- [Key Features](#key-features)
- [Architecture & Technology Stack](#architecture--technology-stack)
- [Project UI & Workflow](#project-ui--workflow)
- [API Endpoints](#api-endpoints)
- [Installation](#installation)
- [Development Status & Roadmap](#development-status--roadmap)
- [Contact](#contact)

---

## **Overview**

Shivam's Tech Blog is a platform for the tech community, built on clean architecture and a microservices-inspired design. It provides a full blog-writing suite, social interaction through likes and comments, and personalized user profiles. It is designed with responsiveness at its core to ensure accessibility for mobile users.

---

## **Key Features**

### **Seamless User Authentication**
- Secure login and registration using **JWT (JSON Web Tokens)**.
- Protected API endpoints ensure user data integrity.
- Access control for blog management.

### **Comprehensive Blog Management**
- Users can draft, preview, and manage their own stories.
- Integrated image upload feature for blog covers.
- Post-level control: users can toggle visibility between **Public** and **Hidden**.

### **Interactive Social Ecosystem**
- Registered users can **Like** posts to show appreciation.
- A fully integrated **Comment** system allows for detailed discussions on articles.

### **Personalized User Profiles**
- Every user gets a dedicated profile page.
- Showcase a personalized **"About"** description.
- Track influence with implemented **Followers** and **Following** count metrics.

### **Streamlined Admin Workflow**
- Dedicated "My Posts" management dashboard.
- Admin review process for blog approval to maintain content quality.

---

## **Architecture & Technology Stack**

This project uses a decoupled backend-frontend architecture.

- **Frontend:**
  - `React.js` (User Interface)
  - `Bootstrap` (Responsive Grid and UI components)
- **Backend:**
  - `Django` (Main web framework)
  - `Django REST Framework (DRF)` (Robust API construction)
  - `JWT Authentication` (via `djangorestframework-simplejwt`)
- **Database:**
  - `SQLite` (For development simplicity)

---

## **Project UI & Workflow**

Here is a walkthrough of the platform using project screenshots, illustrating the core functionality from creation to engagement.

### **1. Home Page - Discovering Tech Stories**

The main dashboard provides an curated feed of "Latest Articles," organized by category (e.g., Django, Software Development) and featuring dates and author information. A clean, modern hero section sets the tone.

![Home Page of Shivam's Tech Blog](image_dee7c6.jpg)

### **2. Blog Creation - The Writing Suite**

The platform offers a detailed blog drafting interface where users can input titles, select categories, and write content. Critically, it allows for image uploads for blog covers and includes a powerful privacy toggle: "Make this post visible to public?".

![Writing a new story on the blog platform](image_dee83b.png)

### **3. My Posts Manager - Dashboard**

A dedicated manager provides users with an overview of their created content, showing status labels ("Visible", "Approved") and allowing for edit/delete actions. Note the "Approved" label, which is part of the planned admin workflow.

![User dashboard showing drafted and published blogs](image_deebc4.png)

### **4. Community Profiles & Engagement**

Every user has a profile page that acts as their personalized dashboard, showcasing an "About" section and counters for followers and following.

Users can easily view and edit their profile details via a modal, and a clean logout button provides secure exit.

The profile highlights social engagement with real-time counters. Below, the full profile details for owner Shivam Sagar:

![Profile modal on Shivam's Tech Blog](image_deec1e.png)

![User Profile Page showing followers and following counters](image_deec5c.jpg)

### **5. Article View & Social Interaction**

Detailed article view provides author details, post metadata (e.g., author `@Vivek@123`, date 1/17/2026), and clear social interaction buttons.

![Article details for 'Spring Boot' by Vivek@123](image_deeb43.png)

The full discussion is shown below, with comments from `@Vivek@123` and `@shivam` and a dynamic text-area for new responses.

![Comment section on article page showing interaction](image_deeb81.png)

---

## **API Endpoints**

The backend exposes a clear and restful API. Here are some key endpoints:

| Endpoint | Method | Description | Authentication |
| :--- | :--- | :--- | :--- |
| `/api/auth/token/` | `POST` | Get JWT access and refresh tokens | No |
| `/api/auth/register/` | `POST` | Register a new user | No |
| `/api/posts/` | `GET` | Get all public posts | No |
| `/api/posts/create/` | `POST` | Create a new blog post | Yes |
| `/api/posts/{id}/update/` | `PATCH` | Edit a blog post | Yes (Owner) |
| `/api/posts/{id}/like/` | `POST` | Like a blog post | Yes |
| `/api/profiles/{username}/` | `GET` | Get user profile information | No |
| `/api/profiles/update/` | `PATCH` | Update current user profile | Yes |

---

## **Installation**

To run this project locally, you will need to set up both the backend and frontend repositories.

#### **Backend Setup (Django)**

1.  **Clone the repository:**
    ```bash
    git clone [your_backend_repo_url]
    cd [backend_directory]
    ```

2.  **Create a virtual environment:**
    ```bash
    python -m venv venv
    source venv/bin/activate  # On Windows: venv\Scripts\activate
    ```

3.  **Install dependencies:**
    ```bash
    pip install -r requirements.txt
    ```

4.  **Run migrations:**
    ```bash
    python manage.py migrate
    ```

5.  **Start the server:**
    ```bash
    python manage.py runserver
    ```

#### **Frontend Setup (React)**

1.  **Clone the repository:**
    ```bash
    git clone [your_frontend_repo_url]
    cd [frontend_directory]
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Start the development server:**
    ```bash
    npm start
    ```

The frontend will now be running on `http://localhost:3000`.

---

## **Development Status & Roadmap**

Key features are functional, but the project is under active development. Our upcoming roadmap includes:

- [ ]  **Full Social Network Implementation:** Enabling actual following/follower mechanisms to drive a personalized feed.
- [ ]  **Admin Panel Completion:** A dedicated interface for admins to efficiently review and manage post approvals.
- [ ]  **Backend Migration:** Plan to move from SQLite to a production-grade database like PostgreSQL for scalability.
- [ ]  **Performance Optimization:** Focusing on image optimization and API caching.
- [ ]  **Testing:** Implementing unit and integration tests.

---

## **Contact**

If you have any questions, feel free to reach out to the author:

**Shivam Sagar**
- Email: shivamsagar6192@gmail.com
- Profile on this platform: `@Shivam@123`
- GitHub: `[your_github_username]`
- LinkedIn: `[your_linkedin_url]`

---