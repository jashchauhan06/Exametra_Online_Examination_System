import { NextRequest, NextResponse } from 'next/server';
import { submitCode, pollResult, getLanguageId, normalizeOutput, parseJudge0Status } from '@/lib/judge0';

export async function POST(req: NextRequest) {
  try {
    const { code, language, testCases } = await req.json();

    if (!code || !language || !testCases || !Array.isArray(testCases)) {
      return NextResponse.json({ error: 'Missing required fields: code, language, testCases' }, { status: 400 });
    }

    const languageId = getLanguageId(language);
    const results = [];

    // Execute against each test case sequentially
    for (const tc of testCases) {
      try {
        const token = await submitCode({
          source_code: code,
          language_id: languageId,
          stdin: tc.input || '',
          cpu_time_limit: (tc.time_limit_ms || 2000) / 1000,
          memory_limit: tc.memory_limit_kb || 128000,
        });

        const result = await pollResult(token);

        const actualOutput = normalizeOutput(result.stdout);
        const expectedOutput = normalizeOutput(tc.expected_output);
        const passed = actualOutput === expectedOutput && result.status.id === 3;

        results.push({
          testCaseId: tc.id,
          input: tc.input,
          expectedOutput: tc.expected_output,
          actualOutput: result.stdout || '',
          passed,
          time_ms: result.time ? parseFloat(result.time) * 1000 : undefined,
          memory_kb: result.memory || undefined,
          error: result.stderr || result.compile_output || result.message || undefined,
          status: passed ? 'passed' : parseJudge0Status(result.status.id),
        });
      } catch (err: any) {
        results.push({
          testCaseId: tc.id,
          input: tc.input,
          expectedOutput: tc.expected_output,
          actualOutput: '',
          passed: false,
          error: err.message || 'Execution failed',
          status: 'error',
        });
      }
    }

    return NextResponse.json({
      results,
      totalPassed: results.filter(r => r.passed).length,
      totalCases: results.length,
    });
  } catch (err: any) {
    console.error('Execute API error:', err);
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}
