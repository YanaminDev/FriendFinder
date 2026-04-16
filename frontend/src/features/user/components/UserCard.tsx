import UserInfo from "./UserInfo"
import UserActions from "./UserActions"

interface LookupValue {
  id: string
  name: string
}

interface User {
  user_id: string
  user_show_name: string
  username: string
  role: string
  sex: string
  age: number
  isBanned: boolean
  info?: {
    user_height: number | null
    language: LookupValue | null
    education: LookupValue | null
  } | null
  life_style?: {
    looking_for: LookupValue | null
    drinking: LookupValue | null
    pet: LookupValue | null
    smoke: LookupValue | null
    workout: LookupValue | null
  } | null
  images?: { imageUrl: string }[]
}

interface UserCardProps {
  user: User
  onAddAdmin: (userId: string) => void
  onRemoveAdmin: (userId: string) => void
  onBanUser: (userId: string) => void
  onUnbanUser: (userId: string) => void
}

export default function UserCard({
  user,
  onAddAdmin,
  onRemoveAdmin,
  onBanUser,
  onUnbanUser,
}: UserCardProps) {
  return (
    <div className={`overflow-hidden rounded-2xl bg-white shadow-[0_2px_20px_rgba(0,0,0,0.06)] ${user.isBanned ? 'opacity-60' : ''}`}>
      {/* Header */}
      <div className={`px-5 py-4 ${user.isBanned ? 'bg-gradient-to-r from-gray-400 to-gray-500' : 'bg-gradient-to-r from-[#FD7979] to-[#ff9a9a]'}`}>
        <div className="flex items-center gap-4">
          {user.images?.[0]?.imageUrl ? (
            <img
              src={user.images[0].imageUrl}
              alt={user.user_show_name}
              className="h-12 w-12 rounded-full object-cover ring-2 ring-white/30"
            />
          ) : (
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 text-lg font-bold text-white ring-2 ring-white/30 backdrop-blur-sm">
              {user.user_show_name.charAt(0).toUpperCase()}
            </div>
          )}
          <div className="flex-1">
            <p className="text-base font-bold text-white">{user.user_show_name}</p>
            <p className="text-xs text-white/70">@{user.username}</p>
          </div>
          <div className="flex items-center gap-2">
            {user.isBanned && (
              <span className="rounded-full bg-red-600 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-white shadow-sm">
                Banned
              </span>
            )}
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
          isBanned={user.isBanned}
          onAddAdmin={onAddAdmin}
          onRemoveAdmin={onRemoveAdmin}
          onBanUser={onBanUser}
          onUnbanUser={onUnbanUser}
        />
      </div>
    </div>
  )
}
