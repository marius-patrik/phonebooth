/** biome-ignore-all assist/source/organizeImports: <idc> */
import express from 'express';

import cookieParser from 'cookie-parser';

import { db } from './db/index.js';
import { migrateToLatest } from './db/migrator.js';
import {
  startBillingManager,
  resumeActiveCalls,
} from './services/billing-manager.js';
import { authenticateJWT } from './services/authenticator.js';

import { emailRouter } from './endpoints/user/user-email.js';
import { ratesRouter } from './endpoints/rates.js';
import { transactionsRouter } from './endpoints/transactions.js';
import { userRouter } from './endpoints/user/user.js';
import { callsRouter } from './endpoints/calls.js';
import { logoutRouter } from './endpoints/user/user-logout.js';
import { dialRouter } from './endpoints/dial.js';
import { contactsRouter } from './endpoints/contacts.js';
import { balanceRouter } from './endpoints/deposit.js';
import { authRouter } from './endpoints/user/user-auth.js';

await migrateToLatest();

const app = express();
const port = 8080;

// Insert static test data
async function insertTestData() {
  try {
    // Insert into user table
    await db
      .insertInto('user')
      .values([
        {
          id: 1,

          email: 'user1@example.com',
          callerId: 123456789,
          balance: 100.5,
          displayCurrency: '$',
          currency: 'USD',
        },

        {
          id: 2,

          email: 'user2@example.com',
          callerId: 987654321,
          balance: 200.0,
          displayCurrency: '€',
          currency: 'EUR',
        },
      ])
      .execute();

    // Insert into call table
    await db
      .insertInto('call')
      .values([
        {
          id: 1,
          owner: 1,

          calleeID: 987654321,
          countryCode: 1,

          price: 2.54,

          status: 'over',

          startTime: '2023-10-01T12:00:00Z',
          endTime: '2023-10-01T12:00:00Z',
        },
        {
          id: 2,
          owner: 2,

          countryCode: 49,
          calleeID: 123456789,

          price: 3.04,

          status: 'over',

          startTime: '2023-10-02T14:30:00Z',
          endTime: '2023-10-02T14:30:00Z',
        },
      ])
      .execute();

    // Insert into rate table
    await db
      .insertInto('rate')
      .values([
        { id: 1, country: 'USA', code: 1, price: 0.05 },
        { id: 2, country: 'Germany', code: 49, price: 0.1 },
      ])
      .execute();

    // Insert into transaction table
    await db
      .insertInto('transaction')
      .values([
        {
          id: 1,
          owner: 1,

          transactionType: 'Deposit',
          displayCurrency: '$',
          value: 50.0,
          timestamp: '2023-10-01T10:00:00Z',
        },
        {
          id: 2,
          owner: 1,

          transactionType: 'Call',
          displayCurrency: '$',
          value: 75.0,
          timestamp: '2023-10-02T11:00:00Z',
        },
      ])
      .execute();

    console.log('Test data inserted successfully');
  } catch (error) {
    console.error('Error inserting test data:', error);
  }
}
// Call the function to insert test data
await insertTestData();

app.use(cookieParser());
app.use(express.json());

// Public routes (no authentication required)
app.use(emailRouter);
app.use(authRouter);

app.use(ratesRouter);

// Apply JWT authentication middleware to all routes below this point
app.use(authenticateJWT);

// Protected routes (require authentication)
app.use(callsRouter);
app.use(transactionsRouter);
app.use(userRouter);
app.use(logoutRouter);
app.use(dialRouter);
app.use(balanceRouter);
app.use(contactsRouter);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);

  // Start billing manager for active call monitoring
  startBillingManager();

  // Resume monitoring any active calls from previous session
  resumeActiveCalls();
});
