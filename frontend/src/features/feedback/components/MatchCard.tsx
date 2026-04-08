import { useState } from "react"
import type { MatchReview, UserSide } from "../Feedback"

interface Props {
  match: MatchReview
  onBan?: (userId: string, userName: string) => void
}

/* ───── small helpers ───── */

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
  sentiment,
  text,
}: {
  label: string
  sentiment: "positive" | "negative"
  text: string
}) {
  return (
    <div className="space-y-1">
      <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-300">
        {label}
      </p>
      <div className="flex items-start gap-2">
        <Thumb ok={sentiment === "positive"} />
        <p className="text-xs leading-relaxed text-gray-500">{text}</p>
      </div>
    </div>
  )
}

function UserColumn({
  user,
  locationName,
  side,
  onBan,
}: {
  user: UserSide
  locationName: string
  side: "left" | "right"
  onBan?: () => void
}) {
  const align = side === "left" ? "items-start text-left" : "items-end text-right"

  return (
    <div className={`flex flex-1 flex-col gap-3 ${align}`}>
      {/* avatar + name */}
      <div className={`flex flex-col ${side === "left" ? "items-start" : "items-end"} gap-1`}>
        <img
          src={user.avatar}
          alt={user.name}
          className="h-12 w-12 rounded-full object-cover ring-2 ring-white"
        />
        <p className="text-sm font-bold text-gray-800">{user.name}</p>
      </div>

      {/* review matcher */}
      <ReviewBlock
        label={`${user.name}'s review on matcher`}
        sentiment={user.review_matcher.sentiment}
        text={user.review_matcher.text}
      />

      {/* review location */}
      <ReviewBlock
        label={`${user.name}'s review on ${locationName}`}
        sentiment={user.review_location.sentiment}
        text={user.review_location.text}
      />

      {/* ban */}
      <button
        onClick={onBan}
        className="mt-auto self-stretch rounded-lg border border-red-200 bg-red-50 py-1.5 text-[11px] font-bold uppercase tracking-wide text-red-400 transition-colors hover:bg-red-100 hover:text-red-500"
      >
        Ban
      </button>
    </div>
  )
}

/* ───── main card ───── */

export default function MatchCard({ match, onBan }: Props) {
  const [banTarget, setBanTarget] = useState<{ id: string; name: string } | null>(null)

  return (
    <>
      <div className="overflow-hidden rounded-2xl bg-white shadow-[0_2px_20px_rgba(0,0,0,0.06)]">
        {/* ── header ── */}
        <div className="bg-gradient-to-r from-[#FD7979] to-[#ff9a9a] px-5 py-3 text-center text-white">
          <p className="text-sm font-bold">
            {match.activity_name} at {match.location_name}
          </p>
          <p className="text-[11px] opacity-80">
            {match.datetime} &middot; {match.area}
          </p>
        </div>

        {/* ── body: two columns ── */}
        <div className="flex gap-0">
          {/* left */}
          <div className="flex-1 p-4">
            <UserColumn
              user={match.user_left}
              locationName={match.location_name}
              side="left"
              onBan={() =>
                setBanTarget({
                  id: match.user_left.user_id,
                  name: match.user_left.name,
                })
              }
            />
          </div>

          {/* divider with arrows */}
          <div className="flex w-10 flex-col items-center justify-center">
            <div className="h-full w-px bg-gray-100" />
            <span className="my-2 text-xs font-bold tracking-widest text-gray-200">
              ⇄
            </span>
            <div className="h-full w-px bg-gray-100" />
          </div>

          {/* right */}
          <div className="flex-1 p-4">
            <UserColumn
              user={match.user_right}
              locationName={match.location_name}
              side="right"
              onBan={() =>
                setBanTarget({
                  id: match.user_right.user_id,
                  name: match.user_right.name,
                })
              }
            />
          </div>
        </div>
      </div>

      {/* ── ban modal ── */}
      {banTarget && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
          onClick={() => setBanTarget(null)}
        >
          <div
            className="mx-4 w-full max-w-xs rounded-2xl bg-white p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-xl">
              🚫
            </div>
            <h3 className="text-base font-bold text-gray-900">Ban user?</h3>
            <p className="mt-1 text-sm text-gray-400">
              <span className="font-semibold text-gray-700">
                {banTarget.name}
              </span>{" "}
              will be permanently banned.
            </p>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setBanTarget(null)}
                className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-semibold text-gray-600 transition-colors hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onBan?.(banTarget.id, banTarget.name)
                  setBanTarget(null)
                }}
                className="flex-1 rounded-xl bg-red-500 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-600"
              >
                Ban
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
