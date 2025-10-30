import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export interface EventInfo {
  id: string;
  name: string;
  slug: string;
  organization_id: string;
  location_type: "phone" | "google_meet" | "zoom";
  duration_minutes: number;
  is_active: boolean;
}

export interface Lead {
  id: string;
  nom?: string;
  prenom?: string;
  company?: string;
  email?: string;
  phone?: string;
  source: "scheduler" | "whatsapp" | "email_drip" | "manual";
  status: "new" | "contacted" | "qualified" | "unqualified" | "nurturing";
  score?: number;
  event_id?: string;
  event?: EventInfo;
  created_at?: string;
  updated_at?: string;
}

interface Interaction {
  id: string;
  type: "booking" | "whatsapp" | "call" | "email";
  date: string;
  details: {
    booking?: { date: string; link: string };
    whatsapp?: { transcript: string };
    call?: { duration: string; recording?: string };
    email?: { subject: string; status: "sent" | "opened" | "clicked" };
  };
}

interface Event {
  id: string;
  organization_id: string;
  name: string;
  slug: string;
  description?: string;
  location_type: "phone" | "google_meet" | "zoom";
  created_by: string;
  confirmation_redirect_url?: string;
  internal_note?: string;
  max_days_ahead?: number;
  min_notice_minutes?: number;
  duration_minutes: number;
  slot_increment_minutes: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Récupérer les leads d'un event spécifique
export const getLeadsByEvent = async (eventId: string): Promise<Lead[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/leads`, {
      params: {
        event_id: eventId,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des leads:", error);
    if (axios.isAxiosError(error)) {
      if (error.response) {
        throw new Error(
          `Erreur ${error.response.status}: ${
            error.response.data?.message || "Erreur inconnue"
          }`
        );
      } else if (error.request) {
        throw new Error("Erreur de connexion au serveur");
      }
    }
    throw new Error("Erreur inattendue");
  }
};

// Récupérer tous les leads d'une organisation
export const getLeadsByOrganization = async (
  organizationId: string
): Promise<Lead[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/leads`, {
      params: {
        organization_id: organizationId,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des leads:", error);
    if (axios.isAxiosError(error)) {
      if (error.response) {
        throw new Error(
          `Erreur ${error.response.status}: ${
            error.response.data?.message || "Erreur inconnue"
          }`
        );
      } else if (error.request) {
        throw new Error("Erreur de connexion au serveur");
      }
    }
    throw new Error("Erreur inattendue");
  }
};

// Exporter le type Event pour utilisation dans les composants
export type { Event };
