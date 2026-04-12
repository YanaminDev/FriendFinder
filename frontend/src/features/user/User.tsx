import { useState, useEffect } from "react"
import BottomNav from "../../components/BottomNav"
import TopBar from "../../components/TopBar"
import UserList from "./components/UserList"
import ConfirmDialog from "../../components/ConfirmDialog"
import { adminService } from "../../services"

interface LookupValue {
  id: string
  name: string
}

interface UserData {
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
}

type Tab = "all" | "user" | "admin" | "banned"

export default function User() {
  const [users, setUsers] = useState<UserData[]>([])
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState<Tab>("all")

  // Confirm dialog state
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean
    title: string
    message: string
    confirmLabel: string
    confirmVariant: "danger" | "primary" | "admin"
    onConfirm: () => void
  }>({
    isOpen: false,
    title: "",
    message: "",
    confirmLabel: "",
    confirmVariant: "danger",
    onConfirm: () => {},
  })

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const data = await adminService.getAllUsers()
      setUsers(data)
    } catch (error) {
      console.error("Failed to fetch users:", error)
    } finally {
      setLoading(false)
    }
  }

  const openConfirm = (
    title: string,
    message: string,
    confirmLabel: string,
    confirmVariant: "danger" | "primary" | "admin",
    onConfirm: () => void
  ) => {
    setConfirmDialog({ isOpen: true, title, message, confirmLabel, confirmVariant, onConfirm })
  }

  const closeConfirm = () => {
    setConfirmDialog((prev) => ({ ...prev, isOpen: false }))
  }

  const handleAddAdmin = (userId: string) => {
    const user = users.find((u) => u.user_id === userId)
    openConfirm(
      "แต่งตั้งเป็น Admin",
      `คุณต้องการแต่งตั้ง "${user?.user_show_name}" เป็น Admin ใช่หรือไม่?`,
      "ยืนยันแต่งตั้ง",
      "admin",
      async () => {
        try {
          await adminService.updateUserRole(userId, "admin")
          await fetchUsers()
        } catch (error) {
          console.error("Failed to add admin:", error)
        }
        closeConfirm()
      }
    )
  }

  const handleRemoveAdmin = (userId: string) => {
    const user = users.find((u) => u.user_id === userId)
    openConfirm(
      "ถอดสิทธิ์ Admin",
      `คุณต้องการถอดสิทธิ์ Admin ของ "${user?.user_show_name}" ใช่หรือไม่?`,
      "ยืนยันถอดสิทธิ์",
      "danger",
      async () => {
        try {
          await adminService.updateUserRole(userId, "user")
          await fetchUsers()
        } catch (error) {
          console.error("Failed to remove admin:", error)
        }
        closeConfirm()
      }
    )
  }

  const handleBanUser = (userId: string) => {
    const user = users.find((u) => u.user_id === userId)
    openConfirm(
      "แบนผู้ใช้",
      `คุณต้องการแบน "${user?.user_show_name}" ใช่หรือไม่? ผู้ใช้จะไม่สามารถเข้าใช้งานระบบได้`,
      "ยืนยันแบน",
      "danger",
      async () => {
        try {
          await adminService.banUser(userId)
          await fetchUsers()
        } catch (error) {
          console.error("Failed to ban user:", error)
        }
        closeConfirm()
      }
    )
  }

  const handleUnbanUser = (userId: string) => {
    const user = users.find((u) => u.user_id === userId)
    openConfirm(
      "ปลดแบนผู้ใช้",
      `คุณต้องการปลดแบน "${user?.user_show_name}" ใช่หรือไม่?`,
      "ยืนยันปลดแบน",
      "primary",
      async () => {
        try {
          await adminService.unbanUser(userId)
          await fetchUsers()
        } catch (error) {
          console.error("Failed to unban user:", error)
        }
        closeConfirm()
      }
    )
  }

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.user_show_name.toLowerCase().includes(searchQuery.toLowerCase())

    if (!matchesSearch) return false

    switch (activeTab) {
      case "user":
        return user.role === "user" && !user.isBanned
      case "admin":
        return user.role === "admin"
      case "banned":
        return user.isBanned
      default:
        return true
    }
  })

  const tabs: { key: Tab; label: string; count: number }[] = [
    { key: "all", label: "ทั้งหมด", count: users.length },
    { key: "user", label: "User", count: users.filter((u) => u.role === "user" && !u.isBanned).length },
    { key: "admin", label: "Admin", count: users.filter((u) => u.role === "admin").length },
    { key: "banned", label: "Banned", count: users.filter((u) => u.isBanned).length },
  ]

  return (
    <div className="relative min-h-screen bg-[#FAFAFA] pb-20">
      <TopBar />

      <div className="mx-auto max-w-3xl px-4 pt-20">
        <h1 className="text-xl font-bold tracking-tight text-gray-800">
          จัดการผู้ใช้
        </h1>

        {/* Search Bar */}
        <div className="mt-4 mb-4">
          <input
            type="text"
            placeholder="ค้นหาชื่อผู้ใช้..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm shadow-sm transition-shadow placeholder:text-gray-400 focus:border-[#FD7979] focus:outline-none focus:ring-2 focus:ring-[#FD7979]/20"
          />
        </div>

        {/* Tabs */}
        <div className="mb-6 flex gap-2 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-1.5 whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-all ${
                activeTab === tab.key
                  ? "bg-[#FD7979] text-white shadow-md"
                  : "bg-white text-gray-600 hover:bg-gray-100"
              }`}
            >
              {tab.label}
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-bold ${
                  activeTab === tab.key
                    ? "bg-white/20 text-white"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* User List */}
        {loading ? (
          <div className="py-8 text-center text-gray-400">กำลังโหลด...</div>
        ) : (
          <UserList
            users={filteredUsers}
            onAddAdmin={handleAddAdmin}
            onRemoveAdmin={handleRemoveAdmin}
            onBanUser={handleBanUser}
            onUnbanUser={handleUnbanUser}
          />
        )}
      </div>

      <BottomNav />

      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        message={confirmDialog.message}
        confirmLabel={confirmDialog.confirmLabel}
        confirmVariant={confirmDialog.confirmVariant}
        onConfirm={confirmDialog.onConfirm}
        onCancel={closeConfirm}
      />
    </div>
  )
}
