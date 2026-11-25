# Secure Note-Taking Application

A RESTful note-taking application built with Node.js, Express.js, MongoDB, and Mongoose. It provides secure JWT authentication, role-based access control, and note management.

## Features

- JWT-based Authentication
- Secure Password Hashing
- Role-Based Access Control (User & Admin)
- Create, Read, Update, and Delete Notes
- Admin User Management
- Admin Access to All Notes
- Public Posts
- Pagination
- MongoDB Indexing
- MongoDB Aggregation

## Technology Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcrypt / bcryptjs

## Installation & Setup

**1. Clone the repository**

```bash
git clone <repository-url>
cd <project-folder>
```

**2. Install dependencies**

```bash
npm install
```

**3. Configure Environment Variables**

Create a `.env` file in the root directory.

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

**4. Start the server**

```bash
npm run dev
```

Server URL: `http://localhost:5000`

## API Endpoints

Base URL: `/api/v1`

### Authentication

| Method | Endpoint | Description |
|---|---|---|
| POST | `/auth/register` | Register a user |
| POST | `/auth/login` | Login and receive JWT |
| GET | `/auth/me` | Get current user profile |

### Notes

| Method | Endpoint | Access |
|---|---|---|
| POST | `/notes` | User |
| GET | `/notes?page=1&limit=10` | User / Admin |
| GET | `/notes/:id` | Owner / Admin |
| PUT | `/notes/:id` | Owner / Admin |
| DELETE | `/notes/:id` | Owner / Admin |

### Users (Admin)

| Method | Endpoint | Description |
|---|---|---|
| GET | `/users?page=1&limit=10` | List all users |
| GET | `/users/:id` | Get user by ID |
| POST | `/users` | Create user |
| PUT | `/users/:id` | Update user |
| DELETE | `/users/:id` | Delete user |
| GET | `/users/interests/groups` | Group users by interests |

### Posts

| Method | Endpoint | Description |
|---|---|---|
| POST | `/posts` | Create a post |
| GET | `/posts` | Get public posts |
| GET | `/posts/:userId/posts` | Get posts by user |

## Role-Based Permissions

**User**
- Create, view, update, and delete own notes.

**Admin**
- All User permissions.
- Create, update, delete, and list users.
- View everyone's notes.

## Database Indexing & Optimization

Indexes are explicitly defined using Mongoose's `schema.index()` method.

- Notes: Supports user-based filtering and pagination.
- Users: Supports admin user listing and pagination.
- Posts: Supports user-based post retrieval.
- Aggregation: Indexes support relevant matching and lookup operations.

Only necessary indexes are created to avoid redundant indexing.

## MongoDB Aggregation

### 1. Group Users by Interests

**Endpoint:** `GET /users/interests/groups`

Uses exactly one `User.aggregate()` call with:

- `$unwind` – separates user interests.
- `$group` – groups users by interest.

### 2. Retrieve User Posts

**Endpoint:** `GET /posts/:userId/posts`

Uses a single aggregation pipeline with `$lookup` to retrieve posts belonging to a particular user.

An index on the post's user reference field supports efficient lookup.

## Security

- Passwords are hashed before storing in MongoDB.
- JWT protects private API routes.
- Role-based middleware handles authorization.
- Users can only access and modify their own notes.
- Admins have additional management permissions.
- Sensitive environment variables are not committed to GitHub.

## Pagination

List operations support pagination using:

```text
?page=1&limit=10
```

This reduces unnecessary database reads and improves API performance.
