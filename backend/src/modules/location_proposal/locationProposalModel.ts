import { z } from "zod";

export const CreateLocationProposalSchema = z.object({
  match_id: z.string(),
  proposer_id: z.string(),
  location_id: z.string(),
});

export const RespondLocationProposalSchema = z.object({
  id: z.string(),
  status: z.enum(["accepted", "rejected"]),
});

export type CreateLocationProposal = z.infer<typeof CreateLocationProposalSchema>;
export type RespondLocationProposal = z.infer<typeof RespondLocationProposalSchema>;
