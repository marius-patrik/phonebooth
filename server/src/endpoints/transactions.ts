import express from 'express';
import { db } from '../db';
import { tokenizer } from '../services/tokenizer.js';

const router = express.Router();

// Endpoint to fetch all transactions for the logged-in user
router.get('/api/transactions', async (req, res) => {
  try {
    // Extract user ID from JWT cookie
    const userId = await tokenizer(req.cookies.jwt);

    // Fetch transactions for the logged-in user
    const transactions = await db
      .selectFrom('transaction')
      .selectAll()
      .where('owner', '=', userId)
      .execute();

    res.json(transactions);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

export { router as transactionsRouter };
