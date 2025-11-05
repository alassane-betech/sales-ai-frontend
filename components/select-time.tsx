import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Helper function to format time for display
const formatTimeForDisplay = (timeValue: string) => {
  const timeMap: { [key: string]: string } = {
    "12:00am": "12:00 AM", "12:15am": "12:15 AM", "12:30am": "12:30 AM", "12:45am": "12:45 AM",
    "1:00am": "1:00 AM", "1:15am": "1:15 AM", "1:30am": "1:30 AM", "1:45am": "1:45 AM",
    "2:00am": "2:00 AM", "2:15am": "2:15 AM", "2:30am": "2:30 AM", "2:45am": "2:45 AM",
    "3:00am": "3:00 AM", "3:15am": "3:15 AM", "3:30am": "3:30 AM", "3:45am": "3:45 AM",
    "4:00am": "4:00 AM", "4:15am": "4:15 AM", "4:30am": "4:30 AM", "4:45am": "4:45 AM",
    "5:00am": "5:00 AM", "5:15am": "5:15 AM", "5:30am": "5:30 AM", "5:45am": "5:45 AM",
    "6:00am": "6:00 AM", "6:15am": "6:15 AM", "6:30am": "6:30 AM", "6:45am": "6:45 AM",
    "7:00am": "7:00 AM", "7:15am": "7:15 AM", "7:30am": "7:30 AM", "7:45am": "7:45 AM",
    "8:00am": "8:00 AM", "8:15am": "8:15 AM", "8:30am": "8:30 AM", "8:45am": "8:45 AM",
    "9:00am": "9:00 AM", "9:15am": "9:15 AM", "9:30am": "9:30 AM", "9:45am": "9:45 AM",
    "10:00am": "10:00 AM", "10:15am": "10:15 AM", "10:30am": "10:30 AM", "10:45am": "10:45 AM",
    "11:00am": "11:00 AM", "11:15am": "11:15 AM", "11:30am": "11:30 AM", "11:45am": "11:45 AM",
    "12:00pm": "12:00 PM", "12:15pm": "12:15 PM", "12:30pm": "12:30 PM", "12:45pm": "12:45 PM",
    "1:00pm": "1:00 PM", "1:15pm": "1:15 PM", "1:30pm": "1:30 PM", "1:45pm": "1:45 PM",
    "2:00pm": "2:00 PM", "2:15pm": "2:15 PM", "2:30pm": "2:30 PM", "2:45pm": "2:45 PM",
    "3:00pm": "3:00 PM", "3:15pm": "3:15 PM", "3:30pm": "3:30 PM", "3:45pm": "3:45 PM",
    "4:00pm": "4:00 PM", "4:15pm": "4:15 PM", "4:30pm": "4:30 PM", "4:45pm": "4:45 PM",
    "5:00pm": "5:00 PM", "5:15pm": "5:15 PM", "5:30pm": "5:30 PM", "5:45pm": "5:45 PM",
    "6:00pm": "6:00 PM", "6:15pm": "6:15 PM", "6:30pm": "6:30 PM", "6:45pm": "6:45 PM",
    "7:00pm": "7:00 PM", "7:15pm": "7:15 PM", "7:30pm": "7:30 PM", "7:45pm": "7:45 PM",
    "8:00pm": "8:00 PM", "8:15pm": "8:15 PM", "8:30pm": "8:30 PM", "8:45pm": "8:45 PM",
    "9:00pm": "9:00 PM", "9:15pm": "9:15 PM", "9:30pm": "9:30 PM", "9:45pm": "9:45 PM",
    "10:00pm": "10:00 PM", "10:15pm": "10:15 PM", "10:30pm": "10:30 PM", "10:45pm": "10:45 PM",
    "11:00pm": "11:00 PM", "11:15pm": "11:15 PM", "11:30pm": "11:30 PM", "11:45pm": "11:45 PM"
  };
  return timeMap[timeValue] || timeValue;
};

