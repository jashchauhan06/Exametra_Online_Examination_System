import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';

export async function POST(req: NextRequest) {
  try {
    const { subject, topic, type, difficulty, count } = await req.json();

    if (!topic || !count) {
      return NextResponse.json({ error: 'Topic and count are required' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'GEMINI_API_KEY is not configured' }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const modelsToTry = ['gemini-2.5-flash', 'gemini-1.5-flash', 'gemini-flash-latest'];

    // 1. Strict Curriculum & Subject Relevance Validation
    if (subject && subject.trim() && subject.trim().toLowerCase() !== 'general knowledge') {
      const validationPrompt = `You are a strict academic curriculum and syllabus validator.
Selected Subject: "${subject}"
Entered Topic/Syllabus: "${topic}"

Determine whether "${topic}" legitimately belongs to or has clear academic relevance within the curriculum and syllabus of "${subject}".
Examples of mismatches:
- "Topology" belongs to Computer Networks or Mathematics, NOT Database Management Systems.
- "OSI Model" or "TCP/IP" belongs to Computer Networks, NOT Data Structures and Algorithms.
- "Photosynthesis" belongs to Biology, NOT Computer Science.
- "Foreign Key", "Normalization", "B+ Trees", "ACID properties" DO belong to Database Management Systems.

Return ONLY a JSON object:
{
  "isRelevant": boolean,
  "reason": "Detailed explanation of whether this topic belongs to ${subject} or which subject it actually belongs to"
}`;

      let validationResult: { isRelevant: boolean; reason: string } | null = null;

      for (const modelName of modelsToTry) {
        try {
          const model = genAI.getGenerativeModel({ model: modelName });
          const res = await model.generateContent({
            contents: [{ role: 'user', parts: [{ text: validationPrompt }] }],
            generationConfig: {
              responseMimeType: "application/json",
              responseSchema: {
                type: SchemaType.OBJECT,
                properties: {
                  isRelevant: { type: SchemaType.BOOLEAN },
                  reason: { type: SchemaType.STRING },
                },
                required: ["isRelevant", "reason"],
              },
            },
          });
          validationResult = JSON.parse(res.response.text());
          break;
        } catch (err: any) {
          console.warn(`Validation with model ${modelName} failed:`, err.message);
        }
      }

      if (validationResult && validationResult.isRelevant === false) {
        return NextResponse.json(
          {
            error: `Topic mismatch: "${topic}" does not belong to the syllabus of "${subject}". ${validationResult.reason || 'Please enter a topic relevant to this subject.'}`
          },
          { status: 400 }
        );
      }
    }

    // 2. Build Question Generation Schema and Instructions
    let typeInstruction = '';
    let responseSchema: any = {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          text: { type: SchemaType.STRING, description: "The question text" },
          marks: { type: SchemaType.NUMBER, description: "Marks for the question (usually 1, 2, or 3)" },
          type: { type: SchemaType.STRING, description: "The exact type of the question" },
        },
        required: ["text", "marks", "type"]
      }
    };

    if (type === 'mcq' || type === 'multi-select') {
      typeInstruction = `Generate ${count} ${type === 'mcq' ? 'Multiple Choice' : 'Multiple Select (multiple correct answers)'} questions. Provide options.`;
      responseSchema.items.properties.options = {
        type: SchemaType.ARRAY,
        items: {
          type: SchemaType.OBJECT,
          properties: {
            text: { type: SchemaType.STRING, description: "The option text" },
            isCorrect: { type: SchemaType.BOOLEAN, description: "Whether this option is correct" }
          },
          required: ["text", "isCorrect"]
        }
      };
      responseSchema.items.required.push("options");
    } else if (type === 'true-false') {
      typeInstruction = `Generate ${count} True/False questions. Provide exact options 'True' and 'False'.`;
      responseSchema.items.properties.options = {
        type: SchemaType.ARRAY,
        items: {
          type: SchemaType.OBJECT,
          properties: {
            text: { type: SchemaType.STRING, description: "The option text (True or False)" },
            isCorrect: { type: SchemaType.BOOLEAN, description: "Whether this option is correct" }
          },
          required: ["text", "isCorrect"]
        }
      };
      responseSchema.items.required.push("options");
    } else if (type === 'subjective') {
      typeInstruction = `Generate ${count} Subjective (Short Answer/Essay) questions. Provide an expected answer and a grading rubric.`;
      responseSchema.items.properties.expected_answer = { type: SchemaType.STRING, description: "The ideal expected answer for this question." };
      responseSchema.items.properties.rubric = { type: SchemaType.STRING, description: "The grading rubric or rules to evaluate the answer (e.g. 1 mark for X, 1 mark for Y)." };
      responseSchema.items.required.push("expected_answer", "rubric");
    } else {
      typeInstruction = `Generate ${count} Multiple Choice questions. Provide options.`;
      responseSchema.items.properties.options = {
        type: SchemaType.ARRAY,
        items: {
          type: SchemaType.OBJECT,
          properties: {
            text: { type: SchemaType.STRING, description: "The option text" },
            isCorrect: { type: SchemaType.BOOLEAN, description: "Whether this option is correct" }
          },
          required: ["text", "isCorrect"]
        }
      };
      responseSchema.items.required.push("options");
    }

    const prompt = `You are an expert academic professor creating an exam for the subject "${subject || 'General Knowledge'}".
Subject: ${subject || 'General Knowledge'}
Topic / Syllabus: ${topic}
Difficulty: ${difficulty || 'medium'} (Adjust the complexity of the questions accordingly)
${typeInstruction}

CRITICAL RULES:
1. Every generated question MUST strictly belong to the subject "${subject}" and focus on "${topic}".
2. Do not include questions from unrelated subjects.
3. Generate strictly ${count} high-quality questions based on the topic.
4. Ensure the questions are accurate and challenging enough for the difficulty level.
5. Return the output as a JSON array adhering to the schema.
`;

    let result;
    let lastError;

    for (const modelName of modelsToTry) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        result = await model.generateContent({
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          generationConfig: {
            responseMimeType: "application/json",
            responseSchema: responseSchema,
          }
        });
        break; // Stop on first success
      } catch (err: any) {
        console.warn(`Model ${modelName} failed:`, err.message);
        lastError = err;
      }
    }

    if (!result) {
      throw lastError || new Error('All fallback models failed due to high demand.');
    }

    const responseText = result.response.text();
    const questions = JSON.parse(responseText);

    return NextResponse.json({ questions });
  } catch (error: any) {
    console.error('Error generating AI questions:', error);
    return NextResponse.json({ error: error.message || 'Failed to generate questions' }, { status: 500 });
  }
}
