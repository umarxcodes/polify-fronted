# Pollify frontend

Pollify is a responsive React + Vite client for creating, discovering, and voting on polls. It communicates with the deployed Pollify API and keeps refresh-token cookies out of JavaScript.

## Setup

```bash
yarn install
cp .env.example .env
yarn dev
```

The default API URL is `https://polling-backend-three.vercel.app/api/v1`; override `VITE_API_BASE_URL` in `.env` when working against another API.

## Scripts

```bash
yarn dev       # start Vite development server
yarn build     # production build
yarn lint      # lint source files
yarn test      # run component tests
```

## Included flows

- Cookie-based authentication with silent access-token refresh and CSRF header support
- Registration, email verification, login, password reset, and protected routes
- Poll feed, creation, detail views, voting, search, bookmarking, notifications, and profile screens
- Admin-only dashboard route and reusable loading, error, and empty states
