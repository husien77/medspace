import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { users } from '../src/db/schema';
import { hash } from 'bcryptjs';

config({ path: '.env.local' });
config();

async function main() {
  const email = process.env.SUPER_ADMIN_EMAIL?.toLowerCase();
  const password = process.env.SUPER_ADMIN_PASSWORD;
  const name = process.env.SUPER_ADMIN_NAME || 'الحسين الغرسي';
  if (!process.env.DATABASE_URL || !email || !password || password.length < 16) throw new Error('Set DATABASE_URL, SUPER_ADMIN_EMAIL, and SUPER_ADMIN_PASSWORD (16+ characters).');
  const client = postgres(process.env.DATABASE_URL, { max: 1 });
  const db = drizzle(client);
  const hashValue = await hash(password, 12);
  await db.insert(users).values({ fullName: name, email, passwordHash: hashValue, role: 'SUPER_ADMIN', status: 'APPROVED' }).onConflictDoUpdate({ target: users.email, set: { fullName: name, passwordHash: hashValue, role: 'SUPER_ADMIN', status: 'APPROVED', updatedAt: new Date() } });
  await client.end();
  console.log(`Super admin provisioned for ${email}. Remove SUPER_ADMIN_PASSWORD from environment now.`);
}
main().catch((error) => { console.error(error); process.exit(1); });
