import axios from "axios";

// Configuration d'axios avec l'URL de base
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export interface SettingsCampaign {
  id: string;
  event_id: string;
  name: string;
  system_prompt: string;
  delay: number;
  call_to_action: string;
  is_active: boolean;
}

export interface CreateCampaignData {
  event_id: string;
  name: string;
  system_prompt: string;
  delay: number;
  call_to_action: string;
  is_active: boolean;
}

// Créer une nouvelle campagne
export const createCampaign = async (
  campaignData: CreateCampaignData
): Promise<SettingsCampaign> => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/settings-campaign`,
      campaignData
    );
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la création de la campagne:", error);
    throw error;
  }
};

export interface UpdateCampaignData {
  name: string;
  system_prompt: string;
  delay: number;
  call_to_action: string;
  is_active: boolean;
}

// Modifier une campagne
export const updateCampaign = async (
  campaignId: string,
  campaignData: UpdateCampaignData
): Promise<SettingsCampaign> => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/settings-campaign/${campaignId}`,
      campaignData
    );
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la modification de la campagne:", error);
    throw error;
  }
};
