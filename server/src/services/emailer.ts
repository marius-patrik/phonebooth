import nodemailer from 'nodemailer';
import { config } from '../config.js';

// Create reusable transporter
let transporter: nodemailer.Transporter | null = null;

function getTransporter() {
  if (transporter) return transporter;

  // If no SMTP config, use Ethereal (fake SMTP for testing)
  if (!config.smtpHost || !config.smtpUser) {
    console.warn(
      '⚠️  No SMTP configuration found. Emails will be logged to console only.',
    );
    console.warn(
      '💡 Set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS in .env to send real emails.',
    );
    return null;
  }

  transporter = nodemailer.createTransport({
    host: config.smtpHost,
    port: config.smtpPort,
    secure: config.smtpSecure, // true for 465, false for other ports
    auth: {
      user: config.smtpUser,
      pass: config.smtpPass,
    },
  });

  console.log(`Email service initialized with ${config.smtpHost}`);
  return transporter;
}

interface SendAuthCodeParams {
  to: string;
  code: string;
}

export async function sendAuthCode({ to, code }: SendAuthCodeParams) {
  const transport = getTransporter();

  const mailOptions = {
    from: config.smtpFrom || config.smtpUser,
    to,
    subject: 'Your Phonebooth Authentication Code',
    text: `Your authentication code is: ${code}\n\nThis code will expire in 15 minutes.\n\nIf you didn't request this code, please ignore this email.`,
    html: `
			<div>
				<h2>Phonebooth Authentication</h2>
				<p>Your authentication code is:</p>
				<div>
					${code}
				</div>
				<p>This code will expire in 15 minutes.</p>
				<p>If you didn't request this code, please ignore this email.</p>
			</div>
		`,
  };

  // If no transporter configured, just log to console
  if (!transport) {
    console.log('\nEMAIL');
    console.log(`To: ${to}`);
    console.log(`Subject: ${mailOptions.subject}`);
    console.log(`Code: ${code}`);
    console.log('\n');
    return { messageId: 'console-mode', preview: null };
  }

  // Send actual email
  try {
    const info = await transport.sendMail(mailOptions);
    console.log(`Email sent to ${to}: ${info.messageId}`);

    // If using Ethereal, log preview URL
    const previewUrl = nodemailer.getTestMessageUrl(info);
    if (previewUrl) {
      console.log(`Preview URL: ${previewUrl}`);
    }

    return { messageId: info.messageId, preview: previewUrl };
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send authentication email');
  }
}
