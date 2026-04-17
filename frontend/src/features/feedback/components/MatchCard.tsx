import type {
  MatchWithReviews,
  MatchLocationReview,
  MatchCancellation,
  MatchReviewUser,
  MatchUserReview,
} from "../../../types/responses"
import { IoThumbsUp, IoThumbsDown, IoPerson, IoLocation, IoTimeOutline, IoMapOutline, IoBanOutline } from "react-icons/io5"
import CardHeader from "../../../components/CardHeader"

interface Props {
  match: MatchWithReviews
  tab: "experience" | "cancellation" | "location_review"
  onBan?: (userId: string, userName: string) => void
}

/* ───── helpers ───── */

function Thumb({ ok }: { ok: boolean }) {
  return ok ? (
    <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100">
      <IoThumbsUp className="h-3 w-3 text-emerald-500" />
    </span>
  ) : (
    <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-100">
      <IoThumbsDown className="h-3 w-3 text-red-400" />
    </span>
  )
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr)
  const day = d.getDate()
  const month = d.getMonth() + 1
  const yearBE = (d.getFullYear() + 543).toString().slice(-2)
  const hh = String(d.getHours()).padStart(2, "0")
  const mm = String(d.getMinutes()).padStart(2, "0")
  return `${day}/${month}/${yearBE}  ${hh}:${mm}`
}

function formatReviewDate(dateStr: string) {
  const d = new Date(dateStr)
  const day = d.getDate()
  const month = d.getMonth() + 1
  const yearBE = (d.getFullYear() + 543).toString().slice(-2)
  return `${day}/${month}/${yearBE}`
}

function getAvatar(user: MatchReviewUser) {
  return user.images?.[0]?.imageUrl || ""
}

/* ───── ReviewBlock ───── */

function ReviewBlock({
  label,
  isPositive,
  text,
  align = "left",
}: {
  label: string
  isPositive: boolean
  text: string
  align?: "left" | "right"
}) {
  return (
    <div className={`rounded-xl px-3 py-2.5 ${isPositive ? "bg-emerald-50" : "bg-red-50"}`}>
      <p className={`mb-1 text-[9px] font-bold uppercase tracking-widest ${isPositive ? "text-emerald-400" : "text-red-300"}`}>
        {label}
      </p>
      <div className={`flex items-start gap-2 ${align === "right" ? "flex-row-reverse" : ""}`}>
        <Thumb ok={isPositive} />
        <p className="text-xs leading-relaxed text-gray-600">{text}</p>
      </div>
    </div>
  )
}

/* ───── user column for Experience tab ───── */

function ExperienceUserColumn({
  user,
  userReview,
  locationReview,
  locationName,
  side,
  onBan,
}: {
  user: MatchReviewUser
  userReview?: MatchUserReview
  locationReview?: MatchLocationReview
  locationName: string
  side: "left" | "right"
  onBan?: () => void
}) {
  const isRight = side === "right"
  const avatar = getAvatar(user)

  return (
    <div className={`flex flex-col h-full ${isRight ? "items-end" : "items-start"}`}>
      {/* Avatar + name */}
      <div className={`flex items-center gap-2 mb-2.5 ${isRight ? "flex-row-reverse" : ""}`}>
        {avatar ? (
          <img src={avatar} alt={user.user_show_name} className="h-11 w-11 rounded-full object-cover ring-2 ring-[#FD7979]/30 shadow-sm" />
        ) : (
          <div className="h-11 w-11 rounded-full bg-gray-100 ring-2 ring-gray-200 flex items-center justify-center text-gray-400 shadow-sm">
            <IoPerson className="h-5 w-5" />
          </div>
        )}
        <div className={isRight ? "text-right" : ""}>
          <p className="text-sm font-bold text-gray-800 leading-tight">{user.user_show_name}</p>
        </div>
      </div>

      {/* Reviews — grows to fill space */}
      <div className="w-full flex-1 space-y-2">
        {userReview ? (
          <ReviewBlock
            label="รีวิวคู่แมทช์"
            isPositive={userReview.status === 1}
            text={userReview.review_text || "(ไม่มีความคิดเห็น)"}
            align={side}
          />
        ) : (
          <div className="rounded-xl bg-gray-50 border border-gray-100 px-3 py-2.5">
            <p className="mb-1 text-[9px] font-bold uppercase tracking-widest text-gray-300">รีวิวคู่แมทช์</p>
            <p className="text-xs text-gray-300 italic">ไม่ได้รีวิว</p>
          </div>
        )}
        {locationReview ? (
          <ReviewBlock
            label={`รีวิว ${locationName}`}
            isPositive={locationReview.status === 1}
            text={locationReview.review_text || "(ไม่มีความคิดเห็น)"}
            align={side}
          />
        ) : (
          <div className="rounded-xl bg-gray-50 border border-gray-100 px-3 py-2.5">
            <p className="mb-1 text-[9px] font-bold uppercase tracking-widest text-gray-300">รีวิว {locationName}</p>
            <p className="text-xs text-gray-300 italic">ไม่ได้รีวิว</p>
          </div>
        )}
      </div>

      {/* Ban button — always at bottom */}
      <button
        onClick={onBan}
        className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-xl border border-red-100 bg-white py-2 text-[11px] font-bold uppercase tracking-wide text-red-400 transition-all hover:bg-red-50 hover:border-red-200 hover:text-red-500 shadow-sm"
      >
        <IoBanOutline className="h-3.5 w-3.5" />
        Ban
      </button>
    </div>
  )
}

