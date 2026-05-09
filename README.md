# Account Detail Viewer

A frontend assessment project built with **Next.js** and **TypeScript**. The app fetches user account data from a public REST API and displays it across a list view and a detail view, with a live search feature to filter accounts.

---

## Features

- **Account List** — Displays all user accounts fetched from the JSONPlaceholder API
- **Account Detail** — Click any account to view its full details on a dedicated page
- **Search** — Filter accounts in real time by name or other fields
- **Unit Tests** — Core functionality covered with Jest

---

## Tech Stack

- [Next.js](https://nextjs.org/) (App Router)
- TypeScript
- CSS Modules
- Jest + React Testing Library
- [JSONPlaceholder API](https://jsonplaceholder.typicode.com/)

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
git clone https://github.com/Lunaristt/account-detail-viewer.git
cd account-detail-viewer
npm install
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Run Tests

```bash
npm test
```

---

## Project Structure

```
app/
├── page.tsx          # Account list view with search
├── [id]/
│   └── page.tsx      # Account detail view
__tests__/            # Unit tests
public/               # Static assets
```

---

## API Reference

Data is fetched from [JSONPlaceholder](https://jsonplaceholder.typicode.com/):

- `GET /users` — Returns list of all user accounts
- `GET /users/:id` — Returns details for a specific user
