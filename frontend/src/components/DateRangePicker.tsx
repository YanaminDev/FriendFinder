import { useState, useRef, useEffect } from "react"
import { IoCalendarOutline, IoChevronBack, IoChevronForward, IoCloseCircle } from "react-icons/io5"

interface DateRangePickerProps {
  dateFrom: string
  dateTo: string
  onChange: (from: string, to: string) => void
}

const DAYS = ["อา", "จ", "อ", "พ", "พฤ", "ศ", "ส"]
const MONTHS = [
  "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
  "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม",
]

function toDateStr(y: number, m: number, d: number) {
  return `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`
}

function formatDisplay(from: string, to: string) {
  if (!from && !to) return "เลือกช่วงวันที่"
  const fmt = (s: string) => {
    const [y, m, d] = s.split("-")
    return `${d}/${m}/${y}`
  }
  if (from && to) return `${fmt(from)} — ${fmt(to)}`
  if (from) return `${fmt(from)} — ...`
  return "เลือกช่วงวันที่"
}

export default function DateRangePicker({ dateFrom, dateTo, onChange }: DateRangePickerProps) {
  const today = new Date()
  const [open, setOpen] = useState(false)
  const [viewYear, setViewYear] = useState(today.getFullYear())
  const [viewMonth, setViewMonth] = useState(today.getMonth())
  const [selecting, setSelecting] = useState<"from" | "to">("from")
  const [hovered, setHovered] = useState<string | null>(null)
  const [tempFrom, setTempFrom] = useState(dateFrom)
  const [tempTo, setTempTo] = useState(dateTo)
  const ref = useRef<HTMLDivElement>(null)

  // Sync external changes
  useEffect(() => { setTempFrom(dateFrom); setTempTo(dateTo) }, [dateFrom, dateTo])

  // Close on outside click
  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [open])

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()
  const firstDay = new Date(viewYear, viewMonth, 1).getDay()

  function handleDayClick(dateStr: string) {
    if (selecting === "from") {
      setTempFrom(dateStr)
      setTempTo("")
      setSelecting("to")
    } else {
      if (tempFrom && dateStr < tempFrom) {
        setTempTo(tempFrom)
        setTempFrom(dateStr)
      } else {
        setTempTo(dateStr)
      }
      setSelecting("from")
    }
  }

  function isInRange(dateStr: string) {
    const start = tempFrom
    const end = selecting === "to" && hovered ? (hovered > tempFrom ? hovered : tempFrom) : tempTo
    if (!start || !end) return false
    return dateStr > start && dateStr < end
  }

  function isRangeEnd(dateStr: string) {
    const end = selecting === "to" && hovered && tempFrom
      ? (hovered > tempFrom ? hovered : tempFrom)
      : tempTo
    return dateStr === end && !!tempFrom
  }

  function prevMonth() {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1) }
    else setViewMonth(m => m - 1)
  }

  function nextMonth() {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1) }
    else setViewMonth(m => m + 1)
  }

  function handleConfirm() {
    onChange(tempFrom, tempTo)
    setOpen(false)
  }

  function handleClear() {
    setTempFrom("")
    setTempTo("")
    setSelecting("from")
    onChange("", "")
    setOpen(false)
  }

  const hasSelection = dateFrom || dateTo

  return (
    <div className="relative" ref={ref}>
      {/* Trigger button */}
      <button
        onClick={() => setOpen(o => !o)}
        className={`flex w-full items-center gap-2 rounded-xl border px-4 py-2.5 text-sm shadow-sm transition-all ${
          open
            ? "border-[#FD7979] ring-2 ring-[#FD7979]/20"
            : "border-gray-200 hover:border-gray-300"
        } bg-white`}
      >
        <IoCalendarOutline className={`h-4 w-4 shrink-0 ${hasSelection ? "text-[#FD7979]" : "text-gray-400"}`} />
        <span className={`flex-1 text-left ${hasSelection ? "font-semibold text-gray-700" : "text-gray-400"}`}>
          {formatDisplay(dateFrom, dateTo)}
        </span>
        {hasSelection && (
          <IoCloseCircle
            className="h-4 w-4 text-gray-300 hover:text-gray-500"
            onClick={(e) => { e.stopPropagation(); handleClear() }}
          />
        )}
      </button>

      {/* Calendar popover */}
      {open && (
        <div className="absolute left-0 right-0 z-50 mt-2 overflow-hidden rounded-2xl bg-white shadow-[0_8px_40px_rgba(0,0,0,0.12)] ring-1 ring-black/5">
          {/* Month navigation */}
          <div className="flex items-center justify-between bg-gradient-to-r from-[#FD7979] to-[#ff9a9a] px-4 py-3">
            <button
              onClick={prevMonth}
              className="flex h-7 w-7 items-center justify-center rounded-full bg-white/20 text-white transition-colors hover:bg-white/30"
            >
              <IoChevronBack className="h-4 w-4" />
            </button>
            <span className="text-sm font-bold text-white">
              {MONTHS[viewMonth]} {viewYear + 543}
            </span>
            <button
              onClick={nextMonth}
              className="flex h-7 w-7 items-center justify-center rounded-full bg-white/20 text-white transition-colors hover:bg-white/30"
            >
              <IoChevronForward className="h-4 w-4" />
            </button>
          </div>

          {/* Hint */}
          <div className="bg-gray-50 px-4 py-1.5 text-center text-[11px] font-medium text-gray-400">
            {selecting === "from" ? "เลือกวันเริ่มต้น" : "เลือกวันสิ้นสุด"}
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 px-3 pt-3">
            {DAYS.map((d) => (
              <div key={d} className="py-1 text-center text-[11px] font-bold text-gray-400">
                {d}
              </div>
            ))}
          </div>

          {/* Day cells */}
          <div className="grid grid-cols-7 px-3 pb-3">
            {Array.from({ length: firstDay }).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1
              const dateStr = toDateStr(viewYear, viewMonth, day)
              const isFrom = dateStr === tempFrom
              const isTo = isRangeEnd(dateStr)
              const inRange = isInRange(dateStr)
              const isHovered = selecting === "to" && dateStr === hovered && !!tempFrom
              const isToday = dateStr === toDateStr(today.getFullYear(), today.getMonth(), today.getDate())

              return (
                <div
                  key={day}
                  className={`relative flex h-9 items-center justify-center transition-all
                    ${(inRange || (isHovered && !isFrom)) ? "bg-[#FD7979]/10" : ""}
                    ${isFrom ? "rounded-l-full" : ""}
                    ${isTo ? "rounded-r-full" : ""}
                    ${!isFrom && !isTo && inRange ? "" : ""}
                  `}
                  onMouseEnter={() => selecting === "to" && setHovered(dateStr)}
                  onMouseLeave={() => setHovered(null)}
                  onClick={() => handleDayClick(dateStr)}
                >
                  <span
                    className={`flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-sm font-medium transition-all
                      ${isFrom || isTo
                        ? "bg-[#FD7979] text-white shadow-md shadow-[#FD7979]/30"
                        : isToday
                          ? "border border-[#FD7979] text-[#FD7979]"
                          : "text-gray-700 hover:bg-[#FD7979]/10 hover:text-[#FD7979]"
                      }
                    `}
                  >
                    {day}
                  </span>
                </div>
              )
            })}
          </div>

          {/* Footer actions */}
          <div className="flex items-center gap-2 border-t border-gray-100 px-4 py-3">
            <button
              onClick={handleClear}
              className="flex-1 rounded-xl border border-gray-200 py-2 text-sm font-semibold text-gray-400 transition-colors hover:border-gray-300 hover:text-gray-600"
            >
              ล้างค่า
            </button>
            <button
              onClick={handleConfirm}
              disabled={!tempFrom}
              className="flex-1 rounded-xl bg-gradient-to-r from-[#FD7979] to-[#ff9a9a] py-2 text-sm font-bold text-white shadow-sm transition-opacity disabled:opacity-40"
            >
              ยืนยัน
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
