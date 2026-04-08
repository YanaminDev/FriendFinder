import { useState } from "react"
import BottomNav from "../../components/BottomNav"
import TopBar from "../../components/TopBar"
import MatchCard from "./components/MatchCard"

export interface ReviewData {
  sentiment: "positive" | "negative"
  text: string
}

export interface UserSide {
  user_id: string
  name: string
  avatar: string
  review_matcher: ReviewData
  review_location: ReviewData
}

export interface MatchReview {
  match_id: string
  location_name: string
  activity_name: string
  datetime: string
  area: string
  user_left: UserSide
  user_right: UserSide
}

const MOCK_MATCHES: MatchReview[] = [
  {
    match_id: "m1",
    activity_name: "Coffee",
    location_name: "Blue Sky Café",
    datetime: "Mon 12:30 PM",
    area: "Ratchayothin",
    user_left: {
      user_id: "u1",
      name: "SKW_BOX5",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
      review_matcher: {
        sentiment: "positive",
        text: "A kind and reliable person who always gives their best.",
      },
      review_location: {
        sentiment: "negative",
        text: "The café was a bit noisy but the coffee was excellent.",
      },
    },
    user_right: {
      user_id: "u2",
      name: "Jane Doe",
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
      review_matcher: {
        sentiment: "positive",
        text: "Really enjoyed our conversation, very easy-going!",
      },
      review_location: {
        sentiment: "positive",
        text: "Great ambiance and friendly staff. Perfect for a meetup.",
      },
    },
  },
  {
    match_id: "m2",
    activity_name: "Movie",
    location_name: "Major Cineplex",
    datetime: "Mon 10:30 PM",
    area: "Ratchayothin",
    user_left: {
      user_id: "u3",
      name: "Punch",
      avatar:
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop",
      review_matcher: {
        sentiment: "positive",
        text: "Fun person to hang out with. Great taste in movies!",
      },
      review_location: {
        sentiment: "negative",
        text: "The seats were uncomfortable, but the screen was great.",
      },
    },
    user_right: {
      user_id: "u4",
      name: "Hanni",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop",
      review_matcher: {
        sentiment: "positive",
        text: "Super friendly! We had a lot in common.",
      },
      review_location: {
        sentiment: "positive",
        text: "Comfortable cinema with great sound. Perfect for a movie night.",
      },
    },
  },
  {
    match_id: "m3",
    activity_name: "Running",
    location_name: "Lumpini Park",
    datetime: "Tue 6:00 AM",
    area: "Silom",
    user_left: {
      user_id: "u5",
      name: "Alex",
      avatar:
        "https://images.unsplash.com/photo-1500654783255-ec3a7e8e87f0?w=150&h=150&fit=crop",
      review_matcher: {
        sentiment: "positive",
        text: "Very energetic and fun to run with. Great company!",
      },
      review_location: {
        sentiment: "positive",
        text: "Beautiful park with a nice jogging track and fresh air.",
      },
    },
    user_right: {
      user_id: "u6",
      name: "Mina",
      avatar:
        "https://images.unsplash.com/photo-1517841905240-472988babdf0?w=150&h=150&fit=crop",
      review_matcher: {
        sentiment: "negative",
        text: "Showed up late and wasn't really interested in running.",
      },
      review_location: {
        sentiment: "positive",
        text: "Perfect place for morning exercise. Will come back again!",
      },
    },
  },
]

const MOCK_CANCELLATIONS: MatchReview[] = [
  {
    match_id: "m4",
    activity_name: "Yoga",
    location_name: "Zen Studio",
    datetime: "Wed 5:00 PM",
    area: "Thonglor",
    user_left: {
      user_id: "u7",
      name: "Lisa",
      avatar:
        "https://images.unsplash.com/photo-1539571696357-5a69c006ae30?w=150&h=150&fit=crop",
      review_matcher: {
        sentiment: "negative",
        text: "Cancelled last minute without any notice.",
      },
      review_location: {
        sentiment: "positive",
        text: "The studio was clean and well-maintained.",
      },
    },
    user_right: {
      user_id: "u8",
      name: "Nicole",
      avatar:
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop",
      review_matcher: {
        sentiment: "negative",
        text: "Had to cancel due to emergency. Sorry!",
      },
      review_location: {
        sentiment: "positive",
        text: "Nice atmosphere, would love to try again.",
      },
    },
  },
]

export default function Feedback() {
  const [activeTab, setActiveTab] = useState<"experience" | "cancellation">(
    "experience"
  )
  const [toast, setToast] = useState<string | null>(null)

  const data =
    activeTab === "experience" ? MOCK_MATCHES : MOCK_CANCELLATIONS

  const handleBan = (_userId: string, userName: string) => {
    setToast(`${userName} has been banned`)
    setTimeout(() => setToast(null), 3000)
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
          {(["experience", "cancellation"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 rounded-full py-2 text-sm font-semibold capitalize transition-all ${
                activeTab === tab
                  ? "bg-white text-[#FD7979] shadow-sm"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Label */}
        <p className="mt-6 mb-4 text-[11px] font-bold uppercase tracking-widest text-gray-300">
          All Reviews
        </p>

        {/* Cards */}
        <div className="space-y-5">
          {data.map((match) => (
            <MatchCard key={match.match_id} match={match} onBan={handleBan} />
          ))}
        </div>

        {data.length === 0 && (
          <p className="mt-16 text-center text-sm text-gray-300">
            No reviews yet
          </p>
        )}
      </div>

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
