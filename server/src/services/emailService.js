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
      <p>Your profile was updated successfully. If this wasn't you, please contact support immediately.</p>
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

// 🚨 SEND SAFETY ALERT EMAIL
export async function sendSafetyAlertEmail({ user, profile, message, alertType }) {
  try {
    const toEmail = normalizeEmail(user?.email);
    if (!toEmail) {
      console.warn('No recipient email for safety alert; skipping.');
      return null;
    }

    const html = `
      <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
        <!-- Alert Header -->
        <div style="background: linear-gradient(135deg, #dc2626 0%, #ef4444 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">⚠️ URGENT SAFETY ALERT</h1>
          <p style="color: #fee; margin: 10px 0 0 0; font-size: 14px;">Tourist Safety System - Immediate Action Required</p>
        </div>

        <!-- Alert Body -->
        <div style="background-color: #fff3f3; padding: 30px; border-left: 5px solid #dc2626; border-right: 5px solid #dc2626;">
          <p style="font-size: 18px; color: #1f2937; margin: 0 0 20px 0;">Dear <strong>${profile?.fullName || user?.name || 'Tourist'}</strong>,</p>
          
          <div style="background-color: #fee2e2; border-left: 4px solid #dc2626; padding: 20px; margin: 20px 0; border-radius: 5px;">
            <h2 style="color: #991b1b; margin: 0 0 15px 0; font-size: 20px;">⚠️ ${alertType || 'SAFETY WARNING'}</h2>
            <p style="font-size: 16px; color: #1f2937; line-height: 1.6; margin: 0;">
              ${message || 'You have been marked as UNSAFE by authorities. Please take immediate action and contact emergency services if needed.'}
            </p>
          </div>

          ${profile?.touristId ? `
          <div style="background-color: #f3f4f6; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p style="margin: 5px 0; color: #4b5563;"><strong>Tourist ID:</strong> ${profile.touristId}</p>
            <p style="margin: 5px 0; color: #4b5563;"><strong>Alert Time:</strong> ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</p>
            <p style="margin: 5px 0; color: #4b5563;"><strong>Location:</strong> ${profile.hotelName || 'Not specified'}</p>
          </div>
          ` : ''}
        </div>

        <!-- Emergency Contacts -->
        <div style="background-color: #fef3c7; padding: 25px; border-left: 5px solid #f59e0b; border-right: 5px solid #f59e0b;">
          <h3 style="color: #92400e; margin: 0 0 15px 0; font-size: 18px;">📞 EMERGENCY CONTACTS</h3>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
            <div style="background: white; padding: 10px; border-radius: 5px;">
              <p style="margin: 0; color: #78350f; font-weight: bold;">🚨 Police</p>
              <p style="margin: 5px 0 0 0; font-size: 20px; color: #92400e; font-weight: bold;">100</p>
            </div>
            <div style="background: white; padding: 10px; border-radius: 5px;">
              <p style="margin: 0; color: #78350f; font-weight: bold;">🚑 Ambulance</p>
              <p style="margin: 5px 0 0 0; font-size: 20px; color: #92400e; font-weight: bold;">102</p>
            </div>
            <div style="background: white; padding: 10px; border-radius: 5px;">
              <p style="margin: 0; color: #78350f; font-weight: bold;">🔥 Fire</p>
              <p style="margin: 5px 0 0 0; font-size: 20px; color: #92400e; font-weight: bold;">101</p>
            </div>
            <div style="background: white; padding: 10px; border-radius: 5px;">
              <p style="margin: 0; color: #78350f; font-weight: bold;">👮 Tourist Helpline</p>
              <p style="margin: 5px 0 0 0; font-size: 20px; color: #92400e; font-weight: bold;">1363</p>
            </div>
          </div>
          ${profile?.emergencyContactName && profile?.emergencyContactPhone ? `
          <div style="background: white; padding: 15px; border-radius: 5px; margin-top: 15px; border: 2px solid #f59e0b;">
            <p style="margin: 0; color: #78350f; font-weight: bold;">👨‍👩‍👧‍👦 Your Emergency Contact</p>
            <p style="margin: 5px 0 0 0; font-size: 16px; color: #92400e;">
              <strong>${profile.emergencyContactName}</strong><br>
              📞 ${profile.emergencyContactPhone}
            </p>
          </div>
          ` : ''}
        </div>

        <!-- Action Button -->
        <div style="background-color: #f9fafb; padding: 25px; text-align: center; border-radius: 0 0 10px 10px; border-left: 5px solid #6b7280; border-right: 5px solid #6b7280; border-bottom: 5px solid #6b7280;">
          <a href="${process.env.PUBLIC_APP_URL || 'http://localhost:3000'}/tourist/emergency" 
             style="display: inline-block; background-color: #dc2626; color: white; padding: 15px 40px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">
            🆘 VIEW EMERGENCY HELP
          </a>
          <p style="margin: 15px 0 0 0; color: #6b7280; font-size: 12px;">
            This is an automated alert from Tourist Safety System<br>
            Please do not reply to this email
          </p>
        </div>
      </div>
    `;

    const result = await sendMail({
      from: `"🚨 Tourist Safety Alert" <${process.env.EMAIL_USER || process.env.AUTHORITY_EMAIL}>`,
      to: toEmail,
      subject: `🚨 URGENT: ${alertType || 'Safety Alert'} - Immediate Action Required`,
      html
    });
    
    console.log('Safety alert email sent to:', toEmail);
    return result;
  } catch (err) {
    console.error('Safety alert email error:', err);
    return null;
  }
}
// ...existing code...