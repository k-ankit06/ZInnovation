import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';

let cachedTransporter = null;
let smtpMode = false;

export async function initMailerIfNeeded() {
  if (cachedTransporter) return;

  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  // remove accidental spaces if someone pasted the app password with spaces
  const passRaw = process.env.SMTP_PASS;
  const pass = passRaw ? String(passRaw).replace(/\s+/g, '') : undefined;

  if (host && user && pass) {
    try {
      const transporter = nodemailer.createTransport({
        host,
        port: Number(process.env.SMTP_PORT || 587),
        secure: String(process.env.SMTP_SECURE || 'false') === 'true',
        auth: { user, pass }
      });
      await transporter.verify();
      cachedTransporter = transporter;
      smtpMode = true;
      console.log('SMTP transporter ready');
      return;
    } catch (err) {
      // don't crash the app for bad SMTP creds — fall back to dev mode
      console.warn('SMTP init failed, falling back to dev mailer. Error:', err.message || err);
      cachedTransporter = null;
      smtpMode = false;
      return;
    }
  }

  if (host && (!user || !pass)) {
    console.warn('SMTP_HOST is set but SMTP_USER/SMTP_PASS missing or invalid — using dev mailer fallback.');
  } else {
    console.log('No SMTP configured — emails will be logged and saved to server/tmp/emails.log (not actually sent).');
  }
  cachedTransporter = null;
  smtpMode = false;
}

/**
 * sendMail wrapper:
 * - If SMTP configured: sends via SMTP transporter.
 * - Otherwise: logs to console and appends to server/tmp/emails.log + saves a .eml file for inspection.
 *
 * Accepts nodemailer-style options: { to, subject, text, html, from }
 */
export async function sendMail({ to, subject, text = '', html = '', from }) {
  const fromAddr = from || process.env.AUTHORITY_EMAIL || process.env.EMAIL_USER || 'no-reply@example.com';

  if (smtpMode && cachedTransporter) {
    return cachedTransporter.sendMail({ from: fromAddr, to, subject, text, html });
  }

  // Dev fallback: ensure folder exists
  const tmpDir = path.join(process.cwd(), 'server', 'tmp', 'outgoing');
  await fs.promises.mkdir(tmpDir, { recursive: true });

  const timestamp = new Date().toISOString();
  const out = [
    '---',
    `Date: ${timestamp}`,
    `From: ${fromAddr}`,
    `To: ${Array.isArray(to) ? to.join(', ') : to}`,
    `Subject: ${subject}`,
    '',
    'Text:',
    text || '',
    '',
    'HTML:',
    html || '',
    '',
    ''
  ].join('\n');

  // append to a combined log
  const logPath = path.join(process.cwd(), 'server', 'tmp', 'emails.log');
  await fs.promises.appendFile(logPath, out + '\n', 'utf8');

  // save individual .eml for convenience
  const emlName = `email-${Date.now()}.eml`;
  const emlPath = path.join(tmpDir, emlName);
  const emlContent = [
    `From: ${fromAddr}`,
    `To: ${Array.isArray(to) ? to.join(', ') : to}`,
    `Subject: ${subject}`,
    `Date: ${timestamp}`,
    '',
    text || html || ''
  ].join('\n\n');
  await fs.promises.writeFile(emlPath, emlContent, 'utf8');

  // console output
  console.log('[DEV MAILER] Email saved:', { to, subject, emlPath, logPath });

  // return a nodemailer-like fake response
  return { accepted: [to], messageId: `dev-${Date.now()}`, fallback: true };
}

export function getTransporter() {
  if (smtpMode && cachedTransporter) return cachedTransporter;
  throw new Error('Mailer not initialized in SMTP mode. Use sendMail() which supports dev fallback.');
}