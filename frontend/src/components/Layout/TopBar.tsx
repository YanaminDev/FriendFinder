interface TopBarProps {
  title?: string
  onBack?: () => void
}

export default function TopBar({ 
  title = "FriendFinder",
}: TopBarProps) {
  return (
    <div className="
      fixed top-0 left-0 
      w-full h-16 
      bg-white 
      shadow-sm
      flex items-center
      px-4
      z-50
    ">
      <div className="flex items-center gap-2 ml-3">
        <span className="text-[#FD7979] text-lg font-semibold">
          {title}
        </span>
      </div>
    </div>
  )
}