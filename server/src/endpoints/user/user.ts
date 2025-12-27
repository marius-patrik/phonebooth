import express from 'express';
import { db } from '../../db/index.js';
import { tokenizer } from '../../services/tokenizer.js';

const router = express.Router();

router.get('/api/user', async (req, res) => {
  try {
    // Extract user ID from JWT cookie
    const userId = await tokenizer(req.cookies.jwt);

    // Fetch the user from the database using the user ID
    const user = await db
      .selectFrom('user')
      .selectAll()
      .where('id', '=', userId)
      .executeTakeFirst();

    // If the user is not found, return a 404 error
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Return the user data as a JSON response
    res.json(user);
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ error: 'Failed to fetch user data' });
  }
});

export { router as userRouter };