/* ───── user column for Cancellation tab ───── */

function CancellationUserColumn({
  user,
  cancellation,
  side,
  onBan,
}: {
  user: MatchReviewUser
  cancellation?: MatchCancellation
  side: "left" | "right"
  onBan?: () => void
}) {
  const isRight = side === "right"
  const avatar = getAvatar(user)
  const isReviewer = cancellation?.reviewer_id === user.user_id

  return (
    <div className={`flex flex-col h-full ${isRight ? "items-end" : "items-start"}`}>
      {/* Avatar + name */}
      <div className={`flex items-center gap-2 mb-2.5 ${isRight ? "flex-row-reverse" : ""}`}>
        {avatar ? (
          <img src={avatar} alt={user.user_show_name} className="h-11 w-11 rounded-full object-cover ring-2 ring-[#FD7979]/30 shadow-sm" />
        ) : (
          <div className="h-11 w-11 rounded-full bg-gray-100 ring-2 ring-gray-200 flex items-center justify-center text-gray-400 shadow-sm">
            <IoPerson className="h-5 w-5" />
          </div>
        )}
        <div className={isRight ? "text-right" : ""}>
          <p className="text-sm font-bold text-gray-800 leading-tight">{user.user_show_name}</p>
          {cancellation && (
            <span className={`text-[10px] font-semibold ${isReviewer ? "text-orange-400" : "text-blue-400"}`}>
              {isReviewer ? "ผู้รีวิว" : "ผู้ถูกรีวิว"}
            </span>
          )}
        </div>
      </div>

      {/* Cancellation reason — grows to fill space */}
      <div className="w-full flex-1">
        {cancellation && isReviewer ? (
          <div className="w-full rounded-xl bg-orange-50 px-3 py-2.5">
            <p className="mb-1 text-[9px] font-bold uppercase tracking-widest text-orange-400">เหตุผลที่ยกเลิก</p>
            {cancellation.quick_select && (
              <span className="mb-1 inline-block rounded-full bg-orange-400 px-2 py-0.5 text-[10px] font-semibold text-white">
                {cancellation.quick_select.name}
              </span>
            )}
            {cancellation.content && (
              <p className="text-xs leading-relaxed text-gray-600">{cancellation.content}</p>
            )}
            {!cancellation.content && !cancellation.quick_select && (
              <p className="text-xs text-gray-400">(ไม่มีเหตุผล)</p>
            )}
          </div>
        ) : (
          <div className="w-full rounded-xl bg-gray-50 border border-gray-100 px-3 py-2.5">
            <p className="mb-1 text-[9px] font-bold uppercase tracking-widest text-gray-300">เหตุผลที่ยกเลิก</p>
            <p className="text-xs text-gray-300 italic">ไม่ได้รีวิว</p>
          </div>
        )}
      </div>

      {/* Ban button — always at bottom */}
      <button
        onClick={onBan}
        className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-xl border border-red-100 bg-white py-2 text-[11px] font-bold uppercase tracking-wide text-red-400 transition-all hover:bg-red-50 hover:border-red-200 hover:text-red-500 shadow-sm"
      >
        <IoBanOutline className="h-3.5 w-3.5" />
        Ban
      </button>
    </div>
  )
}

/* ───── Location Review card ───── */

