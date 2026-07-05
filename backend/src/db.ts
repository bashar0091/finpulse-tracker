import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import "dotenv/config";

// Ensure the database connection URL is loaded safely
const connectionString = `${process.env.DATABASE_URL}`;

// Initialize the PostgreSQL connection pool wrapper via 'pg'
const pool = new Pool({ connectionString });

// Instantiate the Prisma driver adapter for PostgreSQL
const adapter = new PrismaPg(pool);

// Construct the Prisma Client by explicitly parsing the adapter configuration object
const prisma = new PrismaClient({ adapter });

export default prisma;