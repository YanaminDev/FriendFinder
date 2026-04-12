import type {
  MatchWithReviews,
  MatchExperience,
  MatchLocationReview,
  MatchCancellation,
  MatchReviewUser,
} from "../../../types/responses"

interface Props {
  match: MatchWithReviews
  tab: "experience" | "cancellation" | "location_review"
  onBan?: (userId: string, userName: string) => void
}

/* ───── helpers ───── */

function Thumb({ ok }: { ok: boolean }) {
  return ok ? (
    <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-[11px]">
      👍
    </span>
  ) : (
    <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-100 text-[11px]">
      👎
    </span>
  )
}

function ReviewBlock({
  label,
  isPositive,
  text,
}: {
  label: string
  isPositive: boolean
  text: string
}) {
  return (
    <div className="space-y-1">
      <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-300">
        {label}
      </p>
      <div className="flex items-start gap-2">
        <Thumb ok={isPositive} />
        <p className="text-xs leading-relaxed text-gray-500">{text}</p>
      </div>
    </div>
  )
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr)
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
  })
}

function formatReviewDate(dateStr: string) {
  const d = new Date(dateStr)
  return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`
}

function getAvatar(user: MatchReviewUser) {
  return user.images?.[0]?.imageUrl || ""
}

/* ───── user column for Experience tab ───── */

function ExperienceUserColumn({
  user,
  experience,
  locationReview,
  locationName,
  side,
  onBan,
}: {
  user: MatchReviewUser
  experience?: MatchExperience
  locationReview?: MatchLocationReview
  locationName: string
  side: "left" | "right"
  onBan?: () => void
}) {
  const align = side === "left" ? "items-start text-left" : "items-end text-right"
  const avatar = getAvatar(user)

  return (
    <div className={`flex flex-1 flex-col gap-3 ${align}`}>
      <div className={`flex flex-col ${side === "left" ? "items-start" : "items-end"} gap-1`}>
        {avatar ? (
          <img src={avatar} alt={user.username} className="h-12 w-12 rounded-full object-cover ring-2 ring-white" />
        ) : (
          <div className="h-12 w-12 rounded-full bg-gray-200 ring-2 ring-white flex items-center justify-center text-gray-400 text-lg">
            👤
          </div>
        )}
        <p className="text-sm font-bold text-gray-800">{user.username}</p>
      </div>

      {experience && (
        <ReviewBlock
          label={`${user.username}'s review on matcher`}
          isPositive={experience.status === 1}
          text={experience.content || "(no comment)"}
        />
      )}

      {locationReview && (
        <ReviewBlock
          label={`${user.username}'s review on ${locationName}`}
          isPositive={locationReview.status === 1}
          text={locationReview.review_text || "(no comment)"}
        />
      )}

      <button
        onClick={onBan}
        className="mt-auto self-stretch rounded-lg border border-red-200 bg-red-50 py-1.5 text-[11px] font-bold uppercase tracking-wide text-red-400 transition-colors hover:bg-red-100 hover:text-red-500"
      >
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
  const align = side === "left" ? "items-start text-left" : "items-end text-right"
  const avatar = getAvatar(user)
  const isReviewer = cancellation?.reviewer_id === user.user_id

  return (
    <div className={`flex flex-1 flex-col gap-3 ${align}`}>
      <div className={`flex flex-col ${side === "left" ? "items-start" : "items-end"} gap-1`}>
        {avatar ? (
          <img src={avatar} alt={user.username} className="h-12 w-12 rounded-full object-cover ring-2 ring-white" />
        ) : (
          <div className="h-12 w-12 rounded-full bg-gray-200 ring-2 ring-white flex items-center justify-center text-gray-400 text-lg">
            👤
          </div>
        )}
        <p className="text-sm font-bold text-gray-800">{user.username}</p>
        {cancellation && (
          <span className={`text-[10px] font-semibold ${isReviewer ? "text-orange-400" : "text-blue-400"}`}>
            {isReviewer ? "Reviewer" : "Reviewee"}
          </span>
        )}
      </div>

      {cancellation && isReviewer && (
        <div className="space-y-1">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-300">
            Cancellation reason
          </p>
          {cancellation.quick_select && (
            <span className="inline-block rounded-full bg-orange-50 px-2 py-0.5 text-[10px] font-semibold text-orange-500">
              {cancellation.quick_select.name}
            </span>
          )}
          {cancellation.content && (
            <p className="text-xs leading-relaxed text-gray-500">{cancellation.content}</p>
          )}
          {!cancellation.content && !cancellation.quick_select && (
            <p className="text-xs text-gray-400">(no reason given)</p>
          )}
        </div>
      )}

      <button
        onClick={onBan}
        className="mt-auto self-stretch rounded-lg border border-red-200 bg-red-50 py-1.5 text-[11px] font-bold uppercase tracking-wide text-red-400 transition-colors hover:bg-red-100 hover:text-red-500"
      >
        Ban
      </button>
    </div>
  )
}

