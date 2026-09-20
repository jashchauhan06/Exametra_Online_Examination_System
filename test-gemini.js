const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const modelsToTest = [
  'gemini-2.5-pro',
  'gemini-3.1-pro-preview',
  'gemini-3.7-flash'
];

async function run() {
  for (const modelName of modelsToTest) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent('Say hello');
      console.log(`[SUCCESS] ${modelName} works!`);
      break; // Stop on first success
    } catch (e) {
      console.log(`[FAILED] ${modelName}: ${e.message}`);
    }
  }
}

run();