function LocationReviewCard({
  match,
  locationName,
  locationImage,
  user1LocReview,
  user2LocReview,
  onBan,
}: {
  match: MatchWithReviews
  locationName: string
  locationImage?: string
  user1LocReview?: MatchLocationReview
  user2LocReview?: MatchLocationReview
  onBan?: (userId: string, userName: string) => void
}) {
  const positionName = match.position?.name || ""

  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-[0_4px_24px_rgba(0,0,0,0.07)] ring-1 ring-black/[0.03]">
      {/* Location image header */}
      <div className="relative">
        {locationImage ? (
          <img src={locationImage} alt={locationName} className="h-40 w-full object-cover" />
        ) : (
          <div className="flex h-40 w-full items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
            <IoLocation className="h-12 w-12 text-gray-300" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 px-5 py-4 text-white">
          <p className="text-base font-bold drop-shadow-sm">{locationName}</p>
          <div className="mt-1 flex items-center gap-3 text-[11px] text-white/70">
            <span className="flex items-center gap-1"><IoMapOutline className="h-3 w-3" />{positionName}</span>
            <span>·</span>
            <span>{match.activity.name}</span>
            <span>·</span>
            <span className="flex items-center gap-1"><IoTimeOutline className="h-3 w-3" />{formatDate(match.createdAt)}</span>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <div className="divide-y divide-gray-50 px-5 py-2">
        {[
          { user: match.user1, review: user1LocReview },
          { user: match.user2, review: user2LocReview },
        ].map(({ user, review }) => {
          const avatar = getAvatar(user)
          return (
            <div key={user.user_id} className="flex items-start gap-3 py-3.5">
              {avatar ? (
                <img src={avatar} alt={user.user_show_name} className="h-10 w-10 shrink-0 rounded-full object-cover ring-2 ring-[#FD7979]/20 shadow-sm" />
              ) : (
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-100 ring-2 ring-gray-200 text-gray-400 shadow-sm">
                  <IoPerson className="h-5 w-5" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                {review ? (
                  <>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-gray-800">{user.user_show_name}</p>
                      <Thumb ok={review.status === 1} />
                    </div>
                    <p className="mt-1 text-xs leading-relaxed text-gray-500">
                      {review.review_text || "(ไม่มีความคิดเห็น)"}
                    </p>
                    <p className="mt-1 text-[10px] text-gray-300">{formatReviewDate(review.createdAt)}</p>
                  </>
                ) : (
                  <>
                    <p className="text-sm font-bold text-gray-800">{user.user_show_name}</p>
                    <p className="mt-1 text-xs text-gray-300 italic">ไม่ได้รีวิว</p>
                  </>
                )}
              </div>
              <button
                onClick={() => onBan?.(user.user_id, user.user_show_name)}
                className="shrink-0 flex items-center gap-1 rounded-xl border border-red-100 bg-white px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide text-red-400 transition-all hover:bg-red-50 hover:text-red-500 shadow-sm"
              >
                <IoBanOutline className="h-3 w-3" />
                Ban
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* ───── main card ───── */

export default function MatchCard({ match, tab, onBan }: Props) {
  const locationName = match.location?.name || "Unknown location"
  const positionName = match.position?.name || ""
  const locationImage = match.location?.location_image?.[0]?.imageUrl

  const user1Review = match.user_review.find((r) => r.user_id === match.user1_id)
  const user2Review = match.user_review.find((r) => r.user_id === match.user2_id)
  const user1LocReview = match.location_review.find((r) => r.user_id === match.user1_id)
  const user2LocReview = match.location_review.find((r) => r.user_id === match.user2_id)
  const cancellation = match.cancellation[0]

  if (tab === "location_review") {
    return (
      <LocationReviewCard
        match={match}
        locationName={locationName}
        locationImage={locationImage}
        user1LocReview={user1LocReview}
        user2LocReview={user2LocReview}
        onBan={onBan}
      />
    )
  }

  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-[0_4px_24px_rgba(0,0,0,0.07)] ring-1 ring-black/[0.03]">
      {/* header */}
      <CardHeader className="px-5 py-4 text-center">
        <p className="text-sm font-bold tracking-tight">
          {match.activity.name} at {locationName}
        </p>
        <div className="mt-1 flex items-center justify-center gap-2 text-[11px] text-white/75">
          <span className="flex items-center gap-1"><IoMapOutline className="h-3 w-3" />{positionName}</span>
          <span>·</span>
          <span className="flex items-center gap-1"><IoTimeOutline className="h-3 w-3" />{formatDate(match.createdAt)}</span>
        </div>
      </CardHeader>

      {/* body */}
      <div className="flex p-4 gap-3 items-stretch">
        <div className="flex-1 flex flex-col">
          {tab === "experience" ? (
            <ExperienceUserColumn
              user={match.user1}
              userReview={user1Review}
              locationReview={user1LocReview}
              locationName={locationName}
              side="left"
              onBan={() => onBan?.(match.user1.user_id, match.user1.user_show_name)}
            />
          ) : (
            <CancellationUserColumn
              user={match.user1}
              cancellation={cancellation}
              side="left"
              onBan={() => onBan?.(match.user1.user_id, match.user1.user_show_name)}
            />
          )}
        </div>

        {/* VS divider */}
        <div className="flex flex-col items-center justify-center gap-1 px-1">
          <div className="h-full w-px bg-gradient-to-b from-transparent via-gray-100 to-transparent" />
          <span className="rounded-full bg-gray-100 px-1.5 py-0.5 text-[9px] font-black tracking-widest text-gray-300">VS</span>
          <div className="h-full w-px bg-gradient-to-b from-transparent via-gray-100 to-transparent" />
        </div>

        <div className="flex-1 flex flex-col">
          {tab === "experience" ? (
            <ExperienceUserColumn
              user={match.user2}
              userReview={user2Review}
              locationReview={user2LocReview}
              locationName={locationName}
              side="right"
              onBan={() => onBan?.(match.user2.user_id, match.user2.user_show_name)}
            />
          ) : (
            <CancellationUserColumn
              user={match.user2}
              cancellation={cancellation}
              side="right"
              onBan={() => onBan?.(match.user2.user_id, match.user2.user_show_name)}
            />
          )}
        </div>
      </div>
    </div>
  )
}
