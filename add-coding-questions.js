const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

function loadEnv(filePath) {
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf-8');
    content.split('\n').forEach(line => {
      const match = line.match(/^([^=]+)=(.*)$/);
      if (match) {
        process.env[match[1].trim()] = match[2].trim();
      }
    });
  }
}

loadEnv('.env.local');
loadEnv('.env');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase URL or Key');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  const { data: users, error: userErr } = await supabase
    .from('users')
    .select('id')
    .in('role', ['admin', 'faculty'])
    .limit(1);

  if (userErr || !users || users.length === 0) {
    console.error('Failed to fetch a creator user:', userErr);
    process.exit(1);
  }

  const creatorId = users[0].id;

  const { data: subjects, error: subjErr } = await supabase
    .from('subjects')
    .select('id')
    .limit(1);

  if (subjErr || !subjects || subjects.length === 0) {
    console.error('Failed to fetch a subject:', subjErr);
    process.exit(1);
  }

  const subjectId = subjects[0].id;

  const codingQuestions = [
    {
      text: "Write a function to return the sum of two numbers. The input will be two space-separated integers on a single line.",
      type: "coding",
      marks: 5,
      difficulty: "easy",
      topic: "Basic Arithmetic",
      subject_id: subjectId,
      created_by: creatorId,
      coding_languages: ["c", "cpp", "python", "javascript", "java"],
      starter_code: {
        "python": "def solve():\n    # Read input from stdin\n    # Example: a, b = map(int, input().split())\n    pass\n\nif __name__ == '__main__':\n    solve()",
        "javascript": "const readline = require('readline');\nconst rl = readline.createInterface({ input: process.stdin, output: process.stdout });\n\nrl.on('line', (line) => {\n    // Split the line, convert to numbers, and print the sum\n    \n});"
      },
      time_limit_ms: 2000,
      memory_limit_kb: 128000,
      test_cases: [
        { id: "tc1", input: "5 3", expected_output: "8", is_hidden: false, points: 2 },
        { id: "tc2", input: "-2 10", expected_output: "8", is_hidden: false, points: 1 },
        { id: "tc3", input: "100 200", expected_output: "300", is_hidden: true, points: 2 }
      ],
      options: []
    },
    {
      text: "Write a program to reverse a given string. The input will be a single line containing a string.",
      type: "coding",
      marks: 10,
      difficulty: "medium",
      topic: "Strings",
      subject_id: subjectId,
      created_by: creatorId,
      coding_languages: ["c", "cpp", "python", "javascript", "java"],
      starter_code: {
        "python": "def solve():\n    s = input()\n    # Reverse and print the string\n    pass\n\nif __name__ == '__main__':\n    solve()",
        "javascript": "const readline = require('readline');\nconst rl = readline.createInterface({ input: process.stdin, output: process.stdout });\n\nrl.on('line', (line) => {\n    // Reverse the string and print it\n    \n});"
      },
      time_limit_ms: 2000,
      memory_limit_kb: 128000,
      test_cases: [
        { id: "tc1", input: "hello", expected_output: "olleh", is_hidden: false, points: 5 },
        { id: "tc2", input: "Exametra", expected_output: "artemaxE", is_hidden: false, points: 5 },
        { id: "tc3", input: "12345", expected_output: "54321", is_hidden: true, points: 5 }
      ],
      options: []
    }
  ];

  for (const q of codingQuestions) {
    const { data, error } = await supabase.from('questions').insert(q).select();
    if (error) {
      console.error('Error inserting question:', error);
    } else {
      console.log('Inserted coding question:', q.text.slice(0, 30) + '...');
    }
  }

  console.log('Done.');
}

main();
