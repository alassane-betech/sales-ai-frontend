"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Users,
  Clock,
  HelpCircle,
  XCircle,
  Bell,
  CheckCircle,
} from "lucide-react";
import axios from "axios";

// Composant pour l'étape Event Details (existant)
function EventDetailsStep({
  formData,
  setFormData,
  errors,
  handleInputChange,
}: {
  formData: any;
  setFormData: any;
  errors: any;
  handleInputChange: (field: string, value: string) => void;
}) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Event Name *
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => handleInputChange("name", e.target.value)}
          className={`w-full px-3 py-2 bg-white/10 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white placeholder-gray-400 ${
            errors.name ? "border-red-500" : "border-white/20"
          }`}
          placeholder="Enter event name"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-400 flex items-center">
            <AlertCircle className="w-4 h-4 mr-1" />
            {errors.name}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Event Slug *
        </label>
        <input
          type="text"
          value={formData.slug}
          onChange={(e) => handleInputChange("slug", e.target.value)}
          className={`w-full px-3 py-2 bg-white/10 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white placeholder-gray-400 ${
            errors.slug ? "border-red-500" : "border-white/20"
          }`}
          placeholder="Enter event slug"
        />
        {errors.slug && (
          <p className="mt-1 text-sm text-red-400 flex items-center">
            <AlertCircle className="w-4 h-4 mr-1" />
            {errors.slug}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Description
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => handleInputChange("description", e.target.value)}
          rows={3}
          className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white placeholder-gray-400"
          placeholder="Enter event description"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Location Type
        </label>
        <select
          value={formData.location_type}
          onChange={(e) => handleInputChange("location_type", e.target.value)}
          className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white"
        >
          <option value="google_meet">Google Meet</option>
          <option value="zoom">Zoom</option>
          <option value="phone">Phone Call</option>
        </select>
      </div>
    </div>
  );
}

// Composant pour l'étape Hosts
function HostsStep() {
  return (
    <div className="space-y-4">
      <div className="text-center py-8">
        <h3 className="text-lg font-medium text-white mb-2">Hosts</h3>
        <p className="text-gray-400">Configure event hosts</p>
      </div>
    </div>
  );
}

// Composant pour l'étape Event Time
function EventTimeStep() {
  return (
    <div className="space-y-4">
      <div className="text-center py-8">
        <h3 className="text-lg font-medium text-white mb-2">Event Time</h3>
        <p className="text-gray-400">Set event date and time</p>
      </div>
    </div>
  );
}

// Composant pour l'étape Invitee Questions
function InviteeQuestionsStep() {
  return (
    <div className="space-y-4">
      <div className="text-center py-8">
        <h3 className="text-lg font-medium text-white mb-2">
          Invitee Questions
        </h3>
        <p className="text-gray-400">Configure questions for invitees</p>
      </div>
    </div>
  );
}

// Composant pour l'étape Disqualifications
function DisqualificationsStep() {
  return (
    <div className="space-y-4">
      <div className="text-center py-8">
        <h3 className="text-lg font-medium text-white mb-2">
          Disqualifications
        </h3>
        <p className="text-gray-400">Set disqualification criteria</p>
      </div>
    </div>
  );
}

// Composant pour l'étape Notifications
function NotificationsStep() {
  return (
    <div className="space-y-4">
      <div className="space-y-4">
        <div className="text-center py-8">
          <h3 className="text-lg font-medium text-white mb-2">Notifications</h3>
          <p className="text-gray-400">Configure notification settings</p>
        </div>
      </div>
    </div>
  );
}

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
}: {
  organizationId: string;
}) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    location_type: "google_meet",
    organization_id: organizationId,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const steps = [
    {
      name: "Event Details",
      component: EventDetailsStep,
      icon: <Calendar className="w-4 h-4" />,
    },
    {
      name: "Hosts",
      component: HostsStep,
      icon: <Users className="w-4 h-4" />,
    },
    {
      name: "Event Time & Limits",
      component: EventTimeStep,
      icon: <Clock className="w-4 h-4" />,
    },
    {
      name: "Invitee Questions",
      component: InviteeQuestionsStep,
      icon: <HelpCircle className="w-4 h-4" />,
    },
    {
      name: "Disqualification",
      component: DisqualificationsStep,
      icon: <XCircle className="w-4 h-4" />,
    },
    {
      name: "Notifications",
      component: NotificationsStep,
      icon: <Bell className="w-4 h-4" />,
    },
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Event name is required";
    }
    if (!formData.slug.trim()) {
      newErrors.slug = "Event slug is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      console.log("Creating event with data:", formData);
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/events`,
        {
          name: formData.name,
          slug: formData.slug,
          description: formData.description,
          location_type: formData.location_type,
          organization_id: formData.organization_id,
        }
      );

      if (response.status === 201 || response.status === 200) {
        console.log("Event created successfully:", response.data);
        // Reset form
        setFormData({
          name: "",
          slug: "",
          description: "",
          location_type: "google_meet",
          organization_id: organizationId,
        });
      }
    } catch (error: any) {
      console.error("Failed to create event:", error);
      if (error.response?.data?.message) {
        setErrors({ general: error.response.data.message });
      } else {
        setErrors({
          general: "Failed to create event. Please try again.",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const CurrentStepComponent = steps[currentStep].component;
  const isFirstStepValid =
    formData.name.trim() !== "" && formData.slug.trim() !== "";

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
              Create New Event
            </h2>
            <p className="text-gray-400 text-sm">
              Set up your event step by step
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
                <CurrentStepComponent
                  formData={formData}
                  setFormData={setFormData}
                  errors={errors}
                  handleInputChange={handleInputChange}
                />
              </div>

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-6">
                <button
                  onClick={prevStep}
                  disabled={currentStep === 0}
                  className="px-6 py-3 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Previous
                </button>

                {currentStep === steps.length - 1 ? (
                  <button
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className="px-6 py-3 bg-gradient-to-r from-green-main to-green-light text-white rounded-lg hover:from-green-600 hover:to-green-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? "Creating Event..." : "Create Event"}
                  </button>
                ) : (
                  <button
                    onClick={nextStep}
                    className="px-6 py-3 bg-gradient-to-r from-green-main to-green-light text-white rounded-lg hover:from-green-600 hover:to-green-500 transition-all duration-300 flex items-center"
                  >
                    Next
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </button>
                )}
              </div>

              {/* Error Display */}
              {errors.general && (
                <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg mt-4">
                  <p className="text-red-400 text-sm flex items-center">
                    <AlertCircle className="w-4 h-4 mr-2" />
                    {errors.general}
                  </p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
