# InvoiceFlow

A modern React invoice management application inspired by the `tediko/invoice-app` UI, with a complete mocked product flow:
- authentication
- invoices list/detail/create/edit/delete
- profile and settings
- light/dark theme
- responsive sidebar with mobile drawer

## Tech Stack

- React 18
- React Router DOM 6
- Vite 5
- Plain CSS (design-token style variables)
- LocalStorage for mock persistence

## Features

### Authentication (Mock)
- Login
- Register
- Reset password (mock confirmation)
- Protected app routes

### Invoices
- Invoice list page with status filtering
- Dedicated **Create Invoice** page (`/invoices/new`)
- Invoice detail page (`/invoices/:invoiceId`)
- Edit invoice inline on detail page
- Mark as paid
- Delete invoice

### User Area
- Profile page with editable fields
- Settings page:
  - theme toggle
  - mock data export

### UI/UX
- Inspired by the original Invoice App visual style
- Light and dark theme support
- Staggered row animation + page entry motion
- Mobile navigation drawer (open/close)

## Project Structure

```
src/
  components/
  context/
  data/
  pages/
  utils/
  App.jsx
  main.jsx
  styles.css
```

## Getting Started

### 1) Install dependencies

```bash
npm install
```

### 2) Run development server

```bash
npm run dev
```

### 3) Build for production

```bash
npm run build
```

### 4) Preview production build

```bash
npm run preview
```

## Authentication

Use an account that exists in the backend API, or register a new one from the app.

## Routes

### Public
- `/login`
- `/register`
- `/reset-password`

### Protected
- `/dashboard`
- `/invoices`
- `/invoices/new`
- `/invoices/:invoiceId`
- `/profile`
- `/settings`

## Data & Persistence

This project uses the backend API for authentication and invoice creation, then stores the current session and local invoice cache in LocalStorage:

- auth/session
- invoices
- theme preference

The backend currently exposes:

- `POST /api/Auth/register`
- `POST /api/Auth/login`
- `POST /api/Invoice`

Invoice list/detail/edit/delete still run from the local cache until matching backend endpoints are added.

## Notes

- This app is designed as a realistic frontend prototype.
- If you want backend integration, replace context actions with API service calls and keep the same page/component structure.
