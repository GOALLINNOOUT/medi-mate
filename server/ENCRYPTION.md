# MediMate Server — Encryption Policy (summary)

This document summarizes encryption scope, classification, and recommended implementation for the MediMate server module.

1. Encryption Scope

Encryption applies to all personally identifiable information (PII), protected health information (PHI), and authentication data that could compromise user security or confidentiality. Non-sensitive operational data may be stored unencrypted to improve performance and maintain usability.

2. Data Classification

- Sensitive Data — Information that can directly or indirectly identify a user or reveal medical history. Encryption: Mandatory (AES-256 or equivalent).
- Confidential Data — Internal platform records or analytics with limited exposure risk. Encryption: Conditional or pseudonymized encryption.
- Public / Non-Sensitive Data — Reference or operational data unrelated to user identity or health. Encryption: Stored as plain data.

3. Data Requiring Encryption (high level)

- Authentication Data: Passwords, OTP codes, tokens — One-way hash (bcrypt ≥12). Never store plain credentials. Use salting.
- Personal Identifiers (PII): Full name, phone number, email, date of birth, gender, address — AES-256 at rest + TLS 1.3 in transit. Store in encrypted DB fields where practical.
- Medical Records (PHI): Prescriptions, medication logs, doctor notes, allergy info — AES-256 encryption. Restrict access via RBAC.
- Device / Session Data: API tokens, FCM tokens, biometric signatures — AES-256 or tokenization. Keep only for active sessions.
- Payment Information: Tokenize and use PCI-compliant gateway. Do not store full card numbers in MediMate.
- Media / Files: Uploaded reports, ID images — Encrypted cloud storage (S3 + KMS). Decrypt only on authorized requests.
- Caregiver–Patient Chats: Messages, attachments, voice notes — End-to-end or DB encryption depending on feature needs.

4. Implementation notes & recommendations

- Passwords: Use bcrypt with a work factor >= 12. This repo updates user hashing to bcrypt(12).
- Field encryption: Use a well-tested AES-256-GCM implementation (see `server/utils/encryption.js`). Keep keys out of source. Use KMS (AWS KMS, GCP KMS, Azure Key Vault) where possible and rotate keys regularly.
- Transport: Enforce TLS 1.3 for all external connections (frontend ↔ server, server ↔ 3rd party APIs).
- Storage: For files, use cloud object storage with server-side encryption and KMS-wrapped keys. Avoid storing sensitive files unencrypted.
- Token handling: Store short-lived access tokens in HttpOnly secure cookies and refresh tokens in secure HttpOnly cookies.
- Logging: Never log full PII/PHI values. Redact or pseudonymize in logs and error traces.

5. Required environment variables (suggested)

- ENCRYPTION_KEY — base64 or hex-encoded 32-byte key used by `server/utils/encryption.js`. Prefer KMS-managed keys instead of raw env values in production.
- JWT_SECRET, JWT_REFRESH_SECRET — for token signing.
- MONGO_URI, FIREBASE_CREDENTIALS, CLOUDINARY_URL — as before.

6. Next steps / Notes

- Integrate field-level encryption into models for PII/PHI fields (selective). Avoid encrypting fields used for indexing/search unless using searchable encryption or an alternative design (hashing or tokenization).
- Consider adding a key-rotation process and secrets manager integration.
