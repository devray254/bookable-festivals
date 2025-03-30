
# Maabara Events Backend API

This is the backend API for the Maabara Events platform, handling database operations and providing RESTful endpoints for the frontend.

## Setup Instructions

1. Install dependencies:
   ```
   npm install
   ```

2. Configure environment variables:
   - Copy `.env.example` to `.env`
   - Modify database connection details as needed

3. Start the server:
   ```
   npm run dev
   ```

## API Endpoints

### Health Check
- GET `/api/health` - Check database connection status

### Logs
- GET `/api/logs` - Retrieve all activity logs
- POST `/api/logs` - Create a new log entry

## Database

The server will automatically:
1. Create the database if it doesn't exist
2. Create necessary tables if they don't exist
3. Add a default admin user if none exists

## Database Schema

### activity_logs
- id: INT (Primary Key, Auto Increment)
- timestamp: DATETIME
- action: VARCHAR(100)
- user: VARCHAR(100)
- details: TEXT
- ip: VARCHAR(45)
- level: VARCHAR(20)

### users
- id: INT (Primary Key, Auto Increment)
- name: VARCHAR(100)
- email: VARCHAR(100) (Unique)
- password: VARCHAR(100)
- role: VARCHAR(20)
- organization_type: VARCHAR(50)
