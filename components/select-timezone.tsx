import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel } from "@/components/ui/select";
import { Search, Clock, Globe } from "lucide-react";
import { cn } from "@/lib/utils";

// Comprehensive timezone data with better organization
const timezoneGroups = [
  {
    label: "North America",
    zones: [
      { value: "GMT-10:00", label: "Hawaii", region: "Hawaii-Aleutian Standard Time" },
      { value: "GMT-9:00", label: "Alaska", region: "Alaska Standard Time" },
      { value: "GMT-8:00", label: "Pacific Time", region: "US & Canada" },
      { value: "GMT-7:00", label: "Mountain Time", region: "US & Canada" },
      { value: "GMT-6:00", label: "Central Time", region: "US & Canada" },
      { value: "GMT-5:00", label: "Eastern Time", region: "US & Canada" },
      { value: "GMT-4:00", label: "Atlantic Time", region: "Canada" },
    ]
  },
  {
    label: "South America",
    zones: [
      { value: "GMT-3:00", label: "Brazil Time", region: "São Paulo, Buenos Aires" },
      { value: "GMT-2:00", label: "Mid-Atlantic", region: "South Georgia" },
    ]
  },
  {
    label: "Europe & Africa",
    zones: [
      { value: "GMT-1:00", label: "Azores", region: "Cape Verde Islands" },
      { value: "GMT+0:00", label: "GMT", region: "London, Dublin, Lisbon" },
      { value: "GMT+1:00", label: "Central European", region: "Paris, Berlin, Rome" },
      { value: "GMT+2:00", label: "Eastern European", region: "Cairo, Helsinki, Athens" },
      { value: "GMT+3:00", label: "East Africa", region: "Moscow, Nairobi, Baghdad" },
    ]
  },
  {
    label: "Asia & Pacific",
    zones: [
      { value: "GMT+4:00", label: "Gulf Standard", region: "Dubai, Abu Dhabi" },
      { value: "GMT+5:00", label: "Pakistan Standard", region: "Karachi, Tashkent" },
      { value: "GMT+6:00", label: "Bangladesh Standard", region: "Dhaka, Almaty" },
      { value: "GMT+7:00", label: "Indochina", region: "Bangkok, Jakarta, Ho Chi Minh" },
      { value: "GMT+8:00", label: "China Standard", region: "Beijing, Singapore, Perth" },
      { value: "GMT+9:00", label: "Japan Standard", region: "Tokyo, Seoul, Pyongyang" },
      { value: "GMT+9:30", label: "Australian Central", region: "Adelaide, Darwin" },
      { value: "GMT+10:00", label: "Australian Eastern", region: "Sydney, Melbourne, Brisbane" },
      { value: "GMT+11:00", label: "Solomon Islands", region: "Magadan, New Caledonia" },
      { value: "GMT+12:00", label: "New Zealand", region: "Auckland, Wellington, Fiji" },
      { value: "GMT+13:00", label: "Tonga Time", region: "Nuku'alofa" },
    ]
  },
  {
    label: "Remote Islands",
    zones: [
      { value: "GMT-11:00", label: "Samoa Standard", region: "Midway Island, Samoa" },
    ]
  }
];

// Helper function to format timezone for display
const formatTimezoneForDisplay = (timezoneValue: string) => {
  for (const group of timezoneGroups) {
    const zone = group.zones.find(z => z.value === timezoneValue);
    if (zone) {
      return `${zone.label} (${timezoneValue})`;
    }
  }
  return timezoneValue;
};

// Helper function to get current time in timezone
const getCurrentTimeInTimezone = (offset: string) => {
  const now = new Date();
  const offsetHours = parseFloat(offset.replace('GMT', '').replace(':', '.'));
  const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
  const targetTime = new Date(utc + (offsetHours * 3600000));
  return targetTime.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true 
  });
};

interface SelectTimezoneProps {
  defaultValue?: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
  placeholder?: string;
  showCurrentTime?: boolean;
}

