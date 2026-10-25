import { createClient, InsForgeClient } from '@insforge/sdk';

const insforgeUrl = process.env.NEXT_PUBLIC_INSFORGE_URL || 'https://kbia4qk4.us-east.insforge.app';
const insforgeAnonKey = process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY || 'anon_1e12622464e5a267950bec5a052a0c8aaf1e58dee257f6f8b4d20836d60b3b92';
const insforgeApiKey = process.env.INSFORGE_API_KEY || 'ik_73efec7fc1fa3227303d4dc7cb7f6577';

function enhanceClient(client: InsForgeClient) {
  const originalFrom = client.database.from.bind(client.database);

  const wrappedFrom = (table: string) => {
    const query = originalFrom(table);
    const origInsert = query.insert.bind(query);
    const origUpsert = query.upsert.bind(query);

    // InsForge requires inserts and upserts to be an array [{ ... }]
    // Automatically wrap single objects so callers can use either format safely.
    query.insert = (values: any, options?: any) => {
      const arrayValues = Array.isArray(values) ? values : [values];
      return origInsert(arrayValues, options);
    };

    query.upsert = (values: any, options?: any) => {
      const arrayValues = Array.isArray(values) ? values : [values];
      return origUpsert(arrayValues, options);
    };

    return query;
  };

  (client as any).from = wrappedFrom;
  return client as InsForgeClient & { from: typeof wrappedFrom };
}

// Client for frontend and authenticated user requests
export const insforge = enhanceClient(
  createClient({
    baseUrl: insforgeUrl,
    anonKey: insforgeAnonKey,
  })
);

// Admin client with backend API Key for server-side API routes
export const insforgeAdmin = enhanceClient(
  createClient({
    baseUrl: insforgeUrl,
    anonKey: insforgeApiKey,
  })
);

// Backward-compatibility alias while components migrate
export const supabase = insforge;
export const supabaseAdmin = insforgeAdmin;
