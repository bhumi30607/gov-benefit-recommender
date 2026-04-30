# Life Event Based Government Benefit Recommender

Full-stack React and Node.js application for discovering welfare schemes based on life events, income, age, and occupation.

## Project structure

- `backend/` Express, MongoDB, JWT auth, Multer-based local image upload, Nodemailer OTP/reset flows
- `frontend/` React Router app with signup, login, recommender, profile, and admin pages

## Quick start

1. Copy `backend/.env.example` to `backend/.env`
2. Copy `frontend/.env.example` to `frontend/.env`
3. Install dependencies in both folders:
   - `cd backend && npm install`
   - `cd frontend && npm install`
4. Run the apps:
   - `cd backend && npm run dev`
   - `cd frontend && npm run dev`

## Included pages

- Home / Dashboard
- Signup
- Login
- Benefit Recommender
- Profile
- Admin Dashboard

## Key backend folders

- `src/controllers`
- `src/routes`
- `src/models`
- `src/middleware`
- `src/utils`
- `src/services`

## Key frontend folders

- `src/pages`
- `src/components`
- `src/routes`
- `src/context`
- `src/api`
- `src/styles`
