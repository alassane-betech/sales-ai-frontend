"use client";

import { useEffect } from "react";
import { getEventCalendar } from "@/lib/api/calendar-event";

interface CalendarPageProps {
  params: {
    eventId: string;
  };
}

export default function CalendarPage({ params }: CalendarPageProps) {
  const { eventId } = params;

  useEffect(() => {
    const fetchEventCalendar = async () => {
      try {
        const calendarData = await getEventCalendar(eventId);
        console.log("Event calendar data:", calendarData);
      } catch (error) {
        console.error("Error fetching event calendar:", error);
      }
    };

    fetchEventCalendar();
  }, [eventId]);

  return (
    <div>
      <h1>Calendrier des événements</h1>
      <p>Event ID: {eventId}</p>
    </div>
  );
}
