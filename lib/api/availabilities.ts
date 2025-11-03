import axios from "axios";
import { Availability, NewAvailabilityBody } from "../models/Availabilities/Availibility";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const getAvailabilites = async () => {
  const response = await axios.get(`${API_BASE_URL}/availability`);
  return response.data.availabilities;
};

export const updateAvailability = async (availability: Availability) => {
  const response = await axios.put(`${API_BASE_URL}/availability`, availability);
  return response.data;
};

export const createAvailability = async (availability: NewAvailabilityBody): Promise<Omit<Availability, 'days'>> => {
  const response = await axios.post(`${API_BASE_URL}/availability`, availability);
  return response.data as Omit<Availability, 'days'>;
};