# University Campus Guide - Full Stack Project

A full-stack MERN campus guide web application with user authentication, campus location data, and map view.

## Tech Stack

- React.js
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcrypt
- Leaflet / React Leaflet

## Features

- User signup and login
- Password hashing
- JWT authentication
- Campus location listing
- Interactive map view
- Backend MVC structure

## Project Structure

```txt
campus-guide/backend   - Backend code
frontend               - Frontend code
```

## How to Run

### Backend

```bash
cd campus-guide/backend
npm install
npm run dev
```

If `npm run dev` does not work:

```bash
node server.js
```

### Frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

## Environment Variables

Create a `.env` file inside:

```txt
campus-guide/backend/.env
```

Add:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=3000
```

## Main API Endpoints

```txt
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
GET  /api/places
```

## Note

`.env` and `node_modules` are not uploaded for security and size reasons.

## Author

Abbireddy Sameer
