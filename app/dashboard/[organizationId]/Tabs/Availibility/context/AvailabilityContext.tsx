"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Availability, NewAvailabilityBody } from "@/lib/models/Availabilities/Availibility";
import { AvailabilityDay } from "@/lib/models/Availabilities/AvailabilityDay";
import { getAvailabilites, updateAvailability as updateAvailabilityApi, createAvailability as createAvailabilityApi } from "@/lib/api/availabilities";

interface AvailabilityContextType {
  // Original data from API
  availabilities: Availability[];
  selectedAvailability: Availability | null;
  loading: boolean;
  error: string | null;
  
  // Current working state (what user is editing)
  currentWorkingHours: AvailabilityDay[];
  currentTimezone: string;
  
  // Change detection
  hasChanges: boolean;
  
  // Actions
  setSelectedAvailability: (availability: Availability | null) => void;
  updateWorkingHours: (workingHours: AvailabilityDay[]) => void;
  updateTimezone: (timezone: string) => void;
  saveChanges: () => Promise<void>;
  resetChanges: () => void;
  refreshAvailabilities: () => Promise<void>;
  createAvailability: (availability: NewAvailabilityBody) => Promise<void>;
}

const AvailabilityContext = createContext<AvailabilityContextType | undefined>(undefined);

interface AvailabilityProviderProps {
  children: ReactNode;
  organizationId: string;
  userId: string;
}

const defaultAvailabilityDays: AvailabilityDay[] = [
  {
    weekday: 0,
    weekday_name: "Monday",
    enabled: false,
    slots: [],
  },
  {
    weekday: 1,
    weekday_name: "Tuesday",
    enabled: false,
    slots: [],
  },
  {
    weekday: 2,
    weekday_name: "Wednesday",
    enabled: false,
    slots: [],
  },
  {
    weekday: 3,
    weekday_name: "Thursday",
    enabled: false,
    slots: [],
  },
  {
    weekday: 4,
    weekday_name: "Friday",
    enabled: false,
    slots: [],
  },
  {
    weekday: 5,
    weekday_name: "Saturday",
    enabled: false,
    slots: [],
  },
  {
    weekday: 6,
    weekday_name: "Sunday",
    enabled: false,
    slots: [],
  },
];

