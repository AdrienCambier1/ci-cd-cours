import { useState } from "react";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

function formatDate(date) {
  if (!date) return "";
  return date.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export function DatePickerInput({ id, name, onChange, "aria-invalid": ariaInvalid }) {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState(undefined);
  const [month, setMonth] = useState(undefined);
  const [value, setValue] = useState("");

  const handleTextChange = (e) => {
    const parsed = new Date(e.target.value);
    setValue(e.target.value);
    if (!isNaN(parsed.getTime())) {
      setDate(parsed);
      setMonth(parsed);
      onChange({ target: { name, value: parsed.toISOString().split("T")[0] } });
    } else {
      setDate(undefined);
      onChange({ target: { name, value: e.target.value } });
    }
  };

  const handleCalendarSelect = (selected) => {
    setDate(selected);
    setValue(formatDate(selected));
    setOpen(false);
    onChange({ target: { name, value: selected.toISOString().split("T")[0] } });
  };

  return (
    <InputGroup>
      <InputGroupInput
        id={id}
        value={value}
        placeholder="01 janvier 1990"
        aria-invalid={ariaInvalid}
        onChange={handleTextChange}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown") {
            e.preventDefault();
            setOpen(true);
          }
        }}
      />
      <InputGroupAddon align="inline-end">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger
            aria-label="Sélectionner une date"
            className="flex size-7 items-center justify-center text-muted-foreground hover:text-foreground"
          >
            <CalendarIcon className="size-4" />
          </PopoverTrigger>
          <PopoverContent
            className="w-auto overflow-hidden p-0"
            align="end"
            alignOffset={-8}
            sideOffset={10}
          >
            <Calendar
              mode="single"
              selected={date}
              month={month}
              onMonthChange={setMonth}
              captionLayout="dropdown"
              fromYear={1900}
              toYear={new Date().getFullYear() - 18}
              onSelect={handleCalendarSelect}
            />
          </PopoverContent>
        </Popover>
      </InputGroupAddon>
    </InputGroup>
  );
}
