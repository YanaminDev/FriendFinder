import {
  CREATE_LOCATION_PROPOSAL,
  GET_LOCATION_PROPOSAL_BY_MATCH,
  RESPOND_LOCATION_PROPOSAL,
} from "../api/endpoint";
import mainApi from "../api/main.api";

export interface LocationProposal {
  id: string;
  match_id: string;
  proposer_id: string;
  location_id: string;
  status: "pending" | "accepted" | "rejected";
  createdAt: string;
  location?: {
    id: string;
    name: string;
    description?: string;
    activity_id: string;
    position_id: string;
  };
  proposer?: { user_id: string; user_show_name: string };
}

export const createLocationProposal = async (data: {
  match_id: string;
  location_id: string;
}): Promise<LocationProposal> => {
  try {
    return await mainApi.post<LocationProposal>(CREATE_LOCATION_PROPOSAL, data);
  } catch (error) {
    console.error("Error creating location proposal:", error);
    throw error;
  }
};

export const getLocationProposalByMatch = async (
  match_id: string
): Promise<LocationProposal | null> => {
  try {
    const endpoint = GET_LOCATION_PROPOSAL_BY_MATCH.replace(":match_id", match_id);
    return await mainApi.get<LocationProposal | null>(endpoint);
  } catch (error) {
    console.error("Error fetching location proposal:", error);
    throw error;
  }
};

export const respondLocationProposal = async (
  id: string,
  status: "accepted" | "rejected"
): Promise<LocationProposal> => {
  try {
    return await mainApi.put<LocationProposal>(RESPOND_LOCATION_PROPOSAL, { id, status });
  } catch (error) {
    console.error("Error responding to location proposal:", error);
    throw error;
  }
};
