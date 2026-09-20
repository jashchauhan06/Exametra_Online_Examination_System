import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

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
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'GEMINI_API_KEY is not configured on the server.' },
        { status: 500 }
      );
    }

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

    // Fallback model chain (same pattern as evaluate-subjective)
    const modelsToTry = [
      'gemini-2.5-flash',
      'gemini-2.0-flash',
      'gemini-1.5-flash',
    ];

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
}

Do NOT include any markdown code blocks, backticks, or extra text outside the JSON.`;

    let responseText: string | null = null;
    let lastError: Error | null = null;

    for (const modelName of modelsToTry) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });

        let result;

        if (submissionType === 'image' && imageBase64) {
          // Multimodal: image + text prompt
          const imagePart = {
            inlineData: {
              data: imageBase64,
              mimeType: imageMimeType || 'image/jpeg',
            },
          };

          result = await model.generateContent([
            systemPrompt + '\n\nThe student has submitted an image-based response. Analyze the image content carefully and evaluate it.',
            imagePart,
          ]);
        } else {
          // Text-only prompt
          const studentContent = submissionType === 'pdf'
            ? `[Extracted from PDF]\n${textContent}`
            : textContent;

          result = await model.generateContent(
            `${systemPrompt}\n\nStudent's Submission:\n${studentContent}`
          );
        }

        const response = await result.response;
        responseText = response.text().trim();
        break; // success
      } catch (err: any) {
        console.warn(`Model ${modelName} failed:`, err.message);
        lastError = err;
      }
    }

    if (!responseText) {
      throw lastError || new Error('All fallback models failed.');
    }

    // Clean up potential markdown formatting
    let jsonString = responseText;
    if (jsonString.startsWith('```')) {
      const firstNewline = jsonString.indexOf('\n');
      const lastBacktick = jsonString.lastIndexOf('```');
      if (firstNewline !== -1 && lastBacktick > firstNewline) {
        jsonString = jsonString.substring(firstNewline + 1, lastBacktick).trim();
      } else {
        jsonString = jsonString.replace(/^```(json)?|```$/g, '').trim();
      }
    }

    const evaluation = JSON.parse(jsonString);

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
