# Company Registration & Verification System

This is a comprehensive web application for company registration and verification. It features a modern frontend built with React and a robust backend utilizing Node.js and Express.

## Features

*   **User Authentication**: Secure signup and login using Firebase Authentication.
*   **Company Registration Workflow**: A multi-step form wizard for registering companies with detailed information.
*   **Data Verification**: Automated and manual verification processes for company details.
*   **Profile Management**: Users can view and manage their profiles and registered company data.
*   **File Uploads**: Integration with Cloudinary for secure uploading and storage of company documents and logos.
*   **Form Validation**: Robust client-side validation using React Hook Form and Yup to ensure data integrity.
*   **Hybrid Database Architecture**: Utilizes PostgreSQL for structured relational data and MongoDB for flexible document storage.
*   **Responsive Design**: A modern, responsive UI built with Tailwind CSS and Material UI components.
*   **Secure API**: JWT-based session management and protected backend routes.

## Tech Stack

**Frontend:**
*   React (Vite)
*   Redux Toolkit (State Management)
*   Tailwind CSS (Styling)
*   React Hook Form & Yup (Forms & Validation)
*   Firebase (Authentication)

**Backend:**
*   Node.js & Express
*   PostgreSQL (Primary Database - `pg`)
*   MongoDB (via `mongoose`)
*   Cloudinary (Image Uploads)
*   Firebase Admin (Auth Verification)

## Prerequisites

*   Node.js (v18+ recommended)
*   PostgreSQL
*   MongoDB
*   Git

## Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/Akshaya0026/Company-Registration-Verification-System.git
    cd Company-Registration-Verification-System
    ```

2.  **Install dependencies:**
    
    This project uses npm workspaces or separate package.json files. You can install dependencies for both frontend and backend.

    ```bash
    # Root installation (if workspaces configured)
    npm install

    # OR install separately
    cd backend && npm install
    cd ../frontend && npm install
    ```

## Environment Setup

### Backend
Create a `.env` file in the `backend` directory with the following variables (adjust as needed for your setup):

```env
PORT=3000
DATABASE_URL=postgres://user:password@localhost:5432/your_db_name
MONGODB_URI=mongodb://localhost:27017/your_db_name
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
FIREBASE_SERVICE_ACCOUNT_KEY=path/to/serviceAccountKey.json
JWT_SECRET=your_jwt_secret
```

### Frontend
Create a `.env` file in the `frontend` directory (or `.env.local`):

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_API_URL=http://localhost:3000
```

## Running the Application

### Backend Development
Run the backend server in development mode (with nodemon):

```bash
cd backend
npm run dev
```
*   **Database Migration**: `npm run migrate`
*   **Seed Data**: `npm run seed:all`

### Frontend Development
Run the frontend development server:

```bash
cd frontend
npm run dev
```

The frontend will typically run at `http://localhost:5173` and the backend at `http://localhost:3000` (or as configured).

## Testing

*   **Backend**: `cd backend && npm test`
*   **Frontend**: `cd frontend && npm test`
