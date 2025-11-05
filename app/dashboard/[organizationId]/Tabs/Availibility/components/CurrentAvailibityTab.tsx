import { motion, AnimatePresence } from "framer-motion";
import {
  TimeSlot,
  AvailabilityDay,
} from "@/lib/models/Availabilities/AvailabilityDay";
import { Plus, Save, X, Trash2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import SelectTime from "@/components/select-time";
import { Button } from "@/components/ui/button";
import SelectTimezone from "@/components/select-timezone";
import { useAvailability } from "../context/AvailabilityContext";

export default function CurrentAvailibityTab() {
  const {
    selectedAvailability,
    currentWorkingHours,
    currentTimezone,
    hasChanges,
    loading,
    error,
    updateWorkingHours,
    updateTimezone,
    saveChanges,
    resetChanges,
  } = useAvailability();

  const generateId = () =>
    Date.now().toString() + Math.random().toString(36).substring(2, 9);

  const toggleDay = (day: AvailabilityDay) => {
    const newWorkingHours = currentWorkingHours.map((d) => {
      if (d.weekday === day.weekday) {
        if (!day.enabled) {
          return {
            ...d,
            enabled: true,
            slots: day.slots.length > 0 ? day.slots : [...day.slots, {
                id: generateId(),
                start_time: "09:00am",
                end_time: "05:00pm",
                buffer_minutes: 0,
              }],
          };
        } else {
          return { ...d, enabled: false };
        }
      }
      return d;
    });
    updateWorkingHours(newWorkingHours);
  };

  const addTimeSlot = (day: AvailabilityDay) => {
    const newTimeSlot: TimeSlot = {
      id: generateId(),
      start_time: "09:00am",
      end_time: "05:00pm",
      buffer_minutes: 0,
    };

    const dayToUpdate = currentWorkingHours.find((d) => d.weekday === day.weekday);
    let newWorkingHours: AvailabilityDay[];

    if (!dayToUpdate || !dayToUpdate?.slots || dayToUpdate?.slots?.length === 0) {
      newWorkingHours = currentWorkingHours.map((d) =>
        d.weekday === day.weekday
          ? { ...d, enabled: true, slots: [newTimeSlot] }
          : d
      );
    } else {
      newWorkingHours = currentWorkingHours.map((d) =>
        d.weekday === dayToUpdate?.weekday
          ? {
              ...d,
              enabled: true,
              slots: [...(dayToUpdate.slots || []), newTimeSlot],
            }
          : d
      );
    }
    updateWorkingHours(newWorkingHours);
  };

  const removeTimeSlot = (day: AvailabilityDay, timeSlotId: string) => {
    const newWorkingHours = currentWorkingHours.map((d) =>
      d.weekday === day.weekday
        ? {
            ...d,
            slots: (d.slots || []).filter((slot) => slot.id !== timeSlotId),
          }
        : d
    );
    updateWorkingHours(newWorkingHours);
  };

  const updateTimeSlot = (
    day: AvailabilityDay,
    timeSlotId: string,
    field: "start_time" | "end_time",
    value: string
  ) => {
    const newWorkingHours = currentWorkingHours.map((d) =>
      d.weekday === day.weekday
        ? {
            ...d,
            slots: (d.slots || []).map((slot) =>
              slot.id === timeSlotId ? { ...slot, [field]: value } : slot
            ),
          }
        : d
    );
    updateWorkingHours(newWorkingHours);
  };

  // Loading state
  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-lg p-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-white">Loading availability...</div>
          </div>
        </div>
      </motion.div>
    );
  }

  // Error state
  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-lg p-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-red-400">Error: {error}</div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Content */}
      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white">
            Configure Your Availability
          </h3>
          <p className="text-gray-400 text-sm">
            Set your working hours for each day of the week
          </p>
        </div>

        <div className="flex flex-col gap-2 my-4">
          <h3>Select your timezone</h3>
          <SelectTimezone
            value={currentTimezone}
            onChange={(value) => updateTimezone(value)}
          />
        </div>

        <div className="space-y-3">
          {currentWorkingHours.map((config, index) => (
            <motion.div
              key={config.weekday}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className={`p-3 rounded-lg border transition-all duration-200 ${
                config.enabled
                  ? "bg-white/5 border-white/10 hover:bg-white/10"
                  : "bg-white/[0.02] border-white/5 opacity-60"
              }`}
            >
              <div className="flex flex-row items-center space-x-4 h-full">
                {/* Day Toggle */}
                <div className="flex items-center justify-start space-x-3 min-w-[120px] pt-2 h-full">
                  <Switch
                    checked={config.enabled}
                    onCheckedChange={() => toggleDay(config)}
                    className="data-[state=checked]:bg-green-main"
                  />
                  <span
                    className={`text-sm font-medium capitalize ${
                      config.enabled ? "text-white" : "text-gray-500"
                    }`}
                  >
                    {config.weekday_name}
                  </span>
                </div>

                {/* Time Slots */}
                <div className="flex-1">
                  <AnimatePresence>
                    {config.enabled && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-2"
                      >
                        {config.slots?.map(
                          (timeSlot: TimeSlot, slotIndex: number) => (
                            <motion.div
                              key={timeSlot.id}
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              transition={{
                                duration: 0.2,
                                delay: slotIndex * 0.05,
                              }}
                              className="flex items-center space-x-2 bg-white/[0.02] border border-white/5 rounded-lg p-2"
                            >
                              <SelectTime
                                defaultValue={timeSlot.start_time}
                                value={timeSlot.start_time}
                                onChange={(value) =>
                                  updateTimeSlot(
                                    config,
                                    timeSlot.id,
                                    "start_time",
                                    value
                                  )
                                }
                              />
                              <span className="text-gray-400 text-xs">to</span>
                              <SelectTime
                                defaultValue={timeSlot.end_time}
                                value={timeSlot.end_time}
                                onChange={(value) =>
                                  updateTimeSlot(
                                    config,
                                    timeSlot.id,
                                    "end_time",
                                    value
                                  )
                                }
                              />

                              {/* Show Add button for last time slot, Delete button for others */}
                              {slotIndex === (config.slots?.length || 0) - 1 ? (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => addTimeSlot(config)}
                                  className="bg-white/5 border-white/20 text-green-main hover:bg-green-main/10 hover:border-green-main/30 px-1.5 h-7"
                                >
                                  <Plus className="w-3 h-3" />
                                </Button>
                              ) : (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    removeTimeSlot(config, timeSlot.id)
                                  }
                                  className="bg-red-500/10 border-red-500/20 text-red-400 hover:bg-red-500/20 hover:border-red-500/40 px-1.5 h-7"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </Button>
                              )}
                            </motion.div>
                          )
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end space-x-3 mt-4">
          <Button
            variant="outline"
            className="px-6 bg-white/5 border-white/20 text-gray-300 hover:bg-white/10 hover:text-white hover:border-white/30"
            onClick={resetChanges}
          >
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
          <Button
            disabled={!hasChanges}
            className="px-6 bg-gradient-to-r from-green-main to-green-light hover:from-green-light hover:to-green-main text-white border-0"
            onClick={saveChanges}
          >
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
