import express from 'express';
import { db } from '../db';

const router = express.Router();

// Endpoint to fetch all rates
router.get('/api/rates', async (req, res) => {
  try {
    const rates = await db.selectFrom('rate').selectAll().execute();
    res.json(rates);
  } catch {
    console.error('Error fetching rates');
    res.status(500).json({ error: 'Failed to fetch rates' });
  }
});

export { router as ratesRouter };
