import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CurrentAvailibityTab from "./components/CurrentAvailibityTab";
import { Availability } from "@/lib/models/Availabilities/Availibility";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import NewAvailibility from "./components/NewAvailibilityModal";
import { AvailabilityProvider, useAvailability } from "./context/AvailabilityContext";

function AvailibilityViewContent({ organizationId, userId }: { organizationId: string, userId: string }) {
  const {
    availabilities,
    selectedAvailability,
    setSelectedAvailability,
    loading,
    error
  } = useAvailability();
  
  const [isNewAvailibilityModalOpen, setIsNewAvailibilityModalOpen] = useState(false);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Availibility</h1>
      </div>

      {/* Tab Navigation */}
      <div className="flex flex-row items-center justify-between bg-white/5 backdrop-blur-md border border-white/10 rounded-lg p-2">
        <div className="flex flex-col justify-start items-center space-y-2">
          <h3 className="text-white">Select your availability</h3>
          <Select 
            value={selectedAvailability?.id} 
            onValueChange={(value) => setSelectedAvailability(availabilities.find((availability: Availability) => availability.id === value) || null)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select your availability" />
            </SelectTrigger>
            <SelectContent>
              {availabilities.map((availability: Availability) => (
                <SelectItem key={availability.id} value={availability.id}>
                  {availability.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-row justify-end items-center space-x-2">
          <NewAvailibility 
            open={isNewAvailibilityModalOpen} 
            setOpen={setIsNewAvailibilityModalOpen} 
            organizationId={organizationId} 
            userId={userId} 
          />
        </div>
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <CurrentAvailibityTab />
      </AnimatePresence>
    </div>
  );
}

export default function AvailibilityView({ organizationId, userId }: { organizationId: string, userId: string }) {
  return (
    <AvailabilityProvider organizationId={organizationId} userId={userId}>
      <AvailibilityViewContent organizationId={organizationId} userId={userId} />
    </AvailabilityProvider>
  );
}