export function AvailabilityProvider({ children, organizationId, userId }: AvailabilityProviderProps) {
  // Original data from API
  const [availabilities, setAvailabilities] = useState<Availability[]>([]);
  const [selectedAvailability, setSelectedAvailability] = useState<Availability | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Current working state (what user is editing)
  const [currentWorkingHours, setCurrentWorkingHours] = useState<AvailabilityDay[]>([]);
  const [currentTimezone, setCurrentTimezone] = useState<string>("GMT+0:00");
  
  // Original state for comparison (to detect changes)
  const [originalWorkingHours, setOriginalWorkingHours] = useState<AvailabilityDay[]>([]);
  const [originalTimezone, setOriginalTimezone] = useState<string>("GMT+0:00");
  
  // Change detection
  const hasChanges = React.useMemo(() => {
    // Compare timezone
    if (currentTimezone !== originalTimezone) {
      return true;
    }
    
    // Compare working hours (deep comparison)
    if (currentWorkingHours.length !== originalWorkingHours.length) {
      return true;
    }
    
    return currentWorkingHours.some((currentDay, index) => {
      const originalDay = originalWorkingHours[index];
      if (!originalDay) return true;
      
      // Compare basic properties
      if (currentDay.enabled !== originalDay.enabled || 
          currentDay.weekday !== originalDay.weekday) {
        return true;
      }
      
      // Compare slots
      const currentSlots = currentDay.slots || [];
      const originalSlots = originalDay.slots || [];
      
      if (currentSlots.length !== originalSlots.length) {
        return true;
      }
      
      return currentSlots.some((currentSlot, slotIndex) => {
        const originalSlot = originalSlots[slotIndex];
        if (!originalSlot) return true;
        
        return currentSlot.start_time !== originalSlot.start_time ||
               currentSlot.end_time !== originalSlot.end_time ||
               currentSlot.buffer_minutes !== originalSlot.buffer_minutes;
      });
    });
  }, [currentWorkingHours, currentTimezone, originalWorkingHours, originalTimezone]);

  // Fetch availabilities from API
  const refreshAvailabilities = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getAvailabilites();
      setAvailabilities(response);
      
      if (response.length > 0) {
        const activeAvailability = response.find((availability: Availability) => availability.is_active);
        const targetAvailability = activeAvailability || response[0];
        setSelectedAvailability(targetAvailability);
      } else {
        setSelectedAvailability(null);
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  // Update current state when selected availability changes
  useEffect(() => {
    if (selectedAvailability && selectedAvailability.days) {
      const workingHours = selectedAvailability.days;
      const timezone = selectedAvailability.timezone || "GMT+0:00";
      
      // Set current working state
      setCurrentWorkingHours([...workingHours]);
      setCurrentTimezone(timezone);
      
      // Set original state for comparison
      setOriginalWorkingHours([...workingHours]);
      setOriginalTimezone(timezone);
    } else {
      // Reset to defaults if no availability selected
      setCurrentWorkingHours([]);
      setCurrentTimezone("GMT+0:00");
      setOriginalWorkingHours([]);
      setOriginalTimezone("GMT+0:00");
    }
  }, [selectedAvailability]);

  // Initialize data on mount
  useEffect(() => {
    refreshAvailabilities();
  }, []);

  // Actions
  const updateWorkingHours = (workingHours: AvailabilityDay[]) => {
    setCurrentWorkingHours([...workingHours]);
  };

  const updateTimezone = (timezone: string) => {
    setCurrentTimezone(timezone);
  };

  const saveChanges = async () => {
    if (!selectedAvailability || !hasChanges) return;
    
    try {
      setLoading(true);
      await updateAvailabilityApi({
        id: selectedAvailability.id,
        user_id: selectedAvailability.user_id,
        is_active: selectedAvailability.is_active,
        name: selectedAvailability.name,
        days: currentWorkingHours,
        timezone: currentTimezone,
      });
      
      // Update original state to match current state
      setOriginalWorkingHours([...currentWorkingHours]);
      setOriginalTimezone(currentTimezone);
      
      // Refresh data from API to ensure consistency
      await refreshAvailabilities();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to save changes");
    } finally {
      setLoading(false);
    }
  };

  const resetChanges = () => {
    setCurrentWorkingHours([...originalWorkingHours]);
    setCurrentTimezone(originalTimezone);
  };

  const handleSetSelectedAvailability = (availability: Availability | null) => {
    setSelectedAvailability(availability);
  };

  const createAvailability = async (availability: NewAvailabilityBody) => {
    try {
      const response = await createAvailabilityApi(availability);
      const newAvailability = { ...response, days: defaultAvailabilityDays } as Availability;
      setAvailabilities([...availabilities, newAvailability]);
      if (newAvailability.is_active) {
        setSelectedAvailability(newAvailability);
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to create availability");
    }
  };

  const contextValue: AvailabilityContextType = {
    // Original data from API
    availabilities,
    selectedAvailability,
    loading,
    error,
    
    // Current working state
    currentWorkingHours,
    currentTimezone,
    
    // Change detection
    hasChanges,
    
    // Actions
    setSelectedAvailability: handleSetSelectedAvailability,
    updateWorkingHours,
    updateTimezone,
    saveChanges,
    resetChanges,
    refreshAvailabilities,
    createAvailability,
  };

  return (
    <AvailabilityContext.Provider value={contextValue}>
      {children}
    </AvailabilityContext.Provider>
  );
}

export function useAvailability() {
  const context = useContext(AvailabilityContext);
  if (context === undefined) {
    throw new Error("useAvailability must be used within an AvailabilityProvider");
  }
  return context;
}
