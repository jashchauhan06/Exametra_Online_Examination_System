import { NextRequest, NextResponse } from 'next/server';
import { callAI, extractJsonFromResponse } from '@/lib/ai';

export async function POST(req: NextRequest) {
  try {
    const { subject, topic, type, difficulty, count } = await req.json();

    if (!topic || !count) {
      return NextResponse.json({ error: 'Topic and count are required' }, { status: 400 });
    }

    // Build Generation Prompt with integrated curriculum check
    let typeInstruction = '';
    if (type === 'mcq' || type === 'multi-select') {
      typeInstruction = `Generate ${count} ${type === 'mcq' ? 'Multiple Choice' : 'Multiple Select (multiple correct answers)'} questions.
Format for each item in the array:
{
  "text": "Question text here",
  "marks": 2,
  "type": "${type === 'mcq' ? 'Multiple Choice' : 'Multiple Select'}",
  "options": [
    { "text": "Option A", "isCorrect": false },
    { "text": "Option B", "isCorrect": true },
    { "text": "Option C", "isCorrect": false },
    { "text": "Option D", "isCorrect": false }
  ]
}`;
    } else if (type === 'true-false') {
      typeInstruction = `Generate ${count} True/False questions.
Format for each item in the array:
{
  "text": "Question text here",
  "marks": 1,
  "type": "True/False",
  "options": [
    { "text": "True", "isCorrect": true },
    { "text": "False", "isCorrect": false }
  ]
}`;
    } else if (type === 'subjective') {
      typeInstruction = `Generate ${count} Subjective (Short Answer/Essay) questions.
Format for each item in the array:
{
  "text": "Question text here",
  "marks": 5,
  "type": "Subjective",
  "expected_answer": "Model expected answer here",
  "rubric": "Grading criteria here"
}`;
    } else {
      typeInstruction = `Generate ${count} Multiple Choice questions.
Format for each item in the array:
{
  "text": "Question text here",
  "marks": 2,
  "type": "Multiple Choice",
  "options": [
    { "text": "Option A", "isCorrect": false },
    { "text": "Option B", "isCorrect": true },
    { "text": "Option C", "isCorrect": false },
    { "text": "Option D", "isCorrect": false }
  ]
}`;
    }

    const prompt = `You are an expert academic curriculum reviewer and exam question creator.

Subject: ${subject || 'General Knowledge'}
Topic / Syllabus: ${topic}
Difficulty: ${difficulty || 'medium'} (Adjust complexity accordingly)

TASK 1 (Curriculum Validation):
Determine if "${topic}" legitimately belongs to or has clear academic relevance within the curriculum/syllabus of "${subject}".
Examples of mismatches:
- "Topology" belongs to Computer Networks or Mathematics, NOT Database Management Systems.
- "OSI Model" or "TCP/IP" belongs to Computer Networks, NOT Data Structures and Algorithms.
- "Photosynthesis" belongs to Biology, NOT Computer Science.

IF the topic does NOT belong to "${subject}", return ONLY this JSON:
{
  "isRelevant": false,
  "mismatchReason": "Explanation of which subject this topic actually belongs to instead of ${subject}"
}

IF the topic legitimately belongs to "${subject}", return this JSON:
{
  "isRelevant": true,
  "questions": [
    // ${typeInstruction}
  ]
}

CRITICAL RULES:
1. Every generated question MUST strictly belong to the subject "${subject}" and focus on "${topic}".
2. Return ONLY a valid JSON object.`;

    const responseText = await callAI({
      systemPrompt: 'You are an academic exam generator. You return strictly a JSON object.',
      prompt,
      jsonMode: true,
    });

    const parsed = extractJsonFromResponse<any>(responseText);

    if (parsed && parsed.isRelevant === false) {
      return NextResponse.json(
        {
          error: `Topic mismatch: "${topic}" does not belong to the syllabus of "${subject}". ${parsed.mismatchReason || 'Please enter a topic relevant to this subject.'}`
        },
        { status: 400 }
      );
    }

    let questions: any[] = [];
    if (Array.isArray(parsed)) {
      questions = parsed;
    } else if (parsed && typeof parsed === 'object') {
      if (Array.isArray(parsed.questions)) {
        questions = parsed.questions;
      } else {
        const foundArray = Object.values(parsed).find(v => Array.isArray(v));
        if (foundArray) {
          questions = foundArray as any[];
        } else if (parsed.text) {
          questions = [parsed];
        }
      }
    }

    if (!questions || questions.length === 0) {
      throw new Error('LLM did not return any valid questions');
    }

    return NextResponse.json({ questions });
  } catch (error: any) {
    console.error('Error generating AI questions:', error);
    return NextResponse.json({ error: error.message || 'Failed to generate questions' }, { status: 500 });
  }
}
