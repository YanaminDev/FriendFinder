import React, { useState, useRef, useEffect } from "react"

interface Option {
  value: string
  label: string
  icon?: string
}

interface Props {
  options: Option[]
  value: string
  onChange: (value: string) => void
  placeholder?: string
  name?: string
  disabled?: boolean
  className?: string
}

export default function Select({
  options,
  value,
  onChange,
  placeholder = "Select an option...",
  name,
  disabled = false,
  className = "",
}: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const selected = options.find((o) => o.value === value)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div ref={ref} className={`relative ${className}`}>
      {name && <input type="hidden" name={name} value={value} />}

      {/* Trigger */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`
          w-full px-4 py-2.5 md:py-4 rounded-full border border-black-900
          bg-white text-sm sm:text-base md:text-[15px] text-left
          focus:outline-none focus:ring-2 focus:ring-[#FD7979]
          transition shadow-md flex items-center justify-between
          ${disabled ? "bg-gray-100 text-gray-500 cursor-not-allowed opacity-60" : "cursor-pointer"}
        `}
      >
        <span className={selected ? "text-gray-900" : "text-gray-400"}>
          {selected ? (
            <span className="flex items-center gap-2">
              {selected.icon && <span>{selected.icon}</span>}
              {selected.label}
            </span>
          ) : (
            placeholder
          )}
        </span>

        {/* Chevron */}
        <svg
          className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 mt-2 w-full bg-white rounded-2xl border border-gray-200 shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="max-h-60 overflow-y-auto py-1">
            {options.length === 0 ? (
              <div className="px-4 py-3 text-sm text-gray-400 text-center">
                No options available
              </div>
            ) : (
              options.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onChange(option.value)
                    setIsOpen(false)
                  }}
                  className={`
                    w-full px-4 py-2.5 text-left text-sm flex items-center gap-2
                    transition-colors duration-150
                    ${
                      option.value === value
                        ? "bg-gradient-to-r from-[#FFF0F0] to-[#FFE8E8] text-[#F26B6B] font-medium"
                        : "text-gray-700 hover:bg-gray-50"
                    }
                  `}
                >
                  {option.icon && <span className="text-base">{option.icon}</span>}
                  <span>{option.label}</span>
                  {option.value === value && (
                    <svg className="w-4 h-4 ml-auto text-[#F26B6B]" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
