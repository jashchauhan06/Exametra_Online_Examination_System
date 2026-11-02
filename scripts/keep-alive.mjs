import { createClient } from '@insforge/sdk';
import fs from 'fs';
import path from 'path';

// Load environment variables if not already set
function loadEnv() {
  const envPath = path.resolve(process.cwd(), '.env.local');
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf8').split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const [key, ...rest] = trimmed.split('=');
      const val = rest.join('=').trim().replace(/^['"]|['"]$/g, '');
      if (key && !process.env[key]) {
        process.env[key] = val;
      }
    }
  }
}

loadEnv();

const baseUrl = process.env.NEXT_PUBLIC_INSFORGE_URL || 'https://kbia4qk4.us-east.insforge.app';
const apiKey = process.env.INSFORGE_API_KEY || process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY;

if (!baseUrl || !apiKey) {
  console.error('❌ Missing INSFORGE credentials in environment or .env.local');
  process.exit(1);
}

const client = createClient({
  baseUrl,
  anonKey: apiKey,
});

async function ping() {
  const start = Date.now();
  console.log(`[${new Date().toISOString()}] Pinging InsForge database at ${baseUrl}...`);

  try {
    // Perform a lightweight query to register activity and prevent auto-pause
    const { data, error, status } = await client.database
      .from('subjects')
      .select('id')
      .limit(1);

    const duration = Date.now() - start;

    if (error) {
      console.error(`❌ Ping failed (${duration}ms) with status ${status}:`, error.message);
      process.exit(1);
    }

    console.log(`✅ Database is ACTIVE and awake! Response in ${duration}ms (status ${status}).`);
    console.log(`   Sample record fetched: ${data && data.length > 0 ? data[0].id : 'Empty table'}`);
  } catch (err) {
    const duration = Date.now() - start;
    console.error(`❌ Unexpected error after ${duration}ms:`, err);
    process.exit(1);
  }
}

ping();

