import axios from "axios";

// Configuration d'axios avec l'URL de base
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export interface InvitationRequest {
  invited_emails: string[];
}

export interface InvitationResponse {
  success: boolean;
  message: string;
  invitations_sent: number;
  failed_emails?: string[];
}

// Envoyer des invitations à des membres d'équipe
export const sendTeamInvitations = async (
  organizationId: string,
  invitedEmails: string[]
): Promise<InvitationResponse> => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/organizations/${organizationId}/invitations`,
      {
        invited_emails: invitedEmails,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Erreur lors de l'envoi des invitations:", error);
    throw error;
  }
};
