"use client";

import { useEffect, useState } from "react";
import { getEventCalendar } from "@/lib/api/calendar-event";
import { FormStep } from "@/components/calendar/form-step";
import { BookingStep } from "@/components/calendar/booking-step";
import { TwoStepProgress } from "@/components/calendar/two-step-progress";
import { CheckCircle, Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";

interface CalendarPageProps {
  params: {
    eventId: string;
  };
}

interface EventData {
  id: string;
  name: string;
  description: string;
  duration_minutes: number;
  slots_incrementes: number;
  creator?: {
    first_name: string;
    last_name: string;
    email: string;
    phone_number?: string;
  };
  questions?: any[];
}

interface FormData {
  phone: string;
  name: string;
  email?: string;
  answers?: { [key: string]: string };
}

export default function CalendarPage({ params }: CalendarPageProps) {
  const { eventId } = params;
  const [eventData, setEventData] = useState<EventData | null>(null);
  const [currentStep, setCurrentStep] = useState<"form" | "booking">("form");
  const [formData, setFormData] = useState<FormData | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | undefined>(
    undefined
  );
  const [isBookingConfirmed, setIsBookingConfirmed] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);

  useEffect(() => {
    const fetchEventCalendar = async () => {
      try {
        const calendarData = await getEventCalendar(eventId);
        console.log("Event calendar data:", calendarData);
        setEventData(calendarData);
      } catch (error) {
        console.error("Error fetching event calendar:", error);
        // Données de démonstration pour le développement
        setEventData({
          id: eventId,
          name: "30 Minute Meeting",
          description: "Réunion de 30 minutes pour discuter de votre projet",
          duration_minutes: 30,
          slots_incrementes: 30,
          creator: {
            first_name: "Reggie",
            last_name: "Peterson",
            email: "reggie@example.com",
            phone_number: "+1234567890",
          },
        });
      }
    };

    fetchEventCalendar();
  }, [eventId]);

  const handleFormSubmit = (data: FormData) => {
    setFormData(data);
    setCurrentStep("booking");
  };

  const handleGoBackToForm = () => {
    setCurrentStep("form");
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };

  const handleConfirmBooking = async () => {
    setIsConfirming(true);
    // Simuler un délai de confirmation
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Logique de confirmation de réservation
    console.log("Réservation confirmée:", {
      formData,
      selectedDate,
      selectedTime,
      eventData,
    });

    setIsBookingConfirmed(true);
    setIsConfirming(false);
    // Ici vous pourriez appeler une API pour confirmer la réservation
  };

  const handleNewBooking = () => {
    setFormData(null);
    setSelectedDate(undefined);
    setSelectedTime(undefined);
    setCurrentStep("form");
    setIsBookingConfirmed(false);
    setIsConfirming(false);
  };

  if (!eventData) {
    return (
      <div className="min-h-screen bg-[#18181B] flex items-center justify-center">
        <div className="text-white">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#18181B] via-[#1a1a1d] to-[#202023] text-white flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-[#1E1E21] rounded-2xl shadow-2xl border border-[#007953]/20 overflow-hidden">
        {/* Progress Steps - Above everything */}
        <div className="px-8 py-6 bg-[#1E1E21] border-b border-[#232327]">
          <TwoStepProgress currentStep={currentStep} className="mb-0" />
        </div>

        <div className="flex flex-col lg:flex-row min-h-[600px]">
          {/* Form Section */}
          <div className="w-full lg:w-1/2 p-8 flex flex-col justify-center bg-[#1E1E21]">
            <FormStep
              eventData={eventData}
              onContinue={handleFormSubmit}
              onGoBack={handleGoBackToForm}
              className="w-full"
              questions={eventData.questions}
              isReadOnly={currentStep === "booking"}
            />
          </div>

          {/* Divider */}
          <div className="w-px bg-[#232327] hidden lg:block"></div>

          {/* Booking Section */}
          <div className="w-full lg:w-1/2 p-8 flex flex-col justify-center bg-[#232327] relative">
            <div className="w-full">
              {/* Step Content */}
              {currentStep === "form" && (
                <div className="text-center relative">
                  <CalendarIcon className="w-16 h-16 text-[#9D9DA8] mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">
                    Book your event
                  </h3>
                  <p className="text-[#9D9DA8] text-sm">
                    Please fill out the form before choosing your time slot.
                  </p>

                  {/* Calendar with overlay */}
                  <div className="mt-8 relative">
                    <div className="opacity-30 pointer-events-none">
                      <Calendar
                        selected={undefined}
                        onSelect={() => {}}
                        mode="single"
                        required
                        className="w-full rounded-2xl"
                      />
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-[#1E1E21] rounded-lg p-4 shadow-lg border border-[#007953]/20 max-w-xs text-center">
                        <p className="text-white text-sm">
                          Please fill out the form before choosing your time
                          slot.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {currentStep === "booking" && !isBookingConfirmed && (
                <BookingStep
                  eventData={eventData}
                  selectedDate={selectedDate}
                  selectedTime={selectedTime}
                  onDateSelect={handleDateSelect}
                  onTimeSelect={handleTimeSelect}
                  onConfirm={handleConfirmBooking}
                  isConfirming={isConfirming}
                  className="w-full"
                />
              )}

              {isBookingConfirmed && (
                <div className="text-center">
                  <div className="mb-8">
                    <CheckCircle className="w-20 h-20 text-[#007953] mx-auto mb-6" />
                    <h3 className="text-2xl md:text-4xl font-bold text-white mb-4">
                      Réservation confirmée !
                    </h3>
                    <p className="text-[#9D9DA8] text-lg mb-6">
                      Votre réservation a été confirmée avec succès
                    </p>

                    <div className="bg-[#1E1E21] rounded-xl p-6 mb-8 border border-[#007953]/20 shadow-sm">
                      <div className="text-[#9D9DA8] text-sm mb-3">
                        Détails de votre réservation
                      </div>
                      <div className="text-white font-medium text-lg mb-2">
                        {selectedDate?.toLocaleDateString("fr-FR", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </div>
                      <div className="text-[#9D9DA8] text-base">
                        {selectedTime} - {eventData?.duration_minutes} minutes
                      </div>
                      <div className="text-[#9D9DA8] text-sm mt-2">
                        avec {eventData?.creator?.first_name}{" "}
                        {eventData?.creator?.last_name}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <p className="text-[#9D9DA8] text-sm">
                      Un email de confirmation a été envoyé à votre adresse
                      email
                    </p>

                    <button
                      onClick={handleNewBooking}
                      className="px-6 py-2 border border-[#007953]/30 text-white hover:bg-[#007953]/20 rounded-lg transition-colors"
                    >
                      Nouvelle réservation
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-[#232327] px-8 py-4 bg-[#1E1E21]">
          <div className="text-center text-[#9D9DA8] text-sm">
            Powered by <span className="font-semibold text-white">ShowUp</span>
          </div>
        </div>
      </div>
    </div>
  );
}
