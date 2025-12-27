/** biome-ignore-all assist/source/organizeImports: <idc> */
import express from 'express';
import { db } from '../../db/index.js';
import { sendAuthCode } from '../../services/emailer.js';

const router = express.Router();

const generateCode = () => Math.random().toString().substring(2, 8);

router.post('/api/user/email', async (req, res) => {
  try {
    const { email } = req.body;

    // Check if the user exists in the database
    const user = await db
      .selectFrom('user')
      .selectAll()
      .where('email', '=', email)
      .executeTakeFirst();

    const authCode = generateCode();
    const createdAt = new Date().toISOString();

    if (!user) {
      // Create new user with default values
      await db
        .insertInto('user')
        .values({
          email,
          balance: 0,
          currency: 'USD',
          displayCurrency: '$',
          callerId: 0,
          authCode: Number(authCode),
          authCodeCreated: createdAt,
        })
        .executeTakeFirst();
    } else {
      // Update the user table with the generated authentication code and created timestamp
      await db
        .updateTable('user')
        .where('email', '=', email)
        .set({
          authCode: Number(authCode),
          authCodeCreated: createdAt,
        })
        .execute();
    }

    // Send authentication code via email
    try {
      await sendAuthCode({ to: email, code: authCode });
      res.json({ message: 'Authentication code sent to your email' });
    } catch (error) {
      console.error('Error sending email:', error);
      // Still return success but log the error
      // In console mode, user can see the code in server logs
      res.json({
        message:
          'Authentication code generated (check server logs if email not configured)',
      });
    }
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export { router as emailRouter };
