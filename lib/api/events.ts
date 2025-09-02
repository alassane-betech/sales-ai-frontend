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
