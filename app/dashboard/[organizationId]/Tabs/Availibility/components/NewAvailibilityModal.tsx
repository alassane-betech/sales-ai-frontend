import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import SelectTimezone from "@/components/select-timezone";
import { NewAvailabilityBody } from "@/lib/models/Availabilities/Availibility";
import { createAvailability } from "@/lib/api/availabilities";
import { toast } from "sonner";
import { useAvailability } from "../context/AvailabilityContext";

export default function NewAvailibility({
  open,
  setOpen,
  organizationId,
  userId,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  organizationId: string;
  userId: string;
}) {
  const { createAvailability } = useAvailability();
  const [name, setName] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [timezone, setTimezone] = useState("GMT+1:00");

  const handleSubmit = async () => {
    const newAvailability: NewAvailabilityBody = {
      user_id: userId,
      name,
      is_active: isActive,
      timezone,
      organization_id: organizationId,
    };
    try {
      await createAvailability(newAvailability);
      toast.success("Availability created successfully");
      setOpen(false);
    } catch (error) {
      toast.error("Failed to create availability");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          onClick={() => setOpen(true)}
          className="bg-white/5 border-white/20 text-green-main hover:bg-green-main/10 hover:border-green-main/30 px-1.5 h-7"
        >
          <Plus className="w-4 h-4" />
          Add Availability
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-white/5 backdrop-blur-md border border-white/10 rounded-lg p-6">
        <DialogHeader>
          <DialogTitle className="text-white">Add Availability</DialogTitle>
          <DialogDescription className="text-white">
            Add a new availability for your business.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="grid gap-3">
            <Label htmlFor="name-1">Name</Label>
            <Input
              id="name-1"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter a name for your availability"
            />
          </div>
        </div>
        <div className="grid gap-3">
          <Label htmlFor="timezone-1">Timezone</Label>
          <SelectTimezone
            value={timezone}
            onChange={(value) => setTimezone(value)}
          />
        </div>
        <div className="grid gap-3">
          <Label htmlFor="is-active">Define as active</Label>
          <Switch
            id="is-active"
            checked={isActive}
            onCheckedChange={setIsActive}
            className="data-[state=checked]:bg-green-main data-[state=unchecked]:bg-gray-300"
          />
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            className="bg-white/5 border-white/20 text-green-main hover:bg-green-main/10 hover:border-green-main/30 px-1.5 h-7"
          >
            <X className="w-4 h-4" />
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            className="bg-gradient-to-r from-green-main to-green-light hover:from-green-light hover:to-green-main text-white border-0 px-1.5 h-7"
          >
            <Plus className="w-4 h-4" />
            Add Availability
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
