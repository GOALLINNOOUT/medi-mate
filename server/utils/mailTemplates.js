// mailTemplates.js
// Build email subjects/plain-text/html bodies for various notification emails.
// Keep this file free of transport logic so controllers can decide how to send.

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function buildVerificationEmail(user, verificationUrl, token) {
  const fromName = 'MediMate';
  const subject = 'Verify your MediMate account';

  const text = `Hi ${user.firstName || ''},\n\nPlease verify your MediMate account by visiting the following link:\n${verificationUrl}\n\nIf you didn't request this, please ignore this email.`;

  const html = `
  <!doctype html>
  <html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
      body { margin:0; padding:0; -webkit-font-smoothing:antialiased; -webkit-text-size-adjust:none; }
      table { border-collapse:collapse; }
      img { border:0; display:block; }
      :root {
        --bg: #F3F4F6; --surface: #ffffff; --text: #0F1724; --muted: #6B7280; --primary: #2D9CDB; --primary-strong: #1B74B8; --radius: 12px;
      }
      @media (prefers-color-scheme: dark) {
        :root { --bg: #0F172A; --surface: #1E293B; --text: #F9FAFB; --muted: #9CA3AF; --primary: #56CCF2; --primary-strong: #2EA6E6; }
      }
      .email-wrapper { background-color: var(--bg); width:100%; padding:32px 16px; }
      .email-content { max-width:600px; margin:0 auto; background:var(--surface); border-radius:var(--radius); padding:28px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; color:var(--text); }
      .brand { font-weight:700; color:var(--primary); font-size:20px; text-decoration:none }
      .heading { font-size:22px; font-weight:700; margin:8px 0 12px; }
      .lead { font-size:16px; line-height:1.5; margin:0 0 18px; color:var(--text); }
      .muted { color:var(--muted); font-size:13px; }
      .button { display:inline-block; background:var(--primary); color:#fff; padding:12px 20px; border-radius:8px; text-decoration:none; font-weight:600; }
      .button:active { background:var(--primary-strong); }
      .footer { font-size:12px; color:var(--muted); margin-top:20px; }
      .token { word-break:break-all; background:rgba(0,0,0,0.03); padding:8px 10px; border-radius:8px; display:inline-block; font-family:monospace; font-size:13px; color:var(--muted); }
      @media (max-width:420px) { .email-content { padding:18px; } .heading { font-size:20px; } .lead { font-size:15px; } }
    </style>
  </head>
  <body>
    <div class="email-wrapper">
      <div class="email-content">
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px;">
          <div style="width:48px;height:48px;border-radius:10px;background:linear-gradient(135deg,var(--primary),var(--primary-strong));display:flex;align-items:center;justify-content:center;color:#fff;font-weight:700;font-size:18px;">MM</div>
          <div>
            <div class="brand">MediMate</div>
            <div class="muted" style="margin-top:2px;font-size:13px;">Account verification</div>
          </div>
        </div>

        <h1 class="heading">Verify your email</h1>
        <p class="lead">Hi ${user.firstName ? `${escapeHtml(user.firstName)}` : ''},<br/>Thanks for creating a MediMate account. To complete your registration, please verify your email address by clicking the button below.</p>

        <p style="text-align:center;margin:18px 0;">
          <a class="button" href="${verificationUrl}" target="_blank" rel="noopener">Verify my email</a>
        </p>

        <p class="muted" style="margin-bottom:6px;text-align:center">If the button doesn't work, copy and paste this link into your browser:</p>
        <p style="word-break:break-all;font-size:13px;text-align:center;color:var(--primary);margin:0 0 12px">${verificationUrl}</p>

        <div style="margin-top:6px">Alternatively use this verification token:</div>
        <div style="margin-top:8px"><span class="token">${escapeHtml(token)}</span></div>

        <p class="footer">If you didn't create an account with us, you can safely ignore this email. For help, reply to this message or visit our <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}" style="color:var(--primary)">website</a>.</p>
      </div>
    </div>
  </body>
  </html>
  `;

  return { subject, text, html };
}

module.exports = {
  buildVerificationEmail
};

function buildPasswordResetEmail(user, resetUrl, token) {
  const fromName = 'MediMate';
  const subject = 'Reset your MediMate password';

  const text = `Hi ${user.firstName || ''},\n\nWe received a request to reset your MediMate password. You can reset it by visiting the following link:\n${resetUrl}\n\nIf you didn't request a password reset, you can safely ignore this message.`;

  const html = `
  <!doctype html>
  <html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
      body { margin:0; padding:0; -webkit-font-smoothing:antialiased; -webkit-text-size-adjust:none; }
      table { border-collapse:collapse; }
      img { border:0; display:block; }
      :root {
        --bg: #F3F4F6; --surface: #ffffff; --text: #0F1724; --muted: #6B7280; --primary: #2D9CDB; --primary-strong: #1B74B8; --radius: 12px;
      }
      .email-wrapper { background-color: var(--bg); width:100%; padding:32px 16px; }
      .email-content { max-width:600px; margin:0 auto; background:var(--surface); border-radius:var(--radius); padding:28px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; color:var(--text); }
      .brand { font-weight:700; color:var(--primary); font-size:20px; text-decoration:none }
      .heading { font-size:22px; font-weight:700; margin:8px 0 12px; }
      .lead { font-size:16px; line-height:1.5; margin:0 0 18px; color:var(--text); }
      .muted { color:var(--muted); font-size:13px; }
      .button { display:inline-block; background:var(--primary); color:#fff; padding:12px 20px; border-radius:8px; text-decoration:none; font-weight:600; }
      .token { word-break:break-all; background:rgba(0,0,0,0.03); padding:8px 10px; border-radius:8px; display:inline-block; font-family:monospace; font-size:13px; color:var(--muted); }
      .footer { font-size:12px; color:var(--muted); margin-top:20px; }
      @media (max-width:420px) { .email-content { padding:18px; } .heading { font-size:20px; } .lead { font-size:15px; } }
    </style>
  </head>
  <body>
    <div class="email-wrapper">
      <div class="email-content">
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px;">
          <div style="width:48px;height:48px;border-radius:10px;background:linear-gradient(135deg,var(--primary),var(--primary-strong));display:flex;align-items:center;justify-content:center;color:#fff;font-weight:700;font-size:18px;">MM</div>
          <div>
            <div class="brand">MediMate</div>
            <div class="muted" style="margin-top:2px;font-size:13px;">Password reset</div>
          </div>
        </div>

        <h1 class="heading">Reset your password</h1>
        <p class="lead">Hi ${user.firstName ? `${escapeHtml(user.firstName)}` : ''},<br/>We received a request to reset your MediMate password. Click the button below to reset it. This link will expire in 1 hour.</p>

        <p style="text-align:center;margin:18px 0;">
          <a class="button" href="${resetUrl}" target="_blank" rel="noopener">Reset password</a>
        </p>

        <p class="muted" style="margin-bottom:6px;text-align:center">If the button doesn't work, copy and paste this link into your browser:</p>
        <p style="word-break:break-all;font-size:13px;text-align:center;color:var(--primary);margin:0 0 12px">${resetUrl}</p>

        <div style="margin-top:6px">Alternatively use this reset token:</div>
        <div style="margin-top:8px"><span class="token">${escapeHtml(token)}</span></div>

        <p class="footer">If you didn't request a password reset, you can safely ignore this email. For help, reply to this message or visit our <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}" style="color:var(--primary)">website</a>.</p>
      </div>
    </div>
  </body>
  </html>
  `;

  return { subject, text, html };
}

module.exports = {
  buildVerificationEmail,
  buildPasswordResetEmail
};
