import { prisma } from "../../../lib/prisma";
import { CreateLocationProposal, RespondLocationProposal } from "./locationProposalModel";

export const locationProposalRepository = {
  // Create a proposal. Supersede any existing pending proposal for the same match.
  create: async (data: CreateLocationProposal) => {
    await prisma.location_Proposal.updateMany({
      where: { match_id: data.match_id, status: "pending" },
      data: { status: "rejected" },
    });
    return await prisma.location_Proposal.create({
      data: {
        match_id: data.match_id,
        proposer_id: data.proposer_id,
        location_id: data.location_id,
      },
      include: {
        location: true,
        proposer: { select: { user_id: true, user_show_name: true } },
      },
    });
  },

  // Return the latest pending proposal for this match (if any)
  getLatestPendingByMatch: async (match_id: string) => {
    return await prisma.location_Proposal.findFirst({
      where: { match_id, status: "pending" },
      orderBy: { createdAt: "desc" },
      include: {
        location: true,
        proposer: { select: { user_id: true, user_show_name: true } },
      },
    });
  },

  // Respond accepted/rejected. On accepted, set Match.location_id.
  respond: async (data: RespondLocationProposal) => {
    const proposal = await prisma.location_Proposal.update({
      where: { id: data.id },
      data: { status: data.status },
      include: { location: true },
    });

    if (data.status === "accepted" && proposal.location_id) {
      await prisma.match.update({
        where: { id: proposal.match_id },
        data: { location_id: proposal.location_id },
      });
    }

    return proposal;
  },
};
