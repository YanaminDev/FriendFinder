import "dotenv/config";
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

export async function askAI(
  userMessage: string,
  queryFn: (input: unknown) => Promise<unknown> 
): Promise<AIResponse> {
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

  const messages: Anthropic.MessageParam[] = [
    { role: "user", content: userMessage },
  ];

  while (true) {
    const response = await claude.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1024,
      system: systemInstruction,
      tools,
      messages,
    });

    messages.push({ role: "assistant", content: response.content });

    if (response.stop_reason === "end_turn") {
      const raw = response.content.reduce(
        (acc, b) => (b.type === "text" ? acc + b.text : acc),
        ""
      );

      try {
        const clean = raw.replace(/```json|```/g, "").trim();
        return JSON.parse(clean) as AIResponse;
      } catch {
        return {
          success: false,
          message: "Failed to parse AI response",
          data: null,
        };
      }
    }

    if (response.stop_reason === "tool_use") {
      const toolResults: Anthropic.ToolResultBlockParam[] = [];

      for (const block of response.content) {
        if (block.type !== "tool_use") continue;

        let result: unknown;

        try {
          result = await queryFn(block.input); 
        } catch (err: unknown) {
          result = {
            error: err instanceof Error ? err.message : "Query failed",
          };
        }

        toolResults.push({
          type: "tool_result",
          tool_use_id: block.id,
          content: JSON.stringify(result),
        });
      }

      messages.push({ role: "user", content: toolResults });
    }
  }
}