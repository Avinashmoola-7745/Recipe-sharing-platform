# Recipe Sharing Platform

A fullstack recipe sharing app where users can post, browse, and search recipes.

## Tech Stack

- Frontend: React.js
- Backend: Node.js + Express.js
- Database: MongoDB

## Features

- User registration and login with JWT auth
- Post recipes with ingredients, steps, category, cook time, and optional image
- Browse all recipes with search, category filter, and sorting
- Pagination
- Edit and delete your own recipes

## Project Structure

```
recipe-sharing-platform/
  backend/
    models/
    routes/
    controllers/
    middleware/
    server.js
  frontend/
    src/
      components/
      pages/
      context/
```

## Setup

### Backend

```bash
cd backend
npm install
cp .env.example .env
# Fill in your MONGO_URI and JWT_SECRET in .env
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm start
```

Make sure MongoDB is running locally or update MONGO_URI to your Atlas connection string.

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register |
| POST | /api/auth/login | Login |
| GET | /api/auth/me | Get current user |
| GET | /api/recipes | Get all recipes (supports ?search, ?category, ?sort, ?page) |
| GET | /api/recipes/:id | Get single recipe |
| POST | /api/recipes | Create recipe (auth required) |
| PUT | /api/recipes/:id | Update recipe (auth required) |
| DELETE | /api/recipes/:id | Delete recipe (auth required) |
