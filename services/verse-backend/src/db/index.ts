import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { users,userCredentials,arenaUser,arenaSchools } from "./schema";
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const db = drizzle(pool,{
    schema: {
        users: users,
        user_credentials: userCredentials,
        arena_users: arenaUser,
        arena_schools: arenaSchools,
    }
});
