import React, { useRef } from "react"

interface Props extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'type'> {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function TimeInput({ className = "", value, onChange, ...props }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value.replace(/[^\d:]/g, '');

    // Remove all colons to work with digits only
    const digits = raw.replace(/:/g, '');

    if (digits.length === 0) {
      e.target.value = '';
      onChange(e);
      return;
    }

    // Auto-insert colon after 2 digits
    let formatted = '';
    if (digits.length <= 2) {
      formatted = digits;
    } else {
      formatted = digits.slice(0, 2) + ':' + digits.slice(2, 4);
    }

    // Validate hours (00-23) and minutes (00-59)
    const parts = formatted.split(':');
    const hour = parseInt(parts[0], 10);
    if (parts[0].length === 2 && (hour < 0 || hour > 23)) {
      return; // block invalid hour
    }
    if (parts[1] !== undefined && parts[1].length === 2) {
      const min = parseInt(parts[1], 10);
      if (min < 0 || min > 59) {
        return; // block invalid minute
      }
    }

    e.target.value = formatted;
    onChange(e);
  };

  return (
    <input
      ref={inputRef}
      type="text"
      inputMode="numeric"
      maxLength={5}
      value={value}
      onChange={handleChange}
      placeholder="HH:MM"
      className={`w-full px-4 py-2.5 md:py-4 rounded-full border border-black-900
        bg-white text-sm sm:text-base md:text-[15px]
        focus:outline-none focus:ring-2 focus:ring-[#FD7979]
        transition shadow-md disabled:bg-gray-100 disabled:text-gray-500
        disabled:cursor-not-allowed disabled:opacity-60
        ${className}
      `}
      {...props}
    />
  )
}
