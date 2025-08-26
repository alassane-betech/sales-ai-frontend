import axios from "axios";

// Configuration d'axios avec l'URL de base
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export interface Organization {
  organization_id: string;
  organization_name: string;
  branding: string;
  role: "owner" | "admin" | "member";
  memberCount: number;
  created_at: string;
  updated_at: string;
}

export interface TeamMember {
  user_id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: "owner" | "admin" | "closer";
  status: "accepted" | "pending" | "rejected";
  joined_at: string;
}

// Récupérer toutes les organisations de l'utilisateur connecté
export const getUserOrganizations = async (): Promise<Organization[]> => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/organizations/my-organizations`
    );
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des organisations:", error);
    throw error;
  }
};

// Récupérer une organisation spécifique par son ID
export const getOrganizationById = async (
  organizationId: string
): Promise<Organization> => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/organizations/${organizationId}`
    );
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération de l'organisation:", error);
    throw error;
  }
};

// Récupérer les membres d'une organisation
export const getOrganizationMembers = async (
  organizationId: string
): Promise<TeamMember[]> => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/organizations/${organizationId}/members`
    );
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des membres:", error);
    throw error;
  }
};
