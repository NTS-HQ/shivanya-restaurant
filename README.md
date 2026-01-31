# Shivanya Restaurant Web App

A complete full-stack restaurant management and ordering system.

## Features
- **Customer**: Browse menu, Add to Cart, Order (Dine-in/Takeaway/Delivery), Track Order.
- **Admin**: Dashboard stats, Manage Orders (Accept/Reject/Deliver), Manage Menu, Settings.
- **Waiter**: POS-like manual order entry.

## Tech Stack
- **Frontend**: React, TypeScript, Vite, Tailwind CSS
- **Backend**: Node.js, Express, PostgreSQL
- **Database**: PostgreSQL

## Installation

1. **Clone the repository**
2. **Install Dependencies**
   ```sh
   npm run install-all
   ```

3. **Environment Setup**
   - Create `backend/.env` based on `backend/.env.example`.
   - Ensure you have a PostgreSQL database URL.

4. **Run Locally**
   ```sh
   npm run dev
   ```
   This will start both backend (Port 5000) and frontend (Port 5173).

## Deployment (Railway)
1. Push to GitHub.
2. Link repo to Railway.
3. Add `DATABASE_URL` and `JWT_SECRET` variable in Railway.
4. Railway will auto-detect `railway.json` and deploy.

## Admin Setup
On first run, navigate to `/admin/setup` to create the initial admin account.
