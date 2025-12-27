import type { Migration } from 'kysely';

export default {
  async up(db) {
    await db.schema
      .createTable('user')

      .addColumn('id', 'integer', (col) => col.primaryKey().autoIncrement()) // UUID cannot use autoIncrement
      .addColumn('authCode', 'integer')
      .addColumn('authCodeExpires', 'text') // ISO timestamp string
      .addColumn('authCodeCreated', 'text') // ISO timestamp string for code creation

      .addColumn('email', 'text', (col) => col.notNull().unique()) // Removed autoIncrement
      .addColumn('callerId', 'integer') // Removed autoIncrement
      .addColumn('balance', 'float8') // Removed autoIncrement
      .addColumn('displayCurrency', 'text') // Removed autoIncrement
      .addColumn('currency', 'text') // Removed autoIncrement
      .execute();

    await db.schema
      .createTable('call')

      .addColumn('id', 'integer', (col) => col.primaryKey().autoIncrement()) // Valid autoIncrement
      .addColumn('owner', 'integer', (col) =>
        col.references('user.id').onDelete('cascade').notNull(),
      ) // Removed owner column

      .addColumn('status', 'text') // Removed autoIncrement

      .addColumn('countryCode', 'integer') // Removed autoIncrement
      .addColumn('calleeID', 'integer') // Removed autoIncrement

      .addColumn('price', 'float8') // Removed autoIncrement

      .addColumn('startTime', 'date') // Removed autoIncrement
      .addColumn('lastBillingCheck', 'text') // ISO timestamp string
      .addColumn('endTime', 'date') // Removed autoIncrement
      .execute();

    await db.schema
      .createTable('rate')

      .addColumn('id', 'integer', (col) => col.primaryKey().autoIncrement()) // Valid autoIncrement

      .addColumn('country', 'text') // Removed autoIncrement
      .addColumn('code', 'integer') // Removed autoIncrement
      .addColumn('price', 'float8') // Removed autoIncrement
      .execute();

    await db.schema
      .createTable('transaction')

      .addColumn('id', 'integer', (col) => col.primaryKey().autoIncrement()) // Valid autoIncrement
      .addColumn('owner', 'integer', (col) =>
        col.references('user.id').onDelete('cascade').notNull(),
      )

      .addColumn('transactionType', 'text') // Removed autoIncrement
      .addColumn('value', 'float8') // Removed autoIncrement
      .addColumn('displayCurrency', 'text') // Removed autoIncrement
      .addColumn('timestamp', 'date') // Removed autoIncrement
      .execute();

    await db.schema
      .createTable('contact')

      .addColumn('id', 'integer', (col) => col.primaryKey().autoIncrement())
      .addColumn('owner', 'integer', (col) =>
        col.references('user.id').onDelete('cascade').notNull(),
      )

      .addColumn('name', 'text', (col) => col.notNull())
      .addColumn('countryCode', 'integer', (col) => col.notNull())
      .addColumn('calleeID', 'integer', (col) => col.notNull())
      .addColumn('createdAt', 'text', (col) => col.notNull())
      .execute();
  },
} satisfies Migration;
