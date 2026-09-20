import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Google Generative AI with the API key from environment variables
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

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
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'GEMINI_API_KEY is not configured on the server.' },
        { status: 500 }
      );
    }

    const body = await req.json();
    const { questionId, questionText, studentAnswer, rubric, expectedAnswer, maxMarks } = body as SubjectiveRequest;

    if (!questionId || !questionText || !studentAnswer || maxMarks === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Use a fallback mechanism to handle 503 high demand errors
    const modelsToTry = ['gemini-3.8-flash', 'gemini-3.7-flash', 'gemini-3.6-flash', 'gemini-3.5-flash', 'gemini-flash-latest'];

    const prompt = `
You are an expert strict academic examiner evaluating a student's answer for a subjective question.
Evaluate the student's answer based on the provided question, maximum marks, and (optional) grading rubric / expected answer.

Question: ${questionText}
Maximum Marks: ${maxMarks}
${rubric ? `Grading Rubric: ${rubric}` : ''}
${expectedAnswer ? `Expected Answer: ${expectedAnswer}` : ''}

Student's Answer:
${studentAnswer}

Provide your evaluation as a valid JSON object strictly matching the following schema:
{
  "score": number, // The marks awarded out of ${maxMarks} (can be fractional like 2.5)
  "feedback": string // Personalized feedback explaining what the student did right and what they missed based on the rubric.
}

Return ONLY the raw JSON string without any markdown code blocks or backticks.
`;

    let responseText = null;
    let lastError = null;

    for (const modelName of modelsToTry) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        responseText = response.text().trim();
        break; // Stop on first success
      } catch (err: any) {
        console.warn(`Model ${modelName} failed:`, err.message);
        lastError = err;
      }
    }

    if (!responseText) {
      throw lastError || new Error('All fallback models failed due to high demand.');
    }
    
    const text = responseText;
    
    // Clean up potential markdown formatting (e.g. \`\`\`json ... \`\`\`)
    let jsonString = text;
    if (jsonString.startsWith('\`\`\`')) {
        const firstLineBreak = jsonString.indexOf('\\n');
        const lastBacktick = jsonString.lastIndexOf('\`\`\`');
        if (firstLineBreak !== -1 && lastBacktick !== -1) {
            jsonString = jsonString.substring(firstLineBreak + 1, lastBacktick).trim();
        } else {
            jsonString = jsonString.replace(/^\`\`\`(json)?|\`\`\`$/g, '').trim();
        }
    }

    const evaluation = JSON.parse(jsonString);

    if (typeof evaluation.score !== 'number' || typeof evaluation.feedback !== 'string') {
        throw new Error('Invalid evaluation format returned by AI');
    }

    // Ensure score is within bounds
    evaluation.score = Math.max(0, Math.min(maxMarks, evaluation.score));

    return NextResponse.json(evaluation);

  } catch (error: any) {
    console.error('Subjective Evaluation Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to evaluate answer' },
      { status: 500 }
    );
  }
}
