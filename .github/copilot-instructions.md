# GitHub Copilot Guide – MediMate Project

## Project Overview
MediMate is a medication management system with web, mobile, and server modules.

- **Web**: React.js (JavaScript)
- **Mobile**: Expo (React Native, TypeScript)
- **Server**: Node.js + Express (JavaScript)
- **Database**: MongoDB
- **Architecture**: REST API with modular feature-based folder structure

---

## Coding Rules
- Follow MediMate **coding standards** and **best practices** as documented.
- Use **camelCase** for variables and **PascalCase** for components.
- All React components should use **functional syntax** and **hooks**.
- Keep imports clean and organized.
- Follow **API naming conventions**: `/api/v1/{module}/{action}`.

---

## Documentation Reference
Attach or reference:
- `developer-documentation.md`
- `coding-standards.md`
## Copilot instructions — MediMate (concise)

This repo is a modular health product with three main modules: `mobile/` (Expo + TypeScript), `web/` (Vite + React), and `server/` (Node.js + Express + Mongoose). Use the instructions below to keep suggestions conservative and repo-accurate.

Core facts (quick)
- Mobile: Expo + React Native + TypeScript. Routes under `mobile/app/` (e.g. `_layout.tsx`, `(tabs)/index.tsx`). Use `mobile/package.json` scripts (`npm run start|android|ios|web|reset-project`).
- Web: Vite + React (JSX). Entry `web/src/main.jsx`, app `web/src/App.jsx`. Dev: `cd web && npm run dev`.
- Server: Node + Express + Mongoose + JWT. `server/package.json` lists deps but there is no runnable `index.js` scaffold in the repo — check `server/` before assuming a runnable API.

How Copilot should act (high-value rules)
- Follow the project's API pattern: versioned REST routes like `/api/v1/{module}` and keep controllers/services modular (controllers, routes, services, models).
- TypeScript only in `mobile/`. For `web/` and `server/` produce JavaScript unless the task explicitly asks for TS conversion.
- Auth: use JWTs (HttpOnly cookie on web; secure/encrypted storage on mobile). Implement RBAC middleware (roles: patient, caregiver, admin, doctor).
- Notifications: hybrid model — prefer FCM (server + Firebase Admin SDK) for cloud delivery and local device scheduling (AsyncStorage/SQLite) for offline resilience.
- Secrets & env: reference `.env` keys used in docs — e.g. `MONGO_URI`, `JWT_SECRET`, `FIREBASE_CREDENTIALS`, `CLOUDINARY_URL`, `GCP_*` keys. Never hardcode secrets.

Concrete commands & files to reference
- Mobile dev: cd mobile && npm run start (or `npm run android|ios|web`). Reset: `npm run reset-project` (runs `mobile/scripts/reset-project.js`).
- Web dev: cd web && npm run dev. Lint: `npm run lint` in `web/` and `mobile/`.
- Server: confirm `server/index.js` exists. If scaffolding, use `server/index.js`, `/server/routes/`, `/server/controllers/`, `/server/models/` and add a `start` script in `server/package.json` (e.g., "start": "node index.js").
- Important docs: `docs/MEDIMATE DEVELOPER DOCUMENTATION.docx` contains full architecture, API, env examples and security rules — consult it for behavioral/PII rules and HIPAA/GDPR guidance.

Examples to follow
- Axios wrapper for frontend calls: use baseURL from env `API_BASE_URL` and attach JWT from secure storage (HttpOnly cookie on web is preferred).
- RBAC middleware pattern: authorizeRoles(...roles) that checks `req.user.role` and returns 403 if unauthorized.

Safety & compliance
- Always follow encryption and privacy guidance in `docs/` (PHI must be encrypted, retention rules, consent for caregiver sharing). Prefer minimal scope changes that don't alter security postures.

If unsure
- Ask: Do you want me to scaffold `server/index.js` + a minimal health route and add a `start` script? Or only update docs/README under `server/` describing required env vars (MONGO_URI, JWT_SECRET, FIREBASE_CREDENTIALS)?

End of concise guidance — refer to `docs/MEDIMATE DEVELOPER DOCUMENTATION.docx` for full spec.
— End of Copilot guidance —
