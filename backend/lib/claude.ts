import "dotenv/config"
import Anthropic from "@anthropic-ai/sdk";
import { getSchemaAsText } from "../src/tools/schemaReader";

interface AIResponse {
  success: boolean;
  message: string;
  data: unknown[] | unknown | null;
}

export const claude = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
});

// Tool definition ที่ส่งให้ Claude รู้จัก
const tools: Anthropic.Tool[] = [
  {
    name: "query",
    description: "Query the database using Prisma. Use this to retrieve data.",
    input_schema: {
      type: "object",
      properties: {
        model: {
          type: "string",
          description: "read all table in schema",
        },
        action: {
          type: "string",
          description: "The Prisma action: findMany, findFirst, findUnique",
        },
        args: {
          type: "object",
          description: "Prisma query arguments (where, select, orderBy, take, skip)",
          properties: {},
        },
      },
      required: ["model", "action"],
    },
  },
];

export async function askAI(userMessage: string): Promise<AIResponse> {
    const schemaText = getSchemaAsText();

    const systemInstruction = `
    You are an AI assistant that helps users query a database.
    You have access to the following database schema:

    ${schemaText}

    Rules:
    - Always use the "query" tool to retrieve data. Never answer from memory.
    - Never write raw SQL.
    - Only use the models and fields defined in the schema above.
    - Always respond in JSON object format only. No extra text outside the JSON.

    Response format:
    {
    "success": true,
    "message": "อธิบายสั้นๆ ว่าทำอะไร",
    "data": [] or {}
    }

    If error:
    {
    "success": false,
    "message": "อธิบายว่าเกิด error อะไร",
    "data": null
    }
  `.trim();

  const response = await claude.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 1024,
    system: systemInstruction,
    tools,
    messages: [
      {
        role: "user",
        content: userMessage,
      },
    ],
  });


  const raw = response.content.reduce((acc, b) =>
    b.type === "text" ? acc + b.text : acc,
    ""
  );

  try {
    const clean = raw.replace(/```json|```/g, "").trim();
    return JSON.parse(clean) as AIResponse;
  } catch {
    // ถ้า parse ไม่ได้ return error object แทน
    return {
      success: false,
      message: "Failed to parse AI response",
      data: null,
    };
  }
  
}