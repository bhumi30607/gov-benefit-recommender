# Life Event Based Government Benefit Recommender

Full-stack React and Node.js application for discovering welfare schemes based on life events, income, age, and occupation.

## Project structure

- `backend/` Express, MongoDB, JWT auth, Multer-based local image upload, Nodemailer OTP/reset flows
- `frontend/` React Router app with signup, login, recommender, profile, and admin pages

## Quick start

1. Copy `backend/.env.example` to `backend/.env`
2. Copy `frontend/.env.example` to `frontend/.env`
3. Start MongoDB locally on your machine.
   - Default local connection used by this project:
     `mongodb://127.0.0.1:27017/gov-benefit-recommender`
   - MongoDB Atlas is not required for local development.
4. Install dependencies in both folders:
   - `cd backend && npm install`
   - `cd frontend && npm install`
5. Run the apps:
   - `cd backend && npm run dev`
   - `cd frontend && npm run dev`

## Database setup

- The backend uses MongoDB through Mongoose.
- For local development, set `MONGODB_URI` in `backend/.env` to:
  `mongodb://127.0.0.1:27017/gov-benefit-recommender`
- If `MONGODB_URI` is missing, the backend falls back to the same local MongoDB URL automatically.
- The app cannot run without some MongoDB instance, but it does not need MongoDB Atlas specifically.

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
