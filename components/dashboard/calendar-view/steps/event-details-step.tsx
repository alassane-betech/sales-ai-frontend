import { AlertCircle } from "lucide-react";
import { createEvent, updateEvent } from "@/lib/api/events";
import { useState } from "react";

interface EventDetailsStepProps {
  event: any;
  onEventChange: (event: any) => void;
  currentEventId: string | null;
  setCurrentEventId: (id: string | null) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  onNext: () => void;
}

export default function EventDetailsStep({
  event,
  onEventChange,
  currentEventId,
  setCurrentEventId,
  isLoading,
  setIsLoading,
  onNext,
}: EventDetailsStepProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const handleSubmit = async () => {
    if (!validateEventDetails(event)) return;

    setIsLoading(true);
    try {
      const dataToSend = prepareEventDetailsData(event);

      if (currentEventId) {
        // Mode modification
        await updateEvent(currentEventId, dataToSend);
      } else {
        // Mode création
        const response = await createEvent(dataToSend);
        setCurrentEventId(response.id);
      }
      onNext();
    } catch (error: any) {
      setErrors(event);
      console.error(
        `Failed to ${currentEventId ? "update" : "create"} event:`,
        error
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Event Name *
        </label>
        <input
          type="text"
          value={event.name || ""}
          onChange={(e) => onEventChange({ ...event, name: e.target.value })}
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
          value={event.slug || ""}
          onChange={(e) => onEventChange({ ...event, slug: e.target.value })}
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
          value={event.description || ""}
          onChange={(e) =>
            onEventChange({ ...event, description: e.target.value })
          }
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
          value={event.location_type || "google_meet"}
          onChange={(e) =>
            onEventChange({ ...event, location_type: e.target.value })
          }
          className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white"
        >
          <option value="google_meet">Google Meet</option>
          <option value="zoom">Zoom</option>
          <option value="phone">Phone Call</option>
        </select>
      </div>

      <button
        onClick={handleSubmit}
        disabled={isLoading}
        className="w-full px-6 py-3 bg-gradient-to-r from-green-main to-green-light text-white rounded-lg hover:from-green-600 hover:to-green-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading
          ? currentEventId
            ? "Updating..."
            : "Creating..."
          : currentEventId
          ? "Update & Next"
          : "Create & Next"}
      </button>
    </div>
  );
}

export const validateEventDetails = (event: any) => {
  const errors: Record<string, string> = {};

  if (!event.name?.trim()) {
    errors.name = "Event name is required";
  }
  if (!event.slug?.trim()) {
    errors.slug = "Event slug is required";
  }

  return errors;
};

// Fonction pour préparer les données à envoyer
export const prepareEventDetailsData = (event: any) => {
  return {
    name: event.name,
    slug: event.slug,
    description: event.description,
    location_type: event.location_type,
    organization_id: event.organization_id,
  };
};
