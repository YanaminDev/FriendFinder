import React from "react"

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {}

export default function Input({ className = "", ...props }: Props) {
  return (
    <input
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