import { Migrator } from 'kysely';
import { db } from './index';
import migration0000 from './migrations/0000-init';

export async function migrateToLatest() {
  const migrator = new Migrator({
    db,
    provider: {
      getMigrations: async () => ({
        '0000-init': migration0000,
      }),
    },
  });

  const { error, results } = await migrator.migrateToLatest();

  results?.forEach((it) => {
    if (it.status === 'Success') {
      console.log(`migration "${it.migrationName}" was executed successfully`);
    } else if (it.status === 'Error') {
      console.error(`failed to execute migration "${it.migrationName}"`);
    }
  });

  if (error) {
    console.error('failed to migrate');
    console.error(error);
    process.exit(1);
  }

  // Remove this line to keep the database connection open
  // await db.destroy();
}
