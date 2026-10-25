import { NextRequest, NextResponse } from 'next/server';
import { callAI, extractJsonFromResponse } from '@/lib/ai';

interface SubjectiveRequest {
  questionId: string;
  questionText: string;
  studentAnswer: string;
  rubric?: string;
  expectedAnswer?: string;
  maxMarks: number;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { questionId, questionText, studentAnswer, rubric, expectedAnswer, maxMarks } = body as SubjectiveRequest;

    if (!questionId || !questionText || !studentAnswer || maxMarks === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const systemPrompt = `You are an expert strict academic examiner evaluating a student's answer for a subjective question.
Evaluate the answer based on correctness, clarity, completeness, and adherence to the rubric/expected answer.
Return ONLY valid JSON matching this schema:
{
  "score": number, // The marks awarded out of ${maxMarks} (can be fractional like 2.5)
  "feedback": string // Constructive feedback explaining what was correct and what was missed
}`;

    const prompt = `Question: ${questionText}
Maximum Marks: ${maxMarks}
${rubric ? `Grading Rubric: ${rubric}` : ''}
${expectedAnswer ? `Expected Answer: ${expectedAnswer}` : ''}

Student's Answer:
${studentAnswer}

Evaluate the student's answer now.`;

    const responseText = await callAI({
      systemPrompt,
      prompt,
      jsonMode: true,
    });

    const evaluation = extractJsonFromResponse<{ score: number; feedback: string }>(responseText);

    if (typeof evaluation.score !== 'number' || typeof evaluation.feedback !== 'string') {
      throw new Error('Invalid evaluation format returned by AI');
    }

    // Ensure score is within bounds
    evaluation.score = Math.max(0, Math.min(maxMarks, Math.round(evaluation.score * 100) / 100));

    return NextResponse.json(evaluation);

  } catch (error: any) {
    console.error('Subjective Evaluation Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to evaluate answer' },
      { status: 500 }
    );
  }
}
