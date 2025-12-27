/** biome-ignore-all assist/source/organizeImports: <idc
 * 
> */
import express from 'express';
import { db } from '../../db/index.js';
import jwt from 'jsonwebtoken';
import { config } from '../../config.js';

const router = express.Router();

// Login endpoint
router.post('/api/user/auth', async (req, res) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({ error: 'Code is required' });
    }

    // Convert code to number
    const codeNumber = Number(code);

    if (Number.isNaN(codeNumber)) {
      return res.status(400).json({ error: 'Invalid code format' });
    }

    // Check if the code exists in the database
    const user = await db
      .selectFrom('user')
      .selectAll()
      .where('authCode', '=', codeNumber)
      .executeTakeFirst();

    if (!user) {
      return res.status(401).json({ error: 'Invalid code' });
    }

    // Check if code has expired (created > 15 min ago)
    if (user.authCodeCreated) {
      const createdAt = new Date(user.authCodeCreated);
      const now = new Date();
      const diffMs = now.getTime() - createdAt.getTime();
      if (diffMs > 15 * 60 * 1000) {
        return res.status(401).json({ error: 'Code has expired' });
      }
    }

    // Generate a JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      config.jwtSecret,
      {
        expiresIn: '30d', // Token expires in 30 days
      },
    );

    // Set the token as an HTTP-only cookie
    res.cookie('jwt', token, {
      httpOnly: true, // Prevent JavaScript access
      secure: process.env.NODE_ENV === 'production', // Use HTTPS in production
      sameSite: 'strict', // Prevent CSRF
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days in milliseconds
    });

    // Send a success response
    res.json({ message: 'Login successful' });

    // No longer clear auth code after validation
  } catch (error) {
    console.error('Error during login code validation:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export { router as authRouter };
