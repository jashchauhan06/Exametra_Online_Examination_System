// ============================================================
// Judge0 Code Execution Service
// ============================================================

export type Judge0Language = {
  id: number;
  name: string;
  key: string;
};

export const SUPPORTED_LANGUAGES: Judge0Language[] = [
  { id: 50, name: 'C (GCC 9.2)', key: 'c' },
  { id: 54, name: 'C++ (GCC 9.2)', key: 'cpp' },
  { id: 71, name: 'Python 3', key: 'python' },
  { id: 63, name: 'JavaScript (Node.js)', key: 'javascript' },
  { id: 62, name: 'Java (OpenJDK 13)', key: 'java' },
  { id: 82, name: 'SQL (SQLite 3.27)', key: 'sql' },
];

export function getLanguageId(key: string): number {
  const lang = SUPPORTED_LANGUAGES.find(l => l.key === key);
  return lang?.id ?? 71; // default to Python
}

export function getLanguageName(key: string): string {
  const lang = SUPPORTED_LANGUAGES.find(l => l.key === key);
  return lang?.name ?? key;
}

export const DEFAULT_STARTER_CODE: Record<string, string> = {
  c: `#include <stdio.h>

int main() {
    // Read input and write output
    
    return 0;
}`,
  cpp: `#include <iostream>
using namespace std;

int main() {
    // Read input and write output
    
    return 0;
}`,
  python: `# Read input and print output

`,
  javascript: `// Read input from stdin
const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin });
const lines = [];

rl.on('line', (line) => lines.push(line));
rl.on('close', () => {
    // Process input from 'lines' array
    
});`,
  java: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Read input and write output
        
    }
}`,
  sql: `-- Write your SQL query below
SELECT `,
};

// ── Judge0 API Communication ──

const JUDGE0_API_URL = process.env.JUDGE0_API_URL || 'https://judge0-ce.p.rapidapi.com';
const JUDGE0_API_KEY = process.env.JUDGE0_API_KEY || '';

interface Judge0Submission {
  source_code: string;
  language_id: number;
  stdin?: string;
  expected_output?: string;
  cpu_time_limit?: number;
  memory_limit?: number;
}

interface Judge0Result {
  stdout: string | null;
  stderr: string | null;
  compile_output: string | null;
  message: string | null;
  status: { id: number; description: string };
  time: string | null;
  memory: number | null;
}

// Status IDs from Judge0
const STATUS = {
  IN_QUEUE: 1,
  PROCESSING: 2,
  ACCEPTED: 3,
  WRONG_ANSWER: 4,
  TIME_LIMIT: 5,
  COMPILATION_ERROR: 6,
  RUNTIME_ERROR_SIGSEGV: 7,
  RUNTIME_ERROR_SIGXFSZ: 8,
  RUNTIME_ERROR_SIGFPE: 9,
  RUNTIME_ERROR_SIGABRT: 10,
  RUNTIME_ERROR_NZEC: 11,
  RUNTIME_ERROR_OTHER: 12,
  INTERNAL_ERROR: 13,
  EXEC_FORMAT_ERROR: 14,
};

export async function submitCode(submission: Judge0Submission): Promise<string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  // RapidAPI headers
  if (JUDGE0_API_KEY) {
    headers['x-rapidapi-host'] = 'judge0-ce.p.rapidapi.com';
    headers['x-rapidapi-key'] = JUDGE0_API_KEY;
  }

  const res = await fetch(`${JUDGE0_API_URL}/submissions?base64_encoded=true&wait=false`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      source_code: Buffer.from(submission.source_code).toString('base64'),
      language_id: submission.language_id,
      stdin: submission.stdin ? Buffer.from(submission.stdin).toString('base64') : undefined,
      expected_output: submission.expected_output ? Buffer.from(submission.expected_output).toString('base64') : undefined,
      cpu_time_limit: submission.cpu_time_limit || 2,
      memory_limit: submission.memory_limit || 128000,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Judge0 submission failed: ${res.status} — ${text}`);
  }

  const data = await res.json();
  return data.token;
}

export async function getResult(token: string): Promise<Judge0Result> {
  const headers: Record<string, string> = {};

  if (JUDGE0_API_KEY) {
    headers['x-rapidapi-host'] = 'judge0-ce.p.rapidapi.com';
    headers['x-rapidapi-key'] = JUDGE0_API_KEY;
  }

  const res = await fetch(`${JUDGE0_API_URL}/submissions/${token}?base64_encoded=true&fields=stdout,stderr,compile_output,message,status,time,memory`, {
    headers,
  });

  if (!res.ok) throw new Error(`Judge0 get result failed: ${res.status}`);

  const data = await res.json();

  return {
    stdout: data.stdout ? Buffer.from(data.stdout, 'base64').toString() : null,
    stderr: data.stderr ? Buffer.from(data.stderr, 'base64').toString() : null,
    compile_output: data.compile_output ? Buffer.from(data.compile_output, 'base64').toString() : null,
    message: data.message ? Buffer.from(data.message, 'base64').toString() : null,
    status: data.status,
    time: data.time,
    memory: data.memory,
  };
}

export async function pollResult(token: string, maxAttempts = 20, delayMs = 1500): Promise<Judge0Result> {
  for (let i = 0; i < maxAttempts; i++) {
    const result = await getResult(token);

    if (result.status.id !== STATUS.IN_QUEUE && result.status.id !== STATUS.PROCESSING) {
      return result;
    }

    await new Promise(resolve => setTimeout(resolve, delayMs));
  }

  throw new Error('Execution timed out waiting for Judge0 result');
}

export function parseJudge0Status(statusId: number): 'passed' | 'failed' | 'error' | 'tle' | 'mle' {
  switch (statusId) {
    case STATUS.ACCEPTED: return 'passed';
    case STATUS.WRONG_ANSWER: return 'failed';
    case STATUS.TIME_LIMIT: return 'tle';
    case STATUS.COMPILATION_ERROR: return 'error';
    default:
      if (statusId >= 7 && statusId <= 12) return 'error';
      return 'error';
  }
}

export function normalizeOutput(output: string | null): string {
  if (!output) return '';
  return output.replace(/\r\n/g, '\n').trim();
}
