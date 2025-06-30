# PostgreSQL Migration and Render Deployment Guide

## Overview
Your application is already set up to support PostgreSQL and deployment on Render. The necessary packages (`pg` and `pg-hstore`) are installed, and the configuration files are ready for both local development and production deployment.

## Configuration Files
- The `db.js` file is already configured to support both local development and Render's PostgreSQL service.
- The `index.js` file is set up to use the dynamic port from the environment variables.
- New test and setup scripts have been created in the `scripts` folder.

## Local Development Setup
1. Ensure PostgreSQL is installed and running locally
2. Create a database named `bd_login` 
3. Update `.env` file with your local PostgreSQL credentials:
   ```
   DB_HOST=localhost
   DB_USER=postgres
   DB_PASSWORD=your_password
   DB_NAME=bd_login
   DB_PORT=5432
   DB_DIALECT=postgres
   JWT_SECRET=your_secret_key
   # Comment out DATABASE_URL for local development
   # DATABASE_URL=...
   PORT=3001
   ```

4. Run the database setup script:
   ```
   npm run setup-database
   ```

5. Start the development server:
   ```
   npm run dev
   ```

## Render Deployment Steps
1. Create a PostgreSQL database on Render
2. Create a new Web Service on Render and connect it to your GitHub repository
3. Configure the Web Service:
   - Build Command: `npm run render-build`
   - Start Command: `npm run render-start`
   - Set the DATABASE_URL environment variable to the PostgreSQL connection string provided by Render
   - Set the JWT_SECRET environment variable to a secure random string

4. Deploy your application

## Frontend Configuration
- Update the `.env.local` file in the frontend project with the correct backend URL:
  ```
  # For local development
  NEXT_PUBLIC_API_URL=http://localhost:3001/api
  ```

- For production, update to your Render backend URL:
  ```
  NEXT_PUBLIC_API_URL=https://your-backend-name.onrender.com/api
  ```

## Verifying Deployment
1. After deployment, verify that your API endpoints are accessible
2. If you encounter any issues, check the Render logs for error messages
3. Ensure the database migration ran successfully by checking for the admin user

## Troubleshooting
- If you encounter connection issues, make sure the database is running and accessible
- Check the environment variables in your Render dashboard
- Verify the SSL settings in the database connection
