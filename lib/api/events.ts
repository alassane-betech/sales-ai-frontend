import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// Récupérer un événement par ID
export const getEventById = async (eventId: string) => {
  const response = await axios.get(`${API_BASE_URL}/events/${eventId}`);
  return response.data;
};

// Créer un événement
export const createEvent = async (eventData: any) => {
  const response = await axios.post(`${API_BASE_URL}/events`, eventData);
  return response.data;
};

// Modifier un événement
export const updateEvent = async (eventId: string, updateData: any) => {
  const response = await axios.put(
    `${API_BASE_URL}/events/${eventId}`,
    updateData
  );
  return response.data;
};

// Récupérer les événements d'une organisation
export const getEventsByOrganization = async (organizationId: string) => {
  const response = await axios.get(
    `${API_BASE_URL}/events/organization/${organizationId}`
  );
  return response.data;
};

// Récupérer les questions d'un événement
export const getEventQuestions = async (
  eventId: string,
  includeInactive: boolean = false
) => {
  const response = await axios.get(
    `${API_BASE_URL}/events/${eventId}/questions`,
    {
      params: {
        includeInactive: includeInactive.toString(),
      },
    }
  );
  return response.data;
};

// Interface pour les options de question
export interface QuestionOption {
  label: string;
  value: string;
  position: number;
}

// Interface pour les données de question
export interface QuestionData {
  label: string;
  help_text: string;
  type:
    | "short_answer"
    | "long_answer"
    | "multiple_choice"
    | "radio"
    | "number"
    | "date";
  is_required: boolean;
  is_active: boolean;
  options?: QuestionOption[];
  min_length?: number;
  max_length?: number;
  min_number?: number;
  max_number?: number;
  earliest_date?: string;
  latest_date?: string;
}

// Fonction pour ajouter une question à un événement
export const addEventQuestion = async (
  eventId: string,
  questionData: QuestionData
) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/events/${eventId}/questions`,
      questionData
    );
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la création de la question:", error);

    if (axios.isAxiosError(error)) {
      if (error.response) {
        // Erreur de réponse du serveur
        const { status, data } = error.response;
        throw new Error(
          `Erreur ${status}: ${data.message || "Erreur inconnue"}`
        );
      } else if (error.request) {
        // Erreur de réseau
        throw new Error("Erreur de connexion au serveur");
      }
    }
    // Autre erreur
    throw new Error("Erreur inattendue");
  }
};

// Fonction pour supprimer une question d'un événement
export const deleteEventQuestion = async (
  eventId: string,
  questionId: string
) => {
  try {
    const response = await axios.delete(
      `${API_BASE_URL}/events/${eventId}/questions/${questionId}`
    );
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la suppression de la question:", error);

    if (axios.isAxiosError(error)) {
      if (error.response) {
        // Erreur de réponse du serveur
        const { status, data } = error.response;
        throw new Error(
          `Erreur ${status}: ${data.message || "Erreur inconnue"}`
        );
      } else if (error.request) {
        // Erreur de réseau
        throw new Error("Erreur de connexion au serveur");
      }
    }
    // Autre erreur
    throw new Error("Erreur inattendue");
  }
};
