import { useEffect, useState } from "react"
import BottomNav from "../../components/BottomNav"
import TopBar from "../../components/TopBar"
import ConfirmDialog from "../../components/ConfirmDialog"
import MatchCard from "./components/MatchCard"
import { feedbackService, adminService } from "../../services"
import type {
  MatchWithReviews,
  MatchExperience,
  MatchLocationReview,
  MatchCancellation,
} from "../../types/responses"

type TabType = "experience" | "cancellation" | "location_review"

export default function Feedback() {
  const [activeTab, setActiveTab] = useState<TabType>("experience")
  const [matches, setMatches] = useState<MatchWithReviews[]>([])
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const [banDialog, setBanDialog] = useState<{
    isOpen: boolean
    userId: string
    userName: string
  }>({ isOpen: false, userId: "", userName: "" })

  useEffect(() => {
    setLoading(true)
    feedbackService
      .getAllMatchReviews()
      .then(setMatches)
      .catch((err) => console.error("Failed to fetch reviews:", err))
      .finally(() => setLoading(false))
  }, [])

  // Filter by tab
  const filtered =
    activeTab === "experience"
      ? matches.filter((m) => m.experience.length > 0)
      : activeTab === "cancellation"
        ? matches.filter((m) => m.cancellation.length > 0)
        : matches.filter((m) => m.location_review.length > 0)

  const handleBan = async () => {
    try {
      await adminService.banUser(banDialog.userId)
      setToast(`${banDialog.userName} has been banned`)
      setBanDialog({ isOpen: false, userId: "", userName: "" })
      setTimeout(() => setToast(null), 3000)
    } catch {
      setToast("Failed to ban user")
      setBanDialog({ isOpen: false, userId: "", userName: "" })
      setTimeout(() => setToast(null), 3000)
    }
  }

  return (
    <div className="relative min-h-screen bg-[#FAFAFA]">
      <TopBar />

      <div className="mx-auto max-w-3xl px-4 pt-20 pb-24">
        {/* Header */}
        <h1 className="text-center text-lg font-bold tracking-tight text-gray-800">
          Feedback And Review
        </h1>

        {/* Tabs */}
        <div className="mt-5 flex justify-center gap-1 rounded-full bg-gray-100 p-1">
          {(["experience", "cancellation", "location_review"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 rounded-full py-2 text-sm font-semibold transition-all ${
                activeTab === tab
                  ? "bg-white text-[#FD7979] shadow-sm"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              {tab === "location_review" ? "Location Review" : tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Label */}
        <p className="mt-6 mb-4 text-[11px] font-bold uppercase tracking-widest text-gray-300">
          All Reviews
        </p>

        {/* Loading */}
        {loading && (
          <p className="mt-16 text-center text-sm text-gray-400">Loading...</p>
        )}

        {/* Cards */}
        {!loading && (
          <div className="space-y-5">
            {filtered.map((match) => (
              <MatchCard
                key={match.id}
                match={match}
                tab={activeTab}
                onBan={(userId, userName) =>
                  setBanDialog({ isOpen: true, userId, userName })
                }
              />
            ))}
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <p className="mt-16 text-center text-sm text-gray-300">
            No reviews yet
          </p>
        )}
      </div>

      {/* Ban Confirm Dialog */}
      <ConfirmDialog
        isOpen={banDialog.isOpen}
        title="Ban user?"
        message={`${banDialog.userName} will be permanently banned.`}
        confirmLabel="Ban"
        confirmVariant="danger"
        onConfirm={handleBan}
        onCancel={() =>
          setBanDialog({ isOpen: false, userId: "", userName: "" })
        }
      />

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-20 left-1/2 z-50 -translate-x-1/2 rounded-full bg-gray-900 px-6 py-3 text-sm font-medium text-white shadow-lg">
          {toast}
        </div>
      )}

      <BottomNav />
    </div>
  )
}
