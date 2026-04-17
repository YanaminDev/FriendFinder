const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;
type Day = typeof DAYS[number];

// Expand range-style value ("Mon-Fri") back to individual day array
function parseDays(value: string): string[] {
  if (!value || value === 'Everyday') return [];
  return value.split(',').flatMap(part => {
    if (part.includes('-')) {
      const [start, end] = part.split('-');
      const s = DAYS.indexOf(start as Day);
      const e = DAYS.indexOf(end as Day);
      if (s !== -1 && e !== -1 && e >= s) return Array.from(DAYS.slice(s, e + 1));
    }
    return [part];
  }).filter(Boolean);
}

// Compress sorted day array into range string ("Mon,Tue,Wed,Thu,Fri" → "Mon-Fri")
function compressDays(days: string[]): string {
  if (days.length === 0) return '';
  if (days.length === 7) return 'Everyday';
  const indices = days
    .map(d => DAYS.indexOf(d as Day))
    .filter(i => i !== -1)
    .sort((a, b) => a - b);
  const groups: string[] = [];
  let i = 0;
  while (i < indices.length) {
    let j = i;
    while (j + 1 < indices.length && indices[j + 1] === indices[j] + 1) j++;
    groups.push(j > i ? `${DAYS[indices[i]]}-${DAYS[indices[j]]}` : DAYS[indices[i]]);
    i = j + 1;
  }
  return groups.join(',');
}

interface Props {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  disabled?: boolean;
}

export default function OpenDateSelect({ value, onChange, className = "", disabled }: Props) {
  const isEveryday = value === 'Everyday';
  const selectedDays = isEveryday ? [...DAYS] : parseDays(value);

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
      // Sort by DAYS order then compress consecutive ranges
      next.sort((a, b) => DAYS.indexOf(a as any) - DAYS.indexOf(b as any));
      onChange(compressDays(next));
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
