import { prisma } from "../../lib/prisma";
import { z } from "zod"

// อนุญาต
const ALLOWED_ACTIONS = ["findMany", "findFirst", "findUnique"] as const;

const QueryFindLocationForMatchSchema = z.object({
  model: z.enum(["User_Information","Location" ,]),    
  action: z.enum(ALLOWED_ACTIONS), 
    args: z
    .object({
      where: z.record(z.string(), z.unknown()).optional(),
      select: z.record(z.string(), z.boolean()).optional(),
      orderBy: z.record(z.string(), z.unknown()).optional(),
      take: z.number().int().positive().max(100).optional(), // จำกัด max 100 rows
      skip: z.number().int().nonnegative().optional(),
    })
    .optional()
    .default({}),
});

const QueryFriendFindMatchSchema = z.object({
  model: z.enum(["User_Information","Position", "Find_Match","Location" , ""]),    
  action: z.enum(ALLOWED_ACTIONS),
    args: z
    .object({
      where: z.record(z.string(), z.unknown()).optional(),
      select: z.record(z.string(), z.boolean()).optional(),
      orderBy: z.record(z.string(), z.unknown()).optional(),
      take: z.number().int().positive().max(100).optional(),
      skip: z.number().int().nonnegative().optional(),
    })
    .optional()
    .default({}),
});


export type QueryFindLocationForMatchSchema = z.infer<typeof QueryFindLocationForMatchSchema>; 
export type QueryFriendFindMatchSchema  = z.infer<typeof QueryFriendFindMatchSchema >; 

export async function QueryFindLocationForMatch(input: unknown) {

  const { model, action, args } = QueryFindLocationForMatchSchema.parse(input);
  const prismaModel = prisma[model.toLowerCase() as keyof typeof prisma] as any;
  if (!prismaModel || typeof prismaModel[action] !== "function") {
    throw new Error(`Invalid model or action: ${model}.${action}`);
  }
  const result = await prismaModel[action](args);
  return result;
}


export async function QueryFriendFindMatch(input: unknown) {

  const { model, action, args } = QueryFriendFindMatchSchema.parse(input);
  const prismaModel = prisma[model.toLowerCase() as keyof typeof prisma] as any;
  if (!prismaModel || typeof prismaModel[action] !== "function") {
    throw new Error(`Invalid model or action: ${model}.${action}`);
  }
  const result = await prismaModel[action](args);
  return result;
}