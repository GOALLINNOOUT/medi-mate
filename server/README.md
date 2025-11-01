# Server (Node.js + Express)

Minimal scaffold for the MediMate server module. This README explains how to run the local server and which environment variables are expected.

Prerequisites
- Node.js (>=18)
- npm (bundled with Node)
- (Optional) MongoDB if you want DB-backed features

Quick start
1. Copy `.env.example` to `.env` and update values.
2. Install dependencies (already done in your environment):

```powershell
cd server
npm install
```

3. Start the server:

```powershell
cd server
npm start
```

Routes
- GET /api/v1/health — returns service health and DB connection status

Important env keys
- MONGO_URI — MongoDB connection string (optional for local dev)
- JWT_SECRET — JWT signing secret
- FIREBASE_CREDENTIALS — path to Firebase service account JSON
- CLOUDINARY_URL — Cloudinary upload configuration
 - ENCRYPTION_KEY — base64 or hex encoded 32-byte key used for field-level AES-256-GCM encryption (see `ENCRYPTION.md`).

Notes on keys and KMS
- Prefer using a cloud KMS (AWS KMS, GCP KMS, Azure Key Vault) to manage and rotate encryption keys instead of setting raw keys in env for production. If you must use env vars for local dev, keep them out of source control and rotate them regularly.

If you want me to expand this scaffold (auth, models, example controllers), tell me which endpoints or models to add next.
