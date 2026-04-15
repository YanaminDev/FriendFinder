import { prisma } from "../../lib/prisma";
import { z } from "zod"

// อนุญาต
const ALLOWED_ACTIONS = ["findMany", "findFirst", "findUnique"] as const;

// Map model names to actual Prisma model names
const MODEL_MAP: Record<string, keyof typeof prisma> = {
  "location": "location",
  "user": "user",
  "user_information": "user_Information",
  "position": "position",
  "location_review": "location_review",
};

const QueryFindLocationForMatchSchema = z.object({
  model: z.enum(["location", "user", "user_information", "position", "location_review"]),
  action: z.enum(ALLOWED_ACTIONS),
  args: z
    .object({
      where: z.record(z.string(), z.unknown()).optional(),
      select: z.record(z.string(), z.boolean()).optional(),
      orderBy: z.record(z.string(), z.unknown()).optional(),
      take: z.number().int().positive().max(5).optional(), // จำกัด max 5 rows
      skip: z.number().int().nonnegative().optional(),
    })
    .optional()
    .default({}),
});

export type QueryFindLocationForMatchSchema = z.infer<typeof QueryFindLocationForMatchSchema>;

export async function QueryFindLocationForMatch(input: unknown) {
  const { model, action, args } = QueryFindLocationForMatchSchema.parse(input);
  const actualModel = MODEL_MAP[model];
  const prismaModel = prisma[actualModel as keyof typeof prisma] as any;
  if (!prismaModel || typeof prismaModel[action] !== "function") {
    throw new Error(`Invalid model or action: ${model}.${action}`);
  }
  const result = await prismaModel[action](args);
  return result;
}


