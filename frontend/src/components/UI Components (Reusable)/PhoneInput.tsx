import React from "react"

interface Props extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'type' | 'maxLength'> {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function PhoneInput({ className = "", value, onChange, ...props }: Props) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 10);
    e.target.value = raw;
    onChange(e);
  };

  return (
    <input
      type="tel"
      inputMode="numeric"
      maxLength={10}
      value={value}
      onChange={handleChange}
      placeholder="0xxxxxxxxx"
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
