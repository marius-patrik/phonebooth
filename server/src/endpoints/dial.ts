import express from 'express';
import { tokenizer } from '../services/tokenizer.js';

const router = express.Router();

const { db } = await import('../db/index.js');

// Helper function to get rate for a given country code
async function getRateForCode(countryCode: number): Promise<number> {
  const rateRow = await db
    .selectFrom('rate')
    .select('price')
    .where('code', '=', countryCode)
    .executeTakeFirstOrThrow();
  return Number(rateRow.price);
}

// Helper function to end a call and finalize billing
export async function endCall(
  callId: number,
  userId: number,
  calleeNumber: number,
) {
  // Get the rate for this specific call
  const rate = await getRateForCode(calleeNumber);

  // Verify call exists and belongs to user
  const call = await db
    .selectFrom('call')
    .selectAll()
    .where('id', '=', callId)
    .where('owner', '=', userId)
    .executeTakeFirst();

  if (!call) {
    throw new Error('Call not found');
  }

  if (call.status === 'over') {
    throw new Error('Call already ended');
  }

  const userCurrency = await db
    .selectFrom('user')
    .select('displayCurrency')
    .where('id', '=', userId)
    .executeTakeFirst();

  const displayCurrency = userCurrency?.displayCurrency ?? 'USD';

  // Calculate final cost
  const endTime = new Date();
  const startTime = new Date(call.startTime);
  const durationMs = endTime.getTime() - startTime.getTime();
  const durationSeconds = Math.floor(durationMs / 1000);
  const finalCost = (durationSeconds / 60) * rate;

  // Determine final status: failed if still ringing, hanging if connected
  const finalStatus = call.status === 'ringing' ? 'failed' : 'hanging';

  // Update call record with end time and final price
  await db
    .updateTable('call')
    .set({
      status: finalStatus,
      endTime: endTime.toISOString(),
      price: finalCost,
    })
    .where('id', '=', callId)
    .execute();

  // Deduct final cost from user balance
  await db
    .updateTable('user')
    .set((eb) => ({ balance: eb('balance', '-', finalCost) }))
    .where('id', '=', userId)
    .execute();

  // Create transaction record
  await db
    .insertInto('transaction')
    .values({
      owner: userId,
      // Assuming type 2 is for call charges
      value: finalCost,
      timestamp: endTime.toISOString(),
      transactionType: 'Call',
      displayCurrency: displayCurrency,
    })
    .execute();

  return { durationSeconds, finalCost, rate, displayCurrency };
}

// POST /api/call/ring - Initiate a call
router.post('/api/call/ring', async (req, res) => {
  try {
    const userId = tokenizer(req.cookies.jwt);
    const { countryCode, calleeID } = req.body;

    if (!countryCode || !calleeID) {
      return res
        .status(400)
        .json({ error: 'countryCode and calleeID are required' });
    }

    const countryCodeNum = Number(countryCode);
    const calleeNumber = Number(calleeID);

    if (
      Number.isNaN(countryCodeNum) ||
      Number.isNaN(calleeNumber) ||
      countryCodeNum <= 0 ||
      calleeNumber <= 0
    ) {
      return res
        .status(400)
        .json({ error: 'Invalid countryCode or calleeID format' });
    }

    // Check user balance and get caller ID
    const user = await db
      .selectFrom('user')
      .select(['balance', 'callerId'])
      .where('id', '=', userId)
      .executeTakeFirst();

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.balance <= 0) {
      return res.status(402).json({ error: 'Insufficient balance' });
    }

    // Create call record in database
    const newCall = await db
      .insertInto('call')
      .values({
        owner: userId,
        calleeID: calleeNumber,
        countryCode: countryCodeNum,
        startTime: new Date().toISOString(),
        endTime: undefined,
        price: undefined,
        status: 'ringing',
      })
      .returningAll()
      .executeTakeFirstOrThrow();

    res.json({ callId: newCall.id });

    // TODO: Initiate actual call via telephony provider
  } catch (_error) {
    res.status(500).json({ error: 'Failed to initiate call' });
  }
});

