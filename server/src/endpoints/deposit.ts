import express from 'express';
import Stripe from 'stripe';
import { db } from '../db/index.js';
import { tokenizer } from '../services/tokenizer.js';

// Load Stripe secret key from environment variable
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? '', {});

const router = express.Router();

router.post('/api/user/deposit', async (req, res) => {
  try {
    const userId = tokenizer(req.cookies.jwt);
    const { balance } = req.body;

    // Validate and convert balance to a number
    const balanceNum = Number(balance);
    if (Number.isNaN(balanceNum) || balanceNum <= 0) {
      return res.status(400).json({ error: 'Invalid balance amount' });
    }

    // Convert to cents for Stripe (round to avoid floating point issues)
    const value = Math.round(balanceNum * 100);

    // Get user's currency and balance from database
    const user = await db
      .selectFrom('user')
      .select(['currency', 'balance'])
      .where('id', '=', userId)
      .executeTakeFirst();

    // Stripe expects lowercase 3-letter currency codes (e.g., "usd")
    const currency = user?.currency?.toLowerCase() || 'usd'; // Default to USD if not set

    // Create Stripe Checkout Session
    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency,
              product_data: { name: 'Deposit' },
              unit_amount: value,
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: 'https://your-app.com/success',
        cancel_url: 'https://your-app.com/cancel',
        metadata: { userId },
      });
      res.json({ paymentLink: session.url });

      if (session.payment_status === 'paid') {
        const balanceIncrease = value / 100; // Convert cents back to dollars
        await db
          .updateTable('user')
          .set({
            balance: (user?.balance ?? 0) + balanceIncrease,
          })
          .where('id', '=', userId)
          .execute();

        await db
          .insertInto('transaction')
          .values({
            owner: userId,
            value: balanceIncrease, // Store in dollars, not cents
            transactionType: 'deposit',
            timestamp: new Date().toISOString(),
            displayCurrency: currency,
          })
          .execute();

        return res.status(200).json({
          message: 'Deposit successful',
          amount: value,
        });
      }
    } catch (err) {
      console.error('Stripe error:', err);
      return res
        .status(500)
        .json({ error: 'Stripe error', details: String(err) });
    }
  } catch (error) {
    console.error('Deposit endpoint error:', error);
    return res
      .status(500)
      .json({ error: 'Internal server error', details: String(error) });
  }
});

export { router as balanceRouter };
