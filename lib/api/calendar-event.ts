import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// Récupérer les données du calendrier d'un événement
export const getEventCalendar = async (eventId: string) => {
  const response = await axios.get(
    `${API_BASE_URL}/events/${eventId}/calendar`
  );
  return response.data;
};
