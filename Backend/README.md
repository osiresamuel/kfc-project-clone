# Backend setup

1. Install dependencies with `npm install`.
2. Copy `.env.example` to `.env`.
3. Set `DATABASE` to a reachable MongoDB connection string and set `SECRET_KEY` to a long, random value. Existing deployments using `SECRET_SESSION` remain supported.
4. Set `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` to enable payments. Payment endpoints return `503` until both are configured.
5. Run `npm start` (or `npm run dev` during development).

The API listens on port `8080` by default. Set `PORT` to change it and `FRONTEND_ORIGIN` to configure the allowed frontend origin(s), separated by commas. `/health` reports whether the API process is running and MongoDB is connected. The HTTP server starts even when MongoDB is unavailable, retries the connection, and returns `503` from database-backed routes until the database is ready.
