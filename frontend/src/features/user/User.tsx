import { useState, useEffect } from "react"
import BottomNav from "../../components/BottomNav"
import TopBar from "../../components/TopBar"
import UserList from "./components/UserList"
import { userService } from "../../services"

interface User {
  user_id: string
  user_show_name: string
  username: string
  role: string
  sex: string
  age: number
}

const MOCK_USERS: User[] = [
  {
    user_id: "user-1",
    user_show_name: "Jane Doe",
    username: "jane_doe",
    role: "user",
    sex: "female",
    age: 24,
  },
  {
    user_id: "user-2",
    user_show_name: "Michelle",
    username: "michelle_smith",
    role: "user",
    sex: "female",
    age: 26,
  },
  {
    user_id: "user-3",
    user_show_name: "Alex Johnson",
    username: "alex_j",
    role: "user",
    sex: "male",
    age: 28,
  },
]

export default function User() {
  const [users, setUsers] = useState<User[]>(MOCK_USERS)
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    // TODO: Replace with actual API call when backend is ready
    // fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      // const data = await userService.getAllUsers()
      // setUsers(data)
    } catch (error) {
      console.error("Failed to fetch users:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddAdmin = async (userId: string) => {
    try {
      // TODO: API call to update user role to admin
      // await userService.updateUserRole(userId, 'admin')
      console.log("Added admin:", userId)
      fetchUsers()
    } catch (error) {
      console.error("Failed to add admin:", error)
    }
  }

  const handleRemoveAdmin = async (userId: string) => {
    try {
      // TODO: API call to update user role to user
      // await userService.updateUserRole(userId, 'user')
      console.log("Removed admin:", userId)
      fetchUsers()
    } catch (error) {
      console.error("Failed to remove admin:", error)
    }
  }

  const handleDeleteUser = async (userId: string) => {
    try {
      // TODO: API call to delete user
      // await userService.deleteUser(userId)
      console.log("Deleted user:", userId)
      fetchUsers()
    } catch (error) {
      console.error("Failed to delete user:", error)
    }
  }

  const filteredUsers = users.filter(
    user =>
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.user_show_name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="relative min-h-screen bg-[#FAFAFA] pb-20">
      {/* Top Bar */}
      <TopBar />

      {/* Main Content */}
      <div className="mx-auto max-w-3xl px-4 pt-20">
        <h1 className="text-xl font-bold tracking-tight text-gray-800">
          Moderation User
        </h1>

        {/* Search Bar */}
        <div className="mt-4 mb-6">
          <input
            type="text"
            placeholder="Search username..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm shadow-sm transition-shadow placeholder:text-gray-400 focus:border-[#FD7979] focus:outline-none focus:ring-2 focus:ring-[#FD7979]/20"
          />
        </div>

        {/* User List */}
        {loading ? (
          <div className="py-8 text-center text-gray-400">Loading...</div>
        ) : (
          <UserList
            users={filteredUsers}
            onAddAdmin={handleAddAdmin}
            onRemoveAdmin={handleRemoveAdmin}
            onDeleteUser={handleDeleteUser}
          />
        )}
      </div>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  )
}
