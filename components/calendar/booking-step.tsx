"use client";

import * as React from "react";
import { Calendar } from "@/components/ui/calendar";
import { TimeSlotPicker } from "@/components/ui/time-slot-picker";
import { Button } from "@/components/ui/button";
import { CheckCircle, Calendar as CalendarIcon } from "lucide-react";

interface BookingStepProps {
  eventData: {
    id: string;
    name: string;
    description: string;
    duration_minutes: number;
    creator?: {
      first_name: string;
      last_name: string;
    };
  };
  selectedDate?: Date;
  selectedTime?: string;
  onDateSelect: (date: Date) => void;
  onTimeSelect: (time: string) => void;
  onConfirm: () => void;
  isConfirming?: boolean;
  className?: string;
}

export function BookingStep({
  eventData,
  selectedDate,
  selectedTime,
  onDateSelect,
  onTimeSelect,
  onConfirm,
  isConfirming = false,
  className,
}: BookingStepProps) {
  const [currentView, setCurrentView] = React.useState<
    "calendar" | "time" | "confirm"
  >("calendar");

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      onDateSelect(date);
      setCurrentView("time");
    }
  };

  const handleTimeSelect = (time: string) => {
    onTimeSelect(time);
    setCurrentView("confirm");
  };

  const handleConfirm = () => {
    onConfirm();
  };

  const goBackToCalendar = () => {
    setCurrentView("calendar");
  };

  const goBackToTime = () => {
    setCurrentView("time");
  };

  return (
    <div className={className}>
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-lg font-bold text-white mb-1">
            {eventData.name}
          </h2>
          <p className="text-[#9D9DA8] text-sm">
            avec {eventData.creator?.first_name} {eventData.creator?.last_name}
          </p>
        </div>

        {/* Calendar View */}
        {currentView === "calendar" && (
          <div>
            <h3 className="text-lg font-bold text-white mb-4 text-center">
              Sélectionnez une date
            </h3>
            <div className="bg-[#1E1E21] rounded-lg border border-[#007953]/20 shadow-sm">
              <Calendar
                selected={selectedDate}
                onSelect={handleDateSelect}
                mode="single"
                required
                className="w-full rounded-2xl"
              />
            </div>
          </div>
        )}

        {/* Time Selection View */}
        {currentView === "time" && selectedDate && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">
                Choisissez un horaire
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={goBackToCalendar}
                className="text-[#9D9DA8] hover:text-white"
              >
                Changer la date
              </Button>
            </div>
            <div className="bg-[#1E1E21] rounded-lg p-4 border border-[#007953]/20 shadow-sm">
              <TimeSlotPicker
                selectedDate={selectedDate}
                selectedTime={selectedTime}
                onTimeSelect={handleTimeSelect}
                duration={eventData.duration_minutes}
                className="w-full"
              />
            </div>
          </div>
        )}

        {/* Confirmation View */}
        {currentView === "confirm" && selectedDate && selectedTime && (
          <div className="text-center">
            <div className="mb-6">
              <CheckCircle className="w-12 h-12 text-[#007953] mx-auto mb-4" />
              <h3 className="text-lg font-bold text-white mb-4">
                Confirmer votre réservation
              </h3>

              <div className="bg-[#1E1E21] rounded-lg p-4 mb-4 border border-[#007953]/20 shadow-sm">
                <div className="text-[#9D9DA8] text-sm mb-2">
                  Détails de votre réservation
                </div>
                <div className="text-white font-medium text-base mb-1">
                  {selectedDate.toLocaleDateString("fr-FR", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>
                <div className="text-[#9D9DA8] text-sm">
                  {selectedTime} - {eventData.duration_minutes} minutes
                </div>
                <div className="text-[#9D9DA8] text-xs mt-1">
                  avec {eventData.creator?.first_name}{" "}
                  {eventData.creator?.last_name}
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 justify-center">
              <Button
                onClick={goBackToTime}
                variant="outline"
                className="flex-1 border-[#007953]/30 text-white hover:bg-[#007953]/20"
              >
                Modifier
              </Button>
              <Button
                onClick={handleConfirm}
                disabled={isConfirming}
                className="flex-1 bg-[#007953] hover:bg-[#00a86b] text-white"
              >
                {isConfirming ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Confirmation...</span>
                  </div>
                ) : (
                  "Confirmer la réservation"
                )}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
