import UserCard from "./UserCard"

interface User {
  user_id: string
  user_show_name: string
  username: string
  role: string
  sex: string
  age: number
}

interface UserListProps {
  users: User[]
  onAddAdmin: (userId: string) => void
  onRemoveAdmin: (userId: string) => void
  onDeleteUser: (userId: string) => void
}

export default function UserList({
  users,
  onAddAdmin,
  onRemoveAdmin,
  onDeleteUser,
}: UserListProps) {
  if (users.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No users found
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
          onDeleteUser={onDeleteUser}
        />
      ))}
    </div>
  )
}
