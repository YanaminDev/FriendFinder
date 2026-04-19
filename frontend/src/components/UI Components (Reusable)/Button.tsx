import React from "react"

type Variant =
  | "primary"
  | "danger"
  | "admin"
  | "outline"

type Size = "sm" | "md" | "lg"

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  fullWidth?: boolean
}

export default function Button({
  variant = "primary",
  size = "md",
  fullWidth = false,
  className = "",
  children,
  ...props
}: ButtonProps) {
  const base =
  "shadow-xl rounded-full font-medium transition-all duration-300 ease-out transform hover:scale-[1.03] active:scale-[0.98]"

  const variants: Record<Variant, string> = {
    primary: `bg-gradient-to-b from-[#FF8A8A] to-[#F26B6B] text-white shadow-[0_8px_20px_rgba(242,107,107,0.45)]
  hover:shadow-[0_12px_28px_rgba(242,107,107,0.55)]
  active:shadow-[0_4px_10px_rgba(242,107,107,0.35)]
  active:translate-y-[2px]
`,
    danger: "bg-red-500 text-white hover:bg-red-600",
    admin: "bg-[#6C78FF] text-white hover:opacity-90",
    outline:
      "border border-gray-400 text-gray-700 bg-white hover:bg-gray-100",
  }

  const sizes: Record<Size, string> = {
    sm: "px-[55px] py-2 text-[13px] md:text-[15px]",
    md: "px-11 py-2 text-[13px] md:px-20 md:text-[22px]  ",
    lg: "px-8 py-3 text-lg",
  }

  return (
    <button
      className={`
        ${base}
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? "w-full" : ""}
        disabled:opacity-60
        disabled:cursor-not-allowed
        disabled:hover:scale-100
        disabled:active:scale-100
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  )
}