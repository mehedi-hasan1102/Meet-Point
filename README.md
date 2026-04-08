# Meet Point

Meet Point is a modern restaurant ordering web application built with React, TypeScript, and Vite. It includes a customer storefront, cart and checkout flow, authentication-ready account pages, and an admin dashboard UI.

## Features

- Responsive landing page with featured dishes and category-based discovery
- Menu browsing with category filters and product detail pages
- Persistent shopping cart with quantity management and automatic totals
- Checkout and order confirmation flow
- Authentication-ready user account experience (login, register, forgot password, dashboard)
- Admin interface for overview metrics, menu items, and order monitoring
- API abstraction layer prepared for Strapi (currently backed by mock data)

## Tech Stack

- React 18 + TypeScript
- Vite 5
- React Router
- Zustand (persisted auth and cart state)
- TanStack Query
- Axios
- Tailwind CSS + shadcn/ui (Radix UI primitives)
- Vitest + Testing Library

## Getting Started

### Prerequisites

- Node.js 18+ (recommended: latest LTS)
- npm 9+ (or Bun, since `bun.lockb` is present)

### Installation

```bash
git clone <your-repository-url>
cd meet-point
npm install
```

### Run Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

## Environment Variables

Create a `.env` file in the project root:

```bash
VITE_API_URL=http://localhost:1337/api
```

`VITE_API_URL` is optional. If not provided, the app defaults to `http://localhost:1337/api`.

## Available Scripts

- `npm run dev` - Start local development server
- `npm run build` - Build production bundle
- `npm run build:dev` - Build with development mode
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint
- `npm run test` - Run tests once with Vitest
- `npm run test:watch` - Run tests in watch mode

## Project Structure

```text
src/
  components/     # Shared UI, layout, cart, and menu components
  pages/          # Route-level pages (storefront, auth, dashboard, admin)
  store/          # Zustand stores (auth and cart)
  lib/api/        # API client and menu API abstraction
  data/           # Mock menu, order, and user data
  test/           # Vitest setup and sample tests
```

## Notes on Data and Backend

- Current flows use local mock data from `src/data/mock-data.ts`.
- API utilities in `src/lib/api` are structured for easy migration to real backend endpoints.
- Authentication state is persisted locally via Zustand middleware....



npm run build
```


