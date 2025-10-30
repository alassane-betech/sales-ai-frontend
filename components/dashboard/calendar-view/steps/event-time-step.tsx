import { AlertCircle } from "lucide-react";
import { useState } from "react";
import { updateEvent } from "@/lib/api/events";

interface EventTimeStepProps {
  event: any;
  onEventChange: (event: any) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  onNext: () => void;
}

export default function EventTimeStep({
  event = {},
  onEventChange,
  isLoading,
  setIsLoading,
  onNext,
}: EventTimeStepProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [localEvent, setLocalEvent] = useState({
    max_days_ahead: event.max_days_ahead || 14,
    duration_minutes: event.duration_minutes || 30,
    slot_increment_minutes: event.slot_increment_minutes || 15,
    buffer_before_minutes: event.buffer_before_minutes || 0,
    buffer_after_minutes: event.buffer_after_minutes || 0,
  });

  const handleSubmit = async () => {
    const validationErrors = validateEventTime(localEvent);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setIsLoading(true);

    try {
      // Préparer les données finales
      const eventData = {
        ...localEvent,
      };
      const updatedEvent = await updateEvent(event.id, eventData);
      onEventChange(updatedEvent);

      onNext();
    } catch (error: any) {
      setErrors({
        general: "Failed to save event time settings",
      });
      console.error("Failed to save event time settings:", error?.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {errors.general && (
        <div className="p-3 bg-red-500/20 border border-red-500 rounded-lg">
          <p className="text-sm text-red-400 flex items-center">
            <AlertCircle className="w-4 h-4 mr-2" />
            {errors.general}
          </p>
        </div>
      )}

      {/* Date Range Section */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-medium text-white mb-2">Date Range</h3>
          <p className="text-sm text-gray-400 mb-4">
            Select the date range within which invitees will be shown time slots
            on your scheduler
          </p>
        </div>

        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <input
              type="radio"
              id="calendar-days"
              name="dateRange"
              value="calendar-days"
              checked={localEvent.max_days_ahead !== null}
              onChange={(e) =>
                setLocalEvent({ ...localEvent, max_days_ahead: 14 })
              }
              className="w-4 h-4 text-green-500"
            />
            <div
              className={`flex items-center space-x-2 ${
                localEvent.max_days_ahead === null ? "opacity-50" : ""
              }`}
            >
              <input
                type="number"
                value={localEvent.max_days_ahead || 14}
                onChange={(e) =>
                  setLocalEvent({
                    ...localEvent,
                    max_days_ahead: parseInt(e.target.value) || 14,
                  })
                }
                className="w-16 px-2 py-1 bg-white/10 border border-white/20 rounded text-white text-center disabled:opacity-50"
                min="1"
                max="365"
                disabled={localEvent.max_days_ahead === null}
              />
              <select
                defaultValue="calendar-days"
                className="px-3 py-1 bg-white/10 border border-white/20 rounded text-white disabled:opacity-50"
                disabled={localEvent.max_days_ahead === null}
              >
                <option value="calendar-days">Calendar days</option>
              </select>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <input
              type="radio"
              id="indefinitely"
              name="dateRange"
              value="indefinitely"
              checked={localEvent.max_days_ahead === null}
              onChange={(e) =>
                setLocalEvent({ ...localEvent, max_days_ahead: null })
              }
              className="w-4 h-4 text-green-500"
            />
            <label htmlFor="indefinitely" className="text-sm text-gray-300">
              Indefinitely into the future
            </label>
          </div>
        </div>
      </div>

      {/* Duration Section */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-medium text-white mb-2">Duration</h3>
          <p className="text-sm text-gray-400 mb-4">
            Select the duration of your event
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="number"
            value={localEvent.duration_minutes}
            onChange={(e) =>
              setLocalEvent({
                ...localEvent,
                duration_minutes: parseInt(e.target.value) || 30,
              })
            }
            className="w-20 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-center"
            min="5"
            max="480"
          />
          <select
            defaultValue="minutes"
            className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
          >
            <option value="minutes">minutes</option>
            <option value="hours">hours</option>
          </select>
        </div>
      </div>

      {/* Start time increments Section */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-medium text-white mb-2">
            Start time increments
          </h3>
          <p className="text-sm text-gray-400 mb-4">
            The intervals with which available time slots will be shown on your
            scheduler. E.g., if you select 15 minutes, time slots will be shown
            as 09:00am, 09:15am, 09:30 am and so on
          </p>
        </div>

        <select
          value={localEvent.slot_increment_minutes}
          onChange={(e) =>
            setLocalEvent({
              ...localEvent,
              slot_increment_minutes: parseInt(e.target.value),
            })
          }
          className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
        >
          <option value="5">5 minutes</option>
          <option value="10">10 minutes</option>
          <option value="15">15 minutes</option>
          <option value="30">30 minutes</option>
          <option value="45">45 minutes</option>
        </select>
      </div>

      {/* Break time Section */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-medium text-white mb-2">
            Do you want to add break time before or after your events?
          </h3>
          <p className="text-sm text-gray-400 mb-4">
            Select the time buffer that you might want to give yourself before
            or after an event
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-3">
            <label className="text-sm text-gray-300">Before the Event</label>
            <select
              value={localEvent.buffer_before_minutes}
              onChange={(e) =>
                setLocalEvent({
                  ...localEvent,
                  buffer_before_minutes: parseInt(e.target.value),
                })
              }
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
            >
              <option value="0">No buffer</option>
              <option value="5">5 minutes</option>
              <option value="10">10 minutes</option>
              <option value="15">15 minutes</option>
              <option value="30">30 minutes</option>
              <option value="60">60 minutes</option>
            </select>
          </div>

          <div className="space-y-3">
            <label className="text-sm text-gray-300">After the Event</label>
            <select
              value={localEvent.buffer_after_minutes}
              onChange={(e) =>
                setLocalEvent({
                  ...localEvent,
                  buffer_after_minutes: parseInt(e.target.value),
                })
              }
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
            >
              <option value="0">No buffer</option>
              <option value="5">5 minutes</option>
              <option value="10">10 minutes</option>
              <option value="15">15 minutes</option>
              <option value="30">30 minutes</option>
              <option value="60">60 minutes</option>
            </select>
          </div>
        </div>
      </div>

      <button
        onClick={handleSubmit}
        disabled={isLoading}
        className="w-full px-6 py-3 bg-gradient-to-r from-green-main to-green-light text-white rounded-lg hover:from-green-600 hover:to-green-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? "Saving..." : "Next"}
      </button>
    </div>
  );
}

export const validateEventTime = (event: any = {}) => {
  const errors: Record<string, string> = {};

  if (!event.duration_minutes || event.duration_minutes < 5) {
    errors.duration_minutes = "Duration must be at least 5 minutes";
  }

  if (!event.slot_increment_minutes || event.slot_increment_minutes < 5) {
    errors.slot_increment_minutes = "Time increment must be at least 5 minutes";
  }

  if (event.buffer_before_minutes < 0) {
    errors.buffer_before_minutes = "Buffer before must be 0 or more minutes";
  }

  if (event.buffer_after_minutes < 0) {
    errors.buffer_after_minutes = "Buffer after must be 0 or more minutes";
  }

  return errors;
};
