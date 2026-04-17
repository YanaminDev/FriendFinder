import type { ReactNode } from "react"

interface CardHeaderProps {
  children: ReactNode
  /** 'pink' (default) or 'gray' for banned/disabled state */
  variant?: "pink" | "gray"
  className?: string
}

/**
 * Reusable card header with pink gradient background and decorative circles.
 * Drop it as the first child inside any `overflow-hidden rounded-2xl` card wrapper.
 */
export default function CardHeader({ children, variant = "pink", className = "px-5 py-4" }: CardHeaderProps) {
  const bg =
    variant === "gray"
      ? "bg-gradient-to-r from-gray-400 to-gray-500"
      : "bg-gradient-to-r from-[#FD7979] to-[#ff9a9a]"

  return (
    <div className={`relative overflow-hidden text-white ${bg} ${className}`}>
      {/* decorative circles */}
      <div className="pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full bg-white/10" />
      <div className="pointer-events-none absolute -left-4 -bottom-4 h-16 w-16 rounded-full bg-white/10" />
      {/* content */}
      <div className="relative">{children}</div>
    </div>
  )
}
