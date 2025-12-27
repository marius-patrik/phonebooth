import { db } from '../db/index.js';
import { endCall } from '../endpoints/dial.js';

const BILLING_CHECK_INTERVAL = 5000; // 5 seconds
const HANGING_CALL_TIMEOUT = 300000; // 5 minutes (auto-complete hanging calls)
const RINGING_CALL_TIMEOUT = 15000; // 15 seconds (auto-fail ringing calls)
let billingTimer: NodeJS.Timeout | null = null;

// Check all active calls and terminate if balance depleted
async function checkActiveCalls() {
  try {
    const activeCalls = await db
      .selectFrom('call')
      .selectAll()
      .where('status', '=', 'connected')
      .execute();

    const now = new Date().toISOString();

    for (const call of activeCalls) {
      // Update last billing check timestamp
      await db
        .updateTable('call')
        .set({ lastBillingCheck: now })
        .where('id', '=', call.id)
        .execute();

      // Check user balance
      const user = await db
        .selectFrom('user')
        .select('balance')
        .where('id', '=', call.owner)
        .executeTakeFirst();

      if (user && user.balance <= 0) {
        console.log(
          `Auto-terminating call ${call.id} due to insufficient funds`,
        );
        await endCall(call.id, call.owner, call.countryCode);
      }
    }
  } catch (error) {
    console.error('Error in billing check:', error);
  }
}

// Check all hanging calls and auto-complete after timeout
async function checkHangingCalls() {
  try {
    const hangingCalls = await db
      .selectFrom('call')
      .selectAll()
      .where('status', '=', 'hanging')
      .execute();

    const now = new Date();

    for (const call of hangingCalls) {
      if (!call.endTime) continue;

      const endTime = new Date(call.endTime);
      const timeSinceEnd = now.getTime() - endTime.getTime();

      // Auto-complete calls that have been hanging for more than timeout period
      if (timeSinceEnd > HANGING_CALL_TIMEOUT) {
        console.log(
          `Auto-completing call ${call.id} after ${Math.floor(timeSinceEnd / 60000)} minutes`,
        );
        await db
          .updateTable('call')
          .set({ status: 'over' })
          .where('id', '=', call.id)
          .execute();
      }
    }
  } catch (error) {
    console.error('Error in hanging call check:', error);
  }
}

// Check all ringing calls and auto-fail after timeout
async function checkRingingCalls() {
  try {
    const ringingCalls = await db
      .selectFrom('call')
      .selectAll()
      .where('status', '=', 'ringing')
      .execute();

    const now = new Date();

    for (const call of ringingCalls) {
      const startTime = new Date(call.startTime);
      const timeSinceStart = now.getTime() - startTime.getTime();

      // Auto-fail calls that have been ringing for more than timeout period
      if (timeSinceStart > RINGING_CALL_TIMEOUT) {
        console.log(
          `Auto-failing call ${call.id} - no answer after ${Math.floor(timeSinceStart / 1000)} seconds`,
        );
        await endCall(call.id, call.owner, call.countryCode);
      }
    }
  } catch (error) {
    console.error('Error in ringing call check:', error);
  }
}

// Start the global billing timer
export function startBillingManager() {
  if (billingTimer) {
    console.log('⚠️  Billing manager already running');
    return;
  }

  console.log('✓ Starting billing manager (checks every 60 seconds)');
  billingTimer = setInterval(() => {
    checkActiveCalls();
    checkHangingCalls();
    checkRingingCalls();
  }, BILLING_CHECK_INTERVAL);

  // Run initial checks immediately
  checkActiveCalls();
  checkHangingCalls();
  checkRingingCalls();
}

// Stop the billing timer (for graceful shutdown)
export function stopBillingManager() {
  if (billingTimer) {
    clearInterval(billingTimer);
    billingTimer = null;
    console.log('✓ Billing manager stopped');
  }
}

// Resume active calls on server restart
export async function resumeActiveCalls() {
  const activeCalls = await db
    .selectFrom('call')
    .select(['id', 'owner'])
    .where('status', '=', 'connected')
    .execute();

  if (activeCalls.length > 0) {
    console.log(
      `⚠️  Found ${activeCalls.length} active call(s) from previous session - monitoring for billing`,
    );
  }
}