export default function SelectTime({defaultValue, value, onChange}: {defaultValue: string, value: string, onChange: (value: string) => void}) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-32 bg-white/5 border-white/20 text-white hover:bg-white/10 focus:ring-green-main text-xs">
        <SelectValue placeholder="Select a time">
          {value ? formatTimeForDisplay(value) : "Select a time"}
        </SelectValue>
      </SelectTrigger>
      <SelectContent className="bg-gray-900 border-white/20 text-white max-h-60 text-xs">
        <SelectItem className="text-white hover:bg-white/10 focus:bg-white/10" value="12:00am">12:00 AM</SelectItem>
        <SelectItem className="text-white hover:bg-white/10 focus:bg-white/10" value="12:15am">12:15 AM</SelectItem>
        <SelectItem className="text-white hover:bg-white/10 focus:bg-white/10" value="12:30am">12:30 AM</SelectItem>
        <SelectItem className="text-white hover:bg-white/10 focus:bg-white/10" value="12:45am">12:45 AM</SelectItem>
        <SelectItem className="text-white hover:bg-white/10 focus:bg-white/10" value="1:00am">1:00 AM</SelectItem>
        <SelectItem className="text-white hover:bg-white/10 focus:bg-white/10" value="1:15am">1:15 AM</SelectItem>
        <SelectItem className="text-white hover:bg-white/10 focus:bg-white/10" value="1:30am">1:30 AM</SelectItem>
        <SelectItem className="text-white hover:bg-white/10 focus:bg-white/10" value="1:45am">1:45 AM</SelectItem>
        <SelectItem className="text-white hover:bg-white/10 focus:bg-white/10" value="2:00am">2:00 AM</SelectItem>
        <SelectItem className="text-white hover:bg-white/10 focus:bg-white/10" value="2:15am">2:15 AM</SelectItem>
        <SelectItem className="text-white hover:bg-white/10 focus:bg-white/10" value="2:30am">2:30 AM</SelectItem>
        <SelectItem className="text-white hover:bg-white/10 focus:bg-white/10" value="2:45am">2:45 AM</SelectItem>
        <SelectItem className="text-white hover:bg-white/10 focus:bg-white/10" value="3:00am">3:00 AM</SelectItem>
        <SelectItem className="text-white hover:bg-white/10 focus:bg-white/10" value="3:15am">3:15 AM</SelectItem>
        <SelectItem className="text-white hover:bg-white/10 focus:bg-white/10" value="3:30am">3:30 AM</SelectItem>
        <SelectItem className="text-white hover:bg-white/10 focus:bg-white/10" value="3:45am">3:45 AM</SelectItem>
        <SelectItem className="text-white hover:bg-white/10 focus:bg-white/10" value="4:00am">4:00 AM</SelectItem>
        <SelectItem className="text-white hover:bg-white/10 focus:bg-white/10" value="4:15am">4:15 AM</SelectItem>
        <SelectItem className="text-white hover:bg-white/10 focus:bg-white/10" value="4:30am">4:30 AM</SelectItem>
        <SelectItem className="text-white hover:bg-white/10 focus:bg-white/10" value="4:45am">4:45 AM</SelectItem>
        <SelectItem className="text-white hover:bg-white/10 focus:bg-white/10" value="5:00am">5:00 AM</SelectItem>
        <SelectItem className="text-white hover:bg-white/10 focus:bg-white/10" value="5:15am">5:15 AM</SelectItem>
        <SelectItem className="text-white hover:bg-white/10 focus:bg-white/10" value="5:30am">5:30 AM</SelectItem>
        <SelectItem className="text-white hover:bg-white/10 focus:bg-white/10" value="5:45am">5:45 AM</SelectItem>
        <SelectItem className="text-white hover:bg-white/10 focus:bg-white/10" value="6:00am">6:00 AM</SelectItem>
        <SelectItem className="text-white hover:bg-white/10 focus:bg-white/10" value="6:15am">6:15 AM</SelectItem>
        <SelectItem className="text-white hover:bg-white/10 focus:bg-white/10" value="6:30am">6:30 AM</SelectItem>
        <SelectItem className="text-white hover:bg-white/10 focus:bg-white/10" value="6:45am">6:45 AM</SelectItem>
        <SelectItem className="text-white hover:bg-white/10 focus:bg-white/10" value="7:00am">7:00 AM</SelectItem>
        <SelectItem className="text-white hover:bg-white/10 focus:bg-white/10" value="7:15am">7:15 AM</SelectItem>
        <SelectItem className="text-white hover:bg-white/10 focus:bg-white/10" value="7:30am">7:30 AM</SelectItem>
        <SelectItem className="text-white hover:bg-white/10 focus:bg-white/10" value="7:45am">7:45 AM</SelectItem>
        <SelectItem className="text-white hover:bg-white/10 focus:bg-white/10" value="8:00am">8:00 AM</SelectItem>
        <SelectItem className="text-white hover:bg-white/10 focus:bg-white/10" value="8:15am">8:15 AM</SelectItem>
        <SelectItem className="text-white hover:bg-white/10 focus:bg-white/10" value="8:30am">8:30 AM</SelectItem>
        <SelectItem className="text-white hover:bg-white/10 focus:bg-white/10" value="8:45am">8:45 AM</SelectItem>
        <SelectItem className="text-white hover:bg-white/10 focus:bg-white/10" value="9:00am">9:00 AM</SelectItem>
        <SelectItem className="text-white hover:bg-white/10 focus:bg-white/10" value="9:15am">9:15 AM</SelectItem>
        <SelectItem className="text-white hover:bg-white/10 focus:bg-white/10" value="9:30am">9:30 AM</SelectItem>
        <SelectItem className="text-white hover:bg-white/10 focus:bg-white/10" value="9:45am">9:45 AM</SelectItem>
        <SelectItem className="text-white hover:bg-white/10 focus:bg-white/10" value="10:00am">10:00 AM</SelectItem>
        <SelectItem className="text-white hover:bg-white/10 focus:bg-white/10" value="10:15am">10:15 AM</SelectItem>
        <SelectItem className="text-white hover:bg-white/10 focus:bg-white/10" value="10:30am">10:30 AM</SelectItem>
        <SelectItem className="text-white hover:bg-white/10 focus:bg-white/10" value="10:45am">10:45 AM</SelectItem>
        <SelectItem className="text-white hover:bg-white/10 focus:bg-white/10" value="11:00am">11:00 AM</SelectItem>
        <SelectItem className="text-white hover:bg-white/10 focus:bg-white/10" value="11:15am">11:15 AM</SelectItem>
        <SelectItem className="text-white hover:bg-white/10 focus:bg-white/10" value="11:30am">11:30 AM</SelectItem>
        <SelectItem className="text-white hover:bg-white/10 focus:bg-white/10" value="11:45am">11:45 AM</SelectItem>
        <SelectItem className="text-white hover:bg-white/10 focus:bg-white/10" value="12:00pm">12:00 PM</SelectItem>
        <SelectItem className="text-white hover:bg-white/10 focus:bg-white/10" value="12:15pm">12:15 PM</SelectItem>
        <SelectItem className="text-white hover:bg-white/10 focus:bg-white/10" value="12:30pm">12:30 PM</SelectItem>
        <SelectItem className="text-white hover:bg-white/10 focus:bg-white/10" value="12:45pm">12:45 PM</SelectItem>
        <SelectItem className="text-white hover:bg-white/10 focus:bg-white/10" value="1:00pm">1:00 PM</SelectItem>
        <SelectItem className="text-white hover:bg-white/10 focus:bg-white/10" value="1:15pm">1:15 PM</SelectItem>
        <SelectItem className="text-white hover:bg-white/10 focus:bg-white/10" value="1:30pm">1:30 PM</SelectItem>
        <SelectItem className="text-white hover:bg-white/10 focus:bg-white/10" value="1:45pm">1:45 PM</SelectItem>
        <SelectItem className="text-white hover:bg-white/10 focus:bg-white/10" value="2:00pm">2:00 PM</SelectItem>
        <SelectItem className="text-white hover:bg-white/10 focus:bg-white/10" value="2:15pm">2:15 PM</SelectItem>
        <SelectItem className="text-white hover:bg-white/10 focus:bg-white/10" value="2:30pm">2:30 PM</SelectItem>
        <SelectItem className="text-white hover:bg-white/10 focus:bg-white/10" value="2:45pm">2:45 PM</SelectItem>
        <SelectItem className="text-white hover:bg-white/10 focus:bg-white/10" value="3:00pm">3:00 PM</SelectItem>
        <SelectItem className="text-white hover:bg-white/10 focus:bg-white/10" value="3:15pm">3:15 PM</SelectItem>
        <SelectItem className="text-white hover:bg-white/10 focus:bg-white/10" value="3:30pm">3:30 PM</SelectItem>
        <SelectItem className="text-white hover:bg-white/10 focus:bg-white/10" value="3:45pm">3:45 PM</SelectItem>
        <SelectItem className="text-white hover:bg-white/10 focus:bg-white/10" value="4:00pm">4:00 PM</SelectItem>
        <SelectItem className="text-white hover:bg-white/10 focus:bg-white/10" value="4:15pm">4:15 PM</SelectItem>
        <SelectItem className="text-white hover:bg-white/10 focus:bg-white/10" value="4:30pm">4:30 PM</SelectItem>
        <SelectItem className="text-white hover:bg-white/10 focus:bg-white/10" value="4:45pm">4:45 PM</SelectItem>
        <SelectItem className="text-white hover:bg-white/10 focus:bg-white/10" value="5:00pm">5:00 PM</SelectItem>
        <SelectItem className="text-white hover:bg-white/10 focus:bg-white/10" value="5:15pm">5:15 PM</SelectItem>
        <SelectItem className="text-white hover:bg-white/10 focus:bg-white/10" value="5:30pm">5:30 PM</SelectItem>
        <SelectItem className="text-white hover:bg-white/10 focus:bg-white/10" value="5:45pm">5:45 PM</SelectItem>
        <SelectItem className="text-white hover:bg-white/10 focus:bg-white/10" value="6:00pm">6:00 PM</SelectItem>
        <SelectItem className="text-white hover:bg-white/10 focus:bg-white/10" value="6:15pm">6:15 PM</SelectItem>
        <SelectItem className="text-white hover:bg-white/10 focus:bg-white/10" value="6:30pm">6:30 PM</SelectItem>
        <SelectItem className="text-white hover:bg-white/10 focus:bg-white/10" value="6:45pm">6:45 PM</SelectItem>
        <SelectItem className="text-white hover:bg-white/10 focus:bg-white/10" value="7:00pm">7:00 PM</SelectItem>
        <SelectItem className="text-white hover:bg-white/10 focus:bg-white/10" value="7:15pm">7:15 PM</SelectItem>
        <SelectItem className="text-white hover:bg-white/10 focus:bg-white/10" value="7:30pm">7:30 PM</SelectItem>
        <SelectItem className="text-white hover:bg-white/10 focus:bg-white/10" value="7:45pm">7:45 PM</SelectItem>
        <SelectItem className="text-white hover:bg-white/10 focus:bg-white/10" value="8:00pm">8:00 PM</SelectItem>
        <SelectItem className="text-white hover:bg-white/10 focus:bg-white/10" value="8:15pm">8:15 PM</SelectItem>
        <SelectItem className="text-white hover:bg-white/10 focus:bg-white/10" value="8:30pm">8:30 PM</SelectItem>
        <SelectItem className="text-white hover:bg-white/10 focus:bg-white/10" value="8:45pm">8:45 PM</SelectItem>
        <SelectItem className="text-white hover:bg-white/10 focus:bg-white/10" value="9:00pm">9:00 PM</SelectItem>
        <SelectItem className="text-white hover:bg-white/10 focus:bg-white/10" value="9:15pm">9:15 PM</SelectItem>
        <SelectItem className="text-white hover:bg-white/10 focus:bg-white/10" value="9:30pm">9:30 PM</SelectItem>
        <SelectItem className="text-white hover:bg-white/10 focus:bg-white/10" value="9:45pm">9:45 PM</SelectItem>
        <SelectItem className="text-white hover:bg-white/10 focus:bg-white/10" value="10:00pm">10:00 PM</SelectItem>
        <SelectItem className="text-white hover:bg-white/10 focus:bg-white/10" value="10:15pm">10:15 PM</SelectItem>
        <SelectItem className="text-white hover:bg-white/10 focus:bg-white/10" value="10:30pm">10:30 PM</SelectItem>
        <SelectItem className="text-white hover:bg-white/10 focus:bg-white/10" value="10:45pm">10:45 PM</SelectItem>
        <SelectItem className="text-white hover:bg-white/10 focus:bg-white/10" value="11:00pm">11:00 PM</SelectItem>
        <SelectItem className="text-white hover:bg-white/10 focus:bg-white/10" value="11:15pm">11:15 PM</SelectItem>
        <SelectItem className="text-white hover:bg-white/10 focus:bg-white/10" value="11:30pm">11:30 PM</SelectItem>
        <SelectItem className="text-white hover:bg-white/10 focus:bg-white/10" value="11:45pm">11:45 PM</SelectItem>
      </SelectContent>
    </Select>
  );
}