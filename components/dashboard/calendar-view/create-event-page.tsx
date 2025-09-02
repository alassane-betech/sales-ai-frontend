"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  Users,
  Clock,
  HelpCircle,
  XCircle,
  Bell,
} from "lucide-react";
import { getEventById } from "@/lib/api/events";
import EventDetailsStep, {
  validateEventDetails,
  prepareEventDetailsData,
} from "./steps/event-details-step";
import HostsStep, { validateHosts, prepareHostsData } from "./steps/hosts-step";
import EventTimeStep, {
  validateEventTime,
  prepareEventTimeData,
} from "./steps/event-time-step";
import InviteeQuestionsStep, {
  validateInviteeQuestions,
  prepareInviteeQuestionsData,
} from "./steps/invitee-questions-step";
import DisqualificationsStep, {
  validateDisqualifications,
  prepareDisqualificationsData,
} from "./steps/disqualifications-step";
import NotificationsStep, {
  validateNotifications,
  prepareNotificationsData,
} from "./steps/notifications-step";

// Composant du menu latéral
function SidebarMenu({
  currentStep,
  setCurrentStep,
  steps,
  isFirstStepValid,
}: {
  currentStep: number;
  setCurrentStep: (step: number) => void;
  steps: Array<{ name: string; component: any; icon: any }>;
  isFirstStepValid: boolean;
}) {
  return (
    <div className="w-80 glass-effect rounded-lg p-6">
      <div className="space-y-2">
        {steps.map((step, index) => {
          const isDisabled = index > 0 && !isFirstStepValid;

          return (
            <button
              key={index}
              onClick={() => !isDisabled && setCurrentStep(index)}
              disabled={isDisabled}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-all duration-200 ${
                currentStep === index
                  ? "bg-green-main/20 text-green-light border border-green-main/30"
                  : isDisabled
                  ? "text-gray-500 cursor-not-allowed"
                  : "text-gray-300 hover:bg-white/5 hover:text-white"
              }`}
            >
              {step.icon}
              <span className="text-sm font-medium">{step.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function CreateEventPage({
  organizationId,
  eventId,
}: {
  organizationId: string;
  eventId?: string;
}) {
  const [currentStep, setCurrentStep] = useState(0);
  const [event, setEvent] = useState({
    name: "",
    slug: "",
    description: "",
    location_type: "google_meet",
    organization_id: organizationId,
  });
  const [isLoading, setIsLoading] = useState(false);

  const [currentEventId, setCurrentEventId] = useState<string | null>(
    eventId || null
  );

  // Charger les données de l'événement si on a un ID
  useEffect(() => {
    if (currentEventId) {
      const loadEvent = async () => {
        try {
          const eventData = await getEventById(currentEventId);
          setEvent({
            name: eventData.name || "",
            slug: eventData.slug || "",
            description: eventData.description || "",
            location_type: eventData.location_type || "google_meet",
            organization_id: organizationId,
          });
        } catch (error) {
          console.error("Erreur lors du chargement de l'événement:", error);
        }
      };
      loadEvent();
    }
  }, [currentEventId, organizationId]);

  const steps = [
    {
      name: "Event Details",
      component: EventDetailsStep,
      icon: <Calendar className="w-4 h-4" />,
      validate: validateEventDetails,
      prepareData: prepareEventDetailsData,
    },
    {
      name: "Hosts",
      component: HostsStep,
      icon: <Users className="w-4 h-4" />,
      validate: validateHosts,
      prepareData: prepareHostsData,
    },
    {
      name: "Event Time & Limits",
      component: EventTimeStep,
      icon: <Clock className="w-4 h-4" />,
      validate: validateEventTime,
      prepareData: prepareEventTimeData,
    },
    {
      name: "Invitee Questions",
      component: InviteeQuestionsStep,
      icon: <HelpCircle className="w-4 h-4" />,
      validate: validateInviteeQuestions,
      prepareData: prepareInviteeQuestionsData,
    },
    {
      name: "Disqualification",
      component: DisqualificationsStep,
      icon: <XCircle className="w-4 h-4" />,
      validate: validateDisqualifications,
      prepareData: prepareDisqualificationsData,
    },
    {
      name: "Notifications",
      component: NotificationsStep,
      icon: <Bell className="w-4 h-4" />,
      validate: validateNotifications,
      prepareData: prepareNotificationsData,
    },
  ];

  const nextStep = async () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const CurrentStepComponent = steps[currentStep].component as any;
  const isFirstStepValid = currentEventId !== null;

  return (
    <div className="h-fit p-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-green-main to-green-light rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">
              {currentEventId ? "Edit Event" : "Create New Event"}
            </h2>
            <p className="text-gray-400 text-sm">
              {currentEventId
                ? "Modify your event settings"
                : "Set up your event step by step"}
            </p>
          </div>

          <div className="flex space-x-6">
            {/* Sidebar Menu */}
            <SidebarMenu
              currentStep={currentStep}
              setCurrentStep={setCurrentStep}
              steps={steps}
              isFirstStepValid={isFirstStepValid}
            />

            {/* Main Content */}
            <div className="flex-1">
              {/* Step Content */}
              <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                {currentStep === 0 ? (
                  <EventDetailsStep
                    event={event}
                    onEventChange={setEvent}
                    currentEventId={currentEventId}
                    setCurrentEventId={setCurrentEventId}
                    isLoading={isLoading}
                    setIsLoading={setIsLoading}
                    onNext={nextStep}
                  />
                ) : (
                  <CurrentStepComponent />
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
