import { useState, useEffect } from "react"
import BottomNav from "../../components/Layout/BottomNav"
import TopBar from "../../components/Layout/TopBar"
import SearchBar from "../../components/UI Components (Reusable)/SearchBar"
import UserList from "./components/UserList"
import ConfirmDialog from "../../components/Logic Components/ConfirmDialog"
import { adminService, userInformationService } from "../../services"
import { IoPersonOutline, IoShieldCheckmarkOutline, IoBanOutline, IoPeopleOutline } from "react-icons/io5"

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

      const usersWithInfo = await Promise.all(
        data.map(async (user: UserData) => {
          try {
            const info = await userInformationService.getUserInformation(user.user_id)
            return { ...user, info: info ?? user.info }
          } catch {
            return user
          }
        })
      )

      setUsers(usersWithInfo)
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

        {/* Page header banner */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#FD7979] to-[#ff9a9a] px-6 py-5 text-white mb-6 shadow-[0_4px_24px_rgba(253,121,121,0.3)]">
          <div className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-white/10" />
          <div className="pointer-events-none absolute -left-4 -bottom-6 h-20 w-20 rounded-full bg-white/10" />
          <p className="relative text-lg font-bold tracking-tight">จัดการผู้ใช้</p>
          <p className="relative mt-0.5 text-xs text-white/70">ดูและจัดการบัญชีผู้ใช้ทั้งหมดในระบบ</p>
          {/* Stats row */}
          <div className="relative mt-4 grid grid-cols-4 gap-2">
            {[
              { icon: IoPeopleOutline, label: "ทั้งหมด", count: users.length },
              { icon: IoPersonOutline, label: "User", count: users.filter((u) => u.role === "user" && !u.isBanned).length },
              { icon: IoShieldCheckmarkOutline, label: "Admin", count: users.filter((u) => u.role === "admin").length },
              { icon: IoBanOutline, label: "Banned", count: users.filter((u) => u.isBanned).length },
            ].map(({ icon: Icon, label, count }) => (
              <div key={label} className="rounded-xl bg-white/15 backdrop-blur-sm px-3 py-2 text-center">
                <Icon className="h-4 w-4 mx-auto mb-0.5 text-white/80" />
                <p className="text-base font-black leading-none">{count}</p>
                <p className="text-[10px] text-white/70 mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-4">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="ค้นหาชื่อผู้ใช้..."
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
                  : "bg-white text-gray-600 hover:bg-gray-100 shadow-sm ring-1 ring-black/[0.04]"
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
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <div className="h-10 w-10 rounded-full border-4 border-[#FD7979]/30 border-t-[#FD7979] animate-spin" />
            <p className="text-sm text-gray-400">กำลังโหลดข้อมูล...</p>
          </div>
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
