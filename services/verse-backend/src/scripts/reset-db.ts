import { Client } from 'pg';
import * as dotenv from 'dotenv';
dotenv.config();

async function resetDb() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();
  await client.query('DROP SCHEMA public CASCADE;');
  await client.query('CREATE SCHEMA public;');
  await client.end();
  console.log('Database reset successfully.');
}

resetDb().catch(console.error);
