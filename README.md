# Open Music Platform

A production-grade music NFT platform frontend built with modern web technologies.

## Tech Stack

- **Framework**: React 19 via Vite
- **Language**: TypeScript (Strict Mode)
- **Styling**: Tailwind CSS v3
- **Routing**: TanStack Router v1
- **State Management**: Zustand v5 + TanStack Query v5
- **Auth**: Privy
- **Icons**: Lucide React

## Project Structure

```
src/
├── components/     # Reusable UI components
├── features/       # Feature-based modules (Home, Player, etc.)
├── lib/           # Utilities, API clients, hooks
├── routes/        # Route definitions
├── store/         # Global state (Zustand)
├── types/         # TypeScript definitions
└── styles/        # Global styles
```

## getting Started

1. **Install Dependencies**

   ```bash
   pnpm install
   ```

2. **Run Development Server**

   ```bash
   pnpm dev
   ```

3. **Build for Production**
   ```bash
   pnpm build
   ```

## Design System

The project uses a custom Tailwind configuration implementing a "Dark Mode" aesthetic with:

- Primary Background: #000000
- Secondary Background: #0a0a0a
- Accent Color: #6B46C1 (Purple)
- Font: Inter (UI) & Roboto (Headings)

## Features

- **Responsive Layout**: Collapsible sidebar, persistent player.
- **Player**: Global audio player state with mock controls.
- **Routing**: File-based routing setup ready for expansion.
- **Mock Data**: Realistic data for artists, albums, and tracks.
