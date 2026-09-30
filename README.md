# Sahayog

Sahayog is a public procurement and startup enablement platform for the Government of Maharashtra. It models the MSInS / SIH 26136 procurement highway with role-based portals for departments, startups, evaluators, and administrators.

## Features

- Department challenge and workflow management
- Startup application, milestone, and pilot tracking
- Evaluator scoring and review flows
- Admin command center and compliance oversight
- AI-assisted challenge generation and evaluation support

## Tech Stack

- React + TypeScript + Vite
- Express.js server
- Prisma + PostgreSQL
- Tailwind CSS
- Google GenAI

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy environment variables:
   ```bash
   cp .env.example .env
   ```
3. Update the configuration in `.env` with your database and API keys.
4. Start the app in development mode:
   ```bash
   npm run dev
   ```
5. Build for production:
   ```bash
   npm run build
   ```

## Environment Variables

The project expects:

- `DATABASE_URL`
- `GEMINI_API_KEY`
- `APP_URL`

See `.env.example` for the required template.

## Project Structure

- `src/` — frontend application
- `prisma/` — Prisma schema and seed scripts
- `server.ts` — Express backend entry point
- `public/` — static assets

## License

This project is intended for internal / institutional use and should be configured according to your organization’s policies before deployment.
