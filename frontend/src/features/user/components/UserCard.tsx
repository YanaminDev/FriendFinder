import UserInfo from "./UserInfo"
import UserActions from "./UserActions"
import CardHeader from "../../../components/CardHeader"

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
    user_bio: string | null
    blood_group: string | null
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
    <div className={`overflow-hidden rounded-2xl bg-white shadow-[0_4px_24px_rgba(0,0,0,0.07)] ring-1 ring-black/[0.03] ${user.isBanned ? 'opacity-60' : ''}`}>
      <CardHeader variant={user.isBanned ? "gray" : "pink"} className="px-5 py-5">
        <div className="flex items-center gap-4">
          {/* Avatar */}
          {user.images?.[0]?.imageUrl ? (
            <img
              src={user.images[0].imageUrl}
              alt={user.user_show_name}
              className="h-16 w-16 rounded-full object-cover ring-4 ring-white/30 shadow-lg"
            />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20 text-xl font-black text-white ring-4 ring-white/30 shadow-lg backdrop-blur-sm">
              {user.user_show_name.charAt(0).toUpperCase()}
            </div>
          )}

          {/* Name + username */}
          <div className="flex-1 min-w-0">
            <p className="text-base font-black text-white leading-tight truncate">{user.user_show_name}</p>
            <p className="text-xs text-white/60 mt-0.5">@{user.username}</p>
            {/* Badges row */}
            <div className="mt-2 flex items-center gap-1.5 flex-wrap">
              {user.isBanned && (
                <span className="rounded-full bg-red-600/80 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                  Banned
                </span>
              )}
              <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
                user.role === "admin" ? "bg-yellow-400/90 text-yellow-900" : "bg-white/20 text-white"
              }`}>
                {user.role === "admin" ? "Admin" : "User"}
              </span>
            </div>
          </div>
        </div>
      </CardHeader>

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
