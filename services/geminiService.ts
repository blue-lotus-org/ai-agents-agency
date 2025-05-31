
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { GEMINI_MODEL_NAME } from '../constants';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable is not set. Please ensure it's available.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export const generateAgentCode = async (taskDescription: string): Promise<string> => {
  if (!taskDescription.trim()) {
    throw new Error("Task description cannot be empty.");
  }

  // System instruction to guide the AI.
  const systemInstruction = `You are an expert AI Agent Code Generator. Your primary function is to generate JavaScript (Node.js compatible) code for an AI agent based on a user's task description.

Guidelines for code generation:
1.  **Language:** JavaScript (Node.js compatible).
2.  **Structure:** The agent should ideally be a self-contained function or a class.
3.  **Comments:** Include clear, concise comments explaining the functionality of major code parts.
4.  **Usability:** The generated code should be directly usable or provide a clear template.
5.  **Clarity:** If the task is too complex for a simple snippet or requires external APIs not easily mockable, provide a conceptual outline or a class structure with clear TODO comments indicating where external logic/API calls would go.
6.  **Output Format:** Output ONLY the JavaScript code block itself, wrapped in \`\`\`javascript ... \`\`\`. Do NOT include any other explanatory text, greetings, or apologies before or after the code block.

Example for a simple task: "an agent that greets a user":

\`\`\`javascript
/**
 * Agent that greets a user.
 * @param {string} userName - The name of the user to greet.
 * @returns {string} A greeting message.
 */
function greetingAgent(userName) {
  if (!userName || typeof userName !== 'string' || userName.trim() === '') {
    // Handle cases with no or invalid username
    return "Hello, mysterious guest! Please provide a valid name.";
  }
  return \`Hello, \${userName}! Welcome to the system.\`;
}

// Example usage (can be commented out or included for testing):
// const user = "Alice";
// console.log(greetingAgent(user)); // Output: Hello, Alice! Welcome to the system.
// console.log(greetingAgent("")); // Output: Hello, mysterious guest! Please provide a valid name.
\`\`\`

Now, proceed to generate the JavaScript code based on the user's task.
`;

  const userPrompt = `User's Task: "${taskDescription}"`;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: GEMINI_MODEL_NAME,
      contents: [{ role: "user", parts: [{text: userPrompt}] }],
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.5, // Moderately creative but still grounded
        topP: 0.9,
        topK: 40,
      }
    });
    
    let codeContent = response.text.trim();
    
    // Regex to extract code from ```javascript ... ``` block
    const jsCodeBlockRegex = /^```javascript\s*([\s\S]*?)\s*```$/s;
    const match = codeContent.match(jsCodeBlockRegex);

    if (match && match[1]) {
      codeContent = match[1].trim();
    } else if (codeContent.startsWith('```') && codeContent.endsWith('```')) {
      // Fallback for generic markdown block if specific 'javascript' is missing
      const genericCodeBlockRegex = /^```(?:\w*\s*)?\n?([\s\S]*?)\n?\s*```$/s;
      const genericMatch = codeContent.match(genericCodeBlockRegex);
      if (genericMatch && genericMatch[1]) {
         codeContent = genericMatch[1].trim();
      }
    }
    // If no markdown fence is found, assume the entire response is the code, but this is less ideal.

    if (!codeContent) {
        // This might happen if the model returns an empty response or something unexpected.
        console.warn("Gemini API returned an empty or unparseable code block. Full response text:", response.text);
        throw new Error("The AI failed to generate a valid code structure. The response was empty or not in the expected format.");
    }

    return codeContent;

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error && error.message.includes('API_KEY_INVALID')) {
        throw new Error("Invalid API Key. Please check your Gemini API key configuration.");
    }
    throw new Error(`An error occurred while communicating with the AI: ${error instanceof Error ? error.message : String(error)}`);
  }
};
