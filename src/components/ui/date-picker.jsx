import { useState } from "react";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
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

  const handleCalendarSelect = (selected) => {
    if (!selected) return;

    setDate(selected);
    setValue(formatDate(selected));
    setOpen(false);
    onChange({ target: { name, value: selected.toISOString().split("T")[0] } });
  };

  return (
    <div className="relative">
      <Input
        id={id}
        name={name}
        value={value}
        placeholder="01 janvier 1990"
        aria-invalid={ariaInvalid}
        autoComplete="off"
        inputMode="none"
        readOnly
        className="cursor-pointer pr-10 caret-transparent"
        onClick={() => setOpen(true)}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setOpen(true);
          }
        }}
      />
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          aria-label="Sélectionner une date"
          className="absolute right-1 top-1/2 flex size-7 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
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
    </div>
  );
}
