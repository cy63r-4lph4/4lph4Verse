import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { users,userCredentials,arenaUser,arenaSchools } from "./schema";
import * as dotenv from "dotenv";
import * as path from "path";
dotenv.config({ path: path.join(process.cwd(), '.env') }); 

if (!process.env.DATABASE_URL) {
  console.error("Current Directory:", process.cwd());
  throw new Error("DATABASE_URL is not defined in environment variables");
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
export const db = drizzle(pool,{
    schema: {
        users,
        userCredentials,
        arenaUser,
        arenaSchools,
    }
});
