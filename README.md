
# Campus Echo Board

A modern notice board system for educational institutions.

## Features

- Role-based access control (admin, teacher, student)
- Teachers can post and delete their own notices
- Students can view notices
- Admin can manage users and notices
- Responsive design for mobile and desktop
- Date filtering for notices
- Important notices highlighting

## Technologies Used

### Frontend
- React
- TypeScript
- Tailwind CSS
- Shadcn/UI Components
- Axios for API communication

### Backend
- Node.js with Express
- TypeScript
- PostgreSQL
- Prisma ORM
- JWT Authentication

## Setup Instructions

### Backend Setup
1. Navigate to the server directory: `cd server`
2. Create a PostgreSQL database
3. Copy `.env.example` to `.env` and update with your database connection string
4. Install dependencies: `npm install`
5. Run database migrations: `npx prisma migrate dev`
6. Start the development server: `npm run dev`

### Frontend Setup
1. In the root directory, install dependencies: `npm install`
2. Make sure the backend server is running
3. Start the development server: `npm run dev`
4. Access the application at: http://localhost:8080

## Default Users

The system will be seeded with these default users:
- Admin: admin@school.edu (password: admin123)
- Teacher: teacher@school.edu (password: teacher123)
- Student: student@school.edu (password: student123)
