// ...existing code...
import { sendMail } from '../config/mailer.js';

function normalizeEmail(e) {
  if (!e) return null;
  return String(e).trim().toLowerCase();
}

export async function sendRegistrationEmail(newUser) {
  try {
    const authorityEmail = normalizeEmail(process.env.AUTHORITY_EMAIL);
    if (!authorityEmail) {
      console.warn('AUTHORITY_EMAIL missing; skipping admin email');
      return null;
    }

    const html = `
      <h1>New Tourist Registration</h1>
      <p>A new tourist has registered on the platform. Details:</p>
      <ul>
        <li><strong>Name:</strong> ${newUser?.name || ''}</li>
        <li><strong>Email:</strong> ${newUser?.email || ''}</li>
        <li><strong>Role:</strong> ${newUser?.role || ''}</li>
        <li><strong>Tourist Type:</strong> ${newUser?.touristType || 'N/A'}</li>
        <li><strong>Country:</strong> ${newUser?.country || 'N/A'}</li>
      </ul>
      <p><a href="${process.env.PUBLIC_APP_URL || 'http://localhost:3000'}/authority/dashboard">Open Authority Dashboard</a></p>
    `;
    const result = await sendMail({
      from: `"Tourist Safety System" <${process.env.EMAIL_USER || authorityEmail}>`,
      to: authorityEmail,
      subject: 'New Tourist Registration Alert',
      html
    });
    console.log('Admin registration email sent (or saved in dev fallback)');
    return result;
  } catch (err) {
    console.error('Admin registration email error:', err);
    return null;
  }
}

export async function sendTouristProfileCompletedEmail({ user, profile }) {
  try {
    const toEmail = normalizeEmail(user?.email);
    if (!toEmail) {
      console.warn('No recipient email for profile-completed email; skipping.');
      return null;
    }

    const html = `
      <h1>Profile Completed Successfully</h1>
      <p>Hi ${profile?.fullName || user?.name || 'Tourist'},</p>
      <p>Your Smart Tourist Profile has been completed successfully.</p>
      ${profile?.touristId ? `<p><strong>Tourist ID:</strong> ${profile.touristId}</p>` : ''}
      <p><a href="${process.env.PUBLIC_APP_URL || 'http://localhost:3000'}/tourist/my-card">Open My Tourist Card</a></p>
    `;
    const result = await sendMail({
      from: `"Tourist Safety System" <${process.env.EMAIL_USER || process.env.AUTHORITY_EMAIL}>`,
      to: toEmail,
      subject: 'Profile Completed Successfully',
      html
    });
    console.log('Tourist profile-completed email sent (or saved in dev fallback)');
    return result;
  } catch (err) {
    console.error('Tourist profile-completed email error:', err);
    return null;
  }
}

export async function sendTouristProfileUpdatedEmail({ user }) {
  try {
    const toEmail = normalizeEmail(user?.email);
    if (!toEmail) {
      console.warn('No recipient email for profile-updated email; skipping.');
      return null;
    }

    const html = `
      <h1>Profile Updated Successfully</h1>
      <p>Hi ${user?.name || 'Tourist'},</p>
      <p>Your profile was updated successfully. If this wasn’t you, please contact support immediately.</p>
      <p><a href="${process.env.PUBLIC_APP_URL || 'http://localhost:3000'}/tourist/profile">Review My Profile</a></p>
    `;
    const result = await sendMail({
      from: `"Tourist Safety System" <${process.env.EMAIL_USER || process.env.AUTHORITY_EMAIL}>`,
      to: toEmail,
      subject: 'Profile Updated Successfully',
      html
    });
    console.log('Tourist profile-updated email sent (or saved in dev fallback)');
    return result;
  } catch (err) {
    console.error('Tourist profile-updated email error:', err);
    return null;
  }
}
// ...existing code...