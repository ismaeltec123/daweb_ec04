# Backend API for Course Management System

This is the backend API for a course management system with authentication, user roles, courses, and enrollments.

## Setup

1. Make sure you have Node.js and PostgreSQL installed
2. Clone this repository
3. Create a `.env` file based on `.env.example` with your database credentials
4. Install dependencies:
   ```
   npm install
   ```
5. Start the development server:
   ```
   npm run dev
   ```

## Database Setup

This application uses PostgreSQL. You can set up the database in two ways:

### Option 1: Using the setup script

```
npm run setup-database
```

This will create all tables and a default admin user (admin@ejemplo.com/admin123).

### Option 2: Manual setup

The application will create the necessary tables when it starts. To create an admin user:

```
node scripts/createAdmin.js
```

## Deployment on Render

This application is configured to deploy on Render.com:

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Configure as:
   - Build Command: `npm run render-build`
   - Start Command: `npm run render-start`
4. Add environment variables:
   - `DATABASE_URL` (Render PostgreSQL connection string)
   - `JWT_SECRET` (secure random string)

## API Endpoints

### Authentication
- POST `/api/auth/register` - Register a new user
- POST `/api/auth/login` - Login and get JWT token
- GET `/api/auth/profile` - Get current user profile

### Courses
- GET `/api/cursos` - List all courses
- GET `/api/cursos/:id` - Get course details
- POST `/api/cursos` - Create a new course (admin only)
- PUT `/api/cursos/:id` - Update a course (admin only)
- DELETE `/api/cursos/:id` - Delete a course (admin only)

### Enrollments
- GET `/api/inscripciones` - List all enrollments for current user
- POST `/api/inscripciones` - Create a new enrollment
- DELETE `/api/inscripciones/:id` - Delete an enrollment
