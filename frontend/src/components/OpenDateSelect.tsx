import React from "react"

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;

interface Props {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  disabled?: boolean;
}

export default function OpenDateSelect({ value, onChange, className = "", disabled }: Props) {
  const isEveryday = value === 'Everyday';
  const selectedDays = isEveryday ? [...DAYS] : value.split(',').filter(Boolean);

  const toggleDay = (day: string) => {
    if (disabled) return;
    let next: string[];
    if (selectedDays.includes(day)) {
      next = selectedDays.filter(d => d !== day);
    } else {
      next = [...selectedDays, day];
    }

    // If all 7 days selected → Everyday
    if (next.length === 7) {
      onChange('Everyday');
    } else {
      // Sort by DAYS order
      next.sort((a, b) => DAYS.indexOf(a as any) - DAYS.indexOf(b as any));
      onChange(next.join(','));
    }
  };

  const toggleEveryday = () => {
    if (disabled) return;
    if (isEveryday) {
      onChange('');
    } else {
      onChange('Everyday');
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Everyday toggle */}
      <button
        type="button"
        onClick={toggleEveryday}
        disabled={disabled}
        className={`px-4 py-1.5 rounded-full text-sm font-medium transition border
          ${isEveryday
            ? 'bg-[#FD7979] text-white border-[#FD7979]'
            : 'bg-white text-gray-600 border-gray-300 hover:border-[#FD7979]'
          }
          disabled:opacity-60 disabled:cursor-not-allowed
        `}
      >
        Everyday
      </button>

      {/* Day buttons */}
      <div className="flex flex-wrap gap-1.5">
        {DAYS.map(day => {
          const active = isEveryday || selectedDays.includes(day);
          return (
            <button
              key={day}
              type="button"
              onClick={() => toggleDay(day)}
              disabled={disabled}
              className={`w-10 h-10 rounded-full text-xs font-medium transition border
                ${active
                  ? 'bg-[#FD7979] text-white border-[#FD7979]'
                  : 'bg-white text-gray-600 border-gray-300 hover:border-[#FD7979]'
                }
                disabled:opacity-60 disabled:cursor-not-allowed
              `}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  )
}
