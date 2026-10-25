import { NextRequest, NextResponse } from 'next/server';
import { callAI, extractJsonFromResponse } from '@/lib/ai';

interface AssignmentEvalRequest {
  assignmentTitle: string;
  assignmentDescription: string;
  rubric?: string;
  maxMarks: number;
  submissionType: 'text' | 'pdf' | 'image';
  textContent?: string;       // For text or extracted PDF text
  imageBase64?: string;       // For image submissions (base64 data)
  imageMimeType?: string;     // e.g. 'image/png', 'image/jpeg'
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as AssignmentEvalRequest;
    const {
      assignmentTitle,
      assignmentDescription,
      rubric,
      maxMarks,
      submissionType,
      textContent,
      imageBase64,
      imageMimeType,
    } = body;

    if (!assignmentTitle || !assignmentDescription || maxMarks === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields: assignmentTitle, assignmentDescription, maxMarks' },
        { status: 400 }
      );
    }

    if (submissionType === 'image' && !imageBase64) {
      return NextResponse.json(
        { error: 'Image submission requires imageBase64 data' },
        { status: 400 }
      );
    }

    if ((submissionType === 'text' || submissionType === 'pdf') && !textContent) {
      return NextResponse.json(
        { error: 'Text/PDF submission requires textContent' },
        { status: 400 }
      );
    }

    const systemPrompt = `You are an expert academic evaluator and grading assistant. You evaluate student assignment submissions thoroughly and fairly.

Assignment Title: ${assignmentTitle}
Assignment Description: ${assignmentDescription}
Maximum Marks: ${maxMarks}
${rubric ? `Grading Rubric / Criteria:\n${rubric}` : 'No specific rubric provided. Evaluate based on correctness, completeness, clarity, and relevance to the assignment description.'}

Evaluate the student's submission and provide:
1. A numeric score out of ${maxMarks} (can be fractional, e.g. 7.5)
2. Detailed, constructive feedback explaining:
   - What the student did well
   - What was missing or incorrect
   - Specific suggestions for improvement
   - How the score was determined based on the rubric

Return ONLY a valid JSON object with this exact schema:
{
  "score": number,
  "feedback": string
}`;

    let userPrompt: string;
    let imagePayload: { base64: string; mimeType?: string } | undefined;

    if (submissionType === 'image' && imageBase64) {
      userPrompt = 'The student has submitted an image-based response. Carefully inspect and analyze the attached image of the student\'s work, then evaluate it according to the criteria.';
      imagePayload = {
        base64: imageBase64,
        mimeType: imageMimeType || 'image/jpeg',
      };
    } else {
      const studentContent = submissionType === 'pdf'
        ? `[Extracted from PDF]\n${textContent}`
        : textContent;
      userPrompt = `Student's Submission:\n${studentContent}`;
    }

    const responseText = await callAI({
      systemPrompt,
      prompt: userPrompt,
      image: imagePayload,
      jsonMode: true,
    });

    const evaluation = extractJsonFromResponse<{ score: number; feedback: string }>(responseText);

    if (typeof evaluation.score !== 'number' || typeof evaluation.feedback !== 'string') {
      throw new Error('Invalid evaluation format returned by AI');
    }

    // Clamp score within bounds
    evaluation.score = Math.max(0, Math.min(maxMarks, Math.round(evaluation.score * 100) / 100));

    return NextResponse.json(evaluation);
  } catch (error: any) {
    console.error('Assignment Evaluation Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to evaluate assignment' },
      { status: 500 }
    );
  }
}
