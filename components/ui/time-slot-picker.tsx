"use client";

import * as React from "react";
import { Clock, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface TimeSlot {
  time: string;
  available: boolean;
  isSelected?: boolean;
}

interface TimeSlotPickerProps {
  selectedDate?: Date;
  selectedTime?: string;
  onTimeSelect?: (time: string) => void;
  duration?: number; // en minutes
  startHour?: number;
  endHour?: number;
  className?: string;
}

const generateTimeSlots = (
  startHour: number = 9,
  endHour: number = 18,
  duration: number = 30
): TimeSlot[] => {
  const slots: TimeSlot[] = [];
  const totalMinutes = (endHour - startHour) * 60;
  const numberOfSlots = Math.floor(totalMinutes / duration);

  for (let i = 0; i < numberOfSlots; i++) {
    const totalMinutes = startHour * 60 + i * duration;
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    const timeString = `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}`;

    // Simuler la disponibilité (dans un vrai app, ceci viendrait de l'API)
    const isAvailable = Math.random() > 0.3; // 70% de disponibilité

    slots.push({
      time: timeString,
      available: isAvailable,
    });
  }

  return slots;
};

export function TimeSlotPicker({
  selectedDate,
  selectedTime,
  onTimeSelect,
  duration = 30,
  startHour = 9,
  endHour = 18,
  className,
}: TimeSlotPickerProps) {
  const [timeSlots, setTimeSlots] = React.useState<TimeSlot[]>([]);

  React.useEffect(() => {
    const slots = generateTimeSlots(startHour, endHour, duration);
    setTimeSlots(slots);
  }, [startHour, endHour, duration]);

  const handleTimeSelect = (time: string) => {
    if (onTimeSelect) {
      onTimeSelect(time);
    }
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours);
    const min = parseInt(minutes);

    if (hour === 0) return `12:${min.toString().padStart(2, "0")} AM`;
    if (hour < 12) return `${hour}:${min.toString().padStart(2, "0")} AM`;
    if (hour === 12) return `12:${min.toString().padStart(2, "0")} PM`;
    return `${hour - 12}:${min.toString().padStart(2, "0")} PM`;
  };

  if (!selectedDate) {
    return (
      <div className={cn("text-center py-8", className)}>
        <Clock className="h-12 w-12 text-[#9D9DA8] mx-auto mb-4" />
        <p className="text-[#9D9DA8]">Sélectionnez d'abord une date</p>
      </div>
    );
  }

  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-center gap-2 mb-4">
        <Clock className="h-5 w-5 text-[#007953]" />
        <h3 className="text-lg font-semibold text-white">
          Choisissez un horaire
        </h3>
      </div>

      <div className="text-sm text-[#9D9DA8] mb-4">
        {selectedDate.toLocaleDateString("fr-FR", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-64 overflow-y-auto">
        {timeSlots.map((slot) => (
          <Button
            key={slot.time}
            variant="outline"
            size="sm"
            onClick={() => handleTimeSelect(slot.time)}
            disabled={!slot.available}
            className={cn(
              "h-10 text-sm font-medium transition-all duration-200 relative",
              slot.available
                ? "border-[#007953]/30 text-white hover:bg-[#007953] hover:text-white hover:border-[#007953]"
                : "border-[#9D9DA8]/20 text-[#9D9DA8]/50 cursor-not-allowed",
              selectedTime === slot.time && slot.available
                ? "bg-[#007953] text-white border-[#007953] shadow-lg"
                : ""
            )}
          >
            {formatTime(slot.time)}
            {selectedTime === slot.time && slot.available && (
              <Check className="h-3 w-3 ml-1" />
            )}
            {!slot.available && (
              <div className="absolute inset-0 bg-[#9D9DA8]/10 rounded-md" />
            )}
          </Button>
        ))}
      </div>

      {timeSlots.filter((slot) => slot.available).length === 0 && (
        <div className="text-center py-8">
          <Clock className="h-12 w-12 text-[#9D9DA8] mx-auto mb-4" />
          <p className="text-[#9D9DA8]">Aucun créneau disponible ce jour</p>
        </div>
      )}
    </div>
  );
}