/* ───── Location Review card (different layout) ───── */

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
    <div className="overflow-hidden rounded-2xl bg-white shadow-[0_2px_20px_rgba(0,0,0,0.06)]">
      {/* Location image header */}
      <div className="relative">
        {locationImage ? (
          <img
            src={locationImage}
            alt={locationName}
            className="h-40 w-full object-cover"
          />
        ) : (
          <div className="flex h-40 w-full items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
            <span className="text-4xl">📍</span>
          </div>
        )}
        {/* overlay info */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 px-5 py-3 text-white">
          <p className="text-base font-bold drop-shadow-sm">{locationName}</p>
          <p className="text-[11px] opacity-80 drop-shadow-sm">
            {positionName} &middot; {match.activity.name} &middot; {formatDate(match.createdAt)}
          </p>
        </div>
      </div>

      {/* Reviews list — only show users who actually reviewed */}
      <div className="divide-y divide-gray-50 px-5 py-3">
        {[
          { user: match.user1, review: user1LocReview },
          { user: match.user2, review: user2LocReview },
        ]
          .filter(({ review }) => !!review)
          .map(({ user, review }) => {
            const avatar = getAvatar(user)
            return (
              <div key={user.user_id} className="flex items-start gap-3 py-3">
                {/* Avatar */}
                {avatar ? (
                  <img src={avatar} alt={user.username} className="h-10 w-10 shrink-0 rounded-full object-cover ring-2 ring-white" />
                ) : (
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-200 ring-2 ring-white text-gray-400">
                    👤
                  </div>
                )}

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold text-gray-800">{user.username}</p>
                    <Thumb ok={review!.status === 1} />
                  </div>
                  <p className="mt-1 text-xs leading-relaxed text-gray-500">
                    {review!.review_text || "(no comment)"}
                  </p>
                  <p className="mt-1 text-[10px] text-gray-300">
                    {formatReviewDate(review!.createdAt)}
                  </p>
                </div>

                {/* Ban */}
                <button
                  onClick={() => onBan?.(user.user_id, user.username)}
                  className="shrink-0 rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide text-red-400 transition-colors hover:bg-red-100 hover:text-red-500"
                >
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

  // Find reviews per user
  const user1Exp = match.experience.find((e) => e.reviewer_id === match.user1_id)
  const user2Exp = match.experience.find((e) => e.reviewer_id === match.user2_id)
  const user1LocReview = match.location_review.find((r) => r.user_id === match.user1_id)
  const user2LocReview = match.location_review.find((r) => r.user_id === match.user2_id)

  // For cancellation tab, show the first cancellation
  const cancellation = match.cancellation[0]

  // Location review tab uses a completely different card layout
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
    <div className="overflow-hidden rounded-2xl bg-white shadow-[0_2px_20px_rgba(0,0,0,0.06)]">
      {/* header */}
      <div className="bg-gradient-to-r from-[#FD7979] to-[#ff9a9a] px-5 py-3 text-center text-white">
        <p className="text-sm font-bold">
          {match.activity.name} at {locationName}
        </p>
        <p className="text-[11px] opacity-80">
          {formatDate(match.createdAt)} &middot; {positionName}
        </p>
      </div>

      {/* body */}
      <div className="flex gap-0">
        <div className="flex-1 p-4">
          {tab === "experience" ? (
            <ExperienceUserColumn
              user={match.user1}
              experience={user1Exp}
              locationReview={user1LocReview}
              locationName={locationName}
              side="left"
              onBan={() => onBan?.(match.user1.user_id, match.user1.username)}
            />
          ) : (
            <CancellationUserColumn
              user={match.user1}
              cancellation={cancellation}
              side="left"
              onBan={() => onBan?.(match.user1.user_id, match.user1.username)}
            />
          )}
        </div>

        <div className="flex w-10 flex-col items-center justify-center">
          <div className="h-full w-px bg-gray-100" />
          <span className="my-2 text-xs font-bold tracking-widest text-gray-200">⇄</span>
          <div className="h-full w-px bg-gray-100" />
        </div>

        <div className="flex-1 p-4">
          {tab === "experience" ? (
            <ExperienceUserColumn
              user={match.user2}
              experience={user2Exp}
              locationReview={user2LocReview}
              locationName={locationName}
              side="right"
              onBan={() => onBan?.(match.user2.user_id, match.user2.username)}
            />
          ) : (
            <CancellationUserColumn
              user={match.user2}
              cancellation={cancellation}
              side="right"
              onBan={() => onBan?.(match.user2.user_id, match.user2.username)}
            />
          )}
        </div>
      </div>
    </div>
  )
}
