import fs from 'fs';

const dump = JSON.parse(fs.readFileSync('scripts/supabase-dump.json', 'utf-8'));

for (const [table, rows] of Object.entries(dump)) {
  console.log(`\n================ ${table} (${rows.length} rows) ================`);
  if (rows.length === 0) continue;
  
  const colTypes = {};
  for (const row of rows) {
    for (const [k, v] of Object.entries(row)) {
      if (v !== null && v !== undefined) {
        if (!colTypes[k]) {
          colTypes[k] = new Set();
        }
        if (Array.isArray(v)) {
          colTypes[k].add('array');
        } else {
          colTypes[k].add(typeof v);
        }
      }
    }
  }

  for (const [k, types] of Object.entries(colTypes)) {
    console.log(`  ${k}: [${Array.from(types).join(', ')}] (sample: ${JSON.stringify(rows[0][k])?.slice(0, 50)})`);
  }
}
