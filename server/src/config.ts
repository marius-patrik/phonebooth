import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Load environment variables from .env file
function loadEnv() {
  try {
    const envPath = join(__dirname, '..', '.env');
    const envFile = readFileSync(envPath, 'utf-8');

    for (const line of envFile.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;

      const [key, ...valueParts] = trimmed.split('=');
      const value = valueParts.join('=').trim();

      if (key && value && !process.env[key]) {
        process.env[key] = value;
      }
    }
  } catch (error) {
    console.warn('Warning: .env file not found, using environment variables');
  }
}

// Load .env on module initialization
loadEnv();

// Export configuration with defaults
export const config = {
  jwtSecret: process.env.JWT_SECRET || 'your-secure-secret-key',
  databasePath: process.env.DATABASE_PATH || ':memory:',

  // Email configuration
  smtpHost: process.env.SMTP_HOST,
  smtpPort: Number.parseInt(process.env.SMTP_PORT || '587'),
  smtpSecure: process.env.SMTP_SECURE === 'true', // true for 465, false for 587
  smtpUser: process.env.SMTP_USER,
  smtpPass: process.env.SMTP_PASS,
  smtpFrom: process.env.SMTP_FROM, // Optional: custom "From" address
} as const;

// Validate critical configuration
if (config.jwtSecret === 'your-secure-secret-key') {
  console.warn(
    '⚠️  WARNING: Using default JWT secret. Set JWT_SECRET in .env file for production!',
  );
}
