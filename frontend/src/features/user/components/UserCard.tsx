import UserInfo from "./UserInfo"
import UserActions from "./UserActions"

interface User {
  user_id: string
  user_show_name: string
  username: string
  role: string
  sex: string
  age: number
}

interface UserCardProps {
  user: User
  onAddAdmin: (userId: string) => void
  onRemoveAdmin: (userId: string) => void
  onDeleteUser: (userId: string) => void
}

export default function UserCard({
  user,
  onAddAdmin,
  onRemoveAdmin,
  onDeleteUser,
}: UserCardProps) {
  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-[0_2px_20px_rgba(0,0,0,0.06)]">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#FD7979] to-[#ff9a9a] px-5 py-4">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 text-lg font-bold text-white ring-2 ring-white/30 backdrop-blur-sm">
            {user.user_show_name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1">
            <p className="text-base font-bold text-white">{user.user_show_name}</p>
            <p className="text-xs text-white/70">@{user.username}</p>
          </div>
          {user.role === "admin" ? (
            <span className="rounded-full bg-yellow-400/90 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-yellow-900 shadow-sm">
              Admin
            </span>
          ) : (
            <span className="rounded-full bg-white/20 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-white backdrop-blur-sm">
              User
            </span>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="px-5 py-5">
        <UserInfo user={user} />
      </div>

      {/* Actions */}
      <div className="px-5 pb-5">
        <UserActions
          userId={user.user_id}
          isAdmin={user.role === "admin"}
          onAddAdmin={onAddAdmin}
          onRemoveAdmin={onRemoveAdmin}
          onDeleteUser={onDeleteUser}
        />
      </div>
    </div>
  )
}
