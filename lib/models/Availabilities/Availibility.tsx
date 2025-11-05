import { AvailabilityDay } from "./AvailabilityDay";

export interface Availability {
  id: string;
  user_id: string;
  is_active: boolean;
  name: string;
  timezone: string;
  days: AvailabilityDay[];
}

export interface NewAvailabilityBody {
  user_id: string;
  is_active: boolean;
  organization_id: string;
  timezone: string; 
  name: string;
}