// POST /api/call/connect - Answer/connect a call
router.post('/api/call/connect', async (req, res) => {
  try {
    const userId = tokenizer(req.cookies.jwt);
    const { callId } = req.body;

    if (!callId) {
      return res.status(400).json({ error: 'Call ID is required' });
    }

    // Verify call exists and belongs to user
    const call = await db
      .selectFrom('call')
      .selectAll()
      .where('id', '=', callId)
      .where('owner', '=', userId)
      .executeTakeFirst();

    if (!call) {
      return res.status(404).json({ error: 'Call not found' });
    }

    if (call.status !== 'ringing') {
      return res.status(400).json({ error: 'Call is not in ringing state' });
    }

    // Update call status to connected
    await db
      .updateTable('call')
      .set({
        status: 'connected',
        startTime: new Date().toISOString(),
        lastBillingCheck: new Date().toISOString(),
      })
      .where('id', '=', callId)
      .execute();

    // Note: Billing is now handled by centralized billing-manager.ts
    // No need for per-call setInterval - the global billing manager
    // will monitor all active calls and auto-terminate when balance depleted

    res.json({ message: 'Call connected', callId });
  } catch (_error) {
    res.status(500).json({ error: 'Failed to connect call' });
  }
});

// POST /api/call/hang - End a call
router.post('/api/call/hang', async (req, res) => {
  try {
    const userId = tokenizer(req.cookies.jwt);
    const { callId } = req.body;

    if (!callId) {
      return res.status(400).json({ error: 'Call ID is required' });
    }

    // Fetch call to get callee number for rate lookup
    const call = await db
      .selectFrom('call')
      .select(['calleeID', 'countryCode'])
      .where('id', '=', callId)
      .where('owner', '=', userId)
      .executeTakeFirst();

    if (!call) {
      return res.status(404).json({ error: 'Call not found' });
    }

    const result = await endCall(callId, userId, call.countryCode);

    res.json({
      message: 'Call ended',
      callId,
      durationSeconds: result.durationSeconds,
      cost: result.finalCost,
      rate: result.rate,
      displayCurrency: result.displayCurrency,
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Failed to end call';
    res.status(500).json({ error: errorMessage });
  }
});

// POST /api/call/complete - Mark call as completed (hanging -> over)
router.post('/api/call/complete', async (req, res) => {
  try {
    const userId = tokenizer(req.cookies.jwt);
    const { callId } = req.body;

    if (!callId) {
      return res.status(400).json({ error: 'Call ID is required' });
    }

    // Verify call exists, belongs to user, and is in hanging state
    const call = await db
      .selectFrom('call')
      .selectAll()
      .where('id', '=', callId)
      .where('owner', '=', userId)
      .executeTakeFirst();

    if (!call) {
      return res.status(404).json({ error: 'Call not found' });
    }

    if (call.status !== 'hanging' && call.status !== 'failed') {
      return res
        .status(400)
        .json({ error: 'Call is not in a final state (hanging or failed)' });
    }

    // Transition to over status
    await db
      .updateTable('call')
      .set({ status: 'over' })
      .where('id', '=', callId)
      .execute();
    const durationSeconds = call.endTime
      ? Math.floor(
          (new Date(call.endTime).getTime() -
            new Date(call.startTime).getTime()) /
            1000,
        )
      : 0;

    const rate = await getRateForCode(call.countryCode);
    const userCurrency = await db
      .selectFrom('user')
      .select('displayCurrency')
      .where('id', '=', userId)
      .executeTakeFirst();
    const displayCurrency = userCurrency?.displayCurrency ?? 'USD';

    res.json({
      message: 'Call completed',
      callId,
      durationSeconds,
      cost: call.price,
      rate,
      displayCurrency,
      status: call.status,
    });
  } catch (_error) {
    res.status(500).json({ error: 'Failed to complete call' });
  }
});

// GET /api/call/status/:callId - Get the status of a call
router.get('/api/call/status/:callId', async (req, res) => {
  try {
    const userId = tokenizer(req.cookies.jwt);
    const { callId } = req.params;

    const callIdNum = Number(callId);
    if (Number.isNaN(callIdNum)) {
      return res.status(400).json({ error: 'Invalid Call ID format' });
    }

    const call = await db
      .selectFrom('call')
      .select('status')
      .where('id', '=', callIdNum)
      .where('owner', '=', userId)
      .executeTakeFirst();

    if (!call) {
      return res.status(404).json({ error: 'Call not found' });
    }

    res.json({ status: call.status });
  } catch (_error) {
    res.status(500).json({ error: 'Failed to fetch call status' });
  }
});

export { router as dialRouter };
