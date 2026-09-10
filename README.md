# Todo Task Manager

A full-stack Todo Task Manager application built with React, Node.js, Express, and MongoDB.

## Features

- Create a task
- Edit a task
- Delete a task
- Change task status
- Four task columns:
  - TODO
  - IN PROGRESS
  - NEED DECISION
  - DONE
- Add a file to a task
- Store tasks in MongoDB

## Technologies Used

### Frontend
- React
- Vite
- JavaScript
- CSS

### Backend
- Node.js
- Express.js
- Multer
- Mongoose
- CORS
- dotenv

### Database
- MongoDB Atlas

## API Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/tasks` | Get all tasks |
| GET | `/api/tasks/:id` | Get one task |
| POST | `/api/tasks` | Create a task |
| PUT | `/api/tasks/:id` | Update a task |
| PATCH | `/api/tasks/:id/status` | Update task status |
| DELETE | `/api/tasks/:id` | Delete a task |
| POST | `/api/tasks/:id/file` | Upload a file |

## File Upload

Files are uploaded using Multer.

The actual uploaded files are stored in:

```text
backend/uploads/