export default function SelectTimezone({
  defaultValue,
  value,
  onChange,
  className,
  placeholder = "Select timezone",
  showCurrentTime = true
}: SelectTimezoneProps) {
  const [searchTerm, setSearchTerm] = useState("");

  // Filter timezones based on search term
  const filteredGroups = timezoneGroups.map(group => ({
    ...group,
    zones: group.zones.filter(zone =>
      zone.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      zone.region.toLowerCase().includes(searchTerm.toLowerCase()) ||
      zone.value.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(group => group.zones.length > 0);

  return (
    <div className={cn("relative", className)}>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className={cn(
          "px-4 py-5",
          "bg-background border border-input",
          "text-foreground text-sm font-medium",
          "rounded-lg shadow-sm",
          "hover:bg-accent hover:text-accent-foreground",
          "focus:outline-none focus:ring-2 focus:ring-green-main focus:ring-offset-2",
          "transition-all duration-200",
          "data-[placeholder]:text-muted-foreground"
        )}>
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4 text-muted-foreground" />
            <SelectValue placeholder={placeholder}>
              {value ? (
                <div className="flex items-center w-full gap-4">
                  <span className="font-medium truncate flex-1">
                    {formatTimezoneForDisplay(value)}
                  </span>
                  {showCurrentTime && (
                    <span className="text-xs text-muted-foreground flex items-center gap-1.5 w-24 justify-end">
                      <Clock className="h-3 w-3 flex-shrink-0" />
                      <span className="font-mono tabular-nums text-right min-w-[60px]">
                        {getCurrentTimeInTimezone(value)}
                      </span>
                    </span>
                  )}
                </div>
              ) : (
                placeholder
              )}
            </SelectValue>
          </div>
        </SelectTrigger>
        
        <SelectContent className={cn(
          "bg-popover border border-border rounded-lg shadow-lg",
          "text-popover-foreground",
          "animate-in fade-in-0 zoom-in-95"
        )}>
          {/* Search Input */}
          <div className="sticky top-0 z-10 p-2 bg-popover border-b border-border">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search timezones..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={cn(
                  "w-full pl-9 pr-3 py-2 text-sm",
                  "bg-background border border-input rounded-md",
                  "text-foreground placeholder:text-muted-foreground",
                  "focus:outline-none focus:ring-2 focus:ring-green-main focus:ring-offset-0",
                  "transition-all duration-200"
                )}
              />
            </div>
          </div>

          {/* Timezone Groups */}
          <div className="max-h-[300px] overflow-y-auto">
            {filteredGroups.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground text-sm">
                No timezones found matching "{searchTerm}"
              </div>
            ) : (
              filteredGroups.map((group) => (
                <SelectGroup key={group.label}>
                  <SelectLabel className={cn(
                    "px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider",
                    "bg-muted/50 border-b border-border/50"
                  )}>
                    {group.label}
                  </SelectLabel>
                  {group.zones.map((zone) => (
                    <SelectItem
                      key={zone.value}
                      value={zone.value}
                      className={cn(
                        "px-3 py-3 cursor-pointer",
                        "hover:bg-accent hover:text-accent-foreground",
                        "focus:bg-accent focus:text-accent-foreground",
                        "data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground",
                        "transition-colors duration-150"
                      )}
                    >
                      <div className="flex items-center w-full gap-6">
                        <div className="flex flex-col flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm">
                              {zone.label}
                            </span>
                            <span className="text-xs text-muted-foreground font-mono">
                              {zone.value}
                            </span>
                          </div>
                          <span className="text-xs text-muted-foreground mt-0.5 truncate">
                            {zone.region}
                          </span>
                        </div>
                        {showCurrentTime && (
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground w-24 justify-end">
                            <Clock className="h-3 w-3 flex-shrink-0" />
                            <span className="font-mono tabular-nums text-right min-w-[60px]">
                              {getCurrentTimeInTimezone(zone.value)}
                            </span>
                          </div>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectGroup>
              ))
            )}
          </div>
        </SelectContent>
      </Select>
    </div>
  );
}