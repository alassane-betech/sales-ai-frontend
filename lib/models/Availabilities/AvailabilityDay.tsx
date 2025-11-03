export enum Weekday {
  MONDAY = 0,
  TUESDAY = 1,
  WEDNESDAY = 2,
  THURSDAY = 3,
  FRIDAY = 4,
  SATURDAY = 5,
  SUNDAY = 6,
}

export interface AvailabilityDay {
  weekday: Weekday;
  enabled: boolean;
  weekday_name: string;
  slots: TimeSlot[];
}

export interface TimeSlot {
  id: string;
  start_time: string;
  end_time: string;
  buffer_minutes: number;
}
