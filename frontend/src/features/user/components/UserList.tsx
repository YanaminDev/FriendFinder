import UserCard from "./UserCard"

interface User {
  user_id: string
  user_show_name: string
  username: string
  role: string
  sex: string
  age: number
  isBanned: boolean
}

interface UserListProps {
  users: User[]
  onAddAdmin: (userId: string) => void
  onRemoveAdmin: (userId: string) => void
  onBanUser: (userId: string) => void
  onUnbanUser: (userId: string) => void
}

export default function UserList({
  users,
  onAddAdmin,
  onRemoveAdmin,
  onBanUser,
  onUnbanUser,
}: UserListProps) {
  if (users.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        ไม่พบผู้ใช้
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {users.map((user) => (
        <UserCard
          key={user.user_id}
          user={user}
          onAddAdmin={onAddAdmin}
          onRemoveAdmin={onRemoveAdmin}
          onBanUser={onBanUser}
          onUnbanUser={onUnbanUser}
        />
      ))}
    </div>
  )
}
