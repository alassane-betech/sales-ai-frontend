"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Clock,
  Settings,
  Calendar,
  X,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  CheckCircle,
  XCircle,
  RefreshCw,
  Tag,
  ArrowLeft,
} from "lucide-react";
import CreateEventPage from "./create-event-page";
import { useParams } from "next/navigation";
import axios from "axios";

// Configuration d'axios avec l'URL de base
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

interface Event {
  id: string;
  organization_id: string;
  name: string;
  slug: string;
  description?: string;
  location_type: "phone" | "google_meet" | "zoom";
  created_by: string;
  confirmation_redirect_url?: string;
  internal_note?: string;
  max_days_ahead?: number;
  duration_minutes: number;
  slot_increment_minutes: number;
  min_notice_minutes: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export default function CalendarView() {
  // State
  const [events, setEvents] = useState<Event[]>([]);
  const [showCreateEvent, setShowCreateEvent] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [showAvailabilityModal, setShowAvailabilityModal] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(["events"])
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const params = useParams();
  const organizationId = params.organizationId as string;

  // Fetch events from API
  useEffect(() => {
    if (!organizationId) return;

    const fetchEvents = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.get(
          `${API_BASE_URL}/events/organization/${organizationId}`
        );
        setEvents(response.data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Une erreur est survenue"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [organizationId]);
  // Availability state
  const [availability, setAvailability] = useState({
    activeEvents: "3",
    timezone: "(GMT+4:00) Abu Dhabi, Muscat",
    days: {
      monday: { enabled: true, slots: [{ start: "10:00", end: "20:30" }] },
      tuesday: { enabled: true, slots: [{ start: "10:00", end: "20:30" }] },
      wednesday: { enabled: false, slots: [{ start: "09:00", end: "17:00" }] },
      thursday: { enabled: true, slots: [{ start: "10:00", end: "20:30" }] },
      friday: { enabled: true, slots: [{ start: "15:00", end: "21:30" }] },
      saturday: { enabled: true, slots: [{ start: "10:00", end: "14:00" }] },
      sunday: { enabled: false, slots: [{ start: "09:00", end: "17:00" }] },
    },
  });

  // Toggle section expansion
  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  // Availability management functions
  const toggleDayAvailability = (day: string) => {
    setAvailability((prev) => ({
      ...prev,
      days: {
        ...prev.days,
        [day]: {
          ...prev.days[day as keyof typeof prev.days],
          enabled: !prev.days[day as keyof typeof prev.days].enabled,
        },
      },
    }));
  };

  const updateTimeSlot = (
    day: string,
    slotIndex: number,
    field: "start" | "end",
    value: string
  ) => {
    setAvailability((prev) => ({
      ...prev,
      days: {
        ...prev.days,
        [day]: {
          ...prev.days[day as keyof typeof prev.days],
          slots: prev.days[day as keyof typeof prev.days].slots.map(
            (slot, index) =>
              index === slotIndex ? { ...slot, [field]: value } : slot
          ),
        },
      },
    }));
  };

  const addTimeSlot = (day: string) => {
    setAvailability((prev) => ({
      ...prev,
      days: {
        ...prev.days,
        [day]: {
          ...prev.days[day as keyof typeof prev.days],
          slots: [
            ...prev.days[day as keyof typeof prev.days].slots,
            { start: "09:00", end: "17:00" },
          ],
        },
      },
    }));
  };

  const duplicateTimeSlot = (day: string, slotIndex: number) => {
    setAvailability((prev) => ({
      ...prev,
      days: {
        ...prev.days,
        [day]: {
          ...prev.days[day as keyof typeof prev.days],
          slots: [
            ...prev.days[day as keyof typeof prev.days].slots.slice(
              0,
              slotIndex + 1
            ),
            prev.days[day as keyof typeof prev.days].slots[slotIndex],
            ...prev.days[day as keyof typeof prev.days].slots.slice(
              slotIndex + 1
            ),
          ],
        },
      },
    }));
  };

  const removeTimeSlot = (day: string, slotIndex: number) => {
    setAvailability((prev) => ({
      ...prev,
      days: {
        ...prev.days,
        [day]: {
          ...prev.days[day as keyof typeof prev.days],
          slots: prev.days[day as keyof typeof prev.days].slots.filter(
            (_, index) => index !== slotIndex
          ),
        },
      },
    }));
  };

  // Get status badge config
  const getStatusConfig = (isActive: boolean) => {
    if (isActive) {
      return {
        color: "bg-green-100 text-green-800",
        icon: CheckCircle,
        label: "Active",
      };
    } else {
      return {
        color: "bg-red-100 text-red-800",
        icon: XCircle,
        label: "Inactive",
      };
    }
  };

  // If showing create event, display the CreateEventPage component
  if (showCreateEvent) {
    return (
      <div className="h-full p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">
                Create New Event
              </h1>
              <p className="text-[#9D9DA8]">Set up your event details</p>
            </div>
            <button
              onClick={() => setShowCreateEvent(false)}
              className="px-4 py-2 text-white bg-[#1E1E21] backdrop-blur-md border border-[#232327] rounded-lg hover:bg-[#232327] transition-colors flex items-center"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Calendar
            </button>
          </div>
        </div>

        <CreateEventPage
          organizationId={organizationId}
          eventId={selectedEventId || undefined}
        />
      </div>
    );
  }

  return (
    <div className="h-full p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Calendar</h1>
            <p className="text-[#9D9DA8]">
              Manage your booking links, availability, and events
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => {
                setSelectedEventId(null);
                setShowCreateEvent(true);
              }}
              className="px-4 py-2 bg-gradient-to-r from-[#007953] to-[#00a86b] text-white rounded-lg hover:from-[#00a86b] hover:to-[#007953] transition-all duration-300 shadow-lg hover:shadow-xl flex items-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Event
            </button>
            <button
              onClick={() => setShowAvailabilityModal(true)}
              className="px-4 py-2 text-[#9D9DA8] bg-[#1E1E21] backdrop-blur-md border border-[#232327] rounded-lg hover:bg-[#232327] transition-colors flex items-center"
            >
              <Settings className="w-4 h-4 mr-2" />
              Set Availability
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="w-full">
        {/* Calendar Events */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-[#1E1E21] backdrop-blur-md rounded-lg shadow-lg border border-[#232327]"
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-white">
                Calendar Events & Availability
              </h2>
              <button
                onClick={() => toggleSection("events")}
                className="text-[#9D9DA8] hover:text-white"
              >
                {expandedSections.has("events") ? (
                  <ChevronUp className="w-5 h-5" />
                ) : (
                  <ChevronDown className="w-5 h-5" />
                )}
              </button>
            </div>

            <AnimatePresence>
              {expandedSections.has("events") && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                >
                  {loading ? (
                    <div className="col-span-full flex items-center justify-center py-8">
                      <RefreshCw className="w-6 h-6 animate-spin text-[#9D9DA8]" />
                      <span className="ml-2 text-[#9D9DA8]">
                        Loading events...
                      </span>
                    </div>
                  ) : error ? (
                    <div className="col-span-full flex items-center justify-center py-8">
                      <AlertCircle className="w-6 h-6 text-red-400" />
                      <span className="ml-2 text-red-400">{error}</span>
                    </div>
                  ) : events.length === 0 ? (
                    <div className="col-span-full flex items-center justify-center py-8">
                      <Calendar className="w-6 h-6 text-[#9D9DA8]" />
                      <span className="ml-2 text-[#9D9DA8]">
                        No events found
                      </span>
                    </div>
                  ) : (
                    events.map((event) => {
                      const statusConfig = getStatusConfig(event.is_active);
                      const Icon = statusConfig.icon;

                      return (
                        <motion.div
                          key={event.id}
                          whileHover={{ y: -2 }}
                          className="border border-[#232327] rounded-lg p-4 hover:bg-[#232327] hover:shadow-lg transition-all duration-200 cursor-pointer bg-[#1E1E21] h-64 flex flex-col"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <h3 className="font-medium text-white line-clamp-2">
                              {event.name}
                            </h3>
                            <span
                              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusConfig.color}`}
                            >
                              <Icon className="w-3 h-3 mr-1" />
                              {statusConfig.label}
                            </span>
                          </div>

                          <div className="space-y-2 text-sm text-[#9D9DA8] flex-1">
                            <div className="flex items-center">
                              <Calendar className="w-4 h-4 mr-2" />
                              Created:{" "}
                              {new Date(event.created_at).toLocaleDateString()}
                            </div>

                            <div className="flex items-center">
                              <Clock className="w-4 h-4 mr-2" />
                              {event.duration_minutes}min •{" "}
                              {event.slot_increment_minutes}min increment
                            </div>

                            <div className="flex items-center">
                              <Tag className="w-4 h-4 mr-2" />
                              <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded-full">
                                {event.location_type}
                              </span>
                            </div>

                            <div className="flex-1">
                              {event.description ? (
                                <p className="text-[#9D9DA8] line-clamp-2">
                                  {event.description}
                                </p>
                              ) : (
                                <p className="text-[#9D9DA8] line-clamp-2 opacity-0">
                                  &nbsp;
                                </p>
                              )}
                            </div>
                          </div>

                          <button
                            onClick={() => {
                              setSelectedEventId(event.id);
                              setShowCreateEvent(true);
                            }}
                            className="mt-3 w-full px-3 py-2 text-sm bg-[#232327] text-white rounded-md hover:bg-[#007953]/20 transition-colors"
                          >
                            View Details
                          </button>
                        </motion.div>
                      );
                    })
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>

      {/* Availability Modal */}
      <AnimatePresence>
        {showAvailabilityModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowAvailabilityModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#1E1E21] rounded-lg shadow-xl w-full max-w-4xl border border-[#232327]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white">
                    Définissez vos disponibilités
                  </h2>
                  <button
                    onClick={() => setShowAvailabilityModal(false)}
                    className="text-[#9D9DA8] hover:text-white"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* Days Configuration */}
                <div className="space-y-4">
                  {Object.entries(availability.days).map(([day, config]) => {
                    const dayNames = {
                      monday: "Lundi",
                      tuesday: "Mardi",
                      wednesday: "Mercredi",
                      thursday: "Jeudi",
                      friday: "Vendredi",
                      saturday: "Samedi",
                      sunday: "Dimanche",
                    };

                    return (
                      <div
                        key={day}
                        className="flex items-center space-x-4 p-3 border border-[#232327] rounded-lg bg-[#1E1E21]"
                      >
                        {/* Toggle Switch */}
                        <button
                          onClick={() => toggleDayAvailability(day)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            config.enabled ? "bg-[#007953]" : "bg-[#232327]"
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              config.enabled ? "translate-x-6" : "translate-x-1"
                            }`}
                          />
                        </button>

                        {/* Day Label */}
                        <span className="text-sm font-medium text-white min-w-[80px]">
                          {dayNames[day as keyof typeof dayNames]}
                        </span>

                        {/* Time Slots */}
                        {config.enabled && (
                          <div className="flex-1 flex items-center space-x-2">
                            {config.slots.map((slot, slotIndex) => (
                              <div
                                key={slotIndex}
                                className="flex items-center space-x-2"
                              >
                                <input
                                  type="time"
                                  value={slot.start}
                                  onChange={(e) =>
                                    updateTimeSlot(
                                      day,
                                      slotIndex,
                                      "start",
                                      e.target.value
                                    )
                                  }
                                  className="px-2 py-1 border border-[#232327] rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#007953] bg-[#18181B] text-white"
                                />
                                <span className="text-gray-400">-</span>
                                <input
                                  type="time"
                                  value={slot.end}
                                  onChange={(e) =>
                                    updateTimeSlot(
                                      day,
                                      slotIndex,
                                      "end",
                                      e.target.value
                                    )
                                  }
                                  className="px-2 py-1 border border-[#232327] rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#007953] bg-[#18181B] text-white"
                                />

                                {/* Action Buttons */}
                                <div className="flex items-center space-x-1">
                                  <button
                                    onClick={() => addTimeSlot(day)}
                                    className="p-1 text-[#9D9DA8] hover:text-white rounded"
                                    title="Add time slot"
                                  >
                                    <Plus className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() =>
                                      duplicateTimeSlot(day, slotIndex)
                                    }
                                    className="p-1 text-[#9D9DA8] hover:text-white rounded"
                                    title="Duplicate time slot"
                                  >
                                    <svg
                                      className="w-4 h-4"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                                      />
                                    </svg>
                                  </button>
                                  {config.slots.length > 1 && (
                                    <button
                                      onClick={() =>
                                        removeTimeSlot(day, slotIndex)
                                      }
                                      className="p-1 text-red-400 hover:text-red-300 rounded"
                                      title="Remove time slot"
                                    >
                                      <svg
                                        className="w-4 h-4"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={2}
                                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                        />
                                      </svg>
                                    </button>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-end space-x-3 pt-6 border-t border-[#232327]">
                  <button
                    onClick={() => setShowAvailabilityModal(false)}
                    className="px-4 py-2 text-[#9D9DA8] bg-[#1E1E21] backdrop-blur-md border border-[#232327] rounded-md hover:bg-[#232327] transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      // Save availability settings
                      console.log("Saving availability:", availability);
                      setShowAvailabilityModal(false);
                    }}
                    className="px-4 py-2 bg-gradient-to-r from-[#007953] to-[#00a86b] text-white rounded-md hover:from-[#00a86b] hover:to-[#007953] transition-colors"
                  >
                    Save Availability
